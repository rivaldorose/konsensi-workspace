-- News Sources table
CREATE TABLE IF NOT EXISTS public.news_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('finance', 'technology', 'policy', 'real_estate', 'crypto', 'agritech', 'general', 'other')),
  language TEXT NOT NULL DEFAULT 'english' CHECK (language IN ('dutch', 'english', 'french', 'german')),
  fetch_frequency TEXT NOT NULL DEFAULT 'daily' CHECK (fetch_frequency IN ('hourly', 'daily', 'weekly')),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- News Articles table
CREATE TABLE IF NOT EXISTS public.news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID NOT NULL REFERENCES public.news_sources(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  url TEXT NOT NULL,
  image_url TEXT,
  author_name TEXT,
  published_at TIMESTAMPTZ NOT NULL,
  category TEXT CHECK (category IN ('finance', 'technology', 'policy', 'real_estate', 'crypto', 'agritech', 'general', 'other')),
  status TEXT NOT NULL DEFAULT 'trending' CHECK (status IN ('trending', 'new', 'saved', 'archived')),
  is_saved BOOLEAN DEFAULT false,
  ai_summary TEXT,
  fetched_by_n8n BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- News Article Notes table (for team comments and personal notes)
CREATE TABLE IF NOT EXISTS public.news_article_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL REFERENCES public.news_articles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  note_type TEXT NOT NULL DEFAULT 'comment' CHECK (note_type IN ('comment', 'personal_note')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.news_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_article_notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all news sources" ON public.news_sources;
DROP POLICY IF EXISTS "Users can create news sources" ON public.news_sources;
DROP POLICY IF EXISTS "Users can update their news sources" ON public.news_sources;
DROP POLICY IF EXISTS "Users can delete their news sources" ON public.news_sources;

DROP POLICY IF EXISTS "Users can view all news articles" ON public.news_articles;
DROP POLICY IF EXISTS "System can create news articles" ON public.news_articles;
DROP POLICY IF EXISTS "Users can update news articles" ON public.news_articles;

DROP POLICY IF EXISTS "Users can view notes for articles" ON public.news_article_notes;
DROP POLICY IF EXISTS "Users can create notes for articles" ON public.news_article_notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON public.news_article_notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.news_article_notes;

-- News Sources policies
CREATE POLICY "Users can view all news sources"
  ON public.news_sources FOR SELECT
  USING (true);

CREATE POLICY "Users can create news sources"
  ON public.news_sources FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their news sources"
  ON public.news_sources FOR UPDATE
  USING (created_by IS NULL OR created_by = auth.uid())
  WITH CHECK (created_by IS NULL OR created_by = auth.uid());

CREATE POLICY "Users can delete their news sources"
  ON public.news_sources FOR DELETE
  USING (created_by IS NULL OR created_by = auth.uid());

-- News Articles policies
CREATE POLICY "Users can view all news articles"
  ON public.news_articles FOR SELECT
  USING (true);

CREATE POLICY "System can create news articles"
  ON public.news_articles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update news articles"
  ON public.news_articles FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- News Article Notes policies
CREATE POLICY "Users can view notes for articles"
  ON public.news_article_notes FOR SELECT
  USING (true);

CREATE POLICY "Users can create notes for articles"
  ON public.news_article_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON public.news_article_notes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON public.news_article_notes FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_news_sources_category ON public.news_sources(category);
CREATE INDEX IF NOT EXISTS idx_news_sources_is_active ON public.news_sources(is_active);
CREATE INDEX IF NOT EXISTS idx_news_articles_source_id ON public.news_articles(source_id);
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON public.news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_status ON public.news_articles(status);
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON public.news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_is_saved ON public.news_articles(is_saved);
CREATE INDEX IF NOT EXISTS idx_news_article_notes_article_id ON public.news_article_notes(article_id);
CREATE INDEX IF NOT EXISTS idx_news_article_notes_user_id ON public.news_article_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_news_article_notes_note_type ON public.news_article_notes(note_type);

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

