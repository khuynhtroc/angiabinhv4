'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ServiceDetailView from '@/components/ServiceDetailView';

export default function LegacyLinhVucHoatDongSlugPage() {
  const params = useParams();
  const rawSlugArray = (params?.slug as string[]) || [];
  const slugKey = rawSlugArray.join('/');

  return <ServiceDetailView slugKey={slugKey} />;
}
