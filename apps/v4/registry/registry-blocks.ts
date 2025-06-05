import { type Registry } from "shadcn/registry"

export const blocks: Registry["items"] = [
  {
    name: "dashboard-01",
    type: "registry:block",
    description: "A dashboard with sidebar, charts and data table.",
    dependencies: [
      "@dnd-kit/core",
      "@dnd-kit/modifiers",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
      "@tanstack/react-table",
      "zod",
    ],
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "label",
      "chart",
      "card",
      "select",
      "tabs",
      "table",
      "toggle-group",
      "badge",
      "button",
      "checkbox",
      "dropdown-menu",
      "drawer",
      "input",
      "avatar",
      "sheet",
      "sonner",
    ],
    files: [
      {
        path: "blocks/dashboard-01/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "blocks/dashboard-01/data.json",
        type: "registry:file",
        target: "app/dashboard/data.json",
      },
      {
        path: "blocks/dashboard-01/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/dashboard-01/components/chart-area-interactive.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/dashboard-01/components/data-table.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/dashboard-01/components/nav-documents.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/dashboard-01/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/dashboard-01/components/nav-secondary.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/dashboard-01/components/nav-user.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/dashboard-01/components/section-cards.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/dashboard-01/components/site-header.tsx",
        type: "registry:component",
      },
    ],
    categories: ["dashboard"],
    meta: {
      iframeHeight: "1000px",
    },
  },
  {
    name: "sidebar-01",
    type: "registry:block",
    description: "A simple sidebar with navigation grouped by section.",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "label",
      "dropdown-menu",
    ],
    files: [
      {
        path: "blocks/sidebar-01/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "blocks/sidebar-01/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-01/components/search-form.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-01/components/version-switcher.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-02",
    description: "A sidebar with collapsible sections.",
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
        path: "blocks/sidebar-02/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "blocks/sidebar-02/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-02/components/search-form.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-02/components/version-switcher.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-03",
    description: "A sidebar with submenus.",
    type: "registry:block",
    registryDependencies: ["sidebar", "breadcrumb"],
    files: [
      {
        path: "blocks/sidebar-03/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "blocks/sidebar-03/components/app-sidebar.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-04",
    description: "A floating sidebar with submenus.",
    type: "registry:block",
    registryDependencies: ["sidebar", "breadcrumb", "separator"],
    files: [
      {
        path: "blocks/sidebar-04/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "blocks/sidebar-04/components/app-sidebar.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-05",
    description: "A sidebar with collapsible submenus.",
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
        path: "blocks/sidebar-05/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "blocks/sidebar-05/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-05/components/search-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-06",
    description: "A sidebar with submenus as dropdowns.",
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
        path: "blocks/sidebar-06/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "blocks/sidebar-06/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-06/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-06/components/sidebar-opt-in-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-07",
    type: "registry:block",
    description: "A sidebar that collapses to icons.",
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
        path: "blocks/sidebar-07/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "blocks/sidebar-07/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-07/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-07/components/nav-projects.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-07/components/nav-user.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-07/components/team-switcher.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-08",
    description: "An inset sidebar with secondary navigation.",
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
        path: "blocks/sidebar-08/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "blocks/sidebar-08/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-08/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-08/components/nav-projects.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-08/components/nav-secondary.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-08/components/nav-user.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-09",
    description: "Collapsible nested sidebars.",
    type: "registry:block",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "collapsible",
      "dropdown-menu",
      "avatar",
      "switch",
      "label",
    ],
    files: [
      {
        path: "blocks/sidebar-09/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "blocks/sidebar-09/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-09/components/nav-user.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-10",
    description: "A sidebar in a popover.",
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
        path: "blocks/sidebar-10/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "blocks/sidebar-10/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-10/components/nav-actions.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-10/components/nav-favorites.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-10/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-10/components/nav-secondary.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-10/components/nav-workspaces.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-10/components/team-switcher.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-11",
    description: "A sidebar with a collapsible file tree.",
    type: "registry:block",
    registryDependencies: ["sidebar", "breadcrumb", "separator", "collapsible"],
    files: [
      {
        path: "blocks/sidebar-11/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "blocks/sidebar-11/components/app-sidebar.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-12",
    description: "A sidebar with a calendar.",
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
        path: "blocks/sidebar-12/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "blocks/sidebar-12/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-12/components/calendars.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-12/components/date-picker.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-12/components/nav-user.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-13",
    description: "A sidebar in a dialog.",
    type: "registry:block",
    registryDependencies: ["sidebar", "breadcrumb", "button", "dialog"],
    files: [
      {
        path: "blocks/sidebar-13/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "blocks/sidebar-13/components/settings-dialog.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-14",
    description: "A sidebar on the right.",
    type: "registry:block",
    registryDependencies: ["sidebar", "breadcrumb"],
    files: [
      {
        path: "blocks/sidebar-14/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "blocks/sidebar-14/components/app-sidebar.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-15",
    description: "A left and right sidebar.",
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
        path: "blocks/sidebar-15/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "blocks/sidebar-15/components/calendars.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-15/components/date-picker.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-15/components/nav-favorites.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-15/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-15/components/nav-secondary.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-15/components/nav-user.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-15/components/nav-workspaces.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-15/components/sidebar-left.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-15/components/sidebar-right.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-15/components/team-switcher.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-16",
    description: "A sidebar with a sticky site header.",
    type: "registry:block",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "collapsible",
      "dropdown-menu",
      "avatar",
      "button",
      "label",
    ],
    files: [
      {
        path: "blocks/sidebar-16/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "blocks/sidebar-16/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-16/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-16/components/nav-projects.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-16/components/nav-secondary.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-16/components/nav-user.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-16/components/search-form.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/sidebar-16/components/site-header.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "login-01",
    description: "A simple login form.",
    type: "registry:block",
    registryDependencies: ["button", "card", "input", "label"],
    files: [
      {
        path: "blocks/login-01/page.tsx",
        target: "app/login/page.tsx",
        type: "registry:page",
      },
      {
        path: "blocks/login-01/components/login-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["authentication", "login"],
  },
  {
    name: "login-02",
    description: "A two column login page with a cover image.",
    type: "registry:block",
    registryDependencies: ["button", "card", "input", "label"],
    files: [
      {
        path: "blocks/login-02/page.tsx",
        target: "app/login/page.tsx",
        type: "registry:page",
      },
      {
        path: "blocks/login-02/components/login-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["authentication", "login"],
  },
  {
    name: "login-03",
    description: "A login page with a muted background color.",
    type: "registry:block",
    registryDependencies: ["button", "card", "input", "label"],
    files: [
      {
        path: "blocks/login-03/page.tsx",
        target: "app/login/page.tsx",
        type: "registry:page",
      },
      {
        path: "blocks/login-03/components/login-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["authentication", "login"],
  },
  {
    name: "login-04",
    description: "A login page with form and image.",
    type: "registry:block",
    registryDependencies: ["button", "card", "input", "label"],
    files: [
      {
        path: "blocks/login-04/page.tsx",
        target: "app/login/page.tsx",
        type: "registry:page",
      },
      {
        path: "blocks/login-04/components/login-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["authentication", "login"],
  },
  {
    name: "login-05",
    description: "A simple email-only login page.",
    type: "registry:block",
    registryDependencies: ["button", "card", "input", "label"],
    files: [
      {
        path: "blocks/login-05/page.tsx",
        target: "app/login/page.tsx",
        type: "registry:page",
      },
      {
        path: "blocks/login-05/components/login-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["authentication", "login"],
  },
  {
    name: "calendar-01",
    description: "A simple calendar.",
    type: "registry:block",
    registryDependencies: ["calendar"],
    files: [
      {
        path: "blocks/calendar-01.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-4 py-12 items-start md:py-20 justify-center min-w-0",
      mobile: "component",
    },
  },
  {
    name: "calendar-02",
    description: "Multiple months with single selection.",
    type: "registry:block",
    registryDependencies: ["calendar"],
    files: [
      {
        path: "blocks/calendar-02.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-4 py-12 items-start md:py-20 justify-center min-w-0",
      mobile: "component",
    },
  },
  {
    name: "calendar-03",
    description: "Multiple months with multiple selection.",
    type: "registry:block",
    registryDependencies: ["calendar"],
    files: [
      {
        path: "blocks/calendar-03.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-4 py-12 items-start md:py-20 justify-center min-w-0",
      mobile: "component",
    },
  },
  {
    name: "calendar-04",
    description: "Single month with range selection",
    type: "registry:block",
    registryDependencies: ["calendar"],
    files: [
      {
        path: "blocks/calendar-04.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-4 py-12 items-start md:py-20 justify-center min-w-0 xl:pt-28",
      mobile: "component",
    },
  },
  {
    name: "calendar-05",
    description: "Multiple months with range selection",
    type: "registry:block",
    registryDependencies: ["calendar"],
    files: [
      {
        path: "blocks/calendar-05.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start md:pt-20 justify-center min-w-0 xl:py-24",
      mobile: "component",
    },
  },
  {
    name: "calendar-06",
    description: "Range selection with minimum days",
    type: "registry:block",
    registryDependencies: ["calendar"],
    files: [
      {
        path: "blocks/calendar-06.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start md:pt-20 justify-center min-w-0 xl:py-24",
      mobile: "component",
    },
  },
  {
    name: "calendar-07",
    description: "Range selection with minimum and maximum days",
    type: "registry:block",
    registryDependencies: ["calendar"],
    files: [
      {
        path: "blocks/calendar-07.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start md:pt-20 justify-center min-w-0 xl:py-24",
      mobile: "component",
    },
  },
  {
    name: "calendar-08",
    description: "Calendar with disabled days",
    type: "registry:block",
    registryDependencies: ["calendar"],
    files: [
      {
        path: "blocks/calendar-08.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start md:pt-20 justify-center min-w-0 xl:py-24",
      mobile: "component",
    },
  },
  {
    name: "calendar-09",
    description: "Calendar with disabled weekends",
    type: "registry:block",
    registryDependencies: ["calendar"],
    files: [
      {
        path: "blocks/calendar-09.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start md:pt-20 justify-center min-w-0 xl:py-24",
      mobile: "component",
    },
  },
  {
    name: "calendar-10",
    description: "Today button",
    type: "registry:block",
    registryDependencies: ["calendar", "card", "button"],
    files: [
      {
        path: "blocks/calendar-10.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start md:pt-20 justify-center min-w-0 xl:py-24",
      mobile: "component",
    },
  },
  {
    name: "calendar-11",
    description: "Start and end of month",
    type: "registry:block",
    registryDependencies: ["calendar"],
    files: [
      {
        path: "blocks/calendar-11.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start md:pt-20 justify-center min-w-0 xl:py-24",
      mobile: "component",
    },
  },
  {
    name: "calendar-12",
    description: "Localized calendar",
    type: "registry:block",
    registryDependencies: ["calendar", "card", "select"],
    files: [
      {
        path: "blocks/calendar-12.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start md:pt-20 justify-center min-w-0 xl:py-24",
      mobile: "component",
    },
  },
  {
    name: "calendar-13",
    description: "With Month and Year Dropdown",
    type: "registry:block",
    registryDependencies: ["calendar", "label", "select"],
    files: [
      {
        path: "blocks/calendar-13.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start md:pt-20 justify-center min-w-0 xl:py-24",
      mobile: "component",
    },
  },
  {
    name: "calendar-14",
    description: "With Booked/Unavailable Days",
    type: "registry:block",
    registryDependencies: ["calendar"],
    files: [
      {
        path: "blocks/calendar-14.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start md:pt-20 justify-center min-w-0 xl:py-24",
      mobile: "component",
    },
  },
  {
    name: "calendar-15",
    description: "With Week Numbers",
    type: "registry:block",
    registryDependencies: ["calendar"],
    files: [
      {
        path: "blocks/calendar-15.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start md:pt-20 justify-center min-w-0 xl:py-24",
      mobile: "component",
    },
  },
  {
    name: "calendar-16",
    description: "With time picker",
    type: "registry:block",
    registryDependencies: ["calendar", "card", "input", "label"],
    files: [
      {
        path: "blocks/calendar-16.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start justify-center min-w-0",
      mobile: "component",
    },
  },
  {
    name: "calendar-17",
    description: "With time picker inline",
    type: "registry:block",
    registryDependencies: ["calendar", "card", "input", "label"],
    files: [
      {
        path: "blocks/calendar-17.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start md:pt-20 justify-center min-w-0 xl:py-24",
      mobile: "component",
    },
  },
  {
    name: "calendar-18",
    description: "Variable size",
    type: "registry:block",
    registryDependencies: ["calendar"],
    files: [
      {
        path: "blocks/calendar-18.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start md:pt-20 justify-center min-w-0 xl:py-24",
      mobile: "component",
    },
  },
  {
    name: "calendar-19",
    description: "With presets",
    type: "registry:block",
    dependencies: ["date-fns"],
    registryDependencies: ["calendar", "card", "input", "label"],
    files: [
      {
        path: "blocks/calendar-19.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start justify-center min-w-0",
      mobile: "component",
    },
  },
  {
    name: "calendar-20",
    description: "With time presets",
    type: "registry:block",
    registryDependencies: ["calendar", "card", "button"],
    files: [
      {
        path: "blocks/calendar-20.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start justify-center min-w-0",
      mobile: "component",
    },
  },
  {
    name: "calendar-21",
    description: "Custom days and formatters",
    type: "registry:block",
    registryDependencies: ["calendar"],
    files: [
      {
        path: "blocks/calendar-21.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start justify-center min-w-0",
      mobile: "component",
    },
  },
  {
    name: "calendar-22",
    description: "Date picker",
    type: "registry:block",
    registryDependencies: ["calendar", "popover", "button", "label"],
    files: [
      {
        path: "blocks/calendar-22.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start md:pt-20 justify-center min-w-0 xl:py-24",
      mobile: "component",
    },
  },
  {
    name: "calendar-23",
    description: "Date range picker",
    type: "registry:block",
    registryDependencies: ["calendar", "popover", "button", "label"],
    files: [
      {
        path: "blocks/calendar-23.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start md:pt-20 justify-center min-w-0 xl:py-24",
      mobile: "component",
    },
  },
  {
    name: "calendar-24",
    description: "Date and Time picker",
    type: "registry:block",
    registryDependencies: ["calendar", "popover", "button", "label"],
    files: [
      {
        path: "blocks/calendar-24.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start md:pt-20 justify-center min-w-0 xl:py-24",
      mobile: "component",
    },
  },
  {
    name: "calendar-25",
    description: "Date and Time range picker",
    type: "registry:block",
    registryDependencies: ["calendar", "popover", "button", "label"],
    files: [
      {
        path: "blocks/calendar-25.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start md:pt-20 justify-center min-w-0 xl:py-24",
      mobile: "component",
    },
  },
  {
    name: "calendar-26",
    description: "Date range picker with time",
    type: "registry:block",
    registryDependencies: ["calendar", "popover", "button", "input", "label"],
    files: [
      {
        path: "blocks/calendar-26.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start md:pt-20 justify-center min-w-0 xl:py-24",
      mobile: "component",
    },
  },
  {
    name: "calendar-27",
    description: "Chart filter",
    type: "registry:block",
    registryDependencies: ["calendar", "chart", "card", "popover", "button"],
    files: [
      {
        path: "blocks/calendar-27.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start justify-center min-w-0",
      mobile: "component",
    },
  },
  {
    name: "calendar-28",
    description: "Input with date picker",
    type: "registry:block",
    registryDependencies: ["calendar", "input", "label", "popover", "button"],
    files: [
      {
        path: "blocks/calendar-28.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start md:pt-20 justify-center min-w-0 xl:py-24",
      mobile: "component",
    },
  },
  {
    name: "calendar-29",
    description: "Natural language date picker",
    type: "registry:block",
    dependencies: ["chrono-node"],
    registryDependencies: ["calendar", "input", "label", "popover", "button"],
    files: [
      {
        path: "blocks/calendar-29.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start md:pt-20 justify-center min-w-0 xl:py-24",
      mobile: "component",
    },
  },
  {
    name: "calendar-30",
    description: "With little-date",
    type: "registry:block",
    registryDependencies: ["calendar", "input", "label", "popover", "button"],
    files: [
      {
        path: "blocks/calendar-30.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start md:pt-20 justify-center min-w-0 xl:py-24",
      mobile: "component",
    },
  },
  {
    name: "calendar-31",
    description: "With event slots",
    type: "registry:block",
    registryDependencies: ["calendar", "card", "button"],
    files: [
      {
        path: "blocks/calendar-31.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "700px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start md:pt-20 justify-center min-w-0",
      mobile: "component",
    },
  },
  {
    name: "calendar-32",
    description: "Date picker in a drawer",
    type: "registry:block",
    registryDependencies: ["calendar", "button", "drawer"],
    files: [
      {
        path: "blocks/calendar-32.tsx",
        type: "registry:component",
      },
    ],
    categories: ["calendar", "date"],
    meta: {
      iframeHeight: "600px",
      container:
        "w-full bg-surface min-h-svh flex px-6 py-12 items-start md:pt-20 justify-center min-w-0 xl:py-24",
      mobile: "component",
    },
  },
]
