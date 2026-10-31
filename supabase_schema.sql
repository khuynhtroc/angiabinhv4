-- ============================================================================
-- BÊ TÔNG AN GIA BÌNH (betongangiabinh.vn) - FULL SUPABASE DATABASE SCHEMA
-- Project ID: msxqrdaklnfpqwhxwjlc
-- Project URL: https://msxqrdaklnfpqwhxwjlc.supabase.co
-- HƯỚNG DẪN: Copy toàn bộ nội dung file này dán vào mục SQL Editor trên
-- dashboard Supabase (https://supabase.com/dashboard/project/msxqrdaklnfpqwhxwjlc/sql)
-- rồi nhấn "RUN".
-- ============================================================================

-- 1. Bảng lưu danh sách bài viết blog chuẩn SEO (posts)
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  "coverImage" TEXT DEFAULT '',
  author TEXT DEFAULT 'Ban Kỹ Thuật An Gia Bình',
  date TEXT DEFAULT '',
  category TEXT DEFAULT 'Bê Tông Tươi',
  tags JSONB DEFAULT '[]'::jsonb,
  views INTEGER DEFAULT 0,
  "readTime" TEXT DEFAULT '5 phút',
  "seoTitle" TEXT DEFAULT '',
  "metaTitle" TEXT DEFAULT '',
  "seoDescription" TEXT DEFAULT '',
  "focusKeywords" JSONB DEFAULT '[]'::jsonb,
  keywords JSONB DEFAULT '[]'::jsonb,
  "isPublished" BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  "jekyllMarkdown" TEXT DEFAULT '',
  permalink TEXT DEFAULT '',
  "updatedAt" TEXT DEFAULT '',
  "aiHeroImagePrompt" TEXT DEFAULT '',
  "isTrendingNews" BOOLEAN DEFAULT false,
  "sourceUrl" TEXT DEFAULT '',
  "trendScore" INTEGER DEFAULT 0,
  "newsType" TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index tìm kiếm bài viết theo slug và ngày đăng
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_date ON public.posts(date DESC);

-- 2. Bảng lưu danh sách dự án / công trình tiêu biểu (projects)
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Công trình trọng điểm',
  location TEXT DEFAULT 'Ninh Bình',
  "volumeM3" INTEGER DEFAULT 0,
  "concreteGrade" TEXT DEFAULT 'Mác 300, Mác 350 R7',
  "pumpService" TEXT DEFAULT 'Bơm cần 52m',
  year INTEGER DEFAULT 2026,
  image TEXT DEFAULT '',
  client TEXT DEFAULT '',
  description TEXT DEFAULT '',
  highlights JSONB DEFAULT '[]'::jsonb,
  slug TEXT DEFAULT '',
  date TEXT DEFAULT '',
  permalink TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Bảng lưu danh sách yêu cầu báo giá / liên hệ (leads)
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT DEFAULT '',
  "concreteGrade" TEXT DEFAULT '',
  "estimatedM3" NUMERIC DEFAULT 0,
  "pumpNeeded" BOOLEAN DEFAULT false,
  "pumpType" TEXT DEFAULT '',
  "pourDate" TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'new'
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads("createdAt" DESC);

-- 4. Bảng danh mục bài viết (categories)
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  "postCount" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Bảng Kho Dữ liệu Đồng bộ Tổng hợp (site_data_store)
-- Dùng để lưu trữ linh hoạt dữ liệu JSON cho config, posts, scheduler, aiSettings...
CREATE TABLE IF NOT EXISTS public.site_data_store (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Bảng cấu hình Social Auto-Share (social_settings)
CREATE TABLE IF NOT EXISTS public.social_settings (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Bảng nhật ký chạy AI Scheduler & Viết bài tự động (scheduler_logs)
CREATE TABLE IF NOT EXISTS public.scheduler_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  "newsTitle" TEXT DEFAULT '',
  "generatedTitle" TEXT DEFAULT '',
  "wordCount" INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published'
);

-- ============================================================================
-- CẤU HÌNH BẢO MẬT & QUYỀN TRUY CẬP (RLS POLICIES)
-- Tắt RLS và cấp toàn quyền cho anon, authenticated, service_role
-- Giúp website, admin dashboard và worker kết nối Supabase mượt mà không bị 403/401
-- ============================================================================
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_data_store DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduler_logs DISABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.posts TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.projects TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.leads TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.categories TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.site_data_store TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.social_settings TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.scheduler_logs TO anon, authenticated, service_role;
