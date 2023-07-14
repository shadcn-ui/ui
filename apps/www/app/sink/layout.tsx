import Link from "next/link"

import { ThemeWrapper } from "@/components/theme-wrapper"
import { styles } from "@/registry/styles"
import { siteConfig, siteConfigSink } from "@/config/site"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: siteConfigSink.name,
    template: `%s - ${siteConfigSink.name}`,
  },
  description: siteConfigSink.description,
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Server Components",
    "Radix UI",
    "Example Collage",
  ],
  authors: [
    {
      name: "shadcn",
      url: "https://shadcn.com",
    },
  ],
  creator: "shadcn",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfigSink.url,
    title: siteConfigSink.name,
    description: siteConfigSink.description,
    siteName: siteConfigSink.name,
    images: [
      {
        url: siteConfigSink.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfigSink.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfigSink.name,
    description: siteConfigSink.description,
    images: [siteConfigSink.ogImage],
    creator: "@shadcn",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

interface SinkLayoutProps {
  children: React.ReactNode
}

export default function SinkLayout({ children }: SinkLayoutProps) {
  return (
    <div className="flex flex-col">
      <div className="container">
        <div className="flex space-x-2 px-2 py-4">
          {styles.map((style) => (
            <Link href={`/sink/${style.name}`} key={style.name}>
              {style.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex-1">
        <ThemeWrapper>{children}</ThemeWrapper>
      </div>
    </div>
  )
}
