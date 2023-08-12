import { Metadata } from "next"

export const siteConfig = {
  name: "mezcal/ui",
  url: "https://mezcalui.com",
  ogImage: "https://ui.shadcn.com/og.jpg",
  description: "Magical ui components for Next.js, React, and Tailwind CSS.",
  links: {
    twitter: "https://twitter.com/mezcalui",
    twitterManduks: "https://twitter.com/manduks",
    twitterRafa: "https://twitter.com/rafa",
    github: "https://github.com/mezcalui",
  },
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Server Components",
    "Mezcal UI",
  ],
  authors: [
    {
      name: "Armando",
      url: "https://armando.mx",
    },
    {
      name: "Rafael",
      url: "guzbarraf.com",
    },
  ],
  creator: "mezcal-ui",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@mezcalui",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export type SiteConfig = typeof siteConfig
