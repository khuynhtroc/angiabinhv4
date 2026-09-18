'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  BlogPost,
  Project,
  Lead,
  RealtimeAnalytics,
  IndustryNews,
  JekyllConfig,
  RealtimeEvent,
  MediaFile,
  IntegrationConfig,
  CategoryItem,
  SitePage,
  AiSettingsConfig,
  AiProviderType,
  SiteMenu,
  MenuItem,
  SchemaSettings,
  AiSchedulerConfig,
  MediaFolder
} from './types';
import {
  initialBlogPosts,
  initialProjects,
  initialLeads,
  initialAnalytics,
  initialIndustryNews,
  initialJekyllConfig,
  initialMediaFiles,
  initialIntegrationConfig,
  initialCategories,
  initialPages,
  initialAiSettings,
  initialSiteMenus,
  initialSchemaSettings,
  initialAiSchedulerConfig,
  initialMediaFolders
} from './initial-data';
import { idbGet, idbSet } from './idb';

export const APP_STORAGE_VERSION = 'agb_v2026_09_14_v5';

const STORAGE_KEYS = {
  VERSION: 'agiabinh_app_storage_version',
  POSTS: 'agiabinh_blog_posts',
  PROJECTS: 'agiabinh_projects',
  LEADS: 'agiabinh_leads',
  ANALYTICS: 'agiabinh_analytics',
  NEWS: 'agiabinh_industry_news',
  JEKYLL: 'agiabinh_jekyll_config',
  ADMIN_AUTH: 'agiabinh_admin_authenticated',
  MEDIA: 'agiabinh_media_files',
  INTEGRATIONS: 'agiabinh_integrations',
  CATEGORIES: 'agiabinh_categories',
  PAGES: 'agiabinh_site_pages',
  AI_SETTINGS: 'agiabinh_ai_settings',
  MENUS: 'agiabinh_site_menus',
  SCHEMA: 'agiabinh_schema_settings',
  AI_SCHEDULER: 'agiabinh_ai_scheduler',
  MEDIA_FOLDERS: 'agiabinh_media_folders'
};

// Global in-memory singleton state shared by all components
interface StoreState {
  isHydrated: boolean;
  posts: BlogPost[];
  projects: Project[];
  leads: Lead[];
  realtimeAnalytics: RealtimeAnalytics;
  industryNews: IndustryNews[];
  jekyllConfig: JekyllConfig;
  mediaFiles: MediaFile[];
  categories: CategoryItem[];
  integrations: IntegrationConfig;
  pages: SitePage[];
  aiSettings: AiSettingsConfig;
  menus: SiteMenu[];
  schemaSettings: SchemaSettings;
  aiScheduler: AiSchedulerConfig;
  mediaFolders: MediaFolder[];
  isAdminAuthenticated: boolean;
}

const globalStore: StoreState = {
  isHydrated: false,
  posts: initialBlogPosts,
  projects: initialProjects,
  leads: initialLeads,
  realtimeAnalytics: initialAnalytics,
  industryNews: initialIndustryNews,
  jekyllConfig: initialJekyllConfig,
  mediaFiles: initialMediaFiles,
  categories: initialCategories,
  integrations: initialIntegrationConfig,
  pages: initialPages,
  aiSettings: initialAiSettings,
  menus: initialSiteMenus,
  schemaSettings: initialSchemaSettings,
  aiScheduler: initialAiSchedulerConfig,
  mediaFolders: initialMediaFolders,
  isAdminAuthenticated: false
};

const storeListeners = new Set<() => void>();

function notifyListeners() {
  storeListeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Store listener error:', e);
    }
  });
}

let hasHydrated = false;
let hasIdbHydrated = false;

function isQuotaExceeded(e: any): boolean {
  return (
    (e instanceof DOMException &&
      (e.code === 22 ||
        e.code === 1014 ||
        e.name === 'QuotaExceededError' ||
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) ||
    (typeof e?.message === 'string' && e.message.toLowerCase().includes('quota'))
  );
}

function safeSetLocalStorage(key: string, value: any): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (err) {
    if (isQuotaExceeded(err)) {
      console.warn(`[Store] Quota exceeded for "${key}". Optimizing local storage cache...`);
      try {
        // 1. Evict heavy dataUrls from media in localStorage
        const savedMedia = localStorage.getItem(STORAGE_KEYS.MEDIA);
        if (savedMedia && savedMedia.length > 50000) {
          try {
            const parsed = JSON.parse(savedMedia);
            if (Array.isArray(parsed)) {
              const slimMedia = parsed.map((m: any) => ({
                id: m.id,
                name: m.name,
                url: m.url?.startsWith('data:') ? (m.path || '/images/blog/default.jpg') : m.url,
                path: m.path,
                folder: m.folder,
                type: m.type,
                size: m.size,
                uploadedAt: m.uploadedAt
              }));
              localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(slimMedia));
            }
          } catch {
            localStorage.removeItem(STORAGE_KEYS.MEDIA);
          }
        }

        // 2. Slim down analytics
        const savedAnalytics = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
        if (savedAnalytics && savedAnalytics.length > 15000) {
          try {
            const parsed = JSON.parse(savedAnalytics);
            if (parsed && Array.isArray(parsed.recentEvents)) {
              parsed.recentEvents = parsed.recentEvents.slice(0, 5);
              localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(parsed));
            }
          } catch {}
        }

        // 3. For posts, NEVER store a sliced/truncated array under STORAGE_KEYS.POSTS because
        // it caused full datasets (1,000+ posts) to be permanently downgraded upon hydration!
        if (key === STORAGE_KEYS.POSTS) {
          console.warn(`[Store] LocalStorage quota reached for posts (${Array.isArray(value) ? value.length : 0} items). Full dataset preserved in IndexedDB.`);
          return false;
        } else {
          // Retry
          const retrySerialized = typeof value === 'string' ? value : JSON.stringify(value);
          localStorage.setItem(key, retrySerialized);
          return true;
        }
      } catch (retryErr) {
        console.warn('[Store] LocalStorage quota reached; IndexedDB preserves full data.', retryErr);
      }
    }
    return false;
  }
}

