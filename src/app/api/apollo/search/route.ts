import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { industry, companySize, location, targetRole, keywords } = body

    const apolloApiKey = process.env.APOLLO_API_KEY
    if (!apolloApiKey) {
      return NextResponse.json(
        { error: 'Apollo API key not configured' },
        { status: 500 }
      )
    }

    // Build Apollo API search query
    // Apollo GraphQL API endpoint
    const apolloEndpoint = 'https://api.apollo.io/v1/mixed_people/search'

    // Prepare search parameters for Apollo
    const apolloParams: any = {
      api_key: apolloApiKey,
      page: 1,
      per_page: 10,
      person_titles: targetRole ? [targetRole] : undefined,
      q_keywords: keywords || undefined,
    }

    // Add filters
    if (industry) {
      apolloParams.organization_industries = [industry]
    }
    
    if (location) {
      apolloParams.person_locations = [location]
    }

    if (companySize) {
      // Map company size to Apollo's format
      // Apollo uses ranges like: 1,10,11,50,51,200,201,500,501,1000,1001,5000,5001,10000,10001+
      const sizeMap: Record<string, string> = {
        '1-10': '1,10',
        '11-50': '11,50',
        '51-200': '51,200',
        '201-500': '201,500',
        '501-1000': '501,1000',
        '1001-5000': '1001,5000',
        '5001-10000': '5001,10000',
        '10000+': '10001+',
      }
      apolloParams.organization_num_employees_ranges = [sizeMap[companySize] || companySize]
    }

    // Remove undefined values
    Object.keys(apolloParams).forEach(key => {
      if (apolloParams[key] === undefined) {
        delete apolloParams[key]
      }
    })

    // Call Apollo API
    const response = await fetch(apolloEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify(apolloParams),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Apollo API error:', errorText)
      return NextResponse.json(
        { error: 'Apollo API request failed', details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Transform Apollo response to our lead format
    const leads = (data.people || []).map((person: any) => {
      const organization = person.organization || {}
      return {
        company_name: organization.name || 'Unknown',
        company_website: organization.website_url || null,
        industry: organization.industry || industry || null,
        company_size: organization.estimated_num_employees ? 
          `${organization.estimated_num_employees}` : companySize || null,
        location: person.city || location || null,
        target_role: person.title || targetRole || null,
        suggested_contact_name: `${person.first_name || ''} ${person.last_name || ''}`.trim() || null,
        suggested_contact_email: person.email || null,
        suggested_contact_linkedin: person.linkedin_url || null,
        suggested_contact_role: person.title || null,
        ai_confidence: person.match_reasons?.length > 0 ? 85 : 70, // Simple confidence score
        ai_summary: `Found via Apollo search. ${person.title ? `Role: ${person.title}.` : ''} ${organization.name ? `Company: ${organization.name}.` : ''} ${organization.industry ? `Industry: ${organization.industry}.` : ''}`,
        keywords: keywords ? keywords.split(',').map((k: string) => k.trim()) : null,
        recent_signals: [],
        potential_synergies: [],
      }
    })

    return NextResponse.json({ leads })
  } catch (error: any) {
    console.error('Error in Apollo search:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

