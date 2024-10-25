import { Registry } from "@/registry/schema"

// v0-compatible blocks
export const v0: Registry = [
  {
    name: "v0-sidebar-01",
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
        path: "v0/sidebar-01.tsx",
        type: "registry:component",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "v0-sidebar-02",
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
        path: "v0/sidebar-02.tsx",
        type: "registry:block",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "v0-sidebar-03",
    type: "registry:block",
    registryDependencies: ["sidebar", "breadcrumb"],
    files: [
      {
        path: "v0/sidebar-03.tsx",
        type: "registry:block",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "v0-sidebar-04",
    type: "registry:block",
    registryDependencies: ["sidebar", "breadcrumb", "separator"],
    files: [
      {
        path: "v0/sidebar-04.tsx",
        type: "registry:block",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "v0-sidebar-05",
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
        path: "v0/sidebar-05.tsx",
        type: "registry:block",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "v0-sidebar-06",
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
        path: "v0/sidebar-06.tsx",
        type: "registry:block",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "v0-sidebar-07",
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
        path: "v0/sidebar-07.tsx",
        type: "registry:block",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "v0-sidebar-08",
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
        path: "v0/sidebar-08.tsx",
        type: "registry:block",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "v0-sidebar-09",
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
        path: "v0/sidebar-09.tsx",
        type: "registry:block",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "v0-sidebar-10",
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
        path: "v0/sidebar-10.tsx",
        type: "registry:block",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "v0-sidebar-11",
    type: "registry:block",
    registryDependencies: ["sidebar", "breadcrumb", "separator", "collapsible"],
    files: [
      {
        path: "v0/sidebar-11.tsx",
        type: "registry:block",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "v0-sidebar-12",
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
        path: "v0/sidebar-12.tsx",
        type: "registry:block",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "v0-sidebar-13",
    type: "registry:block",
    registryDependencies: ["sidebar", "breadcrumb", "button", "dialog"],
    files: [
      {
        path: "v0/sidebar-13.tsx",
        type: "registry:block",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "v0-sidebar-14",
    type: "registry:block",
    registryDependencies: ["sidebar", "breadcrumb"],
    files: [
      {
        path: "v0/sidebar-14.tsx",
        type: "registry:block",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "v0-sidebar-15",
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
        path: "v0/sidebar-15.tsx",
        type: "registry:block",
      },
    ],
    category: "Application",
    subcategory: "Sidebars",
  },
  {
    name: "v0-login-01",
    type: "registry:block",
    registryDependencies: ["button", "card", "input", "label"],
    files: [
      {
        path: "v0/login-01.tsx",
        type: "registry:block",
      },
    ],
    category: "Authentication",
    subcategory: "Login",
  },
]
