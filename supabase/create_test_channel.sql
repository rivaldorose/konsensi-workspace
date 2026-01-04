-- Create a test public channel and add current user as member
-- Run this in Supabase SQL Editor after logging in

-- First, create a public channel
INSERT INTO public.chat_channels (name, description, type, is_private, created_by)
SELECT 
  'general' as name,
  'General discussion channel' as description,
  'channel' as type,
  false as is_private,
  auth.uid() as created_by
WHERE NOT EXISTS (
  SELECT 1 FROM public.chat_channels WHERE name = 'general'
)
RETURNING id;

-- Add current user as member of the general channel
INSERT INTO public.chat_channel_members (channel_id, user_id)
SELECT 
  id as channel_id,
  auth.uid() as user_id
FROM public.chat_channels
WHERE name = 'general'
  AND NOT EXISTS (
    SELECT 1 FROM public.chat_channel_members 
    WHERE channel_id = chat_channels.id 
    AND user_id = auth.uid()
  );

