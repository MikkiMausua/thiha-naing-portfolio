-- ============================================
-- Thiha Naing Portfolio — Database Schema
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- Dashboard > SQL Editor > New Query
-- ============================================

-- ============================================
-- 1. TABLES
-- ============================================

-- Profile table (single row for site owner)
CREATE TABLE IF NOT EXISTS public.profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  professional_summary text NOT NULL,
  phone text,
  email text
);

-- Experiences table
CREATE TABLE IF NOT EXISTS public.experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_title text NOT NULL,
  company text NOT NULL,
  period text NOT NULL,
  responsibilities text[] DEFAULT '{}',
  sort_order integer DEFAULT 0
);

-- Skills table
CREATE TABLE IF NOT EXISTS public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_category text NOT NULL,
  skill_name text NOT NULL,
  sort_order integer DEFAULT 0
);

-- Showcase items table (managed by admin)
CREATE TABLE IF NOT EXISTS public.showcase_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text,
  project_type text,
  short_description text,
  my_role text,
  facebook_post_url text,
  cover_image_url text,
  content_writing_sample text,
  media_buying_notes text,
  event_planning_notes text,
  results text,
  tools_used text,
  full_case_study text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 2. ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showcase_items ENABLE ROW LEVEL SECURITY;

-- Profile: public read, authenticated update
CREATE POLICY "Public can view profile"
  ON public.profile FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update profile"
  ON public.profile FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Experiences: public read
CREATE POLICY "Public can view experiences"
  ON public.experiences FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage experiences"
  ON public.experiences FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Skills: public read
CREATE POLICY "Public can view skills"
  ON public.skills FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage skills"
  ON public.skills FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Showcase items: public read ONLY published, authenticated full access
CREATE POLICY "Public can view published showcase items"
  ON public.showcase_items FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated users can view all showcase items"
  ON public.showcase_items FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create showcase items"
  ON public.showcase_items FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update showcase items"
  ON public.showcase_items FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete showcase items"
  ON public.showcase_items FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- ============================================
-- 3. STORAGE BUCKET
-- ============================================

-- Create a public bucket for showcase cover images
INSERT INTO storage.buckets (id, name, public)
VALUES ('showcase-images', 'showcase-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, authenticated upload/update/delete
CREATE POLICY "Public can view showcase images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'showcase-images');

CREATE POLICY "Authenticated users can upload showcase images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'showcase-images'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Authenticated users can update showcase images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'showcase-images'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Authenticated users can delete showcase images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'showcase-images'
    AND auth.uid() IS NOT NULL
  );

-- ============================================
-- 4. UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.showcase_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 5. SEED DATA (Resume Information)
-- ============================================

-- Profile
INSERT INTO public.profile (name, title, professional_summary, phone, email)
VALUES (
  'Thiha Naing',
  'Growth Marketer & Digital Strategist',
  'A data-driven digital marketer with a strong mix of technical expertise and creative strategy. Experienced in the full campaign lifecycle, managing large-scale Meta ad campaigns, implementing SEO strategies for e-commerce, and setting up marketing automations. Dedicated to optimizing marketing outcomes and improving brand presence through data analytics, workflow automation, and compelling narratives.',
  '09-957369881',
  'thihanaingg6@gmail.com'
);

-- Experiences
INSERT INTO public.experiences (job_title, company, period, responsibilities, sort_order)
VALUES
(
  'Digital Marketing Executive',
  'U Book Educations Co.',
  '2024 - Present',
  ARRAY[
    'Managed and directed digital marketing teams and operations across Myanmar and Cambodia.',
    'Developed and executed a comprehensive 3-month SEO & SEM strategy for a new e-commerce website.',
    'Worked on systematic classification and optimization of a 397-book inventory.',
    'Oversaw Meta advertising campaigns and optimized funnel setups to improve ROI.',
    'Integrated AI tools and marketing automations such as ManyChat and Make.com.',
    'Established and tracked KPIs to improve team performance and marketing outcomes.'
  ],
  1
),
(
  'Digital Marketing Assistant Supervisor',
  'Myint Thukha Nadi Company., Ltd',
  '2023 - 2025',
  ARRAY[
    'Supported daily team operations, workflow management, and task delegation.',
    'Monitored project timelines and helped the team meet deadlines.',
    'Tracked employee performance and provided constructive feedback.',
    'Assisted in developing training programs.',
    'Maintained operational documents and ensured team compliance.'
  ],
  2
);

-- Skills
INSERT INTO public.skills (skill_category, skill_name, sort_order)
VALUES
  ('SEO & SEM', 'On-page SEO', 1),
  ('SEO & SEM', 'Technical SEO Optimization', 2),
  ('Advertising', 'Meta Ads Campaign Setup & Optimization', 3),
  ('Analytics', 'Performance Metrics Tracking', 4),
  ('Analytics', 'Data Analysis', 5),
  ('Automation', 'ManyChat', 6),
  ('Automation', 'Make.com Workflow Setup', 7),
  ('Content', 'Content Writing & Editing', 8),
  ('Social Media', 'Social Media Management', 9),
  ('Creative', 'Video Production', 10),
  ('Creative', 'Graphic Design', 11),
  ('Creative', 'Modern / Minimalist Aesthetic Directing', 12);
