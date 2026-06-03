import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { ShowcaseItem } from "@/types";

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

  return (
    <div className="min-h-screen bg-bg">
      {/* Back navigation */}
      <nav className="sticky top-0 z-40 glass border-b border-gray-light/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/#showcase"
            className="inline-flex items-center gap-2 text-sm text-blue hover:text-navy transition-colors"
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

      {/* Cover Image Hero */}
      {project.cover_image_url && (
        <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-6xl mx-auto">
              {project.category && (
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full mb-4">
                  {project.category}
                </span>
              )}
              <h1 className="text-3xl md:text-5xl font-bold text-white">
                {project.title}
              </h1>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header if no cover image */}
        {!project.cover_image_url && (
          <div className="mb-12">
            {project.category && (
              <span className="inline-block px-3 py-1 bg-blue/10 text-blue text-xs font-medium rounded-full mb-4">
                {project.category}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-bold text-navy">
              {project.title}
            </h1>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Short Description */}
            {project.short_description && (
              <section>
                <h2 className="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue rounded-full" />
                  Overview
                </h2>
                <p className="text-charcoal leading-relaxed text-lg">
                  {project.short_description}
                </p>
              </section>
            )}

            {/* Content Writing Sample */}
            {project.content_writing_sample && (
              <section>
                <h2 className="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue rounded-full" />
                  Content Writing Sample
                </h2>
                <div className="bg-white rounded-xl border border-gray-light/60 p-6">
                  <p className="text-charcoal leading-relaxed whitespace-pre-wrap">
                    {project.content_writing_sample}
                  </p>
                </div>
              </section>
            )}

            {/* Media Buying Notes */}
            {project.media_buying_notes && (
              <section>
                <h2 className="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue rounded-full" />
                  Media Buying Notes
                </h2>
                <div className="bg-white rounded-xl border border-gray-light/60 p-6">
                  <p className="text-charcoal leading-relaxed whitespace-pre-wrap">
                    {project.media_buying_notes}
                  </p>
                </div>
              </section>
            )}

            {/* Event Planning Notes */}
            {project.event_planning_notes && (
              <section>
                <h2 className="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue rounded-full" />
                  Event Planning Notes
                </h2>
                <div className="bg-white rounded-xl border border-gray-light/60 p-6">
                  <p className="text-charcoal leading-relaxed whitespace-pre-wrap">
                    {project.event_planning_notes}
                  </p>
                </div>
              </section>
            )}

            {/* Results */}
            {project.results && (
              <section>
                <h2 className="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue rounded-full" />
                  Results & Metrics
                </h2>
                <div className="bg-blue/5 rounded-xl border border-blue/20 p-6">
                  <p className="text-charcoal leading-relaxed whitespace-pre-wrap">
                    {project.results}
                  </p>
                </div>
              </section>
            )}

            {/* Full Case Study */}
            {project.full_case_study && (
              <section>
                <h2 className="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue rounded-full" />
                  Full Case Study
                </h2>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">
                    {project.full_case_study}
                  </p>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Project Metadata Card */}
              <div className="bg-white rounded-2xl border border-gray-light/60 p-6 space-y-5">
                <h3 className="font-semibold text-navy text-lg">
                  Project Details
                </h3>

                {project.project_type && (
                  <div>
                    <dt className="text-xs font-medium text-gray uppercase tracking-wider mb-1">
                      Project Type
                    </dt>
                    <dd className="text-charcoal">{project.project_type}</dd>
                  </div>
                )}

                {project.my_role && (
                  <div>
                    <dt className="text-xs font-medium text-gray uppercase tracking-wider mb-1">
                      My Role
                    </dt>
                    <dd className="text-charcoal">{project.my_role}</dd>
                  </div>
                )}

                {project.category && (
                  <div>
                    <dt className="text-xs font-medium text-gray uppercase tracking-wider mb-1">
                      Category
                    </dt>
                    <dd>
                      <span className="inline-block px-3 py-1 bg-blue/10 text-blue text-xs font-medium rounded-full">
                        {project.category}
                      </span>
                    </dd>
                  </div>
                )}

                {project.tools_used && (
                  <div>
                    <dt className="text-xs font-medium text-gray uppercase tracking-wider mb-1">
                      Tools Used
                    </dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {project.tools_used.split(",").map((tool, i) => (
                        <span
                          key={i}
                          className="inline-block px-2 py-0.5 bg-gray-light/50 text-charcoal text-xs rounded"
                        >
                          {tool.trim()}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </div>

              {/* Facebook Post Link */}
              {project.facebook_post_url && (
                <div className="bg-white rounded-2xl border border-gray-light/60 p-6">
                  <h3 className="font-semibold text-navy text-lg mb-3">
                    Facebook Post
                  </h3>
                  <a
                    href={project.facebook_post_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1877F2] text-white rounded-lg text-sm font-medium hover:bg-[#1864D9] transition-colors w-full justify-center"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    View on Facebook
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
