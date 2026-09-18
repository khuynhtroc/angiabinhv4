import fs from 'node:fs';
import path from 'node:path';
import {
  BlogPost,
  Project,
  SitePage,
  CategoryItem,
  JekyllConfig
} from '@/lib/types';
import {
  initialBlogPosts,
  initialProjects,
  initialPages,
  initialCategories,
  initialJekyllConfig
} from '@/lib/initial-data';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const PAGES_FILE = path.join(DATA_DIR, 'pages.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn('[server-data] Failed to ensure DATA_DIR:', err);
  }
}

/**
 * Get all blog posts on the server.
 * public/data/posts.json is the primary source of truth.
 */
export function getAllPostsServer(): BlogPost[] {
  ensureDataDir();
  try {
    if (fs.existsSync(POSTS_FILE)) {
      const raw = fs.readFileSync(POSTS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } else {
      // Auto-initialize posts.json on first access
      fs.writeFileSync(POSTS_FILE, JSON.stringify(initialBlogPosts, null, 2), 'utf-8');
      return initialBlogPosts;
    }
  } catch (err) {
    console.warn('[server-data] Error reading posts.json:', err);
  }

  return initialBlogPosts;
}

/**
 * Find a specific post by slug or ID on the server.
 */
export function getPostBySlugServer(rawSlug: string): BlogPost | null {
  if (!rawSlug) return null;
  const clean = decodeURIComponent(rawSlug).trim().replace(/\.html$/, '');
  const posts = getAllPostsServer();

  return (
    posts.find(
      (p) =>
        p.slug === clean ||
        p.id === clean ||
        p.slug === rawSlug ||
        p.id === rawSlug ||
        `${p.slug}.html` === rawSlug ||
        `${p.id}.html` === rawSlug
    ) || null
  );
}

/**
 * Get all projects on the server.
 * public/data/projects.json is the primary source of truth.
 */
export function getAllProjectsServer(): Project[] {
  ensureDataDir();
  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      const raw = fs.readFileSync(PROJECTS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } else {
      fs.writeFileSync(PROJECTS_FILE, JSON.stringify(initialProjects, null, 2), 'utf-8');
      return initialProjects;
    }
  } catch (err) {
    console.warn('[server-data] Error reading projects.json:', err);
  }

  return initialProjects;
}

export function getProjectBySlugServer(rawSlug: string): Project | null {
  if (!rawSlug) return null;
  const clean = decodeURIComponent(rawSlug).trim().replace(/\.html$/, '');
  const projects = getAllProjectsServer();

  return (
    projects.find((p) => {
      const pSlug = p.slug || '';
      const pId = p.id || '';
      return (
        pSlug === clean ||
        pId === clean ||
        pSlug === rawSlug ||
        pId === rawSlug ||
        `${pSlug}.html` === rawSlug ||
        `${pId}.html` === rawSlug
      );
    }) || null
  );
}

/**
 * Get all custom site pages on the server.
 */
