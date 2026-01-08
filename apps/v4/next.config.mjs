import { createMDX } from "fumadocs-mdx/next"

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
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
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  redirects() {
    return [
      // Form redirects to /docs/forms.
      {
        source: "/docs/components/form",
        destination: "/docs/forms",
        permanent: true,
      },
      {
        source: "/docs/components/radix/form",
        destination: "/docs/forms",
        permanent: true,
      },
      {
        source: "/docs/components/base/form",
        destination: "/docs/forms",
        permanent: true,
      },
      // Component redirects (default to radix).
      {
        source: "/docs/components/:name((?!radix|base|form)[^/]+)",
        destination: "/docs/components/radix/:name",
        permanent: false,
      },
      {
        source: "/docs/components/:name((?!radix|base|form)[^/]+).md",
        destination: "/docs/components/radix/:name.md",
        permanent: false,
      },
      // Other redirects.
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
      {
        source: "/directory",
        destination: "/docs/directory",
        permanent: false,
      },
    ]
  },
  rewrites() {
    return [
      {
        source: "/docs/:path*.md",
        destination: "/llm/:path*",
      },
    ]
  },
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
