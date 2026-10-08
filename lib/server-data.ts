import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
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

  const exact = posts.find(
    (p) =>
      p.slug === clean ||
      p.id === clean ||
      p.slug === rawSlug ||
      p.id === rawSlug ||
      `${p.slug}.html` === rawSlug ||
      `${p.id}.html` === rawSlug
  );
  if (exact) return exact;

  // Handle aliases if slug contained external brand names
  const aliasClean = clean
    .replace(/-dufago/gi, '-an-gia-binh')
    .replace(/-cong-thanh/gi, '-an-gia-binh')
    .replace(/-me-kong/gi, '-an-gia-binh')
    .replace(/-mekong/gi, '-an-gia-binh')
    .replace(/-thang-long/gi, '-an-gia-binh')
    .replace(/-viet-duc/gi, '-an-gia-binh');

  if (aliasClean !== clean) {
    const aliasMatch = posts.find(
      (p) => p.slug === aliasClean || `${p.slug}.html` === aliasClean
    );
    if (aliasMatch) return aliasMatch;
  }

  // Reverse check if slug in database still has -dufago
  const reverseClean = clean.replace(/-an-gia-binh/gi, '-dufago');
  if (reverseClean !== clean) {
    const reverseMatch = posts.find(
      (p) => p.slug === reverseClean || `${p.slug}.html` === reverseClean
    );
    if (reverseMatch) return reverseMatch;
  }

  return null;
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
 * Generate updated lib/initial-data.ts code string for any section.
 * Returns the full code string so it can be written to disk or committed directly via GitHub API.
 */
export function getUpdatedInitialDataCode(
  section: 'config' | 'posts' | 'projects' | 'pages' | 'categories' | 'media' | 'all' = 'all',
  existingCode?: string
): string | null {
  try {
    const initialDataPath = path.join(process.cwd(), 'lib', 'initial-data.ts');
    let code = existingCode;
    if (!code) {
      if (fs.existsSync(initialDataPath)) {
        code = fs.readFileSync(initialDataPath, 'utf-8');
      } else {
        return null;
      }
    }

    // 1. Sync Config
    if (section === 'config' || section === 'all') {
      const config = getConfigServer();
      const configJson = JSON.stringify(config, null, 2);
      const replacement = `export const initialJekyllConfig: JekyllConfig = ${configJson};`;
      if (/export const initialJekyllConfig: JekyllConfig = [\s\S]*?;\r?\n\r?\nexport const initialBlogPosts/.test(code)) {
        code = code.replace(
          /export const initialJekyllConfig: JekyllConfig = [\s\S]*?;\r?\n\r?\nexport const initialBlogPosts/,
          `${replacement}\n\nexport const initialBlogPosts`
        );
      }
    }

    // 2. Sync Posts (Keep initial-data.ts lightweight with latest 20 posts while posts.json keeps all posts)
    if (section === 'posts' || section === 'all') {
      const posts = getAllPostsServer();
      const postsForCode = (posts.length > 25 ? posts.slice(0, 20) : posts).map((p) => ({
        ...p,
        excerpt: p.excerpt || p.title || '',
        author: p.author || 'Ban Kỹ Thuật An Gia Bình',
        date: p.date || new Date().toISOString().split('T')[0],
        category: p.category || 'Tin Tức',
        tags: Array.isArray(p.tags) && p.tags.length > 0 ? p.tags : ['bê tông', 'ninh bình'],
        focusKeywords: Array.isArray(p.focusKeywords) && p.focusKeywords.length > 0 ? p.focusKeywords : (Array.isArray(p.tags) && p.tags.length > 0 ? p.tags : ['bê tông ninh bình']),
        views: typeof p.views === 'number' ? p.views : 100,
        readTime: p.readTime || '3 phút',
        coverImage: p.coverImage || '/logo.png',
        content: p.content || '',
      }));
      const postsJson = JSON.stringify(postsForCode, null, 2);
      const replacement = `export const initialBlogPosts: BlogPost[] = ${postsJson};`;
      if (/export const initialBlogPosts: BlogPost\[\] = [\s\S]*?;\r?\n\r?\nexport const initialProjects/.test(code)) {
        code = code.replace(
          /export const initialBlogPosts: BlogPost\[\] = [\s\S]*?;\r?\n\r?\nexport const initialProjects/,
          `${replacement}\n\nexport const initialProjects`
        );
      }
    }

    // 3. Sync Projects
    if (section === 'projects' || section === 'all') {
      const projects = getAllProjectsServer();
      const projectsJson = JSON.stringify(projects, null, 2);
      const replacement = `export const initialProjects: Project[] = ${projectsJson};`;
      if (/export const initialProjects: Project\[\] = [\s\S]*?;\r?\n\r?\nexport const initialLeads/.test(code)) {
        code = code.replace(
          /export const initialProjects: Project\[\] = [\s\S]*?;\r?\n\r?\nexport const initialLeads/,
          `${replacement}\n\nexport const initialLeads`
        );
      }
    }

    // 4. Sync Categories
    if (section === 'categories' || section === 'all') {
      const categories = getAllCategoriesServer();
      const catJson = JSON.stringify(categories, null, 2);
      const replacement = `export const initialCategories: CategoryItem[] = ${catJson};`;
      if (/export const initialCategories: CategoryItem\[\] = [\s\S]*?;\r?\n\r?\nexport const initialPages/.test(code)) {
        code = code.replace(
          /export const initialCategories: CategoryItem\[\] = [\s\S]*?;\r?\n\r?\nexport const initialPages/,
          `${replacement}\n\nexport const initialPages`
        );
      }
    }

    // 5. Sync Pages
    if (section === 'pages' || section === 'all') {
      const pages = getAllPagesServer();
      const pagesJson = JSON.stringify(pages, null, 2);
      const replacement = `export const initialPages: SitePage[] = ${pagesJson};`;
      if (/export const initialPages: SitePage\[\] = [\s\S]*?;\r?\n\r?\nexport const initialAiSettings/.test(code)) {
        code = code.replace(
          /export const initialPages: SitePage\[\] = [\s\S]*?;\r?\n\r?\nexport const initialAiSettings/,
          `${replacement}\n\nexport const initialAiSettings`
        );
      }
    }

    // 6. Sync Media
    if (section === 'media' || section === 'all') {
      const media = getAllMediaServer();
      const mediaJson = JSON.stringify(media, null, 2);
      const replacement = `export const initialMediaFiles = ${mediaJson};`;
      if (/export const initialMediaFiles = [\s\S]*?;\r?\n\r?\nexport const initialCategories/.test(code)) {
        code = code.replace(
          /export const initialMediaFiles = [\s\S]*?;\r?\n\r?\nexport const initialCategories/,
          `${replacement}\n\nexport const initialCategories`
        );
      }
    }

    return code;
  } catch (err) {
    console.error('[server-data] Failed to generate initial-data code:', err);
    return null;
  }
}

