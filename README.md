# Thiha Naing — Portfolio Website

A modern, full-stack portfolio website for Thiha Naing, Growth Marketer & Digital Strategist. Built with Next.js 15, TypeScript, Tailwind CSS v4, and Supabase.

## Features

- **Public Portfolio** — Hero, About, Experience, Services, Skills, Showcase, and Contact sections
- **Admin Dashboard** — Full CRUD for managing showcase projects with draft/publish workflow
- **Supabase Integration** — Database, authentication, file storage, and Row Level Security
- **Responsive Design** — Premium minimalist aesthetic that looks great on all devices
- **SEO Optimized** — Dynamic metadata, Open Graph tags, and semantic HTML

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage)

---

## Setup Guide

### 1. Clone & Install

```bash
cd thiha-naing-portfolio
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New Project** and fill in:
   - **Name**: `thiha-naing-portfolio`
   - **Database Password**: Choose a strong password
   - **Region**: Choose the closest region to your users
3. Wait for the project to be provisioned

### 3. Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor** → **New Query**
2. Copy the entire contents of `supabase/schema.sql`
3. Paste it into the SQL Editor and click **Run**
4. This will create all tables, RLS policies, storage bucket, and seed the resume data

### 4. Set Environment Variables

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon/public** key
3. Create `.env.local` in the project root:

```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Create Admin User

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter your admin email and password
4. Check **Auto Confirm User**
5. Click **Create user**

This user will have full access to the admin dashboard at `/admin`.

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public portfolio.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin dashboard.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Public portfolio (all sections)
│   ├── layout.tsx            # Root layout (fonts, SEO)
│   ├── globals.css           # Design system (Tailwind v4 tokens)
│   ├── not-found.tsx         # Custom 404
│   ├── showcase/
│   │   └── [slug]/page.tsx   # Case study detail page
│   ├── admin/
│   │   ├── page.tsx          # Admin dashboard
│   │   ├── layout.tsx        # Admin layout (sidebar)
│   │   ├── actions.ts        # Showcase CRUD server actions
│   │   ├── login/            # Login page + auth actions
│   │   └── showcase/         # Create/edit showcase pages
│   └── auth/
│       └── callback/route.ts # Auth callback handler
├── components/
│   ├── public/               # Portfolio section components
│   ├── admin/                # Admin UI components
│   └── ui/                   # Shared UI primitives
├── lib/
│   ├── constants.ts          # Resume data, site config
│   └── utils.ts              # Helper functions
├── utils/
│   └── supabase/             # Supabase client utilities
├── types/
│   └── index.ts              # TypeScript interfaces
└── middleware.ts              # Auth middleware
```

---

## Admin Dashboard

### Managing Showcase Projects

1. Log in at `/admin/login` with your admin credentials
2. Click **Add New Project** to create a showcase item
3. Fill in the project details:
   - **Title** (required) — auto-generates URL slug
   - **Category** — Content Writing, Media Buying, SEO, etc.
   - **Short Description** — shown on the showcase card
   - **Cover Image** — upload a cover image
   - **Facebook Post URL** — link to the original post
   - **Content sections** — writing samples, media buying notes, etc.
   - **Status** — Draft (hidden) or Published (visible on public site)
4. Click **Create Project** to save

### Draft/Publish Workflow

- **Draft**: Only visible in the admin dashboard
- **Published**: Visible on the public portfolio website
- Toggle status from the dashboard table

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**

### Environment Variables for Production

Make sure to update your Supabase project's **URL Configuration**:
1. Go to Supabase dashboard → **Authentication** → **URL Configuration**
2. Set **Site URL** to your production domain (e.g., `https://thiha-naing.com`)
3. Add your production domain to **Redirect URLs**

---

## Security Notes

- Row Level Security (RLS) ensures draft items are never exposed publicly
- Only authenticated users can access admin CRUD operations
- The anon key is safe to expose — RLS policies enforce access control
- Cover images are stored in a public Supabase Storage bucket
- Admin authentication uses Supabase Auth with email/password

---

## License

Private project — all rights reserved.
