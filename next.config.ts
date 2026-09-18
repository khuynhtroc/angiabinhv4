import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  distDir: process.env.NODE_ENV === 'production' ? '.next' : '.next-dev',
  output: 'standalone',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder and external CDN images.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  transpilePackages: ['motion'],
  async redirects() {
    const r2Url = (process.env.NEXT_PUBLIC_R2_URL || '').replace(/\/+$/, '');
    const customRedirects = [
      {
        source: '/gioi-thieu',
        destination: '/about',
        permanent: true,
      },
    ];
    if (r2Url) {
      customRedirects.push({
        source: '/images/blog/:path*',
        destination: `${r2Url}/images/blog/:path*`,
        permanent: false,
      });
    }
    return customRedirects;
  },
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
