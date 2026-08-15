import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer;
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
let nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@repo/design-system'],
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
  devIndicators: false,
  serverExternalPackages: ['shiki'],
  outputFileTracingRoot: path.join(projectRoot, '../..'),
  experimental: {
    optimizePackageImports: ['motion'],
    webVitalsAttribution: ['FCP', 'LCP', 'CLS', 'FID', 'TTFB', 'INP'],
  },
  outputFileTracingIncludes: {
    '/*': ['./registry/**/*'],
  },
  images: {
    qualities: [75, 100],
    deviceSizes: [390, 435, 768, 1024, 1280],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'api.microlink.io',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-940ccf6255b54fa799a9b01050e6c227.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'portfolio.brianmoir.dev',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
      {
        protocol: 'https',
        hostname: 'www.ruixen.com',
      },
      {
        protocol: 'https',
        hostname: 'shadcnagents.com',
      },
      {
        protocol: 'https',
        hostname: 'sourceoftruth.com',
      },
      {
        protocol: 'https',
        hostname: 'simplifyingai.com',
      },
      {
        protocol: 'https',
        hostname: 'opencv.org',
      },
      {
        protocol: 'https',
        hostname: 'techarion.com',
      },
      {
        protocol: 'https',
        hostname: 'www.agneyas.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.SriSomanaath',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/craft',
        destination: '/projects',
        permanent: true,
      },
      {
        source: '/craft/feed.xml',
        destination: '/projects/feed.xml',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/projects/:slug.mdx',
        destination: '/blog.mdx/:slug',
      },
      {
        source: '/craft/:slug.mdx',
        destination: '/blog.mdx/:slug',
      },
      {
        source: '/stats/:match*',
        destination: 'https://analytics.srisomanaath.in/:match*',
      },
    ];
  },
};

if (process.env.ANALYZE === 'true') {
  nextConfig = withBundleAnalyzer(nextConfig);
}

export default nextConfig;
