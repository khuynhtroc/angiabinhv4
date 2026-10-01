import fs from 'node:fs';
import path from 'node:path';
import {
  BlogPost,
  Project,
  SitePage,
  CategoryItem,
  JekyllConfig,
  MediaFile,
  TrashItem
} from '@/lib/types';
import {
  initialBlogPosts,
  initialProjects,
  initialPages,
  initialCategories,
  initialJekyllConfig,
  initialMediaFiles
} from '@/lib/initial-data';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const PAGES_FILE = path.join(DATA_DIR, 'pages.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const ADMIN_CONFIG_FILE = path.join(DATA_DIR, 'admin-settings.json');
const MEDIA_FILE = path.join(DATA_DIR, 'media.json');
const TRASH_FILE = path.join(DATA_DIR, 'trash.json');

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
  const deletedPost = currentPosts.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  const filtered = currentPosts.filter((p) => p.id !== idOrSlug && p.slug !== idOrSlug);
  const ok = savePostsServer(filtered);

  if (deletedPost) {
    addToTrashServer({
      id: `trash-post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      originalId: deletedPost.id,
      type: 'post',
      title: deletedPost.title,
      description: deletedPost.excerpt || '',
      data: deletedPost,
      deletedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

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

/**
 * Get Jekyll config from server file.
 */
export function getConfigServer(): JekyllConfig {
  ensureDataDir();
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          ...initialJekyllConfig,
          ...parsed,
          logo: parsed.logo || initialJekyllConfig.logo || '/logo.png',
          favicon: parsed.favicon || initialJekyllConfig.favicon || '/favicon.ico',
        };
      }
    }
  } catch (err) {
    console.warn('[server-data] Failed to read CONFIG_FILE:', err);
  }
  return initialJekyllConfig;
}

/**
 * Save Jekyll config to server file and synchronize to code / initial-data.
 */
export function saveConfigServer(config: Partial<JekyllConfig>): boolean {
  ensureDataDir();
  try {
    const current = getConfigServer();
    const updated: JekyllConfig = {
      ...current,
      ...config,
    };

    // If logo is base64, save to static /logo.png & /images/logo.png
    if (updated.logo && updated.logo.startsWith('data:image/')) {
      try {
        const match = updated.logo.match(/^data:image\/([a-zA-Z0-9\+\.]+);base64,(.+)$/);
        if (match) {
          const ext = match[1] === 'svg+xml' ? 'svg' : (match[1] === 'jpeg' ? 'jpg' : 'png');
          const buffer = Buffer.from(match[2], 'base64');
          const targetPath = path.join(process.cwd(), 'public', `logo.${ext}`);
          fs.writeFileSync(targetPath, buffer);
          const imgDir = path.join(process.cwd(), 'public', 'images');
          if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });
          fs.writeFileSync(path.join(imgDir, `logo.${ext}`), buffer);
          
          // Also sync to standalone if available
          const standaloneImg = path.join(process.cwd(), '.next', 'standalone', 'public', `logo.${ext}`);
          if (fs.existsSync(path.dirname(standaloneImg))) {
            try { fs.writeFileSync(standaloneImg, buffer); } catch {}
          }
          updated.logo = `/logo.${ext}?v=${Date.now()}`;
        }
      } catch (e) {
        console.warn('[server-data] Failed to extract logo image file:', e);
      }
    }

    // If favicon is base64, save to /favicon.ico
    if (updated.favicon && updated.favicon.startsWith('data:image/')) {
      try {
        const match = updated.favicon.match(/^data:image\/([a-zA-Z0-9\+\.\-]+);base64,(.+)$/);
        if (match) {
          const buffer = Buffer.from(match[2], 'base64');
          fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon.ico'), buffer);
          const standaloneFav = path.join(process.cwd(), '.next', 'standalone', 'public', 'favicon.ico');
          if (fs.existsSync(path.dirname(standaloneFav))) {
            try { fs.writeFileSync(standaloneFav, buffer); } catch {}
          }
          updated.favicon = `/favicon.ico?v=${Date.now()}`;
        }
      } catch (e) {
        console.warn('[server-data] Failed to extract favicon file:', e);
      }
    }

    const ok = writeDataFile(CONFIG_FILE, JSON.stringify(updated, null, 2));

    // Also sync values into lib/initial-data.ts so Git diff is visible and SSR reflects changes
    try {
      const initialDataPath = path.join(process.cwd(), 'lib', 'initial-data.ts');
      if (fs.existsSync(initialDataPath)) {
        let code = fs.readFileSync(initialDataPath, 'utf-8');
        if (updated.logo) {
          code = code.replace(/logo:\s*"[^"]*"/, `logo: "${updated.logo.replace(/"/g, '\\"')}"`);
        }
        if (updated.favicon) {
          code = code.replace(/favicon:\s*"[^"]*"/, `favicon: "${updated.favicon.replace(/"/g, '\\"')}"`);
        }
        if (updated.phone) {
          code = code.replace(/phone:\s*"[^"]*"/, `phone: "${updated.phone.replace(/"/g, '\\"')}"`);
        }
        if (updated.email) {
          code = code.replace(/email:\s*"[^"]*"/, `email: "${updated.email.replace(/"/g, '\\"')}"`);
        }
        if (updated.title) {
          code = code.replace(/title:\s*"[^"]*"/, `title: "${updated.title.replace(/"/g, '\\"')}"`);
        }
        if (updated.slogan) {
          code = code.replace(/slogan:\s*"[^"]*"/, `slogan: "${updated.slogan.replace(/"/g, '\\"')}"`);
        }
        if (updated.address) {
          code = code.replace(/address:\s*"[^"]*"/, `address: "${updated.address.replace(/"/g, '\\"')}"`);
        }
        fs.writeFileSync(initialDataPath, code, 'utf-8');
      }
    } catch (err) {
      console.warn('[server-data] Note on syncing initial-data.ts:', err);
    }

    return ok;
  } catch (err) {
    console.error('[server-data] Failed to save CONFIG_FILE:', err);
    return false;
  }
}

export function getAdminConfigServer(): any {
  ensureDataDir();
  try {
    if (fs.existsSync(ADMIN_CONFIG_FILE)) {
      const raw = fs.readFileSync(ADMIN_CONFIG_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[server-data] Failed to read ADMIN_CONFIG_FILE:', err);
  }
  return null;
}

export function saveAdminConfigServer(adminConfig: any): boolean {
  ensureDataDir();
  try {
    if (!adminConfig || typeof adminConfig !== 'object') return false;
    const current = getAdminConfigServer() || {};
    const updated = {
      ...current,
      ...adminConfig,
      updatedAt: new Date().toISOString()
    };
    return writeDataFile(ADMIN_CONFIG_FILE, JSON.stringify(updated, null, 2));
  } catch (err) {
    console.error('[server-data] Failed to save ADMIN_CONFIG_FILE:', err);
    return false;
  }
}

/**
 * =============================================================================
 * MEDIA MANAGEMENT ON SERVER
 * =============================================================================
 */
export function getAllMediaServer(): MediaFile[] {
  ensureDataDir();
  try {
    if (fs.existsSync(MEDIA_FILE)) {
      const raw = fs.readFileSync(MEDIA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } else {
      writeDataFile(MEDIA_FILE, JSON.stringify(initialMediaFiles, null, 2));
      return initialMediaFiles;
    }
  } catch (err) {
    console.warn('[server-data] Failed to read MEDIA_FILE:', err);
  }
  return initialMediaFiles;
}

export function saveMediaServer(media: MediaFile[]): boolean {
  ensureDataDir();
  return writeDataFile(MEDIA_FILE, JSON.stringify(media, null, 2));
}

export function deleteMediaServer(
  id: string,
  updatedList?: MediaFile[],
  fallbackItem?: MediaFile
): { success: boolean; media: MediaFile[] } {
  ensureDataDir();
  const current = getAllMediaServer();
  const deletedItem =
    fallbackItem ||
    current.find((m) => m.id === id || m.path === id || m.url === id || m.name === id);

  const updated =
    updatedList && Array.isArray(updatedList)
      ? updatedList
      : current.filter(
          (m) =>
            m.id !== id &&
            m.path !== id &&
            m.url !== id &&
            m.name !== id &&
            (!deletedItem || m.id !== deletedItem.id)
        );

  const ok = saveMediaServer(updated);

  if (deletedItem) {
    // Also move to Trash automatically
    addToTrashServer({
      id: `trash-media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      originalId: deletedItem.id || id,
      type: 'media',
      title: deletedItem.name || 'Tệp Media',
      description: deletedItem.path || deletedItem.url || '',
      data: deletedItem,
      deletedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  return { success: ok, media: updated };
}

/**
 * =============================================================================
 * TRASH BIN (THÙNG RÁC) SERVER MANAGEMENT
 * Automatically purges items older than 30 days
 * =============================================================================
 */
export function getAllTrashServer(): TrashItem[] {
  ensureDataDir();
  try {
    if (fs.existsSync(TRASH_FILE)) {
      const raw = fs.readFileSync(TRASH_FILE, 'utf-8');
      const parsed: TrashItem[] = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Purge expired items (> 30 days)
        const now = Date.now();
        const valid = parsed.filter(item => {
          const exp = item.expiresAt ? new Date(item.expiresAt).getTime() : new Date(item.deletedAt).getTime() + 30 * 24 * 60 * 60 * 1000;
          return exp > now;
        });
        if (valid.length !== parsed.length) {
          saveTrashServer(valid);
        }
        return valid;
      }
    } else {
      writeDataFile(TRASH_FILE, JSON.stringify([], null, 2));
      return [];
    }
  } catch (err) {
    console.warn('[server-data] Failed to read TRASH_FILE:', err);
  }
  return [];
}

export function saveTrashServer(trash: TrashItem[]): boolean {
  ensureDataDir();
  return writeDataFile(TRASH_FILE, JSON.stringify(trash, null, 2));
}

export function addToTrashServer(item: TrashItem): boolean {
  const current = getAllTrashServer();
  const exists = current.findIndex(t => t.id === item.id || (t.originalId === item.originalId && t.type === item.type));
  if (exists >= 0) {
    current[exists] = item;
  } else {
    current.unshift(item);
  }
  return saveTrashServer(current);
}

export function restoreFromTrashServer(trashId: string): { success: boolean; item?: TrashItem; remainingTrash: TrashItem[] } {
  const current = getAllTrashServer();
  const found = current.find(t => t.id === trashId);
  if (!found) {
    return { success: false, remainingTrash: current };
  }

  // Restore based on type
  if (found.type === 'post' && found.data) {
    saveSinglePostServer(found.data);
  } else if (found.type === 'project' && found.data) {
    const projs = getAllProjectsServer();
    projs.unshift(found.data);
    saveProjectsServer(projs);
  } else if (found.type === 'page' && found.data) {
    const pages = getAllPagesServer();
    pages.unshift(found.data);
    savePagesServer(pages);
  } else if (found.type === 'media' && found.data) {
    const media = getAllMediaServer();
    media.unshift(found.data);
    saveMediaServer(media);
  } else if (found.type === 'category' && found.data) {
    const cats = getAllCategoriesServer();
    cats.push(found.data);
    saveCategoriesServer(cats);
  }

  const remaining = current.filter(t => t.id !== trashId);
  saveTrashServer(remaining);

  return { success: true, item: found, remainingTrash: remaining };
}

export function deleteFromTrashPermanentlyServer(trashId: string): { success: boolean; remainingTrash: TrashItem[] } {
  const current = getAllTrashServer();
  const remaining = current.filter(t => t.id !== trashId);
  const ok = saveTrashServer(remaining);
  return { success: ok, remainingTrash: remaining };
}

export function emptyTrashServer(): boolean {
  return saveTrashServer([]);
}
