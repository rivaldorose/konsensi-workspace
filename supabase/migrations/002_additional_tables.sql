-- ============================================
-- MARKETING POSTS TABLE
-- ============================================
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

-- Indexes for marketing_posts
CREATE INDEX idx_marketing_posts_author_id ON public.marketing_posts(author_id);
CREATE INDEX idx_marketing_posts_status ON public.marketing_posts(status);
CREATE INDEX idx_marketing_posts_scheduled_date ON public.marketing_posts(scheduled_date);

-- Trigger for marketing_posts
CREATE TRIGGER update_marketing_posts_updated_at
  BEFORE UPDATE ON public.marketing_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DOCUMENTS TABLE
-- ============================================
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

-- Indexes for documents
CREATE INDEX idx_documents_owner_id ON public.documents(owner_id);
CREATE INDEX idx_documents_last_edited_by_id ON public.documents(last_edited_by_id);
CREATE INDEX idx_documents_status ON public.documents(status);
CREATE INDEX idx_documents_folder ON public.documents(folder);
CREATE INDEX idx_document_collaborators_document_id ON public.document_collaborators(document_id);
CREATE INDEX idx_document_collaborators_user_id ON public.document_collaborators(user_id);

-- Triggers for documents
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CONTRACTS TABLE
-- ============================================
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

-- Indexes for contracts
CREATE INDEX idx_contracts_owner_id ON public.contracts(owner_id);
CREATE INDEX idx_contracts_status ON public.contracts(status);
CREATE INDEX idx_contracts_type ON public.contracts(type);
CREATE INDEX idx_contracts_end_date ON public.contracts(end_date);
CREATE INDEX idx_contract_parties_contract_id ON public.contract_parties(contract_id);

-- Triggers for contracts
CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CHAT CHANNELS TABLE
-- ============================================
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

-- Indexes for chat
CREATE INDEX idx_chat_channels_created_by ON public.chat_channels(created_by);
CREATE INDEX idx_chat_channel_members_channel_id ON public.chat_channel_members(channel_id);
CREATE INDEX idx_chat_channel_members_user_id ON public.chat_channel_members(user_id);
CREATE INDEX idx_chat_messages_channel_id ON public.chat_messages(channel_id);
CREATE INDEX idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at DESC);

-- Triggers for chat
CREATE TRIGGER update_chat_channels_updated_at
  BEFORE UPDATE ON public.chat_channels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at
  BEFORE UPDATE ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

