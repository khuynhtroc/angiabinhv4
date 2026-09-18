import type {Metadata, Viewport} from 'next';
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import FetchPatch from '@/components/FetchPatch';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-heading',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0f172a',
};

export const metadata: Metadata = {
  title: 'Bê Tông An Gia Bình | Bê Tông Tươi Ninh Bình Uy Tín Số 1',
  description: 'Công ty TNHH Bê Tông An Gia Bình - Cung cấp bê tông tươi, bê tông thương phẩm, xe bơm cần và bơm tĩnh chất lượng cao tại Ninh Bình và toàn quốc. Hotline: 0988 2662 93',
  keywords: [
    'bê tông tươi ninh bình',
    'bê tông an gia bình',
    'giá bê tông tươi ninh bình',
    'bê tông thương phẩm ninh bình',
    'xe bơm bê tông ninh bình',
    'trạm trộn bê tông ninh bình'
  ],
  openGraph: {
    title: 'Bê Tông An Gia Bình | Bê Tông Tươi Ninh Bình Uy Tín',
    description: 'Chuyên cung ứng bê tông thương phẩm mác 150-450, dịch vụ bơm bê tông tiến độ thần tốc, bảo đảm chất lượng kiểm định TCVN tại Ninh Bình.',
    type: 'website',
    locale: 'vi_VN',
    url: 'https://betongangiabinh.vn',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bê Tông An Gia Bình - Trạm Trộn Bê Tông Tươi Ninh Bình',
    description: 'Bê tông thương phẩm chất lượng cao, trạm trộn tự động, xe bồn và xe bơm 24/7.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="vi" className={`scroll-smooth ${plusJakartaSans.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://pub-199a7c334ba049fa93207322cf9ac698.r2.dev" />
        <link rel="alternate" type="application/rss+xml" title="Bê Tông An Gia Bình RSS Feed" href="/rss.xml" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var f=window.fetch;var c=f?f.bind(window):null;try{Object.defineProperty(window,'fetch',{get:function(){return c;},set:function(v){c=v;},configurable:true,enumerable:true});}catch(e){try{if(window.Window&&window.Window.prototype){Object.defineProperty(window.Window.prototype,'fetch',{get:function(){return c;},set:function(v){c=v;},configurable:true,enumerable:true});}}catch(e2){}}}catch(e3){}window.addEventListener('error',function(e){if(e&&e.message&&e.message.indexOf('fetch')!==-1&&e.message.indexOf('only a getter')!==-1){e.preventDefault();if(e.stopImmediatePropagation)e.stopImmediatePropagation();return true;}},true);})();`,
          }}
        />
      </head>
      <body className={`${plusJakartaSans.className} antialiased text-slate-900 bg-slate-50 selection:bg-amber-500 selection:text-white min-h-screen`} suppressHydrationWarning>
        <FetchPatch />
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