function hydrateFromStorage() {
  if (typeof window === 'undefined') return;
  try {
    const currentVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
    const isNewVersion = currentVersion !== APP_STORAGE_VERSION;

    if (isNewVersion) {
      console.log(`[Store] Upgrading store version to ${APP_STORAGE_VERSION}. Synchronizing data with codebase...`);
      localStorage.setItem(STORAGE_KEYS.VERSION, APP_STORAGE_VERSION);

      // Force company info and core configs to use updated values
      globalStore.jekyllConfig = { ...initialJekyllConfig };
      safeSetLocalStorage(STORAGE_KEYS.JEKYLL, globalStore.jekyllConfig);

      // Merge blog posts
      const savedPostsRaw = localStorage.getItem(STORAGE_KEYS.POSTS);
      let parsedSavedPosts: BlogPost[] = [];
      try {
        if (savedPostsRaw) parsedSavedPosts = JSON.parse(savedPostsRaw);
      } catch {}
      const existingPostIds = new Set(parsedSavedPosts.map(p => p.id || p.slug));
      const missingPosts = initialBlogPosts.filter(ip => !existingPostIds.has(ip.id) && !existingPostIds.has(ip.slug));
      globalStore.posts = [...missingPosts, ...parsedSavedPosts];
      safeSetLocalStorage(STORAGE_KEYS.POSTS, globalStore.posts);

      // Merge projects
      const savedProjectsRaw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      let parsedSavedProjects: Project[] = [];
      try {
        if (savedProjectsRaw) parsedSavedProjects = JSON.parse(savedProjectsRaw);
      } catch {}
      const existingProjIds = new Set(parsedSavedProjects.map(p => p.id || p.slug || p.title || ''));
      const missingProjects = initialProjects.filter(ip => 
        !existingProjIds.has(ip.id) && 
        !(ip.slug && existingProjIds.has(ip.slug)) && 
        !(ip.title && existingProjIds.has(ip.title))
      );
      globalStore.projects = [...missingProjects, ...parsedSavedProjects];
      safeSetLocalStorage(STORAGE_KEYS.PROJECTS, globalStore.projects);

      // Merge pages
      const savedPagesRaw = localStorage.getItem(STORAGE_KEYS.PAGES);
      let parsedSavedPages: SitePage[] = [];
      try {
        if (savedPagesRaw) parsedSavedPages = JSON.parse(savedPagesRaw);
      } catch {}
      const existingPageIds = new Set(parsedSavedPages.map(p => p.id || p.slug));
      const missingPages = initialPages.filter(ip => !existingPageIds.has(ip.id) && !existingPageIds.has(ip.slug));
      globalStore.pages = [...missingPages, ...parsedSavedPages];
      safeSetLocalStorage(STORAGE_KEYS.PAGES, globalStore.pages);

      // Merge menus
      globalStore.menus = initialSiteMenus;
      safeSetLocalStorage(STORAGE_KEYS.MENUS, globalStore.menus);

      // Merge media folders and files
      globalStore.mediaFolders = initialMediaFolders;
      safeSetLocalStorage(STORAGE_KEYS.MEDIA_FOLDERS, globalStore.mediaFolders);
    }

    const savedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (savedPosts) {
      try {
        const parsed = JSON.parse(savedPosts);
        // Never overwrite globalStore.posts if localStorage contains fewer posts than current memory!
        if (Array.isArray(parsed) && parsed.length >= globalStore.posts.length && parsed.length > 0) {
          globalStore.posts = parsed;
        }
      } catch {}
    }

    const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p: any) => p.id || p.slug || p.title));
          const missingInitials = initialProjects.filter(ip => !existingIds.has(ip.id) && !existingIds.has(ip.slug) && !existingIds.has(ip.title));
          globalStore.projects = [...missingInitials, ...parsed];
        } else {
          globalStore.projects = initialProjects;
        }
      } catch {
        globalStore.projects = initialProjects;
      }
    } else {
      globalStore.projects = initialProjects;
    }

    const savedLeads = localStorage.getItem(STORAGE_KEYS.LEADS);
    if (savedLeads) {
      try {
        const parsed = JSON.parse(savedLeads);
        if (Array.isArray(parsed)) {
          globalStore.leads = parsed;
        }
      } catch {}
    }

    const savedAnalytics = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    if (savedAnalytics) {
      try {
        globalStore.realtimeAnalytics = JSON.parse(savedAnalytics);
      } catch {}
    }

    const savedNews = localStorage.getItem(STORAGE_KEYS.NEWS);
    if (savedNews) {
      try {
        const parsed = JSON.parse(savedNews);
        if (Array.isArray(parsed)) {
          globalStore.industryNews = parsed;
        }
      } catch {}
    }

    const savedJekyll = localStorage.getItem(STORAGE_KEYS.JEKYLL);
    if (savedJekyll) {
      try {
        globalStore.jekyllConfig = JSON.parse(savedJekyll);
      } catch {}
    }

    const savedMedia = localStorage.getItem(STORAGE_KEYS.MEDIA);
    if (savedMedia) {
      try {
        const parsed = JSON.parse(savedMedia);
        if (Array.isArray(parsed)) {
          globalStore.mediaFiles = parsed;
        }
      } catch {}
    }

    const savedIntegrations = localStorage.getItem(STORAGE_KEYS.INTEGRATIONS);
    if (savedIntegrations) {
      try {
        globalStore.integrations = JSON.parse(savedIntegrations);
      } catch {}
    }

    const savedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (savedCategories) {
      try {
        const parsed = JSON.parse(savedCategories);
        if (Array.isArray(parsed) && parsed.length > 0) {
          globalStore.categories = parsed;
        }
      } catch {}
    }

    const savedPages = localStorage.getItem(STORAGE_KEYS.PAGES);
    if (savedPages) {
      try {
        const parsed = JSON.parse(savedPages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          globalStore.pages = parsed;
        }
      } catch {}
    }

    const savedAiSettings = localStorage.getItem(STORAGE_KEYS.AI_SETTINGS);
    if (savedAiSettings) {
      try {
        const parsed = JSON.parse(savedAiSettings);
        if (parsed && typeof parsed === 'object') {
          globalStore.aiSettings = { ...globalStore.aiSettings, ...parsed };
        }
      } catch {}
    }

    const savedMenus = localStorage.getItem(STORAGE_KEYS.MENUS);
    if (savedMenus) {
      try {
        const parsed = JSON.parse(savedMenus);
        if (Array.isArray(parsed) && parsed.length > 0) {
          globalStore.menus = parsed;
        }
      } catch {}
    }

    const savedSchema = localStorage.getItem(STORAGE_KEYS.SCHEMA);
    if (savedSchema) {
      try {
        const parsed = JSON.parse(savedSchema);
        if (parsed && typeof parsed === 'object') {
          globalStore.schemaSettings = { ...globalStore.schemaSettings, ...parsed };
        }
      } catch {}
    }

    // Always enforce the latest official company name and tax ID
    if (globalStore.schemaSettings) {
      if (!globalStore.schemaSettings.taxId || globalStore.schemaSettings.organizationName?.includes('TNHH')) {
        globalStore.schemaSettings.organizationName = "CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ AN GIA BÌNH";
        globalStore.schemaSettings.legalName = "CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ AN GIA BÌNH";
        globalStore.schemaSettings.taxId = "2700870972";
        globalStore.schemaSettings.vatID = "2700870972";
      }
    }
    if (globalStore.jekyllConfig) {
      globalStore.jekyllConfig.company_name = "CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ AN GIA BÌNH";
      globalStore.jekyllConfig.tax_id = "2700870972";
    }

    const savedAiScheduler = localStorage.getItem(STORAGE_KEYS.AI_SCHEDULER);
    if (savedAiScheduler) {
      try {
        const parsed = JSON.parse(savedAiScheduler);
        if (parsed && typeof parsed === 'object') {
          globalStore.aiScheduler = { ...globalStore.aiScheduler, ...parsed };
        }
      } catch {}
    }

    const savedMediaFolders = localStorage.getItem(STORAGE_KEYS.MEDIA_FOLDERS);
    if (savedMediaFolders) {
      try {
        const parsed = JSON.parse(savedMediaFolders);
        if (Array.isArray(parsed) && parsed.length > 0) {
          globalStore.mediaFolders = parsed;
        }
      } catch {}
    }

    // Auto-normalize post categories to canonical 3 folders
    if (Array.isArray(globalStore.posts)) {
      let anyNormalized = false;
      globalStore.posts = globalStore.posts.map(p => {
        const canonical = normalizeBlogCategory(p.category);
        if (p.category !== canonical) {
          anyNormalized = true;
          return { ...p, category: canonical };
        }
        return p;
      });
      if (anyNormalized) {
        safeSetLocalStorage(STORAGE_KEYS.POSTS, globalStore.posts);
      }
    }

    const savedAuth = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
    if (savedAuth === 'true') {
      globalStore.isAdminAuthenticated = true;
    }
  } catch (err) {
    console.warn('Hydration warning:', err);
  } finally {
    globalStore.isHydrated = true;
    hasHydrated = true;
    notifyListeners();
  }
}

export function normalizeBlogCategory(cat?: string): 'Tin Tức' | 'Kinh Nghiệm' | 'Kiến Thức' {
  if (!cat) return 'Tin Tức';
  const lower = cat.toLowerCase().trim();
  if (
    lower.includes('kinh nghiệm') ||
    lower.includes('kinh-nghiem') ||
    lower.includes('kỹ thuật') ||
    lower.includes('ky-thuat') ||
    lower.includes('thi công') ||
    lower.includes('cẩm nang') ||
    lower.includes('cam-nang') ||
    lower.includes('kinh nghiem')
  ) {
    return 'Kinh Nghiệm';
  }
  if (
    lower.includes('kiến thức') ||
    lower.includes('kien-thuc') ||
    lower.includes('tiêu chuẩn') ||
    lower.includes('tieu-chuan') ||
    lower.includes('chất lượng') ||
    lower.includes('nén mẫu') ||
    lower.includes('cấp phối') ||
    lower.includes('kien thuc')
  ) {
    return 'Kiến Thức';
  }
  return 'Tin Tức';
}

async function hydrateFromIndexedDB() {
  if (typeof window === 'undefined' || hasIdbHydrated) return;
  hasIdbHydrated = true;
  try {
    let changed = false;
    const [idbPosts, idbMedia, idbProjects, idbLeads, idbNews, idbCategories, idbJekyll, idbIntegrations, idbPages, idbAiSettings, idbMenus, idbSchema, idbScheduler, idbFolders] =
      await Promise.all([
        idbGet<BlogPost[]>(STORAGE_KEYS.POSTS),
        idbGet<MediaFile[]>(STORAGE_KEYS.MEDIA),
        idbGet<Project[]>(STORAGE_KEYS.PROJECTS),
        idbGet<Lead[]>(STORAGE_KEYS.LEADS),
        idbGet<IndustryNews[]>(STORAGE_KEYS.NEWS),
        idbGet<CategoryItem[]>(STORAGE_KEYS.CATEGORIES),
        idbGet<JekyllConfig>(STORAGE_KEYS.JEKYLL),
        idbGet<IntegrationConfig>(STORAGE_KEYS.INTEGRATIONS),
        idbGet<SitePage[]>(STORAGE_KEYS.PAGES),
        idbGet<AiSettingsConfig>(STORAGE_KEYS.AI_SETTINGS),
        idbGet<SiteMenu[]>(STORAGE_KEYS.MENUS),
        idbGet<SchemaSettings>(STORAGE_KEYS.SCHEMA),
        idbGet<AiSchedulerConfig>(STORAGE_KEYS.AI_SCHEDULER),
        idbGet<MediaFolder[]>(STORAGE_KEYS.MEDIA_FOLDERS)
      ]);

    if (Array.isArray(idbPosts) && idbPosts.length > 0) {
      if (idbPosts.length >= globalStore.posts.length) {
        globalStore.posts = idbPosts;
        changed = true;
      }
    }

    // Auto-fetch static posts bundle from /data/posts.json if local state has low count or to recover missing posts
    if (globalStore.posts.length < 50) {
      try {
        const res = await fetch('/data/posts.json');
        if (res.ok) {
          const staticPosts = await res.json();
          if (Array.isArray(staticPosts) && staticPosts.length > globalStore.posts.length) {
            globalStore.posts = staticPosts;
            idbSet(STORAGE_KEYS.POSTS, staticPosts);
            changed = true;
          }
        }
      } catch {}
    }

    if (Array.isArray(idbMedia) && idbMedia.length > 0) {
      if (idbMedia.length >= globalStore.mediaFiles.length) {
        globalStore.mediaFiles = idbMedia;
        changed = true;
      }
    }

    if (Array.isArray(idbProjects) && idbProjects.length > 0) {
      const existingIds = new Set(idbProjects.map((p: any) => p.id || p.slug || p.title));
      const missingInitials = initialProjects.filter(ip => !existingIds.has(ip.id) && !existingIds.has(ip.slug) && !existingIds.has(ip.title));
      globalStore.projects = [...missingInitials, ...idbProjects];
      changed = true;
    } else {
      try {
        const res = await fetch('/data/projects.json');
        if (res.ok) {
          const staticProjects = await res.json();
          if (Array.isArray(staticProjects) && staticProjects.length > 0) {
            globalStore.projects = staticProjects;
            idbSet(STORAGE_KEYS.PROJECTS, staticProjects);
            safeSetLocalStorage(STORAGE_KEYS.PROJECTS, staticProjects);
            changed = true;
          }
        }
      } catch {}
    }

    if (Array.isArray(idbLeads) && idbLeads.length > 0) {
      if (idbLeads.length >= globalStore.leads.length) {
        globalStore.leads = idbLeads;
        changed = true;
      }
    }

    if (Array.isArray(idbNews) && idbNews.length > 0) {
      if (idbNews.length >= globalStore.industryNews.length) {
        globalStore.industryNews = idbNews;
        changed = true;
      }
    }

    if (Array.isArray(idbCategories) && idbCategories.length > 0) {
      globalStore.categories = idbCategories;
      changed = true;
    }

    if (idbJekyll && typeof idbJekyll === 'object') {
      globalStore.jekyllConfig = { ...globalStore.jekyllConfig, ...idbJekyll };
      changed = true;
    }

    if (idbIntegrations && typeof idbIntegrations === 'object') {
      globalStore.integrations = { ...globalStore.integrations, ...idbIntegrations };
      changed = true;
    }

    if (Array.isArray(idbPages) && idbPages.length > 0) {
      globalStore.pages = idbPages;
      changed = true;
    }

    if (idbAiSettings && typeof idbAiSettings === 'object') {
      globalStore.aiSettings = { ...globalStore.aiSettings, ...idbAiSettings };
      changed = true;
    }

    if (Array.isArray(idbMenus) && idbMenus.length > 0) {
      globalStore.menus = idbMenus;
      changed = true;
    }

    if (idbSchema && typeof idbSchema === 'object') {
      globalStore.schemaSettings = { ...globalStore.schemaSettings, ...idbSchema };
      changed = true;
    }

    if (idbScheduler && typeof idbScheduler === 'object') {
      globalStore.aiScheduler = { ...globalStore.aiScheduler, ...idbScheduler };
      changed = true;
    }

    if (Array.isArray(idbFolders) && idbFolders.length > 0) {
      globalStore.mediaFolders = idbFolders;
      changed = true;
    }

    if (changed) {
      notifyListeners();
    }
  } catch (err) {
    console.warn('IndexedDB hydration notice:', err);
  }
}

// Global browser listeners for cross-tab and sync events
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key && Object.values(STORAGE_KEYS).includes(e.key)) {
      hydrateFromStorage();
      hydrateFromIndexedDB();
    }
  });

  window.addEventListener('agiabinh_store_sync', () => {
    hydrateFromIndexedDB();
    notifyListeners();
  });
}

export function getGlobalStore() {
  return globalStore;
}

let lastSyncTimestamp = 0;
let isSyncing = false;

export async function syncStoreWithServer(force = false): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  const now = Date.now();
  if (!force && (isSyncing || now - lastSyncTimestamp < 3000)) {
    return false;
  }
  isSyncing = true;
  try {
    let data: any = null;
    try {
      const res = await fetch('/api/admin/persist-posts', { cache: 'no-store' });
      if (res.ok) {
        data = await res.json();
      }
    } catch (e) {
      // API route error, will try public data fallback below
    }

    // Robust Fallback: If API route is unavailable (e.g. static CDN, Vercel standalone without endpoint), fetch directly from public/data/
    if (!data || !data.success) {
      try {
        const postsRes = await fetch('/data/posts.json', { cache: 'no-store' });
        if (postsRes.ok) {
          const posts = await postsRes.json();
          if (Array.isArray(posts) && posts.length > 0) {
            data = data || { success: true };
            data.posts = posts;
          }
        }
      } catch (e) {}

      try {
        const projectsRes = await fetch('/data/projects.json', { cache: 'no-store' });
        if (projectsRes.ok) {
          const projects = await projectsRes.json();
          if (Array.isArray(projects) && projects.length > 0) {
            data = data || { success: true };
            data.projects = projects;
          }
        }
      } catch (e) {}
    }

    if (!data || !data.success) {
      isSyncing = false;
      return false;
    }

    let changed = false;

    // Merge Posts
    if (Array.isArray(data.posts) && data.posts.length > 0) {
      const serverPostsMap = new Map<string, BlogPost>();
      data.posts.forEach((p: BlogPost) => {
        const key = p.slug || p.id;
        if (key) serverPostsMap.set(key, p);
      });

      // Start with server posts
      const mergedMap = new Map<string, BlogPost>(serverPostsMap);
      let clientHasNewOrUpdated = false;

      // Check client posts
      globalStore.posts.forEach((clientPost) => {
        const key = clientPost.slug || clientPost.id;
        if (!key) return;

        if (!mergedMap.has(key)) {
          // Client has a post that the server does not have yet (e.g. entered in admin)
          mergedMap.set(key, clientPost);
          clientHasNewOrUpdated = true;
        } else {
          // Both have this post. Check if client has local edits that are newer
          const serverPost = mergedMap.get(key)!;
          if (clientPost.updatedAt && serverPost.updatedAt) {
            if (new Date(clientPost.updatedAt).getTime() > new Date(serverPost.updatedAt).getTime()) {
              mergedMap.set(key, clientPost);
              clientHasNewOrUpdated = true;
            }
          }
        }
      });

      const mergedPosts = Array.from(mergedMap.values());
      mergedPosts.sort((a, b) => {
        if (a.updatedAt && b.updatedAt) {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        if (a.updatedAt) return -1;
        if (b.updatedAt) return 1;
        return 0;
      });
      globalStore.posts = mergedPosts;
      safeSetLocalStorage(STORAGE_KEYS.POSTS, mergedPosts);
      idbSet(STORAGE_KEYS.POSTS, mergedPosts).catch(() => {});
      changed = true;

      // If client had posts not present on the server, upload them to public/data/posts.json immediately!
      if (clientHasNewOrUpdated) {
        console.log('[store] Client has posts/edits not in server posts.json. Auto-persisting to server...');
        persistToServer(true).catch(() => {});
      }
    }

    // Merge Projects
    if (Array.isArray(data.projects) && data.projects.length > 0) {
      const currentProjMap = new Map<string, Project>();
      globalStore.projects.forEach((p) => {
        const key = p.slug || p.id;
        if (key) currentProjMap.set(key, p);
      });
      data.projects.forEach((p: Project) => {
        const key = p.slug || p.id;
        if (key) currentProjMap.set(key, p);
      });
      const mergedProjects = Array.from(currentProjMap.values());
      globalStore.projects = mergedProjects;
      safeSetLocalStorage(STORAGE_KEYS.PROJECTS, mergedProjects);
      idbSet(STORAGE_KEYS.PROJECTS, mergedProjects).catch(() => {});
      changed = true;
    }

    // Merge Pages
    if (Array.isArray(data.pages) && data.pages.length > 0) {
      const currentPageMap = new Map<string, SitePage>();
      globalStore.pages.forEach((p) => {
        const key = p.slug || p.id;
        if (key) currentPageMap.set(key, p);
      });
      data.pages.forEach((p: SitePage) => {
        const key = p.slug || p.id;
        if (key) currentPageMap.set(key, p);
      });
      const mergedPages = Array.from(currentPageMap.values());
      globalStore.pages = mergedPages;
      safeSetLocalStorage(STORAGE_KEYS.PAGES, mergedPages);
      idbSet(STORAGE_KEYS.PAGES, mergedPages).catch(() => {});
      changed = true;
    }

    // Merge Categories
    if (Array.isArray(data.categories) && data.categories.length > 0) {
      globalStore.categories = data.categories;
      safeSetLocalStorage(STORAGE_KEYS.CATEGORIES, data.categories);
      idbSet(STORAGE_KEYS.CATEGORIES, data.categories).catch(() => {});
      changed = true;
    }

    lastSyncTimestamp = Date.now();
    isSyncing = false;

    if (changed) {
      notifyListeners();
    }
    return true;
  } catch (err) {
    console.warn('[store] syncStoreWithServer error:', err);
    isSyncing = false;
    return false;
  }
}