/**
 * Synchronize data directly into lib/initial-data.ts TypeScript code
 * so all admin modifications become permanent source code changes tracked by Git.
 */
export function syncDataToInitialCode(
  section: 'config' | 'posts' | 'projects' | 'pages' | 'categories' | 'media' | 'all' = 'all'
): boolean {
  try {
    const initialDataPath = path.join(process.cwd(), 'lib', 'initial-data.ts');
    const updated = getUpdatedInitialDataCode(section);
    if (!updated) return false;
    fs.writeFileSync(initialDataPath, updated, 'utf-8');
    return true;
  } catch (err) {
    console.warn('[server-data] Failed to sync data into lib/initial-data.ts:', err);
    return false;
  }
}

/**
 * Automatically create a Git commit so all changes from the admin panel
 * produce new git commits ready to push to GitHub.
 */
export function commitChangesToGit(commitMessage = 'chore(admin): synchronize changes from admin panel'): {
  success: boolean;
  committed: boolean;
  commitHash?: string;
  message: string;
  changedFiles?: string[];
  remotePushed?: boolean;
} {
  try {
    try {
      execSync('git config user.name "An Gia Binh Admin"', { stdio: 'pipe' });
      execSync('git config user.email "admin@betongangiabinh.vn"', { stdio: 'pipe' });
    } catch {}

    // Stage all modifications across data directory, TypeScript source code, and static assets
    execSync('git add -A', { stdio: 'pipe' });

    // Check if there are staged changes ready for commit
    const stagedOutput = execSync('git diff --cached --name-only', { encoding: 'utf-8' }).trim();
    if (!stagedOutput) {
      let lastCommit = '';
      try {
        lastCommit = execSync('git log -1 --format="%h - %s (%cd)" --date=relative', { encoding: 'utf-8' }).trim();
      } catch {
        lastCommit = 'Initial commit';
      }
      return {
        success: true,
        committed: false,
        commitHash: lastCommit,
        message: 'Mã nguồn và tệp dữ liệu đã đồng bộ hoàn toàn với Git, không có thay đổi mới chưa commit.',
        changedFiles: [],
      };
    }

    const changedFiles = stagedOutput.split('\n').map((l) => l.trim()).filter(Boolean);
    const safeMsg = commitMessage.replace(/"/g, '\\"');
    execSync(`git commit -m "${safeMsg}"`, { stdio: 'pipe' });

    let newCommit = '';
    try {
      newCommit = execSync('git log -1 --format="%h - %s (%cd)" --date=relative', { encoding: 'utf-8' }).trim();
    } catch {
      newCommit = 'Commit vừa tạo';
    }

    // Try auto-pushing to remote origin if configured
    let remotePushed = false;
    let pushNotice = '';
    try {
      const remotes = execSync('git remote', { encoding: 'utf-8' }).trim();
      if (remotes.includes('origin')) {
        execSync('git push origin HEAD', { stdio: 'pipe', timeout: 15000 });
        remotePushed = true;
        pushNotice = ' & Đã tự động đẩy (push) thành công lên GitHub!';
      }
    } catch (pushErr: any) {
      console.warn('[server-data] Auto git push notice:', pushErr?.message);
    }

    return {
      success: true,
      committed: true,
      commitHash: newCommit,
      remotePushed,
      message: `Đã tự động tạo commit mới [${newCommit}] trong mã nguồn${pushNotice}`,
      changedFiles,
    };
  } catch (err: any) {
    console.warn('[server-data] Git commit info:', err?.message);
    return {
      success: false,
      committed: false,
      message: err?.message || 'Lỗi khi thực hiện git commit',
    };
  }
}

/**
 * Push all commits to GitHub repository.
 */
export function pushToGitHubServer(remoteUrl?: string): {
  success: boolean;
  message: string;
  commitHash?: string;
  remoteUrl?: string;
} {
  try {
    if (remoteUrl && typeof remoteUrl === 'string' && remoteUrl.trim()) {
      const trimmedUrl = remoteUrl.trim();
      try {
        const remotes = execSync('git remote', { encoding: 'utf-8' }).trim();
        if (remotes.includes('origin')) {
          execSync(`git remote set-url origin "${trimmedUrl}"`, { stdio: 'pipe' });
        } else {
          execSync(`git remote add origin "${trimmedUrl}"`, { stdio: 'pipe' });
        }
      } catch (remErr: any) {
        return {
          success: false,
          message: `Không thể cấu hình Git remote: ${remErr?.message}`,
        };
      }
    }

    // Check if remote origin exists
    let activeRemote = '';
    try {
      activeRemote = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
    } catch {
      return {
        success: false,
        message: 'Chưa có cấu hình Git remote "origin". Vui lòng nhập URL kho GitHub (kèm Personal Access Token nếu là repo riêng tư) hoặc sử dụng tính năng Export to GitHub trên thanh menu của AI Studio.',
      };
    }

    // First ensure all pending changes are committed
    commitChangesToGit('chore(sync): synchronize all website content & settings before GitHub push');

    // Get current branch
    let branch = 'main';
    try {
      branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
    } catch {}

    // Push to remote
    execSync(`git push -u origin ${branch}`, { stdio: 'pipe', timeout: 30000 });
    const lastCommit = execSync('git log -1 --format="%h - %s (%cd)" --date=relative', { encoding: 'utf-8' }).trim();

    return {
      success: true,
      message: `Đã đẩy toàn bộ commit mới lên GitHub thành công (nhánh ${branch})! Mã commit: ${lastCommit}`,
      commitHash: lastCommit,
      remoteUrl: activeRemote,
    };
  } catch (err: any) {
    const errorDetails = err?.stderr?.toString() || err?.message || 'Lỗi không xác định khi git push';
    console.error('[server-data] Git push error:', errorDetails);
    return {
      success: false,
      message: `Lỗi khi đẩy lên GitHub: ${errorDetails}. Gợi ý: Hãy kiểm tra URL/Token GitHub hoặc sử dụng menu "Export to GitHub" của AI Studio.`,
    };
  }
}

/**
 * Retrieve current Git repository branch and latest commit info for display in /admin.
 */
export function getGitStatusServer(): {
  branch: string;
  lastCommit: string;
  clean: boolean;
  uncommittedFiles: string[];
  totalCommits: number;
  remoteUrl: string | null;
  recentCommits: Array<{ hash: string; date: string; message: string }>;
} {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
    const lastCommit = execSync('git log -1 --format="%h - %s (%cd)" --date=relative', { encoding: 'utf-8' }).trim();
    const statusOutput = execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
    const uncommittedFiles = statusOutput ? statusOutput.split('\n').map((l) => l.trim()).filter(Boolean) : [];

    let totalCommits = 0;
    try {
      totalCommits = parseInt(execSync('git rev-list --count HEAD', { encoding: 'utf-8' }).trim(), 10) || 1;
    } catch {}

    let remoteUrl: string | null = null;
    try {
      remoteUrl = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
    } catch {}

    let recentCommits: Array<{ hash: string; date: string; message: string }> = [];
    try {
      const logLines = execSync('git log -5 --format="%h||%cd||%s" --date=short', { encoding: 'utf-8' }).trim().split('\n');
      recentCommits = logLines.filter(Boolean).map(line => {
        const [hash, date, ...rest] = line.split('||');
        return { hash: hash || '', date: date || '', message: rest.join('||') || '' };
      });
    } catch {}

    return {
      branch,
      lastCommit,
      clean: uncommittedFiles.length === 0,
      uncommittedFiles,
      totalCommits,
      remoteUrl,
      recentCommits,
    };
  } catch {
    return {
      branch: 'main',
      lastCommit: 'Chưa có thông tin commit',
      clean: true,
      uncommittedFiles: [],
      totalCommits: 1,
      remoteUrl: null,
      recentCommits: [],
    };
  }
}

