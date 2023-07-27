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
      href: "/docs/ui/accordion",
    },
    {
      title: "Examples",
      href: "/examples",
    },
    {
      title: "Figma",
      href: "/docs/figma",
    },
    {
      title: "GitHub",
      href: "https://github.com/beingofexistence/dx",
      external: true,
    },
    {
      title: "Twitter",
      href: "https://twitter.com/shadcn",
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
          title: "Installation",
          href: "/docs/installation",
          items: [],
        },
        {
          title: "Theming",
          href: "/docs/theming",
          items: [],
        },
        {
          title: "Dark mode",
          href: "/docs/dark-mode",
          items: [],
        },
        {
          title: "CLI",
          href: "/docs/cli",
          items: [],
        },
        {
          title: "Typography",
          href: "/docs/ui/typography",
          items: [],
        },
        {
          title: "Figma",
          href: "/docs/figma",
          items: [],
        },
        {
          title: "Spline",
          href: "/docs/spline",
          items: [],

        },
        {
          title: "Changelog",
          href: "/docs/changelog",
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
      title: "Installation",
      items: [
        {
          title: "Next.js",
          href: "/docs/installation/next",
          items: [],
        },
        {
          title: "Vite",
          href: "/docs/installation/vite",
          items: [],
        },
        {
          title: "Remix",
          href: "/docs/installation/remix",
          items: [],
        },
        {
          title: "Gatsby",
          href: "/docs/installation/gatsby",
          items: [],
        },
        {
          title: "Astro",
          href: "/docs/installation/astro",
          items: [],
        },
        {
          title: "Manual",
          href: "/docs/installation/manual",
          items: [],
        },
      ],
    },
    {
      title: "Ui",
      items: [
        {
          title: "Friday",
          href: "/docs/ui/friday",
          items: [],
        },
        {
          title: "Multiverse",
          href: "/docs/ui/multiverse",
          items: [],
        },
        {
          title: "Navbar",
          href: "/docs/ui/navbar",
          items: [],
        },
        {
          title: "Blockchain Status",
          href: "/docs/ui/blockchain-status",
          items: [],
        },
        {
          title: "Hello Mode",
          href: "/docs/ui/hello-mode",
          items: [],
        },
        {
          title: "Activitybar",
          href: "/docs/ui/activitybar",
          items: [],
        },
        {
          title: "Primary Sidebar",
          href: "/docs/ui/primary-sidebar",
          items: [],
        },
        {
          title: "Secondary Sidebar",
          href: "/docs/ui/secondary-sidebar",
          items: [],
        },
        {
          title: "Bottombar",
          href: "/docs/ui/bottombar",
          items: [],
        },
        {
          title: "Dockbar",
          href: "/docs/ui/dockbar",
          items: [],
        },
        {
          title: "Theme",
          href: "/docs/ui/theme",
          items: [],
        },
        {
          title: "Keyboard Shortcuts",
          href: "/docs/ui/keyboard-shortcuts",
          items: [],
        },
        {
          title: "Search",
          href: "/docs/ui/search",
          items: [],
        },
        {
          title: "Command Palette",
          href: "/docs/ui/command-palette",
          items: [],
        },
        {
          title: "Comment",
          href: "/docs/ui/comment",
          items: [],
        },
        {
          title: "Footer",
          href: "/docs/ui/footer",
          items: [],
        },
        {
          title: "According",
          href: "/docs/ui/according",
          items: [],
        },
        {
          title: "Alert",
          href: "/docs/ui/alert",
          items: [],
        },
        {
          title: "Alert Dialog",
          href: "/docs/ui/alert-dialog",
          items: [],
        },
        {
          title: "Aspect Ratio",
          href: "/docs/ui/aspect-ratio",
          items: [],
        },
        {
          title: "Avatar",
          href: "/docs/ui/avatar",
          items: [],
        },
        {
          title: "Badge",
          href: "/docs/ui/badge",
          items: [],
        },
        {
          title: "Button",
          href: "/docs/ui/button",
          items: [],
        },
        {
          title: "Calendar",
          href: "/docs/ui/calendar",
          items: [],
        },
        {
          title: "Card",
          href: "/docs/ui/card",
          items: [],
        },
        {
          title: "Checkbox",
          href: "/docs/ui/checkbox",
          items: [],
        },
        {
          title: "Collapsible",
          href: "/docs/ui/collapsible",
          items: [],
        },
        {
          title: "Combobox",
          href: "/docs/ui/combobox",
          items: [],
        },
        {
          title: "Context Menu",
          href: "/docs/ui/context-menu",
          items: [],
        },
        {
          title: "Data Table",
          href: "/docs/ui/data-table",
          items: [],
        },
        {
          title: "Dialog",
          href: "/docs/ui/dialog",
          items: [],
        },
        {
          title: "Dropdown Menu",
          href: "/docs/ui/dropdown-menu",
          items: [],
        },
        {
          title: "Form",
          href: "/docs/ui/form",
          items: [],
        },
        {
          title: "Hover Card",
          href: "/docs/ui/hover-card",
          items: [],
        },
        {
          title: "Input",
          href: "/docs/ui/input",
          items: [],
        },
        {
          title: "Label",
          href: "/docs/ui/label",
          items: [],
        },
        {
          title: "Popover",
          href: "/docs/ui/popover",
          items: [],
        },
        {
          title: "Progress",
          href: "/docs/ui/progress",
          items: [],
        },
        {
          title: "Radio Group",
          href: "/docs/ui/radio-group",
          items: [],
        },
        {
          title: "Scroll Area",
          href: "/docs/ui/scroll-area",
          items: [],
        },
        {
          title: "Select",
          href: "/docs/ui/select",
          items: [],
        },
        {
          title: "Separator",
          href: "/docs/ui/separator",
          items: [],
        },
        {
          title: "Sheet",
          href: "/docs/ui/sheet",
          items: [],
        },
        {
          title: "Skeleton",
          href: "/docs/ui/skeleton",
          items: [],
        },
        {
          title: "Slider",
          href: "/docs/ui/slider",
          items: [],
        },
        {
          title: "Switch",
          href: "/docs/ui/switch",
          items: [],
        },
        {
          title: "Table",
          href: "/docs/ui/table",
          items: [],
        },
        {
          title: "Tabs",
          href: "/docs/ui/tabs",
          items: [],
        },
        {
          title: "Textarea",
          href: "/docs/ui/textarea",
          items: [],
        },
        {
          title: "Toast",
          href: "/docs/ui/toast",
          items: [],
        },
        {
          title: "Toggle",
          href: "/docs/ui/toggle",
          items: [],
        },
        {
          title: "Tooltip",
          href: "/docs/ui/tooltip",
          items: [],
        },
        {
          title: "Text",
          href: "/docs/ui/text",
          items: [],
        },
        {
          title: "Charts",
          href: "/docs/ui/charts",
          items: [],
        },
        {
          title: "Pagination",
          href: "/docs/ui/pagination",
          items: [],
        },
        {
          title: "Breadcrumbs",
          href: "/docs/ui/breadcrumbs",
          items: [],
        },
        {
          title: "Chat Bubble",
          href: "/docs/ui/chat-bubble",
          items: [],
        },
        {
          title: "Date and Time Picker",
          href: "/docs/ui/date-and-time-picker",
          items: [],
        },
      ],
    },
    {
      title: "Ux",
      items: [
        {
          title: "Ar and Vr",
          href: "/docs/ux/ar-and-vr",
          items: [],
        },
        {
          title: "Motionjs",
          href: "/docs/ux/motionjs",
          items: [],
        },
        {
          title: "Framer Motion",
          href: "/docs/ux/framer-motion",
          items: [],
        },
        {
          title: "Threejs",
          href: "/docs/ux/threejs",
          items: [],
        },
        {
          title: "Unreal Engine",
          href: "/docs/ux/unreal-engine",
          items: [],
        },
        {
          title: "Unity Engine",
          href: "/docs/ux/unity-engine",
          items: [],
        },
        {
          title: "Blendar",
          href: "/docs/ux/blendar",
          items: [],
        },
        {
          title: "Maya",
          href: "/docs/ux/maya",
          items: [],
        },
        {
          title: "360Deg",
          href: "/docs/ux/360deg",
          items: [],
        },
        {
          title: "WebAssembly",
          href: "/docs/ux/webassembly",
          items: [],
        },
      ],
    },
  ],
}
