'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ServiceDetailView from '@/components/ServiceDetailView';

export default function BeTongTuoiRoutePage() {
  const params = useParams();
  const rawSlugArray = (params?.slug as string[]) || [];

  // If no subslug: 'be-tong-tuoi'
  // If subslug like ['be-tong-thuong']: 'be-tong-tuoi/be-tong-thuong'
  const slugKey = rawSlugArray.length === 0 
    ? 'be-tong-tuoi' 
    : `be-tong-tuoi/${rawSlugArray.join('/')}`;

  return <ServiceDetailView slugKey={slugKey} />;
}
