-- ============================================
-- Showcase Gallery & Layout Format Updates
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Add layout_format column to showcase_items
ALTER TABLE public.showcase_items
ADD COLUMN IF NOT EXISTS layout_format text DEFAULT 'standard';

-- Gallery images table
CREATE TABLE IF NOT EXISTS public.showcase_gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  showcase_id uuid NOT NULL REFERENCES public.showcase_items(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.showcase_gallery ENABLE ROW LEVEL SECURITY;

-- Public can view gallery images
CREATE POLICY "Public can view showcase gallery"
  ON public.showcase_gallery FOR SELECT
  USING (true);

-- Authenticated users full access
CREATE POLICY "Authenticated users can manage showcase gallery"
  ON public.showcase_gallery FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
