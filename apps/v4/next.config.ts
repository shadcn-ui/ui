import path from "path"
import type { NextConfig } from "next"
import { createMDX } from "fumadocs-mdx/next"

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  outputFileTracingRoot: path.join(__dirname, ".."),
  outputFileTracingIncludes: {
    "/*": ["./registry/**/*"],
  },
  serverExternalPackages: ["ts-morph", "shiki"],
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
    ],
  },
}

const withMDX = createMDX()

export default withMDX(nextConfig)
