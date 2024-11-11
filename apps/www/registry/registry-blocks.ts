import { Registry } from "@/registry/schema"

export const blocks: Registry = [
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
  {
    name: "sidebar-01",
    type: "registry:block",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "label",
      "dropdown-menu",
    ],
    files: [
      {
        path: "block/sidebar-01/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "block/sidebar-01/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-01/components/search-form.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-01/components/version-switcher.tsx",
        type: "registry:component",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "sidebar-02",
    type: "registry:block",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "label",
      "dropdown-menu",
    ],
    files: [
      {
        path: "block/sidebar-02/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "block/sidebar-02/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-02/components/search-form.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-02/components/version-switcher.tsx",
        type: "registry:component",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "sidebar-03",
    type: "registry:block",
    registryDependencies: ["sidebar", "breadcrumb"],
    files: [
      {
        path: "block/sidebar-03/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "block/sidebar-03/components/app-sidebar.tsx",
        type: "registry:component",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "sidebar-04",
    type: "registry:block",
    registryDependencies: ["sidebar", "breadcrumb", "separator"],
    files: [
      {
        path: "block/sidebar-04/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "block/sidebar-04/components/app-sidebar.tsx",
        type: "registry:component",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "sidebar-05",
    type: "registry:block",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "label",
      "collapsible",
    ],
    files: [
      {
        path: "block/sidebar-05/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "block/sidebar-05/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-05/components/search-form.tsx",
        type: "registry:component",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "sidebar-06",
    type: "registry:block",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "card",
      "dropdown-menu",
    ],
    files: [
      {
        path: "block/sidebar-06/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "block/sidebar-06/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-06/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-06/components/sidebar-opt-in-form.tsx",
        type: "registry:component",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "sidebar-07",
    type: "registry:block",
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
        path: "block/sidebar-07/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "block/sidebar-07/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-07/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-07/components/nav-projects.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-07/components/nav-user.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-07/components/team-switcher.tsx",
        type: "registry:component",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "sidebar-08",
    type: "registry:block",
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
        path: "block/sidebar-08/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "block/sidebar-08/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-08/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-08/components/nav-projects.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-08/components/nav-secondary.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-08/components/nav-user.tsx",
        type: "registry:component",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "sidebar-09",
    type: "registry:block",
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
        path: "block/sidebar-09/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "block/sidebar-09/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-09/components/nav-user.tsx",
        type: "registry:component",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "sidebar-10",
    type: "registry:block",
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
        path: "block/sidebar-10/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "block/sidebar-10/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-10/components/nav-actions.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-10/components/nav-favorites.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-10/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-10/components/nav-secondary.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-10/components/nav-workspaces.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-10/components/team-switcher.tsx",
        type: "registry:component",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "sidebar-11",
    type: "registry:block",
    registryDependencies: ["sidebar", "breadcrumb", "separator", "collapsible"],
    files: [
      {
        path: "block/sidebar-11/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "block/sidebar-11/components/app-sidebar.tsx",
        type: "registry:component",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "sidebar-12",
    type: "registry:block",
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
        path: "block/sidebar-12/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "block/sidebar-12/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-12/components/calendars.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-12/components/date-picker.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-12/components/nav-user.tsx",
        type: "registry:component",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "sidebar-13",
    type: "registry:block",
    registryDependencies: ["sidebar", "breadcrumb", "button", "dialog"],
    files: [
      {
        path: "block/sidebar-13/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "block/sidebar-13/components/settings-dialog.tsx",
        type: "registry:component",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "sidebar-14",
    type: "registry:block",
    registryDependencies: ["sidebar", "breadcrumb"],
    files: [
      {
        path: "block/sidebar-14/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "block/sidebar-14/components/app-sidebar.tsx",
        type: "registry:component",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "sidebar-15",
    type: "registry:block",
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
        path: "block/sidebar-15/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "block/sidebar-15/components/calendars.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-15/components/date-picker.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-15/components/nav-favorites.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-15/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-15/components/nav-secondary.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-15/components/nav-user.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-15/components/nav-workspaces.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-15/components/sidebar-left.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-15/components/sidebar-right.tsx",
        type: "registry:component",
      },
      {
        path: "block/sidebar-15/components/team-switcher.tsx",
        type: "registry:component",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "login-01",
    type: "registry:block",
    registryDependencies: ["button", "card", "input", "label"],
    files: [
      {
        path: "block/login-01/page.tsx",
        target: "app/login/page.tsx",
        type: "registry:page",
      },
      {
        path: "block/login-01/components/login-form.tsx",
        type: "registry:component",
      },
    ],
    category: "Authentication",
    subcategory: "Login",
  },
]
