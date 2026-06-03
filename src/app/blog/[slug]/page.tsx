import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { BlogPost } from "@/types";
import { formatDate } from "@/lib/utils";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Thiha Naing Blog`,
    description: post.excerpt || "",
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) {
    notFound();
  }

  const blogPost = post as BlogPost;

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        {/* Hero */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/#blog"
            className="inline-flex items-center gap-1.5 text-blue hover:text-navy text-sm font-medium mb-8 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          {/* Tags */}
          {blogPost.tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blogPost.tags.split(',').map((tag) => (
                <span
                  key={tag.trim()}
                  className="inline-block px-3 py-1 bg-blue/10 text-blue text-xs font-medium rounded-full"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-5xl font-bold text-navy mb-4 leading-tight">
            {blogPost.title}
          </h1>

          {blogPost.excerpt && (
            <p className="text-lg text-gray mb-6 leading-relaxed">{blogPost.excerpt}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray mb-10 pb-8 border-b border-gray-light/60">
            <span>{formatDate(blogPost.created_at)}</span>
            <span>·</span>
            <span>Thiha Naing</span>
          </div>

          {/* Cover Image */}
          {blogPost.cover_image_url && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-10">
              <Image
                src={blogPost.cover_image_url}
                alt={blogPost.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <article className="prose prose-lg max-w-none text-charcoal leading-relaxed whitespace-pre-wrap">
            {blogPost.content}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
