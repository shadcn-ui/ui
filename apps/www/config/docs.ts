import { MainNavItem, SidebarNavItem } from "types/nav"

export interface DocsConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
  chartsNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Components",
      href: "/docs/library/components",
    },
    {
      title: "Blocks",
      href: "/docs/library/blocks",
    },

  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
          items: [],
        },
        {
          title: "Installation",
          href: "/docs/installation",
          items: [],
        },
      ],
    },
    {
      title: "The Platform",
      items: [
        {
          title: "Purpose",
          href: "/docs/purpose",
          items: [],
        },
        {
          title: "Architecture",
          href: "/docs/architecture",
          items: [],
        },
      ],
    },
    {
      title: "Library",
      items: [
        {
          title: "Styles",
          href: "/docs/library/styles",
          items: [],
        },
        {
          title: "Components",
          href: "/docs/library/components",
          items: [],
        },
        {
          title: "Blocks",
          href: "/docs/library/blocks",
          items: [],
        },
      ],
    },
  ],
}
