'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestSupabasePage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [connectionInfo, setConnectionInfo] = useState<{
    url: string
    keyConfigured: boolean
  } | null>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient()
        
        // Test de verbinding door de auth status op te halen
        const { data: { session }, error: authError } = await supabase.auth.getSession()
        
        if (authError) {
          setStatus('error')
          setMessage(`❌ Authenticatie Error: ${authError.message}`)
        } else {
          setStatus('success')
          setMessage('✅ Supabase verbinding werkt perfect! Client is geconfigureerd en verbonden.')
        }

        // Toon configuratie info
        setConnectionInfo({
          url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Niet geconfigureerd',
          keyConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        })
      } catch (err) {
        setStatus('error')
        setMessage(`❌ Fout: ${err instanceof Error ? err.message : 'Onbekende fout'}`)
        setConnectionInfo({
          url: 'Error',
          keyConfigured: false
        })
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-grey-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-secondary-500 mb-4">
          Supabase Verbinding Test
        </h1>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-grey-600 mb-2">Status:</p>
            <div className={`p-4 rounded-md ${
              status === 'loading' ? 'bg-grey-100' :
              status === 'success' ? 'bg-success/10 text-success' :
              'bg-error/10 text-error'
            }`}>
              {status === 'loading' && '⏳ Verbinden...'}
              {status === 'success' && message}
              {status === 'error' && message}
            </div>
          </div>

          {connectionInfo && (
            <div>
              <p className="text-sm text-grey-600 mb-2">Configuratie:</p>
              <div className="text-xs bg-grey-100 p-3 rounded-md space-y-1">
                <p>
                  <span className="font-semibold">URL:</span>{' '}
                  {connectionInfo.url !== 'Error' ? (
                    <span className="text-success">✅ {connectionInfo.url.substring(0, 30)}...</span>
                  ) : (
                    <span className="text-error">❌ Niet geconfigureerd</span>
                  )}
                </p>
                <p>
                  <span className="font-semibold">API Key:</span>{' '}
                  {connectionInfo.keyConfigured ? (
                    <span className="text-success">✅ Geconfigureerd</span>
                  ) : (
                    <span className="text-error">❌ Niet geconfigureerd</span>
                  )}
                </p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-grey-200">
            <a 
              href="/" 
              className="block text-center text-primary-500 hover:text-primary-900 underline"
            >
              Terug naar Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
