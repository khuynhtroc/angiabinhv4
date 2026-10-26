'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export default function RealtimeAnalyticsTracker() {
  const pathname = usePathname();
  const { logRealtimeEvent, jekyllConfig, integrations } = useAppStore();
  const lastPathRef = useRef<string | null>(null);
  const isFirstLoadRef = useRef<boolean>(true);

  const gaId = jekyllConfig?.google_analytics?.trim() || integrations?.googleAnalyticsId?.trim() || 'G-6J50BRBSZS';

  // 1. Handle SPA Route Changes for GA4 & GTM dataLayer
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (pathname && pathname.startsWith('/admin')) {
      (window as any)['ga-disable-' + gaId] = true;
      return;
    }
    const h = window.location.hostname || '';
    if (h && h.indexOf('betongangiabinh.vn') === -1 && h !== 'localhost' && h.indexOf('workers.dev') === -1) return;

    const search = typeof window !== 'undefined' ? window.location.search : '';
    const fullUrl = search ? `${pathname}${search}` : pathname;

    // Skip duplicate hits for the exact same path
    if (lastPathRef.current === fullUrl) return;

    if (isFirstLoadRef.current) {
      // On initial SSR load, the <head> scripts in app/layout.tsx already fired the initial pageview
      isFirstLoadRef.current = false;
      lastPathRef.current = fullUrl;
    } else {
      // Subsequent SPA Client Navigations: notify GA4 and GTM
      lastPathRef.current = fullUrl;

      try {
        if (typeof window.gtag === 'function') {
          window.gtag('config', gaId, {
            page_path: fullUrl,
            page_title: typeof document !== 'undefined' ? document.title : '',
          });
          window.gtag('event', 'page_view', {
            page_path: fullUrl,
            page_title: typeof document !== 'undefined' ? document.title : '',
          });
        }

        if (Array.isArray(window.dataLayer)) {
          window.dataLayer.push({
            event: 'page_view',
            page_path: fullUrl,
            page_title: typeof document !== 'undefined' ? document.title : '',
          });
        }
      } catch (err) {
        console.warn('[Analytics] Route tracking notice:', err);
      }
    }

    // 2. Realtime local logging for admin dashboard
    try {
      const isMobile = window.innerWidth < 768;
      const device = isMobile ? 'mobile' : 'desktop';

      const locations = [
        'TP. Ninh Bình (Trung tâm)',
        'KCN Khánh Phú (Trạm 1 - Đông Hoa Lư)',
        'Xã Kim Sơn (Trạm 2 Ninh Bình)',
        'Huyện Hoa Lư (Khu du lịch Tràng An)',
        'TP. Tam Điệp (KCN Tam Điệp)',
        'Huyện Yên Khánh (KCN Khánh Phú)',
        'Huyện Yên Mô',
        'Huyện Gia Viễn',
        'Huyện Nho Quan',
        'Hà Nội / Nhà thầu liên tỉnh',
      ];
      const randomLoc = locations[Math.floor(Math.random() * locations.length)];

      logRealtimeEvent({
        type: 'pageview',
        path: fullUrl,
        location: randomLoc,
        device: device,
        details: `Truy cập trang ${fullUrl}`,
      });

      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'pageview', path: fullUrl }),
      }).catch(() => {});
    } catch {}
  }, [pathname, gaId, logRealtimeEvent]);

  // 3. Global Click Listener for Conversion Tracking (Phone Calls & Zalo)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const h = window.location.hostname || '';
    if (h && h.indexOf('betongangiabinh.vn') === -1 && h !== 'localhost' && h.indexOf('workers.dev') === -1) return;

    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) return;
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href') || '';

      if (href.startsWith('tel:')) {
        const phone = href.replace('tel:', '').trim();
        try {
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'contact_call', {
              event_category: 'engagement',
              event_label: phone,
              value: 1,
            });
          }
          if (Array.isArray(window.dataLayer)) {
            window.dataLayer.push({
              event: 'conversion_call_click',
              phone_number: phone,
            });
          }
        } catch {}
      } else if (href.includes('zalo.me')) {
        try {
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'contact_zalo', {
              event_category: 'engagement',
              event_label: href,
              value: 1,
            });
          }
          if (Array.isArray(window.dataLayer)) {
            window.dataLayer.push({
              event: 'conversion_zalo_click',
              zalo_url: href,
            });
          }
        } catch {}
      }
    };

    document.addEventListener('click', handleDocumentClick, { passive: true });
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return null;
}
