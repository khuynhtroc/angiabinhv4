import { getPostUrl } from './utils';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.betongangiabinh.vn';

export function postPath(
  slugOrPost: string | { id?: string; slug?: string; permalink?: string; category?: string; isTrendingNews?: boolean }
): string {
  if (!slugOrPost) return '/blog';
  return getPostUrl(slugOrPost);
}

export function absolutePostUrl(
  slugOrPost: string | { id?: string; slug?: string; permalink?: string; category?: string; isTrendingNews?: boolean }
): string {
  const path = postPath(slugOrPost);
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}
