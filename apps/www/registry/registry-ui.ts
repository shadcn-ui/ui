import { Registry } from "@/registry/schema"

export const ui: Registry = [
  {
    name: "accordion",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-accordion"],
    files: [
      "ui/accordion.tsx",
      { path: "stories/accordion.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "alert",
    type: "registry:ui",
    files: [
      "ui/alert.tsx",
      { path: "stories/alert.stories.tsx", type: "registry:story" },
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
    name: "alert-dialog",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-alert-dialog"],
    registryDependencies: ["button"],
    files: [
      "ui/alert-dialog.tsx",
      { path: "stories/alert-dialog.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "aspect-ratio",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-aspect-ratio"],
    files: [
      "ui/aspect-ratio.tsx",
      { path: "stories/aspect-ratio.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "avatar",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-avatar"],
    files: [
      "ui/avatar.tsx",
      { path: "stories/avatar.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "badge",
    type: "registry:ui",
    files: [
      "ui/badge.tsx",
      { path: "stories/badge.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "breadcrumb",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-slot"],
    files: [
      "ui/breadcrumb.tsx",
      { path: "stories/breadcrumb.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "button",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-slot"],
    files: [
      "ui/button.tsx",
      { path: "stories/button.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "calendar",
    type: "registry:ui",
    dependencies: ["react-day-picker@8.10.1", "date-fns"],
    registryDependencies: ["button"],
    files: [
      "ui/calendar.tsx",
      { path: "stories/calendar.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "card",
    type: "registry:ui",
    files: [
      "ui/card.tsx",
      { path: "stories/card.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "carousel",
    type: "registry:ui",
    files: [
      "ui/carousel.tsx",
      { path: "stories/carousel.stories.tsx", type: "registry:story" },
    ],
    registryDependencies: ["button"],
    dependencies: ["embla-carousel-react"],
  },
  {
    name: "chart",
    type: "registry:ui",
    files: [
      "ui/chart.tsx",
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
      "ui/checkbox.tsx",
      { path: "stories/checkbox.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "collapsible",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-collapsible"],
    files: [
      "ui/collapsible.tsx",
      { path: "stories/collapsible.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "command",
    type: "registry:ui",
    dependencies: ["cmdk@1.0.0"],
    registryDependencies: ["dialog"],
    files: [
      "ui/command.tsx",
      { path: "stories/command.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "context-menu",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-context-menu"],
    files: [
      "ui/context-menu.tsx",
      { path: "stories/context-menu.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "dialog",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-dialog"],
    files: [
      "ui/dialog.tsx",
      { path: "stories/dialog.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "drawer",
    type: "registry:ui",
    dependencies: ["vaul", "@radix-ui/react-dialog"],
    files: [
      "ui/drawer.tsx",
      { path: "stories/drawer.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "dropdown-menu",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-dropdown-menu"],
    files: [
      "ui/dropdown-menu.tsx",
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
      "ui/form.tsx",
      { path: "stories/form.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "hover-card",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-hover-card"],
    files: [
      "ui/hover-card.tsx",
      { path: "stories/hover-card.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "input",
    type: "registry:ui",
    files: [
      "ui/input.tsx",
      { path: "stories/input.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "input-otp",
    type: "registry:ui",
    dependencies: ["input-otp"],
    files: [
      "ui/input-otp.tsx",
      { path: "stories/input-otp.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "label",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-label"],
    files: [
      "ui/label.tsx",
      { path: "stories/label.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "menubar",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-menubar"],
    files: [
      "ui/menubar.tsx",
      { path: "stories/menubar.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "navigation-menu",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-navigation-menu"],
    files: [
      "ui/navigation-menu.tsx",
      { path: "stories/navigation-menu.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "pagination",
    type: "registry:ui",
    registryDependencies: ["button"],
    files: [
      "ui/pagination.tsx",
      { path: "stories/pagination.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "popover",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-popover"],
    files: [
      "ui/popover.tsx",
      { path: "stories/popover.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "progress",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-progress"],
    files: [
      "ui/progress.tsx",
      { path: "stories/progress.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "radio-group",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-radio-group"],
    files: [
      "ui/radio-group.tsx",
      { path: "stories/radio-group.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "resizable",
    type: "registry:ui",
    dependencies: ["react-resizable-panels"],
    files: [
      "ui/resizable.tsx",
      { path: "stories/resizable.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "scroll-area",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-scroll-area"],
    files: [
      "ui/scroll-area.tsx",
      { path: "stories/scroll-area.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "select",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-select"],
    files: [
      "ui/select.tsx",
      { path: "stories/select.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "separator",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-separator"],
    files: [
      "ui/separator.tsx",
      { path: "stories/separator.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "sheet",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-dialog"],
    files: [
      "ui/sheet.tsx",
      { path: "stories/sheet.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "skeleton",
    type: "registry:ui",
    files: [
      "ui/skeleton.tsx",
      { path: "stories/skeleton.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "slider",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-slider"],
    files: [
      "ui/slider.tsx",
      { path: "stories/slider.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "sonner",
    type: "registry:ui",
    dependencies: ["sonner", "next-themes"],
    files: [
      "ui/sonner.tsx",
      { path: "stories/sonner.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "switch",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-switch"],
    files: [
      "ui/switch.tsx",
      { path: "stories/switch.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "table",
    type: "registry:ui",
    files: [
      "ui/table.tsx",
      { path: "stories/table.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "tabs",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-tabs"],
    files: [
      "ui/tabs.tsx",
      { path: "stories/tabs.stories.tsx", type: "registry:story" },
    ],
  },
  {
    name: "textarea",
    type: "registry:ui",
    files: [
      "ui/textarea.tsx",
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
      "ui/toggle.tsx",
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
      "ui/toggle-group.tsx",
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
      "ui/tooltip.tsx",
      { path: "stories/tooltip.stories.tsx", type: "registry:story" },
    ],
  },
]
