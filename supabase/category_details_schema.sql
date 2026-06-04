-- ============================================
-- Add category_details JSONB column
-- ============================================
-- Run this in your Supabase SQL Editor
-- ============================================

ALTER TABLE public.showcase_items
ADD COLUMN IF NOT EXISTS category_details jsonb DEFAULT '{}'::jsonb;