/**
 * Save posts to server file.
 */
export function savePostsServer(posts: BlogPost[]): boolean {
  ensureDataDir();
  const ok = writeDataFile(POSTS_FILE, JSON.stringify(posts, null, 2));
  if (ok) {
    syncDataToInitialCode('posts');
    commitChangesToGit(`chore(posts): update ${posts.length} blog posts from admin`);
  }
  return ok;
}

/**
 * Save or update a single post into posts.json immediately on the server.
 */
export function saveSinglePostServer(targetPost: BlogPost): { success: boolean; posts: BlogPost[]; gitResult?: any } {
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

  const ok = writeDataFile(POSTS_FILE, JSON.stringify(updatedPosts, null, 2));
  let gitResult: any = null;
  if (ok) {
    syncDataToInitialCode('posts');
    gitResult = commitChangesToGit(`chore(posts): save article "${targetPost.title.substring(0, 50)}"`);
  }
  return { success: ok, posts: updatedPosts, gitResult };
}

/**
 * Delete a single post from posts.json immediately on the server.
 */
export function deleteSinglePostServer(idOrSlug: string): { success: boolean; posts: BlogPost[] } {
  ensureDataDir();
  const currentPosts = getAllPostsServer();
  const deletedPost = currentPosts.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  const filtered = currentPosts.filter((p) => p.id !== idOrSlug && p.slug !== idOrSlug);
  const ok = writeDataFile(POSTS_FILE, JSON.stringify(filtered, null, 2));

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

  if (ok) {
    syncDataToInitialCode('posts');
    commitChangesToGit(`chore(posts): delete post ${idOrSlug}`);
  }

  return { success: ok, posts: filtered };
}

