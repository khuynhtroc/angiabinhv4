-- ==============================================================================
-- BÊ TÔNG AN GIA BÌNH - SUPABASE SCHEMA SETUP
-- Run this script in the Supabase Dashboard -> SQL Editor -> Run
-- Project ID: msxqrdaklnfpqwhxwjlc
-- ==============================================================================

-- 1. Table: social_settings (Stores Facebook, TikTok, LinkedIn, Cron social configs)
CREATE TABLE IF NOT EXISTS public.social_settings (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Table: site_data_store (General key-value store for site configuration & backup)
CREATE TABLE IF NOT EXISTS public.site_data_store (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. Table: settings (Website, SEO, schema, AI scheduler configurations)
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Table: posts (Blog posts cache and real-time updates)
CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY,
    title TEXT,
    slug TEXT UNIQUE,
    content TEXT,
    excerpt TEXT,
    date TEXT,
    category TEXT,
    tags JSONB,
    image TEXT,
    author TEXT,
    isPublished BOOLEAN DEFAULT TRUE,
    views INTEGER DEFAULT 0,
    data JSONB,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. Table: projects (Projects showcase)
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    title TEXT,
    slug TEXT UNIQUE,
    content TEXT,
    excerpt TEXT,
    image TEXT,
    data JSONB,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.social_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_data_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Allow anon and authenticated full access for website operations
CREATE POLICY "Allow public read access on social_settings" ON public.social_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on social_settings" ON public.social_settings FOR ALL USING (true);

CREATE POLICY "Allow public read access on site_data_store" ON public.site_data_store FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on site_data_store" ON public.site_data_store FOR ALL USING (true);

CREATE POLICY "Allow public read access on settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on settings" ON public.settings FOR ALL USING (true);

CREATE POLICY "Allow public read access on posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on posts" ON public.posts FOR ALL USING (true);

CREATE POLICY "Allow public read access on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on projects" ON public.projects FOR ALL USING (true);

