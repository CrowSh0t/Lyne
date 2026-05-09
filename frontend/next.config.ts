// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:5097/api/auth/:path*',
      },
      // /api/me НЕ додаємо — буде оброблятись своїм route.ts
    ];
  },
};

export default nextConfig;
