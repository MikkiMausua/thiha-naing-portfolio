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
  layout_format: 'standard' | 'gallery' | 'case-study' | 'minimal';
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  category_details?: CategoryDetails;
}

export interface CategoryDetails {
  contentWriting?: ContentWritingDetails;
  mediaBuying?: MediaBuyingDetails;
  eventPlanning?: EventPlanningDetails;
  socialMedia?: SocialMediaDetails;
  automation?: AutomationDetails;
}

export interface ContentWritingDetails {
  contentType?: string;
  clientBrandType?: string;
  targetAudience?: string;
  contentGoal?: string;
  toneOfVoice?: string;
  keyMessage?: string;
  writingSamples?: string;
  beforeCopy?: string;
  afterCopy?: string;
  distributionChannel?: string;
  performanceMetrics?: string;
  ctaOutcome?: string;
}

export interface MediaBuyingDetails {
  platform?: string;
  campaignObjective?: string;
  dateRange?: string;
  totalSpend?: string;
  impressions?: string;
  reach?: string;
  clicks?: string;
  ctr?: string;
  cpm?: string;
  cpc?: string;
  leadsMessagesPurchases?: string;
  roas?: string;
  audienceStrategy?: string;
  creativeStrategy?: string;
  optimizationApproach?: string;
  reportingNotes?: string;
}

export interface EventPlanningDetails {
  eventName?: string;
  eventType?: string;
  eventDate?: string;
  venue?: string;
  attendeeCount?: string;
  organizerBrand?: string;
  myResponsibilities?: string;
  eventObjective?: string;
  planningScope?: string;
  timelineRunOfShow?: string;
  vendorsPartners?: string;
  deliverables?: string;
  eventOutcome?: string;
  challengesSolved?: string;
}

export interface SocialMediaDetails {
  platform?: string;
  campaignPageType?: string;
  contentPillars?: string;
  postingFrequency?: string;
  contentFormats?: string;
  creativeDirection?: string;
  captionStrategy?: string;
  communityManagementNotes?: string;
  monthlyPlanCalendar?: string;
  engagementMetrics?: string;
  bestPerformingPosts?: string;
  brandVoice?: string;
}

export interface AutomationDetails {
  businessProblem?: string;
  manualWorkflowBefore?: string;
  automationGoal?: string;
  toolsIntegrations?: string;
  trigger?: string;
  workflowSteps?: string;
  outputResult?: string;
  timeSaved?: string;
  errorHandlingFallback?: string;
  userFlow?: string;
  screenshotsWorkflowDiagram?: string;
  businessImpact?: string;
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

export interface GalleryImage {
  id: string;
  showcase_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export type LayoutFormat = 'standard' | 'gallery' | 'case-study' | 'minimal';
