-- Konsensi Workspace Database Schema (Idempotent Version)
-- This migration can be run multiple times safely
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Helper function to safely drop policies
-- ============================================
CREATE OR REPLACE FUNCTION drop_policy_if_exists(full_table_name text, policy_name text)
RETURNS void AS $$
DECLARE
  schema_part text;
  table_part text;
BEGIN
  -- Parse schema.table into parts
  IF position('.' in full_table_name) > 0 THEN
    schema_part := split_part(full_table_name, '.', 1);
    table_part := split_part(full_table_name, '.', 2);
  ELSE
    schema_part := 'public';
    table_part := full_table_name;
  END IF;
  
  -- Only drop policy if table exists
  IF EXISTS (
    SELECT 1 
    FROM pg_tables 
    WHERE schemaname = schema_part 
    AND tablename = table_part
  ) THEN
    BEGIN
      EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', policy_name, schema_part, table_part);
    EXCEPTION
      WHEN OTHERS THEN NULL;
    END;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
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

-- Drop existing policies
SELECT drop_policy_if_exists('public.users', 'Users can view all team members');
SELECT drop_policy_if_exists('public.users', 'Users can update own profile');
SELECT drop_policy_if_exists('public.users', 'Only admins can insert users');

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
CREATE TABLE IF NOT EXISTS public.apps (
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

-- Drop existing policies
SELECT drop_policy_if_exists('public.apps', 'Team members can view all apps');
SELECT drop_policy_if_exists('public.apps', 'Team members can create apps');
SELECT drop_policy_if_exists('public.apps', 'Owners and team members can update apps');
SELECT drop_policy_if_exists('public.apps', 'Owners and admins can delete apps');

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
CREATE TABLE IF NOT EXISTS public.partners (
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

-- Drop existing policies
SELECT drop_policy_if_exists('public.partners', 'Team members can view all partners');
SELECT drop_policy_if_exists('public.partners', 'Team members can create partners');
SELECT drop_policy_if_exists('public.partners', 'Owners and team members can update partners');
SELECT drop_policy_if_exists('public.partners', 'Owners and admins can delete partners');

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
CREATE TABLE IF NOT EXISTS public.events (
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

-- Drop existing policies
SELECT drop_policy_if_exists('public.events', 'Team members can view all events');
SELECT drop_policy_if_exists('public.events', 'Team members can create events');
SELECT drop_policy_if_exists('public.events', 'Owners and team members can update events');
SELECT drop_policy_if_exists('public.events', 'Owners and admins can delete events');

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
CREATE TABLE IF NOT EXISTS public.goals (
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

-- Drop existing policies
SELECT drop_policy_if_exists('public.goals', 'Team members can view all goals');
SELECT drop_policy_if_exists('public.goals', 'Team members can create goals');
SELECT drop_policy_if_exists('public.goals', 'Owners and team members can update goals');
SELECT drop_policy_if_exists('public.goals', 'Owners and admins can delete goals');

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
CREATE INDEX IF NOT EXISTS idx_apps_owner_id ON public.apps(owner_id);
CREATE INDEX IF NOT EXISTS idx_apps_status ON public.apps(status);
CREATE INDEX IF NOT EXISTS idx_partners_owner_id ON public.partners(owner_id);
CREATE INDEX IF NOT EXISTS idx_partners_status ON public.partners(status);
CREATE INDEX IF NOT EXISTS idx_events_owner_id ON public.events(owner_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_goals_owner_id ON public.goals(owner_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON public.goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_event_id ON public.goals(event_id);
CREATE INDEX IF NOT EXISTS idx_goals_quarter ON public.goals(quarter);

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
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_apps_updated_at ON public.apps;
DROP TRIGGER IF EXISTS update_partners_updated_at ON public.partners;
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
DROP TRIGGER IF EXISTS update_goals_updated_at ON public.goals;

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
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGER to create user profile
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VIEWS for easier queries
-- ============================================
DROP VIEW IF EXISTS apps_with_owner;
DROP VIEW IF EXISTS events_with_owner;
DROP VIEW IF EXISTS goals_with_details;

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

-- Cleanup helper function (optional, can be dropped after migration)
DROP FUNCTION IF EXISTS drop_policy_if_exists(text, text);
