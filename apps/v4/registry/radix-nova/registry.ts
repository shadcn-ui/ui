export const registry = {
  name: "shadcn/ui",
  homepage: "https://ui.shadcn.com",
  items: [
    {
      name: "index",
      type: "registry:style",
      title: "Radix UI",
      description:
        "Optimized for fast development, easy maintenance, and accessibility.",
      dependencies: ["radix-ui"],
    },
    {
      name: "radix-nova",
      type: "registry:style",
      title: "Radix UI",
      description:
        "Optimized for fast development, easy maintenance, and accessibility.",
      dependencies: ["radix-ui"],
    },
    {
      name: "cover-example",
      type: "registry:example",
      title: "Cover",
      files: [
        {
          path: "examples/cover-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "accordion-example",
      type: "registry:example",
      title: "Accordion",
      registryDependencies: ["accordion"],
      files: [
        {
          path: "examples/accordion-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "alert-example",
      type: "registry:example",
      title: "Alert",
      registryDependencies: ["alert"],
      files: [
        {
          path: "examples/alert-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "alert-dialog-example",
      type: "registry:example",
      title: "Alert Dialog",
      registryDependencies: ["alert-dialog", "button"],
      files: [
        {
          path: "examples/alert-dialog-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "aspect-ratio-example",
      type: "registry:example",
      title: "Aspect Ratio",
      registryDependencies: ["aspect-ratio"],
      files: [
        {
          path: "examples/aspect-ratio-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "avatar-example",
      type: "registry:example",
      title: "Avatar",
      registryDependencies: ["avatar"],
      files: [
        {
          path: "examples/avatar-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "badge-example",
      type: "registry:example",
      title: "Badge",
      registryDependencies: ["badge"],
      files: [
        {
          path: "examples/badge-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "breadcrumb-example",
      type: "registry:example",
      title: "Breadcrumb",
      registryDependencies: ["breadcrumb"],
      files: [
        {
          path: "examples/breadcrumb-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "button-example",
      type: "registry:example",
      title: "Button",
      registryDependencies: ["button"],
      files: [
        {
          path: "examples/button-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "button-group-example",
      type: "registry:example",
      title: "Button Group",
      registryDependencies: ["button-group"],
      files: [
        {
          path: "examples/button-group-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "calendar-example",
      type: "registry:example",
      title: "Calendar",
      registryDependencies: [
        "button",
        "calendar",
        "card",
        "drawer",
        "input",
        "label",
        "popover",
      ],
      files: [
        {
          path: "examples/calendar-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "card-example",
      type: "registry:example",
      title: "Card",
      registryDependencies: ["card"],
      files: [
        {
          path: "examples/card-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "carousel-example",
      type: "registry:example",
      title: "Carousel",
      registryDependencies: ["carousel"],
      files: [
        {
          path: "examples/carousel-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "chart-example",
      type: "registry:example",
      title: "Chart",
      registryDependencies: ["chart", "card"],
      files: [
        {
          path: "examples/chart-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "checkbox-example",
      type: "registry:example",
      title: "Checkbox",
      registryDependencies: ["checkbox"],
      files: [
        {
          path: "examples/checkbox-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "collapsible-example",
      type: "registry:example",
      title: "Collapsible",
      registryDependencies: ["collapsible"],
      files: [
        {
          path: "examples/collapsible-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "combobox-example",
      type: "registry:example",
      title: "Combobox",
      registryDependencies: ["avatar", "button", "command", "popover"],
      files: [
        {
          path: "examples/combobox-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "command-example",
      type: "registry:example",
      title: "Command",
      registryDependencies: ["command"],
      files: [
        {
          path: "examples/command-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "context-menu-example",
      type: "registry:example",
      title: "Context Menu",
      registryDependencies: ["context-menu"],
      files: [
        {
          path: "examples/context-menu-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "dialog-example",
      type: "registry:example",
      title: "Dialog",
      registryDependencies: ["dialog"],
      files: [
        {
          path: "examples/dialog-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "drawer-example",
      type: "registry:example",
      title: "Drawer",
      registryDependencies: ["drawer"],
      files: [
        {
          path: "examples/drawer-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "dropdown-menu-example",
      type: "registry:example",
      title: "Dropdown Menu",
      registryDependencies: ["dropdown-menu"],
      files: [
        {
          path: "examples/dropdown-menu-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "empty-example",
      type: "registry:example",
      title: "Empty",
      registryDependencies: ["empty"],
      files: [
        {
          path: "examples/empty-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "field-example",
      type: "registry:example",
      title: "Field",
      registryDependencies: ["field"],
      files: [
        {
          path: "examples/field-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "form-example",
      type: "registry:example",
      title: "Form",
      registryDependencies: [
        "button",
        "calendar",
        "checkbox",
        "form",
        "input",
        "popover",
        "radio-group",
        "select",
        "switch",
        "textarea",
      ],
      files: [
        {
          path: "examples/form-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "hover-card-example",
      type: "registry:example",
      title: "Hover Card",
      registryDependencies: ["hover-card"],
      files: [
        {
          path: "examples/hover-card-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "input-example",
      type: "registry:example",
      title: "Input",
      registryDependencies: ["input"],
      files: [
        {
          path: "examples/input-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "input-group-example",
      type: "registry:example",
      title: "Input Group",
      registryDependencies: ["input-group"],
      files: [
        {
          path: "examples/input-group-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "input-otp-example",
      type: "registry:example",
      title: "Input OTP",
      registryDependencies: ["input-otp"],
      files: [
        {
          path: "examples/input-otp-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "item-example",
      type: "registry:example",
      title: "Item",
      registryDependencies: ["item"],
      files: [
        {
          path: "examples/item-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "kbd-example",
      type: "registry:example",
      title: "Kbd",
      registryDependencies: ["kbd"],
      files: [
        {
          path: "examples/kbd-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "label-example",
      type: "registry:example",
      title: "Label",
      registryDependencies: ["label"],
      files: [
        {
          path: "examples/label-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "menubar-example",
      type: "registry:example",
      title: "Menubar",
      registryDependencies: ["menubar"],
      files: [
        {
          path: "examples/menubar-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "native-select-example",
      type: "registry:example",
      title: "Native Select",
      registryDependencies: ["native-select"],
      files: [
        {
          path: "examples/native-select-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "navigation-menu-example",
      type: "registry:example",
      title: "Navigation Menu",
      registryDependencies: ["navigation-menu"],
      files: [
        {
          path: "examples/navigation-menu-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "pagination-example",
      type: "registry:example",
      title: "Pagination",
      registryDependencies: ["pagination"],
      files: [
        {
          path: "examples/pagination-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "popover-example",
      type: "registry:example",
      title: "Popover",
      registryDependencies: ["popover"],
      files: [
        {
          path: "examples/popover-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "progress-example",
      type: "registry:example",
      title: "Progress",
      registryDependencies: ["progress"],
      files: [
        {
          path: "examples/progress-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "radio-group-example",
      type: "registry:example",
      title: "Radio Group",
      registryDependencies: ["radio-group"],
      files: [
        {
          path: "examples/radio-group-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "resizable-example",
      type: "registry:example",
      title: "Resizable",
      registryDependencies: ["resizable"],
      files: [
        {
          path: "examples/resizable-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "scroll-area-example",
      type: "registry:example",
      title: "Scroll Area",
      registryDependencies: ["scroll-area"],
      files: [
        {
          path: "examples/scroll-area-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "select-example",
      type: "registry:example",
      title: "Select",
      registryDependencies: ["select"],
      files: [
        {
          path: "examples/select-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "separator-example",
      type: "registry:example",
      title: "Separator",
      registryDependencies: ["separator"],
      files: [
        {
          path: "examples/separator-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "sheet-example",
      type: "registry:example",
      title: "Sheet",
      registryDependencies: ["sheet"],
      files: [
        {
          path: "examples/sheet-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "skeleton-example",
      type: "registry:example",
      title: "Skeleton",
      registryDependencies: ["skeleton"],
      files: [
        {
          path: "examples/skeleton-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "slider-example",
      type: "registry:example",
      title: "Slider",
      registryDependencies: ["slider"],
      files: [
        {
          path: "examples/slider-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "sonner-example",
      type: "registry:example",
      title: "Sonner",
      registryDependencies: ["sonner"],
      files: [
        {
          path: "examples/sonner-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "spinner-example",
      type: "registry:example",
      title: "Spinner",
      registryDependencies: ["spinner"],
      files: [
        {
          path: "examples/spinner-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "switch-example",
      type: "registry:example",
      title: "Switch",
      registryDependencies: ["switch"],
      files: [
        {
          path: "examples/switch-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "table-example",
      type: "registry:example",
      title: "Table",
      registryDependencies: ["table"],
      files: [
        {
          path: "examples/table-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "tabs-example",
      type: "registry:example",
      title: "Tabs",
      registryDependencies: ["tabs"],
      files: [
        {
          path: "examples/tabs-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "textarea-example",
      type: "registry:example",
      title: "Textarea",
      registryDependencies: ["textarea"],
      files: [
        {
          path: "examples/textarea-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "toggle-example",
      type: "registry:example",
      title: "Toggle",
      registryDependencies: ["toggle"],
      files: [
        {
          path: "examples/toggle-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "toggle-group-example",
      type: "registry:example",
      title: "Toggle Group",
      registryDependencies: ["toggle-group"],
      files: [
        {
          path: "examples/toggle-group-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "tooltip-example",
      type: "registry:example",
      title: "Tooltip",
      registryDependencies: ["tooltip"],
      files: [
        {
          path: "examples/tooltip-example.tsx",
          type: "registry:example",
        },
      ],
    },
    {
      name: "accordion",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/accordion.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "alert",
      type: "registry:ui",
      files: [
        {
          path: "ui/alert.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "alert-dialog",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      registryDependencies: ["button"],
      files: [
        {
          path: "ui/alert-dialog.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "aspect-ratio",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/aspect-ratio.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "avatar",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/avatar.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "badge",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/badge.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "breadcrumb",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/breadcrumb.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "button",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/button.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "button-group",
      type: "registry:ui",
      registryDependencies: ["button", "separator"],
      files: [
        {
          path: "ui/button-group.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "calendar",
      type: "registry:ui",
      dependencies: ["react-day-picker@latest", "date-fns"],
      registryDependencies: ["button"],
      files: [
        {
          path: "ui/calendar.tsx",
          type: "registry:ui",
        },
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
      ],
    },
    {
      name: "carousel",
      type: "registry:ui",
      dependencies: ["embla-carousel-react"],
      registryDependencies: ["button"],
      files: [
        {
          path: "ui/carousel.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "chart",
      type: "registry:ui",
      dependencies: ["recharts@2.15.4", "lucide-react"],
      registryDependencies: ["card"],
      files: [
        {
          path: "ui/chart.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "checkbox",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/checkbox.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "collapsible",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/collapsible.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "command",
      type: "registry:ui",
      dependencies: ["cmdk"],
      registryDependencies: ["dialog"],
      files: [
        {
          path: "ui/command.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "context-menu",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/context-menu.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "dialog",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/dialog.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "drawer",
      type: "registry:ui",
      dependencies: ["vaul", "radix-ui"],
      files: [
        {
          path: "ui/drawer.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "dropdown-menu",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/dropdown-menu.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "empty",
      type: "registry:ui",
      files: [
        {
          path: "ui/empty.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "field",
      type: "registry:ui",
      registryDependencies: ["label", "separator"],
      files: [
        {
          path: "ui/field.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "form",
      type: "registry:ui",
      dependencies: [
        "radix-ui",
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
      ],
    },
    {
      name: "hover-card",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/hover-card.tsx",
          type: "registry:ui",
        },
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
      ],
    },
    {
      name: "input-group",
      type: "registry:ui",
      registryDependencies: ["button", "input", "textarea"],
      files: [
        {
          path: "ui/input-group.tsx",
          type: "registry:ui",
        },
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
      ],
    },
    {
      name: "item",
      type: "registry:ui",
      registryDependencies: ["separator"],
      files: [
        {
          path: "ui/item.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "label",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/label.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "menubar",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/menubar.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "navigation-menu",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/navigation-menu.tsx",
          type: "registry:ui",
        },
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
      ],
    },
    {
      name: "popover",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/popover.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "progress",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/progress.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "radio-group",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/radio-group.tsx",
          type: "registry:ui",
        },
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
      ],
    },
    {
      name: "scroll-area",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/scroll-area.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "select",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/select.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "separator",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/separator.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "sheet",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/sheet.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "sidebar",
      type: "registry:ui",
      dependencies: ["radix-ui", "class-variance-authority", "lucide-react"],
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
      ],
    },
    {
      name: "slider",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/slider.tsx",
          type: "registry:ui",
        },
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
      ],
    },
    {
      name: "spinner",
      type: "registry:ui",
      dependencies: ["class-variance-authority"],
      files: [
        {
          path: "ui/spinner.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "switch",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/switch.tsx",
          type: "registry:ui",
        },
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
      ],
    },
    {
      name: "tabs",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/tabs.tsx",
          type: "registry:ui",
        },
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
      ],
    },
    {
      name: "toggle",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/toggle.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "toggle-group",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      registryDependencies: ["toggle"],
      files: [
        {
          path: "ui/toggle-group.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "tooltip",
      type: "registry:ui",
      dependencies: ["radix-ui"],
      files: [
        {
          path: "ui/tooltip.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "kbd",
      type: "registry:ui",
      files: [
        {
          path: "ui/kbd.tsx",
          type: "registry:ui",
        },
      ],
    },
    {
      name: "native-select",
      type: "registry:ui",
      files: [
        {
          path: "ui/native-select.tsx",
          type: "registry:ui",
        },
      ],
    },
  ],
}
