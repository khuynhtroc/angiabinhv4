export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.betongangiabinh.vn';

export function postPath(slugOrPost: string | { slug?: string; id?: string }): string {
  if (!slugOrPost) return '/blog';
  const slug = typeof slugOrPost === 'string' ? slugOrPost : slugOrPost.slug || slugOrPost.id || '';
  const clean = slug.replace(/^\//, '');
  return clean.startsWith('blog/') ? `/${clean}` : `/blog/${clean}`;
}

export function absolutePostUrl(slugOrPost: string | { slug?: string; id?: string }): string {
  return `${SITE_URL}${postPath(slugOrPost)}`;
}