/**
 * Save projects to server file.
 */
export function saveProjectsServer(projects: Project[]): boolean {
  ensureDataDir();
  const ok = writeDataFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));
  if (ok) {
    syncDataToInitialCode('projects');
    commitChangesToGit(`chore(projects): update ${projects.length} concrete projects`);
  }
  return ok;
}

/**
 * Save custom pages to server file.
 */
export function savePagesServer(pages: SitePage[]): boolean {
  ensureDataDir();
  const ok = writeDataFile(PAGES_FILE, JSON.stringify(pages, null, 2));
  if (ok) {
    syncDataToInitialCode('pages');
    commitChangesToGit(`chore(pages): update ${pages.length} site pages`);
  }
  return ok;
}

/**
 * Save categories to server file.
 */
export function saveCategoriesServer(categories: CategoryItem[]): boolean {
  ensureDataDir();
  const ok = writeDataFile(CATEGORIES_FILE, JSON.stringify(categories, null, 2));
  if (ok) {
    syncDataToInitialCode('categories');
    commitChangesToGit(`chore(categories): update ${categories.length} blog categories`);
  }
  return ok;
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

    // Synchronize full config into lib/initial-data.ts TypeScript code
    syncDataToInitialCode('config');

    // Automatically create a Git commit for settings changes
    commitChangesToGit(`chore(settings): update website settings, SEO and custom code`);

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
  const ok = writeDataFile(MEDIA_FILE, JSON.stringify(media, null, 2));
  if (ok) {
    syncDataToInitialCode('media');
    commitChangesToGit(`chore(media): update ${media.length} media assets`);
  }
  return ok;
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
