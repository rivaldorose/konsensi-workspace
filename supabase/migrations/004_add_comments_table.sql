-- Comments table for files and documents
CREATE TABLE IF NOT EXISTS public.file_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_id UUID NOT NULL REFERENCES public.files(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.file_comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view comments on accessible files" ON public.file_comments;
DROP POLICY IF EXISTS "Users can create comments on accessible files" ON public.file_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.file_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.file_comments;

-- Comments policies
CREATE POLICY "Users can view comments on accessible files"
  ON public.file_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.files
      WHERE id = file_comments.file_id
      AND (
        created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.files f2
          WHERE f2.id = file_comments.file_id
        )
      )
    )
  );

CREATE POLICY "Users can create comments on accessible files"
  ON public.file_comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.files
      WHERE id = file_comments.file_id
    )
  );

CREATE POLICY "Users can update their own comments"
  ON public.file_comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.file_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_file_comments_file_id ON public.file_comments(file_id);
CREATE INDEX IF NOT EXISTS idx_file_comments_user_id ON public.file_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_file_comments_created_at ON public.file_comments(created_at DESC);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_file_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_file_comments_updated_at ON public.file_comments;
CREATE TRIGGER update_file_comments_updated_at
  BEFORE UPDATE ON public.file_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_file_comments_updated_at();

