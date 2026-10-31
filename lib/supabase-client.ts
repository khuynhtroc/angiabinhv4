import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BlogPost, Project, Lead, CategoryItem, JekyllConfig, SchemaSettings, AiSchedulerConfig, AiSettingsConfig, IntegrationConfig } from './types';

export const DEFAULT_SUPABASE_URL = 'https://msxqrdaklnfpqwhxwjlc.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zeHFyZGFrbG5mcHF3aHh3amxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MDMxNjYsImV4cCI6MjEwODk3OTE2Nn0.QIa6Zq6cTFr08kjaZdIq5cwVPzVvy4eXXh2DnL5967M';

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  DEFAULT_SUPABASE_URL;

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  DEFAULT_SUPABASE_ANON_KEY;

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }
  if (cachedClient) return cachedClient;

  try {
    cachedClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });
    return cachedClient;
  } catch (err) {
    console.warn('[supabase-client] Error initializing Supabase client:', err);
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

// ============================================================================
// POSTS CRUD
// ============================================================================

export async function fetchPostsFromSupabase(): Promise<BlogPost[] | null> {
  const sb = getSupabaseClient();
  if (!sb) return null;

  try {
    // 1. Try dedicated 'posts' table
    const { data, error } = await sb
      .from('posts')
      .select('*')
      .order('date', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      return data as BlogPost[];
    }

    // 2. Fallback to site_data_store key 'posts'
    const { data: storeData, error: storeError } = await sb
      .from('site_data_store')
      .select('data')
      .eq('id', 'posts')
      .maybeSingle();

    if (!storeError && storeData?.data && Array.isArray(storeData.data)) {
      return storeData.data as BlogPost[];
    }
  } catch (err) {
    console.warn('[supabase] fetchPostsFromSupabase error:', err);
  }
  return null;
}

export async function upsertPostToSupabase(post: BlogPost): Promise<boolean> {
  const sb = getSupabaseClient();
  if (!sb) return false;

  try {
    const { error } = await sb.from('posts').upsert(post, { onConflict: 'id' });
    if (error) {
      // Fallback: also try updating site_data_store
      const { data: currentStore } = await sb
        .from('site_data_store')
        .select('data')
        .eq('id', 'posts')
        .maybeSingle();

      const existingPosts: BlogPost[] = Array.isArray(currentStore?.data) ? currentStore.data : [];
      const updatedList = [post, ...existingPosts.filter((p) => p.id !== post.id && p.slug !== post.slug)];

      await sb.from('site_data_store').upsert({
        id: 'posts',
        data: updatedList,
        updated_at: new Date().toISOString(),
      });
      return true;
    }
    return true;
  } catch (err) {
    console.warn('[supabase] upsertPostToSupabase error:', err);
    return false;
  }
}

export async function upsertBulkPostsToSupabase(posts: BlogPost[]): Promise<boolean> {
  const sb = getSupabaseClient();
  if (!sb || !posts.length) return false;

  try {
    const { error } = await sb.from('posts').upsert(posts, { onConflict: 'id' });
    if (!error) return true;

    // Fallback store
    await sb.from('site_data_store').upsert({
      id: 'posts',
      data: posts,
      updated_at: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.warn('[supabase] upsertBulkPostsToSupabase error:', err);
    return false;
  }
}

export async function deletePostFromSupabase(postId: string): Promise<boolean> {
  const sb = getSupabaseClient();
  if (!sb) return false;

  try {
    await sb.from('posts').delete().eq('id', postId);
    return true;
  } catch (err) {
    console.warn('[supabase] deletePostFromSupabase error:', err);
    return false;
  }
}

// ============================================================================
// PROJECTS CRUD
// ============================================================================

export async function fetchProjectsFromSupabase(): Promise<Project[] | null> {
  const sb = getSupabaseClient();
  if (!sb) return null;

  try {
    const { data, error } = await sb.from('projects').select('*').order('year', { ascending: false });
    if (!error && Array.isArray(data) && data.length > 0) {
      return data as Project[];
    }

    const { data: storeData } = await sb
      .from('site_data_store')
      .select('data')
      .eq('id', 'projects')
      .maybeSingle();

    if (storeData?.data && Array.isArray(storeData.data)) {
      return storeData.data as Project[];
    }
  } catch (err) {
    console.warn('[supabase] fetchProjectsFromSupabase error:', err);
  }
  return null;
}

export async function upsertProjectToSupabase(project: Project): Promise<boolean> {
  const sb = getSupabaseClient();
  if (!sb) return false;

  try {
    const { error } = await sb.from('projects').upsert(project, { onConflict: 'id' });
    if (!error) return true;

    const { data: currentStore } = await sb
      .from('site_data_store')
      .select('data')
      .eq('id', 'projects')
      .maybeSingle();

    const existing: Project[] = Array.isArray(currentStore?.data) ? currentStore.data : [];
    const updated = [project, ...existing.filter((p) => p.id !== project.id)];

    await sb.from('site_data_store').upsert({
      id: 'projects',
      data: updated,
      updated_at: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.warn('[supabase] upsertProjectToSupabase error:', err);
    return false;
  }
}

// ============================================================================
// LEADS CRUD
// ============================================================================

export async function fetchLeadsFromSupabase(): Promise<Lead[] | null> {
  const sb = getSupabaseClient();
  if (!sb) return null;

  try {
    const { data, error } = await sb.from('leads').select('*').order('createdAt', { ascending: false });
    if (!error && Array.isArray(data)) {
      return data as Lead[];
    }
  } catch (err) {
    console.warn('[supabase] fetchLeadsFromSupabase error:', err);
  }
  return null;
}

export async function insertLeadToSupabase(lead: Lead): Promise<boolean> {
  const sb = getSupabaseClient();
  if (!sb) return false;

  try {
    const { error } = await sb.from('leads').upsert(lead, { onConflict: 'id' });
    return !error;
  } catch (err) {
    console.warn('[supabase] insertLeadToSupabase error:', err);
    return false;
  }
}

// ============================================================================
// SITE SETTINGS / DATA STORE
// ============================================================================

export async function getStoreValue<T>(key: string, fallback: T): Promise<T> {
  const sb = getSupabaseClient();
  if (!sb) return fallback;

  try {
    const { data, error } = await sb
      .from('site_data_store')
      .select('data')
      .eq('id', key)
      .maybeSingle();

    if (!error && data?.data !== undefined) {
      return data.data as T;
    }
  } catch (err) {
    console.warn(`[supabase] getStoreValue('${key}') error:`, err);
  }
  return fallback;
}

export async function setStoreValue<T>(key: string, value: T): Promise<boolean> {
  const sb = getSupabaseClient();
  if (!sb) return false;

  try {
    const { error } = await sb.from('site_data_store').upsert({
      id: key,
      data: value,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch (err) {
    console.warn(`[supabase] setStoreValue('${key}') error:`, err);
    return false;
  }
}
