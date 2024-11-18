import { Registry } from "@/registry/schema"

export const sink: Registry = [
  {
    name: "_sink",
    type: "registry:block",
    registryDependencies: [
      // registry:ui
      "accordion",
      "alert",
      "alert-dialog",
      "aspect-ratio",
      "avatar",
      "badge",
      "breadcrumb",
      "button",
      "calendar",
      "card",
      "carousel",
      "chart",
      "checkbox",
      "collapsible",
      "command",
      "context-menu",
      "dialog",
      "drawer",
      "dropdown-menu",
      // "form",
      "hover-card",
      "input",
      "input-otp",
      "label",
      "menubar",
      "navigation-menu",
      "pagination",
      "popover",
      "progress",
      "radio-group",
      "resizable",
      "scroll-area",
      "select",
      "separator",
      "sheet",
      "sidebar",
      "skeleton",
      "slider",
      "sonner",
      "switch",
      "table",
      "tabs",
      "textarea",
      "toast",
      "toggle",
      "toggle-group",
      "tooltip",
    ],
    files: [
      {
        path: "block/_sink/page.tsx",
        type: "registry:page",
        target: "app/sink/page.tsx",
      },
      {
        path: "block/_sink/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/component-wrapper.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/nav-projects.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/nav-user.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/team-switcher.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/accordion-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/alert-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/alert-dialog-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/aspect-ratio-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/avatar-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/badge-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/breadcrumb-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/button-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/calendar-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/card-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/carousel-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/checkbox-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/collapsible-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/combobox-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/command-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/context-menu-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/date-picker-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/dialog-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/drawer-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/dropdown-menu-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/hover-card-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/input-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/input-otp-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/label-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/menubar-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/navigation-menu-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/pagination-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/popover-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/progress-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/radio-group-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/resizable-handle.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/scroll-area-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/select-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/separator-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/sheet-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/skeleton-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/slider-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/sonner-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/switch-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/table-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/tabs-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/textarea-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/toast-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/toggle-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/toggle-group-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/tooltip-demo.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/badge-destructive.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/badge-outline.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/badge-secondary.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/button-destructive.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/button-ghost.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/button-link.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/button-loading.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/button-outline.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/button-secondary.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/button-with-icon.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/toggle-disabled.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/toggle-outline.tsx",
        type: "registry:component",
      },
      {
        path: "block/_sink/components/toggle-with-text.tsx",
        type: "registry:component",
      },
    ],
  },
]
