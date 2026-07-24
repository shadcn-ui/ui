import { existsSync } from "fs"
import path from "path"
import { createMDX } from "fumadocs-mdx/next"

// The generated styles under styles/ are gitignored (see styles/README.md).
// Fail fast with instructions instead of a wall of module-not-found errors.
if (
  process.env.NODE_ENV === "development" &&
  !existsSync(path.join(process.cwd(), "styles/base-nova/ui"))
) {
  throw new Error(
    "Generated styles are missing. Run `pnpm --filter=v4 registry:build --style all` once, then restart the dev server."
  )
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Rewrite barrel imports to deep imports so a single icon doesn't pull the
    // whole package into the module graph. Next already optimizes lucide-react,
    // @tabler/icons-react, date-fns and lodash-es by default; these are the
    // heavy icon packages this app uses that are NOT on that default list.
    optimizePackageImports: [
      "@hugeicons/react",
      "@hugeicons/core-free-icons",
      "@phosphor-icons/react",
      "@remixicon/react",
    ],
  },
  outputFileTracingIncludes: {
    "/*": ["./registry/**/*", "./styles/**/*"],
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
  turbopack: {
    root: path.resolve(import.meta.dirname, "../.."),
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
      {
        source: "/docs/components/aria/form",
        destination: "/docs/forms",
        permanent: true,
      },
      // Typography redirects to /docs/typeset.
      {
        source: "/docs/components/base/typography",
        destination: "/docs/typeset",
        permanent: true,
      },
      {
        source: "/docs/components/radix/typography",
        destination: "/docs/typeset",
        permanent: true,
      },
      {
        source: "/docs/components/aria/typography",
        destination: "/docs/typeset",
        permanent: true,
      },
      // Base UI Sonner redirects to Toast.
      {
        source: "/docs/components/base/sonner",
        destination: "/docs/components/base/toast",
        permanent: true,
      },
      {
        source: "/docs/components/base/sonner.md",
        destination: "/docs/components/base/toast.md",
        permanent: true,
      },
      // Component redirects (default to base).
      {
        source: "/docs/components/:name((?!radix|base|aria|form)[^/]+)",
        destination: "/docs/components/base/:name",
        permanent: false,
      },
      {
        source: "/docs/components/:name((?!radix|base|aria|form)[^/]+).md",
        destination: "/docs/components/base/:name.md",
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
      {
        source: "/new",
        destination: "/docs/new",
        permanent: false,
      },
      {
        source: "/skills",
        destination: "/docs/skills",
        permanent: true,
      },
      {
        source: "/cli",
        destination: "/docs/cli",
        permanent: true,
      },
      {
        source: "/themes",
        destination: "/create",
        permanent: true,
      },
      {
        source: "/code/:path*",
        destination:
          "https://raw.githubusercontent.com/shadcn-ui/ui/refs/heads/main/:path*",
        permanent: false,
      },
    ]
  },
  rewrites() {
    return [
      {
        source: "/r/styles/new-york/:path*",
        destination: "/r/styles/new-york-v4/:path*",
      },
      {
        source: "/r/styles/default/:path*",
        destination: "/r/styles/new-york-v4/:path*",
      },
      {
        source: "/docs/:path*.md",
        destination: "/llm/:path*",
      },
      {
        source: "/init.md",
        destination: "/init/md",
      },
    ]
  },
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
