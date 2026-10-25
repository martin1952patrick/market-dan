import { imageHosts } from './image-hosts.config.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  distDir: process.env.DIST_DIR || '.next',

  // IMPORTANT: This project uses .app.tsx convention for routable pages.
  // Files named page.tsx / page.page.tsx are NOT routes — they are plain modules.
  // Only files named page.app.tsx (e.g. page.app.tsx, layout.app.tsx) are treated as routes.
  // This eliminates dynamic slug conflicts from legacy route folder structures.
  pageExtensions: ['app.tsx', 'app.ts', 'app.jsx', 'app.js'],

  typescript: {
    ignoreBuildErrors: true,
  },

  devIndicators: false,

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: imageHosts,
    minimumCacheTTL: 60,
    qualities: [75, 85, 100],
  },

  webpack(config, { dev }) {
if (dev) {
    config.module.rules.push({
      test: /\.(jsx|tsx)$/,
      exclude: [/node_modules/],
      use: [{
        loader: '@dhiwise/component-tagger/nextLoader',
      }],
    });
  }

    return config;
  }
};
export default nextConfig;