import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { ShowcaseItem, GalleryImage } from "@/types";
import StandardLayout from "@/components/showcase/StandardLayout";
import GalleryLayout from "@/components/showcase/GalleryLayout";
import CaseStudyLayout from "@/components/showcase/CaseStudyLayout";
import MinimalLayout from "@/components/showcase/MinimalLayout";
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

      {/* Render selected layout */}
      {project.layout_format === "gallery" && (
        <GalleryLayout project={project} galleryImages={gallery} />
      )}
      {project.layout_format === "case-study" && (
        <CaseStudyLayout project={project} galleryImages={gallery} />
      )}
      {project.layout_format === "minimal" && (
        <MinimalLayout project={project} galleryImages={gallery} />
      )}
      {(project.layout_format === "standard" || !project.layout_format) && (
        <StandardLayout project={project} galleryImages={gallery} />
      )}

      {/* Contact Popup */}
      <ContactPopup />
    </div>
  );
}
