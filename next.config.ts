import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Remove X-Powered-By header for security
  poweredByHeader: false,

  // Enable gzip compression
  compress: true,

  // TypeScript - enable strict checking in production
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === "development",
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Experimental features for Next.js 16
  experimental: {
    // Enable Turbopack filesystem caching for faster builds
    turbopackFileSystemCacheForDev: true,
    turbopackFileSystemCacheForBuild: true,

    // Optimize package imports for better tree-shaking
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "recharts",
      "@radix-ui/react-icons",
    ],

    // Enable server minification
    serverMinification: true,
  },

  // Enable PPR (Partial Pre-Rendering) for hybrid static/dynamic pages
  cacheComponents: true,

  // External packages that shouldn't be bundled in server components
  serverExternalPackages: ["@uiw/react-codemirror"],

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: "/(.*)\\.(ico|png|jpg|jpeg|gif|svg|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
