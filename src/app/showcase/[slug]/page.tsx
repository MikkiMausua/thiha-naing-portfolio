import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { ShowcaseItem, GalleryImage } from "@/types";
import ContentWritingTemplate from "@/components/showcase/templates/ContentWritingTemplate";
import MediaBuyingTemplate from "@/components/showcase/templates/MediaBuyingTemplate";
import EventPlanningTemplate from "@/components/showcase/templates/EventPlanningTemplate";
import SocialMediaTemplate from "@/components/showcase/templates/SocialMediaTemplate";
import AutomationTemplate from "@/components/showcase/templates/AutomationTemplate";
import DefaultShowcaseTemplate from "@/components/showcase/templates/DefaultShowcaseTemplate";
import ContactPopup from "@/components/showcase/ContactPopup";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase
    .from("showcase_items")
    .select("title, short_description")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!item) {
    return { title: "Project Not Found" };
  }

  return {
    title: item.title,
    description: item.short_description || `Showcase project: ${item.title}`,
  };
}

export default async function ShowcaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("showcase_items")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!item) {
    notFound();
  }

  const project = item as ShowcaseItem;

  // Fetch gallery images
  const { data: galleryImages } = await supabase
    .from("showcase_gallery")
    .select("*")
    .eq("showcase_id", project.id)
    .order("sort_order", { ascending: true });

  const gallery = (galleryImages || []) as GalleryImage[];

  // Route layout template based on category
  const cat = (project.category || "").toLowerCase().trim();

  let TemplateComponent = DefaultShowcaseTemplate;

  if (cat.includes("writing") || cat.includes("content")) {
    TemplateComponent = ContentWritingTemplate;
  } else if (cat.includes("buying") || cat.includes("media") || cat.includes("ad")) {
    TemplateComponent = MediaBuyingTemplate;
  } else if (cat.includes("event") || cat.includes("planning")) {
    TemplateComponent = EventPlanningTemplate;
  } else if (cat.includes("social") || cat.includes("media")) {
    TemplateComponent = SocialMediaTemplate;
  } else if (cat.includes("auto") || cat.includes("automation") || cat.includes("workflow")) {
    TemplateComponent = AutomationTemplate;
  }

  return (
    <div className="min-h-screen bg-bg relative">
      {/* Sticky Back Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-light/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/#showcase"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue hover:text-navy transition-colors cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Portfolio
          </Link>
        </div>
      </nav>

      {/* Render Category Layout Template */}
      <TemplateComponent project={project} galleryImages={gallery} />

      {/* Contact Popup */}
      <ContactPopup />
    </div>
  );
}