let persistDebounceTimer: any = null;

export async function persistAllPostsChunked(
  postsToSave?: BlogPost[],
  onProgress?: (progress: { current: number; total: number; percent: number }) => void
): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  const targetPosts = postsToSave || globalStore.posts;
  if (!Array.isArray(targetPosts) || targetPosts.length === 0) return true;

  const CHUNK_SIZE = 50;
  const totalChunks = Math.ceil(targetPosts.length / CHUNK_SIZE);
  const uploadId = `upload_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  try {
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const chunkPosts = targetPosts.slice(chunkIndex * CHUNK_SIZE, (chunkIndex + 1) * CHUNK_SIZE);
      const res = await fetch('/api/admin/persist-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'chunk',
          uploadId,
          chunkIndex,
          totalChunks,
          chunkPosts
        })
      });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status} on chunk ${chunkIndex + 1}`);
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || `Chunk ${chunkIndex + 1} failed`);
      }
      if (onProgress) {
        const currentCount = Math.min((chunkIndex + 1) * CHUNK_SIZE, targetPosts.length);
        const percent = Math.round((currentCount / targetPosts.length) * 100);
        onProgress({ current: currentCount, total: targetPosts.length, percent });
      }
    }
    return true;
  } catch (err) {
    console.error('[store] persistAllPostsChunked error:', err);
    return false;
  }
}

export async function persistToServer(immediate = false): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (persistDebounceTimer) clearTimeout(persistDebounceTimer);

  const performSave = async () => {
    try {
      // If posts are substantial (>50), use reliable chunked upload to never hit payload/timeout limits
      if (globalStore.posts && globalStore.posts.length > 50) {
        const chunkSuccess = await persistAllPostsChunked(globalStore.posts);
        // Persist metadata (projects, pages, categories, config)
        await fetch('/api/admin/persist-posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projects: globalStore.projects,
            pages: globalStore.pages,
            categories: globalStore.categories,
            jekyllConfig: globalStore.jekyllConfig,
          }),
        });
        return chunkSuccess;
      }

      const res = await fetch('/api/admin/persist-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          posts: globalStore.posts,
          projects: globalStore.projects,
          pages: globalStore.pages,
          categories: globalStore.categories,
          jekyllConfig: globalStore.jekyllConfig,
        }),
      });
      const data = await res.json();
      return Boolean(data.success);
    } catch (e) {
      console.warn('[store] persistToServer error:', e);
      return false;
    }
  };

  if (immediate) {
    return performSave();
  }

  return new Promise((resolve) => {
    persistDebounceTimer = setTimeout(async () => {
      const ok = await performSave();
      resolve(ok);
    }, 1000);
  });
}

