import { Registry } from "@/registry/schema"

export const ui: Registry = [
  {
    name: "accordion",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-accordion"],
    files: [
      {
        path: "ui/accordion.tsx",
        type: "registry:ui",
      },
      { path: "stories/accordion.stories.tsx", type: "registry:story" },
    ],
    tailwind: {
      config: {
        theme: {
          extend: {
            keyframes: {
              "accordion-down": {
                from: { height: "0" },
                to: { height: "var(--radix-accordion-content-height)" },
              },
              "accordion-up": {
                from: { height: "var(--radix-accordion-content-height)" },
                to: { height: "0" },
              },
            },
            animation: {
              "accordion-down": "accordion-down 0.2s ease-out",
              "accordion-up": "accordion-up 0.2s ease-out",
            },
          },
        },
      },
    },
  },
  {
    name: "alert",
    type: "registry:ui",
    files: [
      {
        path: "ui/alert.tsx",
        type: "registry:ui",
      },
      { path: "stories/alert.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "alert-dialog",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-alert-dialog"],
    registryDependencies: ["button"],
    files: [
      {
        path: "ui/alert-dialog.tsx",
        type: "registry:ui",
      },
      { path: "stories/alert-dialog.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "aspect-ratio",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-aspect-ratio"],
    files: [
      {
        path: "ui/aspect-ratio.tsx",
        type: "registry:ui",
      },
      { path: "stories/aspect-ratio.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "avatar",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-avatar"],
    files: [
      {
        path: "ui/avatar.tsx",
        type: "registry:ui",
      },
      { path: "stories/avatar.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "badge",
    type: "registry:ui",
    files: [
      {
        path: "ui/badge.tsx",
        type: "registry:ui",
      },
      { path: "stories/badge.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "breadcrumb",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-slot"],
    files: [
      {
        path: "ui/breadcrumb.tsx",
        type: "registry:ui",
      },
      { path: "stories/breadcrumb.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "button",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-slot"],
    files: [
      {
        path: "ui/button.tsx",
        type: "registry:ui",
      },
      { path: "stories/button.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "calendar",
    type: "registry:ui",
    dependencies: ["react-day-picker@8.10.1", "date-fns"],
    registryDependencies: ["button"],
    files: [
      {
        path: "ui/calendar.tsx",
        type: "registry:ui",
      },
      { path: "stories/calendar.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "card",
    type: "registry:ui",
    files: [
      {
        path: "ui/card.tsx",
        type: "registry:ui",
      },
      { path: "stories/card.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "carousel",
    type: "registry:ui",
    files: [
      {
        path: "ui/carousel.tsx",
        type: "registry:ui",
      },
      { path: "stories/carousel.stories.tsx", type: "registry:story" },
    ],
    registryDependencies: ["button"],
    dependencies: ["embla-carousel-react"],
  },
  {
    name: "chart",
    type: "registry:ui",
    files: [
      {
        path: "ui/chart.tsx",
        type: "registry:ui",
      },
      { path: "stories/chart.stories.tsx", type: "registry:story" },
    ],
    registryDependencies: ["card"],
    dependencies: ["recharts", "lucide-react"],
  },
  {
    name: "checkbox",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-checkbox"],
    files: [
      {
        path: "ui/checkbox.tsx",
        type: "registry:ui",
      },
      { path: "stories/checkbox.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "collapsible",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-collapsible"],
    files: [
      {
        path: "ui/collapsible.tsx",
        type: "registry:ui",
      },
      { path: "stories/collapsible.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "command",
    type: "registry:ui",
    dependencies: ["cmdk@1.0.0"],
    registryDependencies: ["dialog"],
    files: [
      {
        path: "ui/command.tsx",
        type: "registry:ui",
      },
      { path: "stories/command.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "context-menu",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-context-menu"],
    files: [
      {
        path: "ui/context-menu.tsx",
        type: "registry:ui",
      },
      { path: "stories/context-menu.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "dialog",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-dialog"],
    files: [
      {
        path: "ui/dialog.tsx",
        type: "registry:ui",
      },
      { path: "stories/dialog.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "drawer",
    type: "registry:ui",
    dependencies: ["vaul", "@radix-ui/react-dialog"],
    files: [
      {
        path: "ui/drawer.tsx",
        type: "registry:ui",
      },
      { path: "stories/drawer.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "dropdown-menu",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-dropdown-menu"],
    files: [
      {
        path: "ui/dropdown-menu.tsx",
        type: "registry:ui",
      },
      { path: "stories/dropdown-menu.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "form",
    type: "registry:ui",
    dependencies: [
      "@radix-ui/react-label",
      "@radix-ui/react-slot",
      "@hookform/resolvers",
      "zod",
      "react-hook-form",
    ],
    registryDependencies: ["button", "label"],
    files: [
      {
        path: "ui/form.tsx",
        type: "registry:ui",
      },
      { path: "stories/form.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "hover-card",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-hover-card"],
    files: [
      {
        path: "ui/hover-card.tsx",
        type: "registry:ui",
      },
      { path: "stories/hover-card.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "input",
    type: "registry:ui",
    files: [
      {
        path: "ui/input.tsx",
        type: "registry:ui",
      },
      { path: "stories/input.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "input-otp",
    type: "registry:ui",
    dependencies: ["input-otp"],
    files: [
      {
        path: "ui/input-otp.tsx",
        type: "registry:ui",
      },
      { path: "stories/input-otp.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "label",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-label"],
    files: [
      {
        path: "ui/label.tsx",
        type: "registry:ui",
      },
      { path: "stories/label.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "menubar",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-menubar"],
    files: [
      {
        path: "ui/menubar.tsx",
        type: "registry:ui",
      },
      { path: "stories/menubar.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "navigation-menu",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-navigation-menu"],
    files: [
      {
        path: "ui/navigation-menu.tsx",
        type: "registry:ui",
      },
      { path: "stories/navigation-menu.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "pagination",
    type: "registry:ui",
    registryDependencies: ["button"],
    files: [
      {
        path: "ui/pagination.tsx",
        type: "registry:ui",
      },
      { path: "stories/pagination.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "popover",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-popover"],
    files: [
      {
        path: "ui/popover.tsx",
        type: "registry:ui",
      },
      { path: "stories/popover.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "progress",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-progress"],
    files: [
      {
        path: "ui/progress.tsx",
        type: "registry:ui",
      },
      { path: "stories/progress.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "radio-group",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-radio-group"],
    files: [
      {
        path: "ui/radio-group.tsx",
        type: "registry:ui",
      },
      { path: "stories/radio-group.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "resizable",
    type: "registry:ui",
    dependencies: ["react-resizable-panels"],
    files: [
      {
        path: "ui/resizable.tsx",
        type: "registry:ui",
      },
      { path: "stories/resizable.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "scroll-area",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-scroll-area"],
    files: [
      {
        path: "ui/scroll-area.tsx",
        type: "registry:ui",
      },
      { path: "stories/scroll-area.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "select",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-select"],
    files: [
      {
        path: "ui/select.tsx",
        type: "registry:ui",
      },
      { path: "stories/select.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "separator",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-separator"],
    files: [
      {
        path: "ui/separator.tsx",
        type: "registry:ui",
      },
      { path: "stories/separator.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "sheet",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-dialog"],
    files: [
      {
        path: "ui/sheet.tsx",
        type: "registry:ui",
      },
      { path: "stories/sheet.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "sidebar",
    type: "registry:ui",
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "lucide-react",
    ],
    registryDependencies: [
      "button",
      "separator",
      "sheet",
      "tooltip",
      "input",
      "use-mobile",
      "skeleton",
    ],
    files: [
      {
        path: "ui/sidebar.tsx",
        type: "registry:ui",
      },
    ],
    tailwind: {
      config: {
        theme: {
          extend: {
            colors: {
              sidebar: {
                DEFAULT: "hsl(var(--sidebar-background))",
                foreground: "hsl(var(--sidebar-foreground))",
                primary: "hsl(var(--sidebar-primary))",
                "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
                accent: "hsl(var(--sidebar-accent))",
                "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
                border: "hsl(var(--sidebar-border))",
                ring: "hsl(var(--sidebar-ring))",
              },
            },
          },
        },
      },
    },
    cssVars: {
      light: {
        "sidebar-background": "0 0% 98%",
        "sidebar-foreground": "240 5.3% 26.1%",
        "sidebar-primary": "240 5.9% 10%",
        "sidebar-primary-foreground": "0 0% 98%",
        "sidebar-accent": "240 4.8% 95.9%",
        "sidebar-accent-foreground": "240 5.9% 10%",
        "sidebar-border": "220 13% 91%",
        "sidebar-ring": "217.2 91.2% 59.8%",
      },
      dark: {
        "sidebar-background": "240 5.9% 10%",
        "sidebar-foreground": "240 4.8% 95.9%",
        "sidebar-primary": "224.3 76.3% 48%",
        "sidebar-primary-foreground": "0 0% 100%",
        "sidebar-accent": "240 3.7% 15.9%",
        "sidebar-accent-foreground": "240 4.8% 95.9%",
        "sidebar-border": "240 3.7% 15.9%",
        "sidebar-ring": "217.2 91.2% 59.8%",
      },
    },
  },
  {
    name: "skeleton",
    type: "registry:ui",
    files: [
      {
        path: "ui/skeleton.tsx",
        type: "registry:ui",
      },
      { path: "stories/skeleton.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "slider",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-slider"],
    files: [
      {
        path: "ui/slider.tsx",
        type: "registry:ui",
      },
      { path: "stories/slider.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "sonner",
    type: "registry:ui",
    dependencies: ["sonner", "next-themes"],
    files: [
      {
        path: "ui/sonner.tsx",
        type: "registry:ui",
      },
      { path: "stories/sonner.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "switch",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-switch"],
    files: [
      {
        path: "ui/switch.tsx",
        type: "registry:ui",
      },
      { path: "stories/switch.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "table",
    type: "registry:ui",
    files: [
      {
        path: "ui/table.tsx",
        type: "registry:ui",
      },
      { path: "stories/table.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "tabs",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-tabs"],
    files: [
      {
        path: "ui/tabs.tsx",
        type: "registry:ui",
      },
      { path: "stories/tabs.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "textarea",
    type: "registry:ui",
    files: [
      {
        path: "ui/textarea.tsx",
        type: "registry:ui",
      },
      { path: "stories/textarea.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "toast",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-toast"],
    files: [
      {
        path: "ui/toast.tsx",
        type: "registry:ui",
      },
      {
        path: "hooks/use-toast.ts",
        type: "registry:hook",
      },
      {
        path: "ui/toaster.tsx",
        type: "registry:ui",
      },
      {
        path: "stories/toast.stories.tsx",
        type: "registry:story",
      },
    ],
  },
  {
    name: "toggle",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-toggle"],
    files: [
      {
        path: "ui/toggle.tsx",
        type: "registry:ui",
      },
      {
        path: "stories/toggle.stories.tsx",
        type: "registry:story",
      },
    ],
  },
  {
    name: "toggle-group",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-toggle-group"],
    registryDependencies: ["toggle"],
    files: [
      {
        path: "ui/toggle-group.tsx",
        type: "registry:ui",
      },
      {
        path: "stories/toggle-group.stories.tsx",
        type: "registry:story",
      },
    ],
  },
  {
    name: "tooltip",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-tooltip"],
    files: [
      {
        path: "ui/tooltip.tsx",
        type: "registry:ui",
      },
      { path: "stories/tooltip.stories.tsx", type: "registry:story" },
    ],
  },
]
