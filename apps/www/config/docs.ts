import { MainNavItem, SidebarNavItem } from "types/nav"

interface DocsConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Components",
      href: "/docs/components/accordion",
    },
    {
      title: "Examples",
      href: "/examples",
    },
    {
      title: "Twitter",
      href: "https://twitter.com/mezcalui",
      external: true,
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
          title: "Theming",
          href: "/docs/theming",
          items: [],
        },

        {
          title: "About",
          href: "/docs/about",
          items: [],
        },
      ],
    },
    {
      title: "Components",
      items: [
        {
          title: "Accordion",
          href: "/docs/components/accordion",
          items: [],
        },
        {
          title: "Alert Dialog",
          href: "/docs/components/alert-dialog",
          items: [],
        },
        {
          title: "Black Hole",
          href: "/docs/components/black-hole",
          items: [],
          label: "Free",
        },
        {
          title: "Button",
          href: "/docs/components/button",
          items: [],
        },
        {
          title: "Crypto Card",
          href: "/docs/components/crypto-card",
          items: [],
        },
        {
          title: "Ring",
          href: "/docs/components/ring",
          items: [],
          label: "Free",
        },
        {
          title: "Toast",
          href: "/docs/components/toast",
          items: [],
        },
      ],
    },
  ],
}
