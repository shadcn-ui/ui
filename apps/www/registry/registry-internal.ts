import { type Registry } from "shadcn/registry"

export const internal: Registry["items"] = [
  {
    name: "sink",
    type: "registry:internal",
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
        path: "internal/sink/page.tsx",
        type: "registry:page",
        target: "app/sink/page.tsx",
      },
      {
        path: "internal/sink/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/component-wrapper.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/nav-projects.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/nav-user.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/team-switcher.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/accordion-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/alert-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/alert-dialog-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/aspect-ratio-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/avatar-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/badge-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/breadcrumb-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/button-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/calendar-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/card-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/carousel-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/checkbox-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/collapsible-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/combobox-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/command-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/context-menu-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/date-picker-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/dialog-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/drawer-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/dropdown-menu-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/hover-card-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/input-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/input-otp-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/label-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/menubar-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/navigation-menu-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/pagination-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/popover-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/progress-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/radio-group-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/resizable-handle.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/scroll-area-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/select-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/separator-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/sheet-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/skeleton-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/slider-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/sonner-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/switch-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/table-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/tabs-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/textarea-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/toast-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/toggle-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/toggle-group-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/tooltip-demo.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/badge-destructive.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/badge-outline.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/badge-secondary.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/button-destructive.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/button-ghost.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/button-link.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/button-loading.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/button-outline.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/button-secondary.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/button-with-icon.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/toggle-disabled.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/toggle-outline.tsx",
        type: "registry:component",
      },
      {
        path: "internal/sink/components/toggle-with-text.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "sidebar-demo",
    type: "registry:internal",
    files: [
      {
        path: "internal/sidebar-demo.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "sidebar-header",
    type: "registry:internal",
    files: [
      {
        path: "internal/sidebar-header.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "sidebar-footer",
    type: "registry:internal",
    files: [
      {
        path: "internal/sidebar-footer.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "sidebar-group",
    type: "registry:internal",
    files: [
      {
        path: "internal/sidebar-group.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "sidebar-group-collapsible",
    type: "registry:internal",
    files: [
      {
        path: "internal/sidebar-group-collapsible.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "sidebar-group-action",
    type: "registry:internal",
    files: [
      {
        path: "internal/sidebar-group-action.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "sidebar-menu",
    type: "registry:internal",
    files: [
      {
        path: "internal/sidebar-menu.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "sidebar-menu-action",
    type: "registry:internal",
    files: [
      {
        path: "internal/sidebar-menu-action.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "sidebar-menu-sub",
    type: "registry:internal",
    files: [
      {
        path: "internal/sidebar-menu-sub.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "sidebar-menu-collapsible",
    type: "registry:internal",
    files: [
      {
        path: "internal/sidebar-menu-collapsible.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "sidebar-menu-badge",
    type: "registry:internal",
    files: [
      {
        path: "internal/sidebar-menu-badge.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "sidebar-rsc",
    type: "registry:internal",
    files: [
      {
        path: "internal/sidebar-rsc.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "sidebar-controlled",
    type: "registry:internal",
    files: [
      {
        path: "internal/sidebar-controlled.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "v0-sidebar-01",
    type: "registry:internal",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "label",
      "dropdown-menu",
    ],
    files: [
      {
        path: "internal/sidebar-01.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "v0-sidebar-02",
    type: "registry:internal",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "label",
      "dropdown-menu",
    ],
    files: [
      {
        path: "internal/sidebar-02.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "v0-sidebar-03",
    type: "registry:internal",
    registryDependencies: ["sidebar", "breadcrumb"],
    files: [
      {
        path: "internal/sidebar-03.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "v0-sidebar-04",
    type: "registry:internal",
    registryDependencies: ["sidebar", "breadcrumb", "separator"],
    files: [
      {
        path: "internal/sidebar-04.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "v0-sidebar-05",
    type: "registry:internal",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "label",
      "collapsible",
    ],
    files: [
      {
        path: "internal/sidebar-05.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "v0-sidebar-06",
    type: "registry:internal",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "card",
      "dropdown-menu",
    ],
    files: [
      {
        path: "internal/sidebar-06.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "v0-sidebar-07",
    type: "registry:internal",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "collapsible",
      "dropdown-menu",
      "avatar",
    ],
    files: [
      {
        path: "internal/sidebar-07.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "v0-sidebar-08",
    type: "registry:internal",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "collapsible",
      "dropdown-menu",
      "avatar",
    ],
    files: [
      {
        path: "internal/sidebar-08.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "v0-sidebar-09",
    type: "registry:internal",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "collapsible",
      "dropdown-menu",
      "avatar",
      "switch",
    ],
    files: [
      {
        path: "internal/sidebar-09.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "v0-sidebar-10",
    type: "registry:internal",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "popover",
      "collapsible",
      "dropdown-menu",
    ],
    files: [
      {
        path: "internal/sidebar-10.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "v0-sidebar-11",
    type: "registry:internal",
    registryDependencies: ["sidebar", "breadcrumb", "separator", "collapsible"],
    files: [
      {
        path: "internal/sidebar-11.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "v0-sidebar-12",
    type: "registry:internal",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "collapsible",
      "calendar",
      "dropdown-menu",
      "avatar",
    ],
    files: [
      {
        path: "internal/sidebar-12.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "v0-sidebar-13",
    type: "registry:internal",
    registryDependencies: ["sidebar", "breadcrumb", "button", "dialog"],
    files: [
      {
        path: "internal/sidebar-13.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "v0-sidebar-14",
    type: "registry:internal",
    registryDependencies: ["sidebar", "breadcrumb"],
    files: [
      {
        path: "internal/sidebar-14.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "v0-sidebar-15",
    type: "registry:internal",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "popover",
      "collapsible",
      "dropdown-menu",
      "calendar",
      "avatar",
    ],
    files: [
      {
        path: "internal/sidebar-15.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "v0-login-01",
    type: "registry:internal",
    registryDependencies: ["button", "card", "input", "label"],
    files: [
      {
        path: "internal/login-01.tsx",
        type: "registry:internal",
      },
    ],
  },
]
