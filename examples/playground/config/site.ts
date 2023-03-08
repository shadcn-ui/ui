import { Metadata } from "next/types"

const url = process.env.NEXT_PUBLIC_APP_URL
const ogUrl = new URL(`${url}/og.jpg`)

interface SiteConfig {
  name: string
  description: string
  links: {
    twitter: string
    github: string
    docs: string
  }
}

export const siteConfig: SiteConfig = {
  name: "Playground",
  description: "Dashboard built using Next.js, Tailwind CSS, and Radix UI",
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
}

export const siteMetadata: Metadata = {
  title: `${siteConfig.name} - ${siteConfig.description}`,
  description: siteConfig.description,
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: "favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
  },
  creator: "@shadcn",
  openGraph: {
    type: "website",
    title: siteConfig.name,
    description: siteConfig.description,
    url: url,
    images: [
      {
        url: ogUrl,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ogUrl,
  },
}
