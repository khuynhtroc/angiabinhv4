'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';

export default function RealtimeAnalyticsTracker() {
  const pathname = usePathname();
  const { logRealtimeEvent, integrations } = useAppStore();
  const lastPathRef = useRef<string | null>('');

  // 1. Google Analytics 4 Script Injection & Search Console Verification (Deferred to browser idle)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadAnalytics = () => {
      try {
        const gaId = integrations?.googleAnalyticsId;
        if (gaId && gaId.trim() !== '') {
          const cleanGaId = gaId.trim();
          // Check if GA script already exists
          if (!document.getElementById('ga-gtag-script')) {
            const script = document.createElement('script');
            script.id = 'ga-gtag-script';
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${cleanGaId}`;
            document.head.appendChild(script);

            const initScript = document.createElement('script');
            initScript.id = 'ga-gtag-init';
            initScript.innerHTML = `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${cleanGaId}', { page_path: window.location.pathname });
            `;
            document.head.appendChild(initScript);
          } else if ((window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
            (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('config', cleanGaId, { page_path: pathname });
          }
        }

        // Search Console Meta Tag
        const gscCode = integrations?.searchConsoleTag || integrations?.searchConsoleCode;
        if (gscCode && gscCode.trim() !== '') {
          let contentVal = gscCode.trim();
          // In case user entered the full <meta ... content="..." />
          const match = contentVal.match(/content=["']([^"']+)["']/i);
          if (match) {
            contentVal = match[1];
          }

          let meta = document.querySelector('meta[name="google-site-verification"]');
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'google-site-verification');
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', contentVal);
        }
      } catch (e) {
        console.warn('Google tracking initialization notice:', e);
      }
    };

    if ('requestIdleCallback' in window) {
      const handle = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(loadAnalytics, { timeout: 3000 });
      return () => {
        if ('cancelIdleCallback' in window) {
          (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(handle);
        }
      };
    } else {
      const timer = setTimeout(loadAnalytics, 2000);
      return () => clearTimeout(timer);
    }
  }, [integrations?.googleAnalyticsId, integrations?.searchConsoleTag, integrations?.searchConsoleCode, pathname]);

  // 2. Realtime local tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (pathname && pathname !== lastPathRef.current) {
      lastPathRef.current = pathname;

      // Determine device
      const isMobile = window.innerWidth < 768;
      const device = isMobile ? 'mobile' : 'desktop';

      // Ninh Bình locations pool with updated plants
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
        path: pathname,
        location: randomLoc,
        device: device,
        details: `Truy cập trang ${pathname}`
      });

      // Send to server beacon as well
      try {
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'pageview', path: pathname }),
        }).catch(() => {});
      } catch {}
    }
  }, [pathname, logRealtimeEvent]);

  return null;
}