export function getAllPagesServer(): SitePage[] {
  ensureDataDir();
  const map = new Map<string, SitePage>();

  initialPages.forEach((pg) => {
    const key = pg.slug || pg.id;
    if (key) map.set(key, pg);
  });

  try {
    if (fs.existsSync(PAGES_FILE)) {
      const raw = fs.readFileSync(PAGES_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsed.forEach((pg: SitePage) => {
          const key = pg.slug || pg.id;
          if (key) map.set(key, pg);
        });
      }
    } else {
      fs.writeFileSync(PAGES_FILE, JSON.stringify(initialPages, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[server-data] Error reading pages.json:', err);
  }

  const uniquePages: SitePage[] = [];
  const seen = new Set<string>();
  map.forEach((pg) => {
    const key = pg.id || pg.slug;
    if (key && !seen.has(key)) {
      seen.add(key);
      uniquePages.push(pg);
    }
  });

  return uniquePages;
}

export function getPageBySlugServer(rawSlug: string): SitePage | null {
  if (!rawSlug) return null;
  const clean = rawSlug.trim().replace(/\.html$/, '').replace(/^\//, '');
  const pages = getAllPagesServer();

  return (
    pages.find((p) => {
      const pSlugClean = (p.slug || '').replace(/^\//, '').replace(/\.html$/, '');
      return (
        pSlugClean === clean ||
        p.id === clean ||
        p.slug === rawSlug ||
        p.slug === `/${rawSlug}`
      );
    }) || null
  );
}

/**
 * Get all categories on the server.
 */
export function getAllCategoriesServer(): CategoryItem[] {
  ensureDataDir();
  try {
    if (fs.existsSync(CATEGORIES_FILE)) {
      const raw = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } else {
      fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(initialCategories, null, 2), 'utf-8');
      return initialCategories;
    }
  } catch {}
  return initialCategories;
}

/**
 * Helper to write a file to both public/data/ and .next/standalone/public/data/ if present.
 */
function writeDataFile(filePath: string, content: string): boolean {
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    // If standalone build directory exists, write to it as well to keep in sync
    const relativePath = path.relative(path.join(process.cwd(), 'public'), filePath);
    const standalonePath = path.join(process.cwd(), '.next', 'standalone', 'public', relativePath);
    if (fs.existsSync(path.dirname(standalonePath))) {
      try {
        fs.writeFileSync(standalonePath, content, 'utf-8');
      } catch {}
    }
    return true;
  } catch (err) {
    console.error(`[server-data] Failed to write file ${filePath}:`, err);
    return false;
  }
}

/**
 * Save posts to server file.
 */
export function savePostsServer(posts: BlogPost[]): boolean {
  ensureDataDir();
  return writeDataFile(POSTS_FILE, JSON.stringify(posts, null, 2));
}

/**
 * Save or update a single post into posts.json immediately on the server.
 */
export function saveSinglePostServer(targetPost: BlogPost): { success: boolean; posts: BlogPost[] } {
  ensureDataDir();
  const currentPosts = getAllPostsServer();
  const existingIdx = currentPosts.findIndex(
    (p) => p.id === targetPost.id || (targetPost.slug && p.slug === targetPost.slug)
  );

  let updatedPosts: BlogPost[];
  if (existingIdx >= 0) {
    const updatedPost: BlogPost = {
      ...currentPosts[existingIdx],
      ...targetPost,
      updatedAt: new Date().toISOString(),
    };
    // Move updated post to index 0 so it is immediately visible at the top of posts.json
    const remaining = currentPosts.filter((_, idx) => idx !== existingIdx);
    updatedPosts = [updatedPost, ...remaining];
  } else {
    const newPostWithDate: BlogPost = {
      ...targetPost,
      updatedAt: new Date().toISOString(),
    };
    updatedPosts = [newPostWithDate, ...currentPosts];
  }

  const ok = savePostsServer(updatedPosts);
  return { success: ok, posts: updatedPosts };
}

/**
 * Delete a single post from posts.json immediately on the server.
 */
export function deleteSinglePostServer(idOrSlug: string): { success: boolean; posts: BlogPost[] } {
  ensureDataDir();
  const currentPosts = getAllPostsServer();
  const filtered = currentPosts.filter((p) => p.id !== idOrSlug && p.slug !== idOrSlug);
  const ok = savePostsServer(filtered);
  return { success: ok, posts: filtered };
}

/**
 * Save projects to server file.
 */
export function saveProjectsServer(projects: Project[]): boolean {
  ensureDataDir();
  return writeDataFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

/**
 * Save custom pages to server file.
 */
export function savePagesServer(pages: SitePage[]): boolean {
  ensureDataDir();
  return writeDataFile(PAGES_FILE, JSON.stringify(pages, null, 2));
}

/**
 * Save categories to server file.
 */
export function saveCategoriesServer(categories: CategoryItem[]): boolean {
  ensureDataDir();
  return writeDataFile(CATEGORIES_FILE, JSON.stringify(categories, null, 2));
}
