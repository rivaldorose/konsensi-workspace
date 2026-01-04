-- AI Lead Discovery table
CREATE TABLE IF NOT EXISTS public.ai_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  industry TEXT,
  company_size TEXT,
  location TEXT,
  website TEXT,
  target_role TEXT,
  suggested_contact_name TEXT,
  suggested_contact_email TEXT,
  suggested_contact_linkedin TEXT,
  keywords TEXT,
  ai_summary TEXT,
  ai_confidence INTEGER DEFAULT 0 CHECK (ai_confidence >= 0 AND ai_confidence <= 100),
  relevance_score TEXT CHECK (relevance_score IN ('high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'discovered' CHECK (status IN ('discovered', 'saved', 'dismissed', 'converted')),
  search_criteria JSONB, -- Stores the original search criteria used to find this lead
  ai_insights JSONB, -- Stores AI-generated insights (activities, signals, synergies, etc.)
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  converted_to_partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.ai_leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own leads" ON public.ai_leads;
DROP POLICY IF EXISTS "Users can create leads" ON public.ai_leads;
DROP POLICY IF EXISTS "Users can update their own leads" ON public.ai_leads;
DROP POLICY IF EXISTS "Users can delete their own leads" ON public.ai_leads;

-- AI Leads policies
CREATE POLICY "Users can view their own leads"
  ON public.ai_leads FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create leads"
  ON public.ai_leads FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own leads"
  ON public.ai_leads FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own leads"
  ON public.ai_leads FOR DELETE
  USING (auth.uid() = created_by);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_leads_created_by ON public.ai_leads(created_by);
CREATE INDEX IF NOT EXISTS idx_ai_leads_status ON public.ai_leads(status);
CREATE INDEX IF NOT EXISTS idx_ai_leads_created_at ON public.ai_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_leads_converted_to_partner_id ON public.ai_leads(converted_to_partner_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_ai_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_ai_leads_updated_at ON public.ai_leads;
CREATE TRIGGER update_ai_leads_updated_at
  BEFORE UPDATE ON public.ai_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_leads_updated_at();

-- Lead notes table (for activity timeline and notes)
CREATE TABLE IF NOT EXISTS public.ai_lead_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES public.ai_leads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  note_type TEXT NOT NULL DEFAULT 'note' CHECK (note_type IN ('note', 'activity', 'system')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.ai_lead_notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view notes for their leads" ON public.ai_lead_notes;
DROP POLICY IF EXISTS "Users can create notes for their leads" ON public.ai_lead_notes;

CREATE POLICY "Users can view notes for their leads"
  ON public.ai_lead_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_leads
      WHERE id = ai_lead_notes.lead_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create notes for their leads"
  ON public.ai_lead_notes FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.ai_leads
      WHERE id = ai_lead_notes.lead_id AND created_by = auth.uid()
    )
  );

-- Indexes for lead notes
CREATE INDEX IF NOT EXISTS idx_ai_lead_notes_lead_id ON public.ai_lead_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_ai_lead_notes_created_at ON public.ai_lead_notes(created_at DESC);

