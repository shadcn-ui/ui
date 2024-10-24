import { Registry } from "@/registry/schema"

export const blocks: Registry = [
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
