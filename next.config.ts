import type { NextConfig } from "next";
import { securityConfig } from './src/lib/security';

const nextConfig: NextConfig = {
  /* config options here */
  
  // Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: Object.entries(securityConfig.csp)
              .map(([key, values]) => `${key} ${values.join(' ')}`)
              .join('; '),
          },
          ...Object.entries(securityConfig.headers).map(([key, value]) => ({
            key,
            value,
          })),
        ],
      },
    ];
  },

  // Image optimization
  images: {
    domains: ['images.unsplash.com', 'groovydecember.ng'],
    formats: ['image/webp', 'image/avif'],
  },

  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
  },

  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

  export default nextConfig;
