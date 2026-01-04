-- News sources table (configured for n8n bots)
CREATE TABLE IF NOT EXISTS public.news_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('finance', 'technology', 'policy', 'general', 'other')),
  language TEXT NOT NULL DEFAULT 'english' CHECK (language IN ('dutch', 'english', 'french', 'german')),
  fetch_frequency TEXT NOT NULL DEFAULT 'daily' CHECK (fetch_frequency IN ('hourly', 'daily', 'weekly')),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- News articles table
CREATE TABLE IF NOT EXISTS public.news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID REFERENCES public.news_sources(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  url TEXT NOT NULL,
  image_url TEXT,
  category TEXT CHECK (category IN ('finance', 'technology', 'policy', 'real_estate', 'crypto', 'agritech', 'general', 'other')),
  author TEXT,
  published_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_saved BOOLEAN DEFAULT false,
  is_read BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  metadata JSONB, -- Stores additional metadata like tags, sentiment, etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- News article notes (for user notes on articles)
CREATE TABLE IF NOT EXISTS public.news_article_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL REFERENCES public.news_articles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_auto_saved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(article_id, user_id) -- One note per user per article
);

-- News article comments (team comments)
CREATE TABLE IF NOT EXISTS public.news_article_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL REFERENCES public.news_articles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.news_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_article_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_article_comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all active news sources" ON public.news_sources;
DROP POLICY IF EXISTS "Users can create news sources" ON public.news_sources;
DROP POLICY IF EXISTS "Users can update their own news sources" ON public.news_sources;
DROP POLICY IF EXISTS "Users can delete their own news sources" ON public.news_sources;

DROP POLICY IF EXISTS "Users can view all published news articles" ON public.news_articles;
DROP POLICY IF EXISTS "Users can update news articles" ON public.news_articles;

DROP POLICY IF EXISTS "Users can view their own notes" ON public.news_article_notes;
DROP POLICY IF EXISTS "Users can create and update their own notes" ON public.news_article_notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.news_article_notes;

DROP POLICY IF EXISTS "Users can view all comments" ON public.news_article_comments;
DROP POLICY IF EXISTS "Users can create comments" ON public.news_article_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.news_article_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.news_article_comments;

-- News sources policies
CREATE POLICY "Users can view all active news sources"
  ON public.news_sources FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can create news sources"
  ON public.news_sources FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own news sources"
  ON public.news_sources FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own news sources"
  ON public.news_sources FOR DELETE
  USING (auth.uid() = created_by);

-- News articles policies
CREATE POLICY "Users can view all published news articles"
  ON public.news_articles FOR SELECT
  USING (status = 'published');

CREATE POLICY "Users can update news articles"
  ON public.news_articles FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- News article notes policies
CREATE POLICY "Users can view their own notes"
  ON public.news_article_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create and update their own notes"
  ON public.news_article_notes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON public.news_article_notes FOR DELETE
  USING (auth.uid() = user_id);

-- News article comments policies
CREATE POLICY "Users can view all comments"
  ON public.news_article_comments FOR SELECT
  USING (true);

CREATE POLICY "Users can create comments"
  ON public.news_article_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.news_article_comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.news_article_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_news_sources_is_active ON public.news_sources(is_active);
CREATE INDEX IF NOT EXISTS idx_news_sources_category ON public.news_sources(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_source_id ON public.news_articles(source_id);
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON public.news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON public.news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_fetched_at ON public.news_articles(fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_saved ON public.news_articles(is_saved);
CREATE INDEX IF NOT EXISTS idx_news_articles_status ON public.news_articles(status);
CREATE INDEX IF NOT EXISTS idx_news_article_notes_article_id ON public.news_article_notes(article_id);
CREATE INDEX IF NOT EXISTS idx_news_article_notes_user_id ON public.news_article_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_news_article_comments_article_id ON public.news_article_comments(article_id);
CREATE INDEX IF NOT EXISTS idx_news_article_comments_created_at ON public.news_article_comments(created_at DESC);

-- Triggers to update updated_at
CREATE OR REPLACE FUNCTION update_news_sources_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_news_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_news_article_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_news_article_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_news_sources_updated_at ON public.news_sources;
CREATE TRIGGER update_news_sources_updated_at
  BEFORE UPDATE ON public.news_sources
  FOR EACH ROW
  EXECUTE FUNCTION update_news_sources_updated_at();

DROP TRIGGER IF EXISTS update_news_articles_updated_at ON public.news_articles;
CREATE TRIGGER update_news_articles_updated_at
  BEFORE UPDATE ON public.news_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_news_articles_updated_at();

DROP TRIGGER IF EXISTS update_news_article_notes_updated_at ON public.news_article_notes;
CREATE TRIGGER update_news_article_notes_updated_at
  BEFORE UPDATE ON public.news_article_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_news_article_notes_updated_at();

DROP TRIGGER IF EXISTS update_news_article_comments_updated_at ON public.news_article_comments;
CREATE TRIGGER update_news_article_comments_updated_at
  BEFORE UPDATE ON public.news_article_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_news_article_comments_updated_at();