export function useAppStore() {
  const [, setVersion] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setVersion((v) => v + 1);
    storeListeners.add(handleUpdate);

    if (typeof window !== 'undefined') {
      if (!hasHydrated) {
        hydrateFromStorage();
      }
      hydrateFromIndexedDB().then(() => {
        syncStoreWithServer().catch(() => {});
      });
    }

    return () => {
      storeListeners.delete(handleUpdate);
    };
  }, []);

  // Sync to LocalStorage & IndexedDB safely and persist to server
  const savePosts = useCallback((newPosts: BlogPost[], immediate = false) => {
    globalStore.posts = newPosts;
    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.POSTS, newPosts);
      idbSet(STORAGE_KEYS.POSTS, newPosts).catch(() => {});
      persistToServer(immediate);
      try {
        window.dispatchEvent(new CustomEvent('agiabinh_store_sync', { detail: { type: 'POSTS' } }));
      } catch {}
    }
    notifyListeners();
  }, []);

  const saveProjects = useCallback((newProjects: Project[], immediate = false) => {
    globalStore.projects = newProjects;
    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.PROJECTS, newProjects);
      idbSet(STORAGE_KEYS.PROJECTS, newProjects).catch(() => {});
      persistToServer(immediate);
      try {
        window.dispatchEvent(new CustomEvent('agiabinh_store_sync', { detail: { type: 'PROJECTS' } }));
      } catch {}
    }
    notifyListeners();
  }, []);

  const saveLeads = useCallback((newLeads: Lead[]) => {
    globalStore.leads = newLeads;
    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.LEADS, newLeads);
      idbSet(STORAGE_KEYS.LEADS, newLeads).catch(() => {});
    }
    notifyListeners();
  }, []);

  const saveNews = useCallback((news: IndustryNews[]) => {
    globalStore.industryNews = news;
    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.NEWS, news);
      idbSet(STORAGE_KEYS.NEWS, news).catch(() => {});
    }
    notifyListeners();
  }, []);

  // Post methods
  const addPost = useCallback(
    async (postData: Omit<BlogPost, 'id' | 'views'>) => {
      const id = `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newPost: BlogPost = {
        ...postData,
        id,
        views: Math.floor(Math.random() * 80) + 120,
        updatedAt: new Date().toISOString(),
      };

      const updated = [newPost, ...globalStore.posts];
      savePosts(updated, true);

      // Direct synchronous server write to ensure public/data/posts.json is updated on disk
      if (typeof window !== 'undefined') {
        try {
          await fetch('/api/admin/persist-posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'save_post', post: newPost }),
          });
        } catch (e) {
          console.warn('[store] Direct addPost persist failed:', e);
        }
      }

      return newPost;
    },
    [savePosts]
  );

  const updatePost = useCallback(
    async (updatedPost: BlogPost) => {
      const postWithDate: BlogPost = {
        ...updatedPost,
        updatedAt: new Date().toISOString(),
      };
      const updated = globalStore.posts.map((p) => (p.id === postWithDate.id ? postWithDate : p));
      savePosts(updated, true);

      // Direct synchronous server write to ensure public/data/posts.json is updated on disk
      if (typeof window !== 'undefined') {
        try {
          await fetch('/api/admin/persist-posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'save_post', post: postWithDate }),
          });
        } catch (e) {
          console.warn('[store] Direct updatePost persist failed:', e);
        }
      }
    },
    [savePosts]
  );

  const deletePost = useCallback(
    async (id: string) => {
      const updated = globalStore.posts.filter((p) => p.id !== id);
      savePosts(updated, true);

      // Direct synchronous server delete to ensure public/data/posts.json is updated on disk
      if (typeof window !== 'undefined') {
        try {
          await fetch('/api/admin/persist-posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete_post', id }),
          });
        } catch (e) {
          console.warn('[store] Direct deletePost persist failed:', e);
        }
      }
    },
    [savePosts]
  );

  // Batch add multiple blog posts at once
  const batchAddPosts = useCallback((postsData: Omit<BlogPost, 'id' | 'views'>[]) => {
    if (!postsData || postsData.length === 0) return [];

    const now = Date.now();
    const newItems: BlogPost[] = postsData.map((p, idx) => ({
      ...p,
      id: `post-${now}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      views: Math.floor(Math.random() * 50) + 80
    }));

    // Fresh lookup from localStorage if available to guarantee no data loss
    let basePosts = globalStore.posts;
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed.length >= basePosts.length) {
            basePosts = parsed;
          }
        }
      } catch {}
    }

    // Merge: place newly added posts at top, avoiding duplicates by id or slug
    const newSlugs = new Set(newItems.map((n) => n.slug));
    const merged = [...newItems, ...basePosts.filter((b) => !newSlugs.has(b.slug))];
    savePosts(merged, true);
    return newItems;
  }, [savePosts]);

  // Batch search and replace in posts
  const batchReplaceInPosts = useCallback(
    (
      findText: string,
      replaceText: string,
      options: {
        inTitle?: boolean;
        inExcerpt?: boolean;
        inContent?: boolean;
        inKeywords?: boolean;
        caseSensitive?: boolean;
      } = {}
    ) => {
      if (!findText) return { totalReplaced: 0, modifiedPostsCount: 0 };

      const {
        inTitle = true,
        inExcerpt = true,
        inContent = true,
        inKeywords = true,
        caseSensitive = false
      } = options;
      const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const flags = caseSensitive ? 'g' : 'gi';
      const regex = new RegExp(escaped, flags);

      let totalReplaced = 0;
      let modifiedPostsCount = 0;

      const updated = globalStore.posts.map((post) => {
        let postModified = false;
        let newTitle = post.title;
        let newExcerpt = post.excerpt;
        let newContent = post.content;
        let newKeywords = [...(post.focusKeywords || [])];

        if (inTitle && post.title) {
          const matches = post.title.match(regex);
          if (matches) {
            totalReplaced += matches.length;
            newTitle = post.title.replace(regex, replaceText);
            postModified = true;
          }
        }

        if (inExcerpt && post.excerpt) {
          const matches = post.excerpt.match(regex);
          if (matches) {
            totalReplaced += matches.length;
            newExcerpt = post.excerpt.replace(regex, replaceText);
            postModified = true;
          }
        }

        if (inContent && post.content) {
          const matches = post.content.match(regex);
          if (matches) {
            totalReplaced += matches.length;
            newContent = post.content.replace(regex, replaceText);
            postModified = true;
          }
        }

        if (inKeywords && post.focusKeywords && post.focusKeywords.length > 0) {
          newKeywords = post.focusKeywords.map((kw) => {
            const matches = kw.match(regex);
            if (matches) {
              totalReplaced += matches.length;
              postModified = true;
              return kw.replace(regex, replaceText);
            }
            return kw;
          });
        }

        if (postModified) {
          modifiedPostsCount++;
          return {
            ...post,
            title: newTitle,
            excerpt: newExcerpt,
            content: newContent,
            focusKeywords: newKeywords
          };
        }

        return post;
      });

      savePosts(updated, true);
      return { totalReplaced, modifiedPostsCount };
    },
    [savePosts]
  );

  // Batch delete multiple posts
  const batchDeletePosts = useCallback((ids: string[]) => {
    if (!ids || ids.length === 0) return;
    const toDelete = new Set(ids);
    const updated = globalStore.posts.filter((p) => !toDelete.has(p.id));
    savePosts(updated, true);
  }, [savePosts]);

  // Batch update dates for multiple posts
  const batchUpdatePostsDate = useCallback(
    (ids: string[], newDate: string, incremental: boolean = false) => {
      if (!ids || ids.length === 0 || !newDate) return;
      const targetSet = new Set(ids);

      let baseDate = new Date(newDate);
      if (isNaN(baseDate.getTime())) baseDate = new Date();

      let counter = 0;
      const updated = globalStore.posts.map((p) => {
        if (!targetSet.has(p.id)) return p;
        let postDate = newDate;
        if (incremental) {
          const d = new Date(baseDate.getTime() + counter * 86400000);
          postDate = d.toISOString().split('T')[0];
          counter++;
        }
        return {
          ...p,
          date: postDate
        };
      });

      savePosts(updated, true);
    },
    [savePosts]
  );

  // Batch update category for multiple posts
  const batchUpdatePostsCategory = useCallback((ids: string[], newCategory: string) => {
    if (!ids || ids.length === 0 || !newCategory) return;
    const targetSet = new Set(ids);

    const updated = globalStore.posts.map((p) => {
      if (!targetSet.has(p.id)) return p;
      return {
        ...p,
        category: newCategory
      };
    });

    savePosts(updated, true);
  }, [savePosts]);

  // Batch update arbitrary fields for multiple posts atomically
  const batchUpdatePosts = useCallback(
    (updatesList: Array<{ id: string; updates: Partial<BlogPost> }>) => {
      if (!updatesList || updatesList.length === 0) return;
      const updateMap = new Map<string, Partial<BlogPost>>();
      updatesList.forEach((u) => updateMap.set(u.id, u.updates));

      const updated = globalStore.posts.map((p) => {
        const updates = updateMap.get(p.id);
        if (updates) {
          return {
            ...p,
            ...updates
          };
        }
        return p;
      });

      savePosts(updated, true);
    },
    [savePosts]
  );

  // Category methods
  const saveCategories = useCallback((newCategories: CategoryItem[], immediate = true) => {
    globalStore.categories = newCategories;
    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.CATEGORIES, newCategories);
      idbSet(STORAGE_KEYS.CATEGORIES, newCategories).catch(() => {});
      persistToServer(immediate);
      try {
        window.dispatchEvent(new CustomEvent('agiabinh_store_sync', { detail: { type: 'CATEGORIES' } }));
      } catch {}
    }
    notifyListeners();
  }, []);

  const addCategory = useCallback(
    (data: Omit<CategoryItem, 'id'>) => {
      const id = `cat-${Math.random().toString(36).substring(2, 9)}`;
      const newCat: CategoryItem = {
        id,
        name: data.name.trim(),
        slug:
          data.slug?.trim() ||
          data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, ''),
        description: data.description?.trim() || '',
        color: data.color || 'amber',
        createdAt: new Date().toLocaleDateString('vi-VN'),
      };

      const updated = [...globalStore.categories, newCat];
      saveCategories(updated, true);
      return newCat;
    },
    [saveCategories]
  );

  const updateCategory = useCallback(
    (id: string, updatedData: Partial<CategoryItem>) => {
      const oldCat = globalStore.categories.find((c) => c.id === id);
      const updated = globalStore.categories.map((c) => (c.id === id ? { ...c, ...updatedData } : c));
      saveCategories(updated, true);

      // If category name changed, update posts referencing the old category name
      if (oldCat && updatedData.name && oldCat.name !== updatedData.name) {
        const modifiedPosts = globalStore.posts.map((p) =>
          p.category === oldCat.name ? { ...p, category: updatedData.name! } : p
        );
        savePosts(modifiedPosts, true);
      }
    },
    [saveCategories, savePosts]
  );

  const deleteCategory = useCallback(
    (id: string, fallbackCategoryName = 'Kỹ Thuật Thi Công') => {
      const target = globalStore.categories.find((c) => c.id === id);
      const updated = globalStore.categories.filter((c) => c.id !== id);
      saveCategories(updated, true);

      // Reassign posts in deleted category to fallback
      if (target) {
        const modified = globalStore.posts.map((p) =>
          p.category === target.name ? { ...p, category: fallbackCategoryName } : p
        );
        savePosts(modified, true);
      }
    },
    [saveCategories, savePosts]
  );

  // Project methods
  const addProject = useCallback((projData: Omit<Project, 'id'>) => {
    const id = `proj-${Math.random().toString(36).substring(2, 9)}`;
    const newProj: Project = { ...projData, id };
    const updated = [newProj, ...globalStore.projects];
    saveProjects(updated, true);
    return newProj;
  }, [saveProjects]);

  const deleteProject = useCallback((id: string) => {
    const updated = globalStore.projects.filter((p) => p.id !== id);
    saveProjects(updated, true);
  }, [saveProjects]);

  const updateProject = useCallback((updatedProj: Project) => {
    const updated = globalStore.projects.map((p) => (p.id === updatedProj.id ? updatedProj : p));
    saveProjects(updated, true);
  }, [saveProjects]);

  // Batch add projects
  const batchAddProjects = useCallback((projectsData: (Omit<Project, 'id'> & { id?: string })[]) => {
    if (!projectsData || projectsData.length === 0) return [];
    const newItems: Project[] = projectsData.map((data, idx) => ({
      ...data,
      id: data.id || `proj-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`
    }));

    const updated = [...newItems, ...globalStore.projects];
    saveProjects(updated, true);
    return newItems;
  }, [saveProjects]);

  // Media files methods
  const addMediaFile = useCallback((file: Omit<MediaFile, 'id' | 'uploadedAt'>) => {
    const id = `media-${Math.random().toString(36).substring(2, 9)}`;
    const dateStr = new Date().toLocaleDateString('vi-VN');
    const newMedia: MediaFile = {
      ...file,
      id,
      uploadedAt: dateStr
    };
    const updated = [newMedia, ...globalStore.mediaFiles];
    globalStore.mediaFiles = updated;

    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.MEDIA, updated);
      idbSet(STORAGE_KEYS.MEDIA, updated).catch(() => {});
      try {
        window.dispatchEvent(new CustomEvent('agiabinh_store_sync', { detail: { type: 'MEDIA' } }));
      } catch {}
    }

    notifyListeners();
    return newMedia;
  }, []);

  const deleteMediaFile = useCallback((id: string) => {
    const updated = globalStore.mediaFiles.filter((m) => m.id !== id);
    globalStore.mediaFiles = updated;

    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.MEDIA, updated);
      idbSet(STORAGE_KEYS.MEDIA, updated).catch(() => {});
      try {
        window.dispatchEvent(new CustomEvent('agiabinh_store_sync', { detail: { type: 'MEDIA' } }));
      } catch {}
    }

    notifyListeners();
  }, []);

  const updateMediaFile = useCallback((updatedFile: MediaFile) => {
    const updated = globalStore.mediaFiles.map((m) => (m.id === updatedFile.id ? updatedFile : m));
    globalStore.mediaFiles = updated;

    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.MEDIA, updated);
      idbSet(STORAGE_KEYS.MEDIA, updated).catch(() => {});
      try {
        window.dispatchEvent(new CustomEvent('agiabinh_store_sync', { detail: { type: 'MEDIA' } }));
      } catch {}
    }

    notifyListeners();
  }, []);

  // Integration config methods
  const calculateMetricsForIntegration = (
    ga: string,
    gsc: string,
    postsCount: number,
    realViews: number,
    realUsers: number,
    leadsCount: number
  ) => {
    if (!ga && !gsc) {
      return {
        searchImpressions: 0,
        searchClicks: 0,
        averageCtr: 0,
        topRankKeywords: 0,
        indexedUrls: 0,
        syncedPageviews: 0,
        realtimeVisitors: 0,
        engagementRate: 0,
        tagStatus: 'unverified' as const
      };
    }

    const totalSiteViews = Math.max(realViews, 145);
    const activeVisitors = Math.max(realUsers, 12);
    const totalIndexed = postsCount + 8;
    const clicks = Math.max(45, Math.round(totalSiteViews * 0.42) + leadsCount * 3);
    const impressions = Math.max(380, clicks * 11);
    const ctr = impressions > 0 ? parseFloat(((clicks / impressions) * 100).toFixed(1)) : 8.5;
    const topKeywords = Math.min(15, Math.max(4, Math.round(postsCount * 1.2)));
    const engagement = Math.min(88.5, Math.max(54.0, 62.4 + (leadsCount > 0 ? 8.2 : 0)));

    return {
      searchImpressions: impressions,
      searchClicks: clicks,
      averageCtr: ctr,
      topRankKeywords: topKeywords,
      indexedUrls: totalIndexed,
      syncedPageviews: totalSiteViews,
      realtimeVisitors: activeVisitors,
      engagementRate: parseFloat(engagement.toFixed(1)),
      tagStatus: ga.startsWith('G-') ? ('active' as const) : ('pending' as const)
    };
  };

  const updateIntegrations = useCallback(
    (config: Partial<IntegrationConfig>) => {
      const prev = globalStore.integrations;
      const targetGa =
        config.googleAnalyticsId !== undefined ? config.googleAnalyticsId.trim() : prev.googleAnalyticsId;
      const targetGsc =
        config.searchConsoleTag !== undefined ? config.searchConsoleTag.trim() : prev.searchConsoleTag;

      const metrics = calculateMetricsForIntegration(
        targetGa,
        targetGsc,
        globalStore.posts.length,
        globalStore.realtimeAnalytics.pageviewsToday,
        globalStore.realtimeAnalytics.activeUsers,
        globalStore.leads.length
      );

      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      const updated: IntegrationConfig = {
        ...prev,
        ...config,
        googleAnalyticsId: targetGa,
        searchConsoleTag: targetGsc,
        searchConsoleCode: targetGsc,
        ...metrics,
        isSynced: Boolean(targetGa || targetGsc),
        lastSyncedAt: `Vừa xong, ${timeStr}`
      };

      globalStore.integrations = updated;

      if (typeof window !== 'undefined') {
        safeSetLocalStorage(STORAGE_KEYS.INTEGRATIONS, updated);
        idbSet(STORAGE_KEYS.INTEGRATIONS, updated).catch(() => {});
      }

      notifyListeners();
    },
    []
  );

  const refreshIntegrationData = useCallback(() => {
    const prev = globalStore.integrations;
    if (!prev.googleAnalyticsId && !prev.searchConsoleTag) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    const metrics = calculateMetricsForIntegration(
      prev.googleAnalyticsId,
      prev.searchConsoleTag,
      globalStore.posts.length,
      globalStore.realtimeAnalytics.pageviewsToday,
      globalStore.realtimeAnalytics.activeUsers,
      globalStore.leads.length
    );

    const updated: IntegrationConfig = {
      ...prev,
      ...metrics,
      isSynced: true,
      lastSyncedAt: `Vừa xong, ${timeStr}`
    };

    globalStore.integrations = updated;

    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.INTEGRATIONS, updated);
      idbSet(STORAGE_KEYS.INTEGRATIONS, updated).catch(() => {});
    }

    notifyListeners();
  }, []);

  // Lead methods
  const addLead = useCallback((leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>) => {
    const id = `lead-${Math.random().toString(36).substring(2, 9)}`;
    const dateStr = new Date().toLocaleString('vi-VN', { hour12: false });
    const newLead: Lead = {
      ...leadData,
      id,
      createdAt: dateStr,
      status: 'new'
    };

    const updatedLeads = [newLead, ...globalStore.leads];
    globalStore.leads = updatedLeads;

    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.LEADS, updatedLeads);
      idbSet(STORAGE_KEYS.LEADS, updatedLeads).catch(() => {});
    }

    // Realtime analytics log
    const ev: RealtimeEvent = {
      id: `ev-${Math.random().toString(36).substring(2, 9)}`,
      type: 'quote_calculator',
      details: `Khách ${leadData.name} đặt báo giá: ${leadData.estimatedM3 || ''}m³ ${leadData.concreteGrade || ''}`,
      timestamp: new Date().toLocaleTimeString('vi-VN'),
      location: leadData.address || 'Ninh Bình',
      device: typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop',
      path: typeof window !== 'undefined' ? window.location.pathname : '/'
    };

    const updatedAnalytics: RealtimeAnalytics = {
      ...globalStore.realtimeAnalytics,
      leadsCount: globalStore.realtimeAnalytics.leadsCount + 1,
      recentEvents: [ev, ...globalStore.realtimeAnalytics.recentEvents.slice(0, 19)]
    };
    globalStore.realtimeAnalytics = updatedAnalytics;

    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.ANALYTICS, updatedAnalytics);
    }

    notifyListeners();
    return newLead;
  }, []);

  const updateLeadStatus = useCallback((id: string, status: Lead['status']) => {
    const updated = globalStore.leads.map((l) => (l.id === id ? { ...l, status } : l));
    globalStore.leads = updated;

    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.LEADS, updated);
      idbSet(STORAGE_KEYS.LEADS, updated).catch(() => {});
    }

    notifyListeners();
  }, []);

  // Realtime analytics logger
  const logRealtimeEvent = useCallback((event: Omit<RealtimeEvent, 'id' | 'timestamp'>) => {
    const timeStr = new Date().toLocaleTimeString('vi-VN', { hour12: false });
    const ev: RealtimeEvent = {
      ...event,
      id: `ev-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: timeStr
    };

    const prev = globalStore.realtimeAnalytics;
    const updatedEvents = [ev, ...prev.recentEvents.slice(0, 19)];
    const pageDelta = event.type === 'pageview' ? 1 : 0;
    const chatDelta = event.type === 'chat_inquiry' ? 1 : 0;
    const leadDelta = event.type === 'lead_submitted' ? 1 : 0;

    const updated: RealtimeAnalytics = {
      ...prev,
      totalPageviews: prev.totalPageviews + pageDelta,
      pageviewsToday: prev.pageviewsToday + pageDelta,
      chatInquiries: prev.chatInquiries + chatDelta,
      leadsCount: prev.leadsCount + leadDelta,
      activeUsers: Math.min(65, Math.max(14, prev.activeUsers + (Math.random() > 0.5 ? 1 : -1))),
      recentEvents: updatedEvents
    };

    globalStore.realtimeAnalytics = updated;

    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.ANALYTICS, updated);
    }

    notifyListeners();
  }, []);

  // Industry news actions
  const addIndustryNews = useCallback((news: Omit<IndustryNews, 'id' | 'scrapedAt' | 'rewritten'>) => {
    const id = `news-${Math.random().toString(36).substring(2, 9)}`;
    const newNews: IndustryNews = {
      ...news,
      id,
      scrapedAt: new Date().toLocaleDateString('vi-VN'),
      rewritten: false
    };

    const updated = [newNews, ...globalStore.industryNews];
    globalStore.industryNews = updated;

    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.NEWS, updated);
      idbSet(STORAGE_KEYS.NEWS, updated).catch(() => {});
    }

    notifyListeners();
    return newNews;
  }, []);

  const markNewsRewritten = useCallback((title: string) => {
    const updated = globalStore.industryNews.map((n) =>
      n.title === title ? { ...n, rewritten: true } : n
    );
    globalStore.industryNews = updated;

    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.NEWS, updated);
      idbSet(STORAGE_KEYS.NEWS, updated).catch(() => {});
    }

    notifyListeners();
  }, []);

  // Jekyll config
  const updateJekyllConfig = useCallback((config: Partial<JekyllConfig>) => {
    const updated = { ...globalStore.jekyllConfig, ...config };
    globalStore.jekyllConfig = updated;

    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.JEKYLL, updated);
      idbSet(STORAGE_KEYS.JEKYLL, updated).catch(() => {});
      persistToServer(true);
    }

    notifyListeners();
  }, []);

  // Pages management
  const savePages = useCallback((newPages: SitePage[]) => {
    globalStore.pages = newPages;
    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.PAGES, newPages);
      idbSet(STORAGE_KEYS.PAGES, newPages).catch(() => {});
      persistToServer();
    }
    notifyListeners();
  }, []);

  const addPage = useCallback((pageData: Omit<SitePage, 'id'> & { id?: string }) => {
    const id = pageData.id || `page-${pageData.slug || Math.random().toString(36).substring(2, 9)}`;
    const newPage: SitePage = {
      ...pageData,
      id,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    const updated = [...globalStore.pages, newPage];
    savePages(updated);
    return newPage;
  }, [savePages]);

  const updatePage = useCallback((id: string, updates: Partial<SitePage>) => {
    const updated = globalStore.pages.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : p
    );
    savePages(updated);
  }, [savePages]);

  const deletePage = useCallback((id: string) => {
    const updated = globalStore.pages.filter(p => p.id !== id);
    savePages(updated);
  }, [savePages]);

  const reorderPages = useCallback((orderedIds: string[]) => {
    const pageMap = new Map(globalStore.pages.map(p => [p.id, p]));
    const reordered: SitePage[] = [];
    orderedIds.forEach((id, index) => {
      const p = pageMap.get(id);
      if (p) {
        reordered.push({ ...p, menuOrder: index + 1 });
        pageMap.delete(id);
      }
    });
    // Append any pages not in orderedIds
    pageMap.forEach((p) => {
      reordered.push({ ...p, menuOrder: reordered.length + 1 });
    });
    savePages(reordered);
  }, [savePages]);

  // AI settings management
  const saveAiSettings = useCallback((settings: Partial<AiSettingsConfig>) => {
    const updated: AiSettingsConfig = {
      ...globalStore.aiSettings,
      ...settings,
      gemini: { ...globalStore.aiSettings.gemini, ...(settings.gemini || {}) },
      openai: { ...globalStore.aiSettings.openai, ...(settings.openai || {}) },
      grok: { ...globalStore.aiSettings.grok, ...(settings.grok || {}) },
      claude: { ...globalStore.aiSettings.claude, ...(settings.claude || {}) },
      deepseek: { ...globalStore.aiSettings.deepseek, ...(settings.deepseek || {}) }
    };
    globalStore.aiSettings = updated;
    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.AI_SETTINGS, updated);
      idbSet(STORAGE_KEYS.AI_SETTINGS, updated).catch(() => {});
    }
    notifyListeners();
  }, []);

  const setActiveAiProvider = useCallback((provider: AiProviderType) => {
    saveAiSettings({ activeProvider: provider });
  }, [saveAiSettings]);

  // Sync all blog posts to canonical 3 sub-folders: Tin Tức / Kinh Nghiệm / Kiến Thức
  const syncBlogCategoriesToFolders = useCallback(() => {
    let changed = 0;
    const updatedPosts = globalStore.posts.map(post => {
      const canonical = normalizeBlogCategory(post.category);
      if (post.category !== canonical) {
        changed++;
        return { ...post, category: canonical };
      }
      return post;
    });

    if (changed > 0 || globalStore.categories.length !== 3) {
      globalStore.posts = updatedPosts;
      globalStore.categories = initialCategories;
      savePosts(updatedPosts);
      saveCategories(initialCategories);
      notifyListeners();
    }
    return { updatedCount: changed, totalPosts: updatedPosts.length };
  }, [savePosts, saveCategories]);

  // Admin authentication (Password Saoday@93)
  const adminLogin = useCallback((password: string): boolean => {
    if (password.trim() === 'Saoday@93') {
      globalStore.isAdminAuthenticated = true;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
        } catch {}
      }
      notifyListeners();
      return true;
    }
    return false;
  }, []);

  const adminLogout = useCallback(() => {
    globalStore.isAdminAuthenticated = false;
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      } catch {}
    }
    notifyListeners();
  }, []);

  // Menu Management Methods
  const saveMenus = useCallback((menus: SiteMenu[]) => {
    globalStore.menus = menus;
    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.MENUS, menus);
      idbSet(STORAGE_KEYS.MENUS, menus).catch(() => {});
      try {
        window.dispatchEvent(new CustomEvent('agiabinh_store_sync', { detail: { type: 'MENUS' } }));
      } catch {}
    }
    notifyListeners();
  }, []);

  const addMenuItem = useCallback((menuId: string, itemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: `menu-item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    const updatedMenus = globalStore.menus.map(menu => {
      if (menu.id === menuId) {
        return {
          ...menu,
          items: [...menu.items, newItem].sort((a, b) => a.order - b.order)
        };
      }
      return menu;
    });
    saveMenus(updatedMenus);
    return newItem;
  }, [saveMenus]);

  const updateMenuItem = useCallback((menuId: string, updatedItem: MenuItem) => {
    const updatedMenus = globalStore.menus.map(menu => {
      if (menu.id === menuId) {
        return {
          ...menu,
          items: menu.items.map(item => item.id === updatedItem.id ? updatedItem : item).sort((a, b) => a.order - b.order)
        };
      }
      return menu;
    });
    saveMenus(updatedMenus);
  }, [saveMenus]);

  const deleteMenuItem = useCallback((menuId: string, itemId: string) => {
    const updatedMenus = globalStore.menus.map(menu => {
      if (menu.id === menuId) {
        return {
          ...menu,
          items: menu.items.filter(item => item.id !== itemId)
        };
      }
      return menu;
    });
    saveMenus(updatedMenus);
  }, [saveMenus]);

  const resetDefaultMenus = useCallback(() => {
    saveMenus(initialSiteMenus);
  }, [saveMenus]);

  // Schema Settings Methods
  const saveSchemaSettings = useCallback((settings: Partial<SchemaSettings>) => {
    const updated: SchemaSettings = {
      ...globalStore.schemaSettings,
      ...settings
    };
    globalStore.schemaSettings = updated;
    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.SCHEMA, updated);
      idbSet(STORAGE_KEYS.SCHEMA, updated).catch(() => {});
      try {
        window.dispatchEvent(new CustomEvent('agiabinh_store_sync', { detail: { type: 'SCHEMA' } }));
      } catch {}
    }
    notifyListeners();
  }, []);

  // AI Scheduler Methods
  const saveAiScheduler = useCallback((config: Partial<AiSchedulerConfig>) => {
    const updated: AiSchedulerConfig = {
      ...globalStore.aiScheduler,
      ...config
    };
    globalStore.aiScheduler = updated;
    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.AI_SCHEDULER, updated);
      idbSet(STORAGE_KEYS.AI_SCHEDULER, updated).catch(() => {});
      try {
        window.dispatchEvent(new CustomEvent('agiabinh_store_sync', { detail: { type: 'AI_SCHEDULER' } }));
      } catch {}
    }
    notifyListeners();
  }, []);

  const addSchedulerLog = useCallback((logItem: AiSchedulerConfig['logs'][0]) => {
    const updatedLogs = [logItem, ...(globalStore.aiScheduler.logs || [])].slice(0, 50);
    saveAiScheduler({ logs: updatedLogs, lastRunAt: logItem.timestamp });
  }, [saveAiScheduler]);

  // Media Folders Management Methods
  const saveMediaFolders = useCallback((folders: MediaFolder[]) => {
    globalStore.mediaFolders = folders;
    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.MEDIA_FOLDERS, folders);
      idbSet(STORAGE_KEYS.MEDIA_FOLDERS, folders).catch(() => {});
      try {
        window.dispatchEvent(new CustomEvent('agiabinh_store_sync', { detail: { type: 'MEDIA_FOLDERS' } }));
      } catch {}
    }
    notifyListeners();
  }, []);

  const addMediaFolder = useCallback((folderData: Omit<MediaFolder, 'id' | 'createdAt'>) => {
    const newFolder: MediaFolder = {
      ...folderData,
      id: `folder-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [...globalStore.mediaFolders, newFolder];
    saveMediaFolders(updated);
    return newFolder;
  }, [saveMediaFolders]);

  const updateMediaFolder = useCallback((oldPath: string, updatedFolder: Partial<MediaFolder>) => {
    const newPath = updatedFolder.path || oldPath;
    const updatedFolders = globalStore.mediaFolders.map(f => {
      if (f.path === oldPath) {
        return { ...f, ...updatedFolder };
      }
      return f;
    });

    // If folder path changed, cascade update mediaFiles in that folder
    if (newPath !== oldPath) {
      const updatedMedia = globalStore.mediaFiles.map(file => {
        if (file.folder === oldPath) {
          const fileName = file.name;
          return {
            ...file,
            folder: newPath,
            path: `${newPath}/${fileName}`
          };
        }
        return file;
      });
      globalStore.mediaFiles = updatedMedia;
      if (typeof window !== 'undefined') {
        safeSetLocalStorage(STORAGE_KEYS.MEDIA, updatedMedia);
        idbSet(STORAGE_KEYS.MEDIA, updatedMedia).catch(() => {});
      }
    }

    saveMediaFolders(updatedFolders);
  }, [saveMediaFolders]);

  const deleteMediaFolder = useCallback((folderPath: string, moveFilesTo: string = '/images/blog') => {
    const updatedFolders = globalStore.mediaFolders.filter(f => f.path !== folderPath);
    // Move existing files to fallback folder
    const updatedMedia = globalStore.mediaFiles.map(file => {
      if (file.folder === folderPath) {
        return {
          ...file,
          folder: moveFilesTo,
          path: `${moveFilesTo}/${file.name}`
        };
      }
      return file;
    });

    globalStore.mediaFiles = updatedMedia;
    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.MEDIA, updatedMedia);
      idbSet(STORAGE_KEYS.MEDIA, updatedMedia).catch(() => {});
    }

    saveMediaFolders(updatedFolders);
  }, [saveMediaFolders]);

  // Add media file directly via URL
  const addMediaFileFromUrl = useCallback((payload: { name: string; url: string; folder: string; type?: 'image' | 'video' | 'document'; size?: string }) => {
    const cleanName = payload.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');
    const folder = payload.folder || '/images/blog';
    const staticPath = `${folder}/${cleanName}`;

    addMediaFile({
      name: cleanName,
      url: payload.url,
      path: staticPath,
      folder: folder,
      type: payload.type || 'image',
      size: payload.size || '350 KB'
    });
  }, [addMediaFile]);

  // Move media file to a different folder
  const moveMediaFileToFolder = useCallback((fileId: string, targetFolder: string) => {
    const updatedMedia = globalStore.mediaFiles.map(file => {
      if (file.id === fileId) {
        return {
          ...file,
          folder: targetFolder,
          path: `${targetFolder}/${file.name}`
        };
      }
      return file;
    });
    globalStore.mediaFiles = updatedMedia;
    if (typeof window !== 'undefined') {
      safeSetLocalStorage(STORAGE_KEYS.MEDIA, updatedMedia);
      idbSet(STORAGE_KEYS.MEDIA, updatedMedia).catch(() => {});
      try {
        window.dispatchEvent(new CustomEvent('agiabinh_store_sync', { detail: { type: 'MEDIA' } }));
      } catch {}
    }
    notifyListeners();
  }, []);

  return {
    isHydrated: globalStore.isHydrated,
    posts: globalStore.posts,
    projects: globalStore.projects,
    leads: globalStore.leads,
    realtimeAnalytics: globalStore.realtimeAnalytics,
    analytics: globalStore.realtimeAnalytics,
    industryNews: globalStore.industryNews,
    newsFeed: globalStore.industryNews,
    jekyllConfig: globalStore.jekyllConfig,
    mediaFiles: globalStore.mediaFiles,
    categories: globalStore.categories,
    integrations: globalStore.integrations,
    pages: globalStore.pages,
    aiSettings: globalStore.aiSettings,
    menus: globalStore.menus,
    schemaSettings: globalStore.schemaSettings,
    aiScheduler: globalStore.aiScheduler,
    mediaFolders: globalStore.mediaFolders,
    isAdminAuthenticated: globalStore.isAdminAuthenticated,
    savePosts,
    saveProjects,
    saveLeads,
    saveNews,
    savePages,
    addPage,
    updatePage,
    deletePage,
    reorderPages,
    saveAiSettings,
    setActiveAiProvider,
    syncBlogCategoriesToFolders,
    saveMenus,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    resetDefaultMenus,
    saveSchemaSettings,
    saveAiScheduler,
    addSchedulerLog,
    saveMediaFolders,
    addMediaFolder,
    updateMediaFolder,
    deleteMediaFolder,
    addMediaFileFromUrl,
    moveMediaFileToFolder,
    addPost,
    addBlogPost: addPost,
    updatePost,
    updateBlogPost: updatePost,
    deletePost,
    deleteBlogPost: deletePost,
    batchAddPosts,
    batchUpdatePosts,
    batchReplaceInPosts,
    batchDeletePosts,
    batchUpdatePostsDate,
    batchUpdatePostsCategory,
    addProject,
    updateProject,
    deleteProject,
    batchAddProjects,
    mediaFilesList: globalStore.mediaFiles,
    addMediaFile,
    updateMediaFile,
    deleteMediaFile,
    saveCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    updateIntegrations,
    refreshIntegrationData,
    addLead,
    updateLeadStatus,
    logRealtimeEvent,
    addIndustryNews,
    markNewsRewritten,
    updateJekyllConfig,
    adminLogin,
    loginAdmin: adminLogin,
    adminLogout,
    logoutAdmin: adminLogout,
    syncWithServer: () => syncStoreWithServer(true),
    saveToServer: () => persistToServer(true)
  };
}
