'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CategoryDetailClient from '@/components/CategoryDetailClient';

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = (params?.slug as string) || '';
  const cleanSlug = decodeURIComponent(rawSlug).replace(/\.html$/, '');

  useEffect(() => {
    if (cleanSlug) {
      router.replace(`/blog/${cleanSlug}`);
    }
  }, [cleanSlug, router]);

  return <CategoryDetailClient cleanSlug={cleanSlug} />;
}
