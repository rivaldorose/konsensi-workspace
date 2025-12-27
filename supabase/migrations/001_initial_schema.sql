-- Konsensi Workspace Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all team members"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Only admins can insert users"
  ON public.users FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- APPS TABLE
-- ============================================
CREATE TABLE public.apps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '📱',
  status TEXT NOT NULL DEFAULT 'idea' CHECK (status IN ('idea', 'development', 'beta', 'live', 'paused', 'archived')),
  category TEXT NOT NULL,
  launch_date DATE,
  production_url TEXT,
  staging_url TEXT,
  github_url TEXT,
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  team_members UUID[] DEFAULT '{}',
  tech_stack JSONB DEFAULT '{}',
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;

-- Apps policies
CREATE POLICY "Team members can view all apps"
  ON public.apps FOR SELECT
  USING (true);

CREATE POLICY "Team members can create apps"
  ON public.apps FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners and team members can update apps"
  ON public.apps FOR UPDATE
  USING (
    auth.uid() = owner_id OR 
    auth.uid() = ANY(team_members) OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

CREATE POLICY "Owners and admins can delete apps"
  ON public.apps FOR DELETE
  USING (
    auth.uid() = owner_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- PARTNERS TABLE
-- ============================================
CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  sector TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  status TEXT NOT NULL DEFAULT 'to_contact' CHECK (status IN ('to_contact', 'in_gesprek', 'active', 'paused')),
  partnership_start DATE,
  contract_end DATE,
  annual_value NUMERIC(12, 2),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  next_action TEXT,
  next_action_date DATE,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Partners policies
CREATE POLICY "Team members can view all partners"
  ON public.partners FOR SELECT
  USING (true);

CREATE POLICY "Team members can create partners"
  ON public.partners FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners and team members can update partners"
  ON public.partners FOR UPDATE
  USING (
    auth.uid() = owner_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

CREATE POLICY "Owners and admins can delete partners"
  ON public.partners FOR DELETE
  USING (
    auth.uid() = owner_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('pilot', 'launch', 'funding', 'partnership', 'campaign', 'other')),
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'on_hold')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  team_members UUID[] DEFAULT '{}',
  budget_total NUMERIC(12, 2),
  budget_spent NUMERIC(12, 2) DEFAULT 0,
  success_criteria TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Team members can view all events"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Team members can create events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners and team members can update events"
  ON public.events FOR UPDATE
  USING (
    auth.uid() = owner_id OR 
    auth.uid() = ANY(team_members) OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

CREATE POLICY "Owners and admins can delete events"
  ON public.events FOR DELETE
  USING (
    auth.uid() = owner_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- GOALS TABLE
-- ============================================
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  objective TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('product', 'partnerships', 'funding', 'marketing', 'operations', 'team')),
  quarter TEXT NOT NULL,
  start_date DATE NOT NULL,
  target_date DATE NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'on_track', 'at_risk', 'completed')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Goals policies
CREATE POLICY "Team members can view all goals"
  ON public.goals FOR SELECT
  USING (true);

CREATE POLICY "Team members can create goals"
  ON public.goals FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners and team members can update goals"
  ON public.goals FOR UPDATE
  USING (
    auth.uid() = owner_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

CREATE POLICY "Owners and admins can delete goals"
  ON public.goals FOR DELETE
  USING (
    auth.uid() = owner_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- INDEXES for better performance
-- ============================================
CREATE INDEX idx_apps_owner_id ON public.apps(owner_id);
CREATE INDEX idx_apps_status ON public.apps(status);
CREATE INDEX idx_partners_owner_id ON public.partners(owner_id);
CREATE INDEX idx_partners_status ON public.partners(status);
CREATE INDEX idx_events_owner_id ON public.events(owner_id);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_goals_owner_id ON public.goals(owner_id);
CREATE INDEX idx_goals_status ON public.goals(status);
CREATE INDEX idx_goals_event_id ON public.goals(event_id);
CREATE INDEX idx_goals_quarter ON public.goals(quarter);

-- ============================================
-- FUNCTION to update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS to auto-update updated_at
-- ============================================
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_apps_updated_at
  BEFORE UPDATE ON public.apps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION to create user profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'member'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGER to create user profile
-- ============================================
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VIEWS for easier queries
-- ============================================

-- View for apps with owner info
CREATE VIEW apps_with_owner AS
SELECT 
  a.*,
  u.full_name as owner_name,
  u.email as owner_email
FROM public.apps a
LEFT JOIN public.users u ON a.owner_id = u.id;

-- View for events with owner info
CREATE VIEW events_with_owner AS
SELECT 
  e.*,
  u.full_name as owner_name,
  u.email as owner_email
FROM public.events e
LEFT JOIN public.users u ON e.owner_id = u.id;

-- View for goals with owner and event info
CREATE VIEW goals_with_details AS
SELECT 
  g.*,
  u.full_name as owner_name,
  u.email as owner_email,
  e.name as event_name
FROM public.goals g
LEFT JOIN public.users u ON g.owner_id = u.id
LEFT JOIN public.events e ON g.event_id = e.id;

-- ============================================
-- RLS Policies for views
-- ============================================
ALTER VIEW apps_with_owner SET (security_invoker = true);
ALTER VIEW events_with_owner SET (security_invoker = true);
ALTER VIEW goals_with_details SET (security_invoker = true);

