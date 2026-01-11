import { createMDX } from "fumadocs-mdx/next"

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  outputFileTracingIncludes: {
    "/*": ["./registry/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
      },
    ],
  },
  redirects() {
    return [
      {
        source: "/accounting/journals/:path*",
        destination: "/erp/accounting/journal-entries/:path*",
        permanent: false,
      },
      {
        source: "/erp/accounting/journals/:path*",
        destination: "/erp/accounting/journal-entries/:path*",
        permanent: false,
      },
      {
        source: "/accounting/ledger/:path*",
        destination: "/erp/accounting/general-ledger/:path*",
        permanent: false,
      },
      {
        source: "/erp/accounting/ledger/:path*",
        destination: "/erp/accounting/general-ledger/:path*",
        permanent: false,
      },
      {
        source: "/accounting/reports",
        has: [
          {
            type: "query",
            key: "tab",
            value: "pl",
          },
        ],
        destination: "/erp/accounting/reports/profit-loss",
        permanent: false,
      },
      {
        source: "/accounting/reports",
        has: [
          {
            type: "query",
            key: "tab",
            value: "bs",
          },
        ],
        destination: "/erp/accounting/reports/balance-sheet",
        permanent: false,
      },
      {
        source: "/components",
        destination: "/docs/components",
        permanent: true,
      },
      {
        source: "/docs/primitives/:path*",
        destination: "/docs/components/:path*",
        permanent: true,
      },
      {
        source: "/figma",
        destination: "/docs/figma",
        permanent: true,
      },
      {
        source: "/sidebar",
        destination: "/docs/components/sidebar",
        permanent: true,
      },
      {
        source: "/react-19",
        destination: "/docs/react-19",
        permanent: true,
      },
      {
        source: "/charts",
        destination: "/charts/area",
        permanent: true,
      },
      {
        source: "/view/styles/:style/:name",
        destination: "/view/:name",
        permanent: true,
      },
      {
        source: "/docs/:path*.mdx",
        destination: "/docs/:path*.md",
        permanent: true,
      },
      {
        source: "/mcp",
        destination: "/docs/mcp",
        permanent: false,
      },
    ]
  },
  rewrites() {
    return [
      {
        source: "/accounting/:path*",
        destination: "/erp/accounting/:path*",
        // TODO: remove legacy /accounting/* alias after migration stabilizes
      },
      {
        source: "/docs/:path*.md",
        destination: "/llm/:path*",
      },
    ]
  },
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
