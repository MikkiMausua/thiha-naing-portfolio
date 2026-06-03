import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import About from "@/components/public/About";
import Showcase from "@/components/public/Showcase";
import Experience from "@/components/public/Experience";
import Services from "@/components/public/Services";
import Skills from "@/components/public/Skills";
import Blog from "@/components/public/Blog";
import Contact from "@/components/public/Contact";
import Footer from "@/components/public/Footer";
import type { Experience as ExperienceType, Skill, ShowcaseItem, BlogPost } from "@/types";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch profile
  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .single();

  // Fetch experiences ordered by sort_order
  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true });

  // Fetch skills ordered by sort_order
  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });

  // Fetch only published showcase items
  const { data: showcaseItems } = await supabase
    .from("showcase_items")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // Fetch only published blog posts
  const { data: blogPosts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About summary={profile?.professional_summary || ""} />
        <Showcase items={(showcaseItems as ShowcaseItem[]) || []} />
        <Experience experiences={(experiences as ExperienceType[]) || []} />
        <Services />
        <Skills skills={(skills as Skill[]) || []} />
        <Blog posts={(blogPosts as BlogPost[]) || []} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
