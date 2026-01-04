# Backend SQL Code Per Page

Dit document bevat alle SQL code per pagina/feature voor de Konsensi Workspace backend.

---

## 📄 Overzicht

- [1. Users & Authentication](#1-users--authentication)
- [2. Dashboard](#2-dashboard)
- [3. Apps](#3-apps)
- [4. Partners](#4-partners)
- [5. Events & Projects](#5-events--projects)
- [6. Goals & Roadmap](#6-goals--roadmap)
- [7. Marketing Hub](#7-marketing-hub)
- [8. Documents](#8-documents)
- [9. Contracts](#9-contracts)
- [10. Chat](#10-chat)
- [11. Notifications](#11-notifications)
- [12. Settings](#12-settings)

---

## 1. Users & Authentication

**Bestand:** `001_initial_schema.sql` (regels 10-39)

```sql
-- Users table (extends Supabase auth.users)
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

-- Trigger for auto-create user profile on signup
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
```

---

## 2. Dashboard

**Bestand:** `001_initial_schema.sql`

De Dashboard pagina gebruikt data uit meerdere tabellen:
- `users` - Team members
- `apps` - Apps overzicht
- `partners` - Partners stats
- `events` - Events stats
- `goals` - Goals progress

**Geen extra SQL nodig** - gebruikt bestaande tabellen.

---

## 3. Apps

**Bestand:** `001_initial_schema.sql` (regels 42-88)

```sql
-- Apps table
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
  documentation_url TEXT,
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  team_members UUID[] DEFAULT '{}',
  tech_stack JSONB DEFAULT '{}',
  metrics JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
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

-- Indexes
CREATE INDEX idx_apps_owner_id ON public.apps(owner_id);
CREATE INDEX idx_apps_status ON public.apps(status);
CREATE INDEX idx_apps_category ON public.apps(category);

-- Trigger
CREATE TRIGGER update_apps_updated_at
  BEFORE UPDATE ON public.apps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 4. Partners

**Bestand:** `001_initial_schema.sql` (regels 91-138)

```sql
-- Partners table
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

-- Indexes
CREATE INDEX idx_partners_owner_id ON public.partners(owner_id);
CREATE INDEX idx_partners_status ON public.partners(status);
CREATE INDEX idx_partners_type ON public.partners(type);

-- Trigger
CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 5. Events & Projects

**Bestand:** `001_initial_schema.sql` (regels 141-188)

```sql
-- Events table
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

-- Indexes
CREATE INDEX idx_events_owner_id ON public.events(owner_id);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_type ON public.events(type);

-- Trigger
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 6. Goals & Roadmap

**Bestand:** `001_initial_schema.sql` (regels 191-234)

```sql
-- Goals table
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
  key_results JSONB DEFAULT '[]',
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

-- Indexes
CREATE INDEX idx_goals_owner_id ON public.goals(owner_id);
CREATE INDEX idx_goals_status ON public.goals(status);
CREATE INDEX idx_goals_event_id ON public.goals(event_id);
CREATE INDEX idx_goals_quarter ON public.goals(quarter);
CREATE INDEX idx_goals_category ON public.goals(category);

-- Trigger
CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 7. Marketing Hub

**Bestand:** `002_additional_tables.sql` (regels 1-48)

```sql
-- Marketing posts table
CREATE TABLE public.marketing_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  caption TEXT,
  type TEXT NOT NULL DEFAULT 'post' CHECK (type IN ('post', 'story', 'reel', 'video')),
  platforms TEXT[] NOT NULL DEFAULT '{}',
  media_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'scheduled', 'published', 'failed')),
  scheduled_date DATE,
  scheduled_time TIME,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  approval_required BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.marketing_posts ENABLE ROW LEVEL SECURITY;

-- Marketing posts policies
CREATE POLICY "Team members can view all marketing posts"
  ON public.marketing_posts FOR SELECT
  USING (true);

CREATE POLICY "Team members can create marketing posts"
  ON public.marketing_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors and managers can update marketing posts"
  ON public.marketing_posts FOR UPDATE
  USING (
    auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

CREATE POLICY "Authors and admins can delete marketing posts"
  ON public.marketing_posts FOR DELETE
  USING (
    auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Indexes
CREATE INDEX idx_marketing_posts_author_id ON public.marketing_posts(author_id);
CREATE INDEX idx_marketing_posts_status ON public.marketing_posts(status);
CREATE INDEX idx_marketing_posts_scheduled_date ON public.marketing_posts(scheduled_date);

-- Trigger
CREATE TRIGGER update_marketing_posts_updated_at
  BEFORE UPDATE ON public.marketing_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 8. Documents

**Bestand:** `002_additional_tables.sql` (regels 51-147)

```sql
-- Documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  type TEXT NOT NULL DEFAULT 'doc' CHECK (type IN ('doc', 'sheet', 'slide', 'pdf')),
  folder TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'all')),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  last_edited_by_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Document collaborators (many-to-many)
CREATE TABLE public.document_collaborators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  permission TEXT NOT NULL DEFAULT 'view' CHECK (permission IN ('view', 'edit', 'comment')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(document_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_collaborators ENABLE ROW LEVEL SECURITY;

-- Documents policies
CREATE POLICY "Users can view accessible documents"
  ON public.documents FOR SELECT
  USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM public.document_collaborators
      WHERE document_id = documents.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create documents"
  ON public.documents FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners and collaborators can update documents"
  ON public.documents FOR UPDATE
  USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM public.document_collaborators
      WHERE document_id = documents.id 
      AND user_id = auth.uid() 
      AND permission IN ('edit', 'comment')
    )
  );

CREATE POLICY "Owners and admins can delete documents"
  ON public.documents FOR DELETE
  USING (
    auth.uid() = owner_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Document collaborators policies
CREATE POLICY "Users can view document collaborators"
  ON public.document_collaborators FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.documents
      WHERE id = document_collaborators.document_id
      AND (owner_id = auth.uid() OR id IN (
        SELECT document_id FROM public.document_collaborators WHERE user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Document owners can manage collaborators"
  ON public.document_collaborators FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.documents
      WHERE id = document_collaborators.document_id AND owner_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_documents_owner_id ON public.documents(owner_id);
CREATE INDEX idx_documents_last_edited_by_id ON public.documents(last_edited_by_id);
CREATE INDEX idx_documents_status ON public.documents(status);
CREATE INDEX idx_documents_folder ON public.documents(folder);
CREATE INDEX idx_document_collaborators_document_id ON public.document_collaborators(document_id);
CREATE INDEX idx_document_collaborators_user_id ON public.document_collaborators(user_id);

-- Trigger
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 9. Contracts

**Bestand:** `002_additional_tables.sql` (regels 150-231)

```sql
-- Contracts table
CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contract_id TEXT UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('Software License', 'Service', 'Employment', 'Real Estate', 'NDA', 'Vendor Contract')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'active', 'expiring_soon', 'expired', 'archived')),
  start_date DATE,
  end_date DATE,
  value NUMERIC(12, 2),
  currency TEXT DEFAULT 'EUR',
  auto_renewal BOOLEAN DEFAULT false,
  renewal_notice_days INTEGER DEFAULT 60,
  related_partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL,
  document_url TEXT,
  notes TEXT,
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contract parties (many-to-many)
CREATE TABLE public.contract_parties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Client', 'Vendor', 'Partner', 'Employee', 'Other')),
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_parties ENABLE ROW LEVEL SECURITY;

-- Contracts policies
CREATE POLICY "Team members can view all contracts"
  ON public.contracts FOR SELECT
  USING (true);

CREATE POLICY "Team members can create contracts"
  ON public.contracts FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners and managers can update contracts"
  ON public.contracts FOR UPDATE
  USING (
    auth.uid() = owner_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

CREATE POLICY "Owners and admins can delete contracts"
  ON public.contracts FOR DELETE
  USING (
    auth.uid() = owner_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Contract parties policies
CREATE POLICY "Users can view contract parties"
  ON public.contract_parties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts
      WHERE id = contract_parties.contract_id
    )
  );

CREATE POLICY "Contract owners can manage parties"
  ON public.contract_parties FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.contracts
      WHERE id = contract_parties.contract_id AND owner_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_contracts_owner_id ON public.contracts(owner_id);
CREATE INDEX idx_contracts_status ON public.contracts(status);
CREATE INDEX idx_contracts_type ON public.contracts(type);
CREATE INDEX idx_contracts_end_date ON public.contracts(end_date);
CREATE INDEX idx_contract_parties_contract_id ON public.contract_parties(contract_id);

-- Trigger
CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 10. Chat

**Bestand:** `002_additional_tables.sql` (regels 234-379)

```sql
-- Chat channels table
CREATE TABLE public.chat_channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'channel' CHECK (type IN ('channel', 'direct_message')),
  is_private BOOLEAN DEFAULT false,
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Chat channel members (many-to-many)
CREATE TABLE public.chat_channel_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID NOT NULL REFERENCES public.chat_channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(channel_id, user_id)
);

-- Chat messages
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID NOT NULL REFERENCES public.chat_channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.chat_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Chat channels policies
CREATE POLICY "Members can view channels they belong to"
  ON public.chat_channels FOR SELECT
  USING (
    NOT is_private OR
    EXISTS (
      SELECT 1 FROM public.chat_channel_members
      WHERE channel_id = chat_channels.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create channels"
  ON public.chat_channels FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Channel creators and admins can update channels"
  ON public.chat_channels FOR UPDATE
  USING (
    auth.uid() = created_by OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Channel creators and admins can delete channels"
  ON public.chat_channels FOR DELETE
  USING (
    auth.uid() = created_by OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Chat channel members policies
CREATE POLICY "Channel members can view members"
  ON public.chat_channel_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_channels
      WHERE id = chat_channel_members.channel_id
      AND (NOT is_private OR EXISTS (
        SELECT 1 FROM public.chat_channel_members ccm
        WHERE ccm.channel_id = chat_channel_members.channel_id AND ccm.user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Channel creators and admins can manage members"
  ON public.chat_channel_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_channels
      WHERE id = chat_channel_members.channel_id
      AND (created_by = auth.uid() OR EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
      ))
    )
  );

-- Chat messages policies
CREATE POLICY "Channel members can view messages"
  ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_channel_members
      WHERE channel_id = chat_messages.channel_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Channel members can send messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.chat_channel_members
      WHERE channel_id = chat_messages.channel_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Message authors can update their messages"
  ON public.chat_messages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Message authors and admins can delete messages"
  ON public.chat_messages FOR DELETE
  USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Indexes
CREATE INDEX idx_chat_channels_created_by ON public.chat_channels(created_by);
CREATE INDEX idx_chat_channel_members_channel_id ON public.chat_channel_members(channel_id);
CREATE INDEX idx_chat_channel_members_user_id ON public.chat_channel_members(user_id);
CREATE INDEX idx_chat_messages_channel_id ON public.chat_messages(channel_id);
CREATE INDEX idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at DESC);

-- Triggers
CREATE TRIGGER update_chat_channels_updated_at
  BEFORE UPDATE ON public.chat_channels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at
  BEFORE UPDATE ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 11. Notifications

**Bestand:** Geen aparte tabel nodig

Notifications kunnen worden geïmplementeerd als:
1. **Real-time events** via Supabase Realtime
2. **View/query** op basis van bestaande tabellen (events, goals, documents, etc.)

**Optionele Notifications tabel:**

```sql
-- Optional: Notifications table for storing notification history
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('mention', 'approval', 'update', 'comment', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true); -- Via service role

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
```

---

## 12. Settings

**Bestand:** Geen aparte tabel nodig

Settings gebruiken de `users` tabel voor profile settings. Optioneel kunnen user preferences worden toegevoegd:

```sql
-- Optional: User preferences table
CREATE TABLE public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
  accent_color TEXT DEFAULT '#65da0b',
  density TEXT DEFAULT 'normal' CHECK (density IN ('comfortable', 'normal', 'compact')),
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  digest_frequency TEXT DEFAULT 'real-time' CHECK (digest_frequency IN ('real-time', 'daily', 'weekly')),
  quiet_hours_enabled BOOLEAN DEFAULT false,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- User preferences policies
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own preferences"
  ON public.user_preferences FOR ALL
  USING (auth.uid() = user_id);

-- Trigger
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 📦 Installatie Instructies

### Stap 1: Run Initial Schema

```bash
# In Supabase SQL Editor, run:
supabase/migrations/001_initial_schema.sql
```

### Stap 2: Run Additional Tables

```bash
# In Supabase SQL Editor, run:
supabase/migrations/002_additional_tables.sql
```

### Stap 3: Verify Tables

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

---

## 🔒 Row Level Security (RLS)

Alle tabellen hebben RLS enabled met policies voor:
- **Select**: Team members kunnen alle records zien (of alleen eigen records)
- **Insert**: Alleen owners/admins kunnen records aanmaken
- **Update**: Owners, team members, en admins kunnen updaten
- **Delete**: Alleen owners en admins kunnen verwijderen

---

## 📊 Indexes

Alle tabellen hebben indexes op:
- Foreign keys (owner_id, user_id, etc.)
- Status fields (voor filtering)
- Date fields (voor sorting)
- Unique constraints waar nodig

---

## 🔄 Triggers

Alle tabellen hebben triggers voor:
- `updated_at` timestamp (automatisch updaten bij wijzigingen)
- User profile creation (via `handle_new_user()` functie)


