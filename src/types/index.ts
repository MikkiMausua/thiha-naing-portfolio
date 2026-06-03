export interface ShowcaseItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  project_type: string;
  short_description: string;
  my_role: string;
  facebook_post_url: string;
  cover_image_url: string;
  content_writing_sample: string;
  media_buying_notes: string;
  event_planning_notes: string;
  results: string;
  tools_used: string;
  full_case_study: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  professional_summary: string;
  phone: string;
  email: string;
}

export interface Experience {
  id: string;
  job_title: string;
  company: string;
  period: string;
  responsibilities: string[];
  sort_order: number;
}

export interface Skill {
  id: string;
  skill_category: string;
  skill_name: string;
  sort_order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  tags: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}
