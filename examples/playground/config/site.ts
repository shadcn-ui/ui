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
