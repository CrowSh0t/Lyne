// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5097/api/:path*', // порт C# бека
      },
    ];
  },
};

export default nextConfig;
