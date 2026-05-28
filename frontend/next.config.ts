import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:5097/api/auth/:path*',
      },
      {
        source: '/api/products/:path*',
        destination: 'http://localhost:5097/api/products/:path*',
      },
      {
        source: '/api/brands/:path*',
        destination: 'http://localhost:5097/api/brands/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.gstatic.com',
      },
    ],
  },
};

export default nextConfig;