import { type Registry } from "shadcn/schema"

export const ui: Registry["items"] = [
  {
    name: "accordion",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/accordion/accordion-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/accordion/accordion-item.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/accordion/accordion-trigger.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/accordion/accordion.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/accordion/index.ts",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/accordion",
      },
    },
  },
  {
    name: "alert",
    type: "registry:ui",
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/alert/alert-action.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/alert/alert-description.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/alert/alert-title.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/alert/alert.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/alert/index.ts",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/alert",
      },
    },
  },
  {
    name: "alert-dialog",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: [
      "button",
      "utils",
    ],
    files: [
      {
        path: "ui/alert-dialog/alert-dialog-action.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/alert-dialog/alert-dialog-cancel.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/alert-dialog/alert-dialog-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/alert-dialog/alert-dialog-description.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/alert-dialog/alert-dialog-footer.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/alert-dialog/alert-dialog-header.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/alert-dialog/alert-dialog-media.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/alert-dialog/alert-dialog-overlay.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/alert-dialog/alert-dialog-portal.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/alert-dialog/alert-dialog-title.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/alert-dialog/alert-dialog-trigger.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/alert-dialog/alert-dialog.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/alert-dialog/index.ts",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/alert-dialog",
      },
    },
  },
  {
    name: "aspect-ratio",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    files: [
      {
        path: "ui/aspect-ratio/aspect-ratio.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/aspect-ratio/index.ts",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/aspect-ratio",
      },
    },
  },
  {
    name: "avatar",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/avatar/avatar-badge.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/avatar/avatar-fallback.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/avatar/avatar-group-count.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/avatar/avatar-group.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/avatar/avatar-image.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/avatar/avatar.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/avatar/index.ts",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/avatar",
      },
    },
  },
  {
    name: "badge",
    type: "registry:ui",
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/badge/badge.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/badge/index.ts",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/badge",
      },
    },
  },
  {
    name: "breadcrumb",
    type: "registry:ui",
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/breadcrumb/breadcrumb-ellipsis.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/breadcrumb/breadcrumb-item.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/breadcrumb/breadcrumb-link.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/breadcrumb/breadcrumb-list.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/breadcrumb/breadcrumb-page.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/breadcrumb/breadcrumb-separator.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/breadcrumb/breadcrumb.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/breadcrumb/index.ts",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/breadcrumb",
      },
    },
  },
  {
    name: "button",
    type: "registry:ui",
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/button/button.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/button/index.ts",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/button",
      },
    },
  },
  {
    name: "button-group",
    type: "registry:ui",
    registryDependencies: [
      "separator",
      "utils",
    ],
    files: [
      {
        path: "ui/button-group/button-group-separator.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/button-group/button-group-text.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/button-group/button-group.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/button-group/index.ts",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/button-group",
      },
    },
  },
  {
    name: "calendar",
    type: "registry:ui",
    dependencies: [
      "@internationalized/date",
      "bits-ui",
    ],
    registryDependencies: [
      "button",
      "utils",
    ],
    files: [
      {
        path: "ui/calendar/calendar-caption.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/calendar-cell.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/calendar-day.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/calendar-grid-body.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/calendar-grid-head.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/calendar-grid-row.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/calendar-grid.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/calendar-head-cell.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/calendar-header.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/calendar-heading.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/calendar-month-select.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/calendar-month.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/calendar-months.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/calendar-nav.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/calendar-next-button.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/calendar-prev-button.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/calendar-year-select.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/calendar.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/calendar/index.ts",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/calendar",
      },
    },
  },
  {
    name: "card",
    type: "registry:ui",
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/card/card-action.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/card/card-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/card/card-description.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/card/card-footer.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/card/card-header.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/card/card-title.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/card/card.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/card/index.ts",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/card",
      },
    },
  },
  {
    name: "carousel",
    type: "registry:ui",
    dependencies: [
      "bits-ui",
      "embla-carousel-svelte",
    ],
    registryDependencies: [
      "button",
      "utils",
    ],
    files: [
      {
        path: "ui/carousel/carousel-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/carousel/carousel-item.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/carousel/carousel-next.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/carousel/carousel-previous.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/carousel/carousel.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/carousel/context.ts",
        type: "registry:ui",
      },
      {
        path: "ui/carousel/index.ts",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/carousel",
      },
    },
  },
  {
    name: "chart",
    type: "registry:ui",
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/chart/chart-container.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/chart/chart-style.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/chart/chart-tooltip.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/chart/chart-utils.ts",
        type: "registry:ui",
      },
      {
        path: "ui/chart/index.ts",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/chart",
      },
    },
  },
  {
    name: "checkbox",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/checkbox/checkbox.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/checkbox/index.ts",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/checkbox",
      },
    },
  },
  {
    name: "collapsible",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    files: [
      {
        path: "ui/collapsible/collapsible-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/collapsible/collapsible-trigger.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/collapsible/collapsible.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/collapsible/index.ts",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/collapsible",
      },
    },
  },
  {
    name: "command",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: [
      "dialog",
      "input-group",
      "utils",
    ],
    files: [
      {
        path: "ui/command/command-dialog.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/command/command-empty.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/command/command-group.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/command/command-input.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/command/command-item.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/command/command-link-item.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/command/command-list.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/command/command-loading.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/command/command-separator.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/command/command-shortcut.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/command/command.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/command/index.ts",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/command",
      },
    },
  },
  {
    name: "context-menu",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/context-menu/context-menu-checkbox-item.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/context-menu-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/context-menu-group-heading.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/context-menu-group.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/context-menu-item.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/context-menu-label.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/context-menu-portal.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/context-menu-radio-group.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/context-menu-radio-item.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/context-menu-separator.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/context-menu-shortcut.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/context-menu-sub-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/context-menu-sub-trigger.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/context-menu-sub.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/context-menu-trigger.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/context-menu.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/context-menu/index.ts",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/context-menu",
      },
    },
  },
  {
    name: "dialog",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: [
      "button",
      "utils",
    ],
    files: [
      {
        path: "ui/dialog/dialog-close.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dialog/dialog-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dialog/dialog-description.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dialog/dialog-footer.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dialog/dialog-header.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dialog/dialog-overlay.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dialog/dialog-portal.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dialog/dialog-title.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dialog/dialog-trigger.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dialog/dialog.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dialog/index.ts",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/dialog",
      },
    },
  },
  {
    name: "drawer",
    type: "registry:ui",
    dependencies: ["vaul-svelte"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/drawer/drawer-close.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/drawer/drawer-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/drawer/drawer-description.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/drawer/drawer-footer.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/drawer/drawer-header.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/drawer/drawer-nested.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/drawer/drawer-overlay.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/drawer/drawer-portal.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/drawer/drawer-title.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/drawer/drawer-trigger.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/drawer/drawer.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/drawer/index.ts",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/drawer",
      },
    },
  },
  {
    name: "dropdown-menu",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/dropdown-menu/dropdown-menu-checkbox-group.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/dropdown-menu-checkbox-item.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/dropdown-menu-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/dropdown-menu-group-heading.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/dropdown-menu-group.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/dropdown-menu-item.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/dropdown-menu-label.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/dropdown-menu-portal.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/dropdown-menu-radio-group.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/dropdown-menu-radio-item.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/dropdown-menu-separator.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/dropdown-menu-shortcut.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/dropdown-menu-sub-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/dropdown-menu-sub-trigger.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/dropdown-menu-sub.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/dropdown-menu-trigger.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/dropdown-menu.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/dropdown-menu/index.ts",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/dropdown-menu",
      },
    },
  },
  {
    name: "empty",
    type: "registry:ui",
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/empty/empty-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/empty/empty-description.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/empty/empty-header.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/empty/empty-media.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/empty/empty-title.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/empty/empty.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/empty/index.ts",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/empty",
      },
    },
  },
  {
    name: "field",
    type: "registry:ui",
    registryDependencies: [
      "label",
      "separator",
      "utils",
    ],
    files: [
      {
        path: "ui/field/field-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/field/field-description.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/field/field-error.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/field/field-group.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/field/field-label.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/field/field-legend.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/field/field-separator.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/field/field-set.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/field/field-title.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/field/field.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/field/index.ts",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/field",
      },
    },
  },
  {
    name: "hover-card",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/hover-card/hover-card-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/hover-card/hover-card-portal.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/hover-card/hover-card-trigger.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/hover-card/hover-card.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/hover-card/index.ts",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/hover-card",
      },
    },
  },
  {
    name: "input",
    type: "registry:ui",
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/input/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/input/input.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/input",
      },
    },
  },
  {
    name: "input-group",
    type: "registry:ui",
    registryDependencies: [
      "button",
      "input",
      "textarea",
      "utils",
    ],
    files: [
      {
        path: "ui/input-group/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/input-group/input-group-addon.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/input-group/input-group-button.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/input-group/input-group-input.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/input-group/input-group-text.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/input-group/input-group-textarea.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/input-group/input-group.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/input-group",
      },
    },
  },
  {
    name: "input-otp",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/input-otp/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/input-otp/input-otp-group.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/input-otp/input-otp-separator.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/input-otp/input-otp-slot.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/input-otp/input-otp.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/input-otp",
      },
    },
  },
  {
    name: "item",
    type: "registry:ui",
    registryDependencies: [
      "separator",
      "utils",
    ],
    files: [
      {
        path: "ui/item/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/item/item-actions.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/item/item-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/item/item-description.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/item/item-footer.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/item/item-group.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/item/item-header.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/item/item-media.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/item/item-separator.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/item/item-title.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/item/item.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/item",
      },
    },
  },
  {
    name: "kbd",
    type: "registry:ui",
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/kbd/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/kbd/kbd-group.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/kbd/kbd.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/kbd",
      },
    },
  },
  {
    name: "label",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/label/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/label/label.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/label",
      },
    },
  },
  {
    name: "menubar",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/menubar/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/menubar-checkbox-item.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/menubar-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/menubar-group-heading.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/menubar-group.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/menubar-item.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/menubar-label.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/menubar-menu.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/menubar-portal.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/menubar-radio-group.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/menubar-radio-item.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/menubar-separator.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/menubar-shortcut.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/menubar-sub-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/menubar-sub-trigger.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/menubar-sub.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/menubar-trigger.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/menubar/menubar.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/menubar",
      },
    },
  },
  {
    name: "native-select",
    type: "registry:ui",
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/native-select/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/native-select/native-select-opt-group.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/native-select/native-select-option.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/native-select/native-select.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/native-select",
      },
    },
  },
  {
    name: "navigation-menu",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/navigation-menu/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/navigation-menu/navigation-menu-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/navigation-menu/navigation-menu-indicator.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/navigation-menu/navigation-menu-item.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/navigation-menu/navigation-menu-link.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/navigation-menu/navigation-menu-list.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/navigation-menu/navigation-menu-trigger.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/navigation-menu/navigation-menu-viewport.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/navigation-menu/navigation-menu.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/navigation-menu",
      },
    },
  },
  {
    name: "pagination",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: [
      "button",
      "utils",
    ],
    files: [
      {
        path: "ui/pagination/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/pagination/pagination-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/pagination/pagination-ellipsis.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/pagination/pagination-item.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/pagination/pagination-link.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/pagination/pagination-next-button.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/pagination/pagination-next.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/pagination/pagination-prev-button.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/pagination/pagination-previous.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/pagination/pagination.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/pagination",
      },
    },
  },
  {
    name: "popover",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/popover/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/popover/popover-close.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/popover/popover-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/popover/popover-description.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/popover/popover-header.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/popover/popover-portal.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/popover/popover-title.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/popover/popover-trigger.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/popover/popover.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/popover",
      },
    },
  },
  {
    name: "progress",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/progress/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/progress/progress.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/progress",
      },
    },
  },
  {
    name: "radio-group",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/radio-group/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/radio-group/radio-group-item.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/radio-group/radio-group.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/radio-group",
      },
    },
  },
  {
    name: "range-calendar",
    type: "registry:ui",
    dependencies: [
      "@internationalized/date",
      "bits-ui",
    ],
    registryDependencies: [
      "button",
      "utils",
    ],
    files: [
      {
        path: "ui/range-calendar/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/range-calendar-caption.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/range-calendar-cell.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/range-calendar-day.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/range-calendar-grid-body.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/range-calendar-grid-head.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/range-calendar-grid-row.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/range-calendar-grid.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/range-calendar-head-cell.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/range-calendar-header.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/range-calendar-heading.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/range-calendar-month-select.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/range-calendar-month.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/range-calendar-months.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/range-calendar-nav.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/range-calendar-next-button.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/range-calendar-prev-button.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/range-calendar-year-select.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/range-calendar/range-calendar.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/range-calendar",
      },
    },
  },
  {
    name: "resizable",
    type: "registry:ui",
    dependencies: ["paneforge"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/resizable/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/resizable/resizable-handle.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/resizable/resizable-pane-group.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/resizable",
      },
    },
  },
  {
    name: "scroll-area",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/scroll-area/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/scroll-area/scroll-area-scrollbar.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/scroll-area/scroll-area.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/scroll-area",
      },
    },
  },
  {
    name: "select",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: [
      "separator",
      "utils",
    ],
    files: [
      {
        path: "ui/select/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/select/select-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/select/select-group-heading.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/select/select-group.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/select/select-item.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/select/select-label.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/select/select-portal.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/select/select-scroll-down-button.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/select/select-scroll-up-button.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/select/select-separator.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/select/select-trigger.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/select/select.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/select",
      },
    },
  },
  {
    name: "separator",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/separator/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/separator/separator.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/separator",
      },
    },
  },
  {
    name: "sheet",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: [
      "button",
      "utils",
    ],
    files: [
      {
        path: "ui/sheet/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/sheet/sheet-close.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sheet/sheet-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sheet/sheet-description.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sheet/sheet-footer.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sheet/sheet-header.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sheet/sheet-overlay.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sheet/sheet-portal.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sheet/sheet-title.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sheet/sheet-trigger.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sheet/sheet.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/sheet",
      },
    },
  },
  {
    name: "sidebar",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: [
      "button",
      "input",
      "separator",
      "sheet",
      "skeleton",
      "tooltip",
      "utils",
    ],
    files: [
      {
        path: "ui/sidebar/constants.ts",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/context.svelte.ts",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/sidebar-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/sidebar-footer.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/sidebar-group-action.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/sidebar-group-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/sidebar-group-label.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/sidebar-group.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/sidebar-header.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/sidebar-input.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/sidebar-inset.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/sidebar-menu-action.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/sidebar-menu-badge.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/sidebar-menu-button.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/sidebar-menu-item.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/sidebar-menu-skeleton.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/sidebar-menu-sub-button.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/sidebar-menu-sub-item.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/sidebar-menu-sub.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/sidebar-menu.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/sidebar-provider.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/sidebar-rail.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/sidebar-separator.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/sidebar-trigger.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/sidebar/sidebar.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/sidebar",
      },
    },
  },
  {
    name: "skeleton",
    type: "registry:ui",
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/skeleton/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/skeleton/skeleton.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/skeleton",
      },
    },
  },
  {
    name: "slider",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/slider/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/slider/slider.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/slider",
      },
    },
  },
  {
    name: "sonner",
    type: "registry:ui",
    dependencies: ["svelte-sonner"],
    files: [
      {
        path: "ui/sonner/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/sonner/sonner.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/sonner",
      },
    },
  },
  {
    name: "spinner",
    type: "registry:ui",
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/spinner/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/spinner/spinner.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/spinner",
      },
    },
  },
  {
    name: "switch",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/switch/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/switch/switch.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/switch",
      },
    },
  },
  {
    name: "table",
    type: "registry:ui",
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/table/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/table/table-body.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/table/table-caption.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/table/table-cell.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/table/table-footer.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/table/table-head.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/table/table-header.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/table/table-row.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/table/table.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/table",
      },
    },
  },
  {
    name: "tabs",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/tabs/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/tabs/tabs-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/tabs/tabs-list.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/tabs/tabs-trigger.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/tabs/tabs.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/tabs",
      },
    },
  },
  {
    name: "textarea",
    type: "registry:ui",
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/textarea/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/textarea/textarea.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/textarea",
      },
    },
  },
  {
    name: "toggle",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/toggle/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/toggle/toggle.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/toggle",
      },
    },
  },
  {
    name: "toggle-group",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: [
      "toggle",
      "utils",
    ],
    files: [
      {
        path: "ui/toggle-group/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/toggle-group/toggle-group-item.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/toggle-group/toggle-group.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/toggle-group",
      },
    },
  },
  {
    name: "tooltip",
    type: "registry:ui",
    dependencies: ["bits-ui"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "ui/tooltip/index.ts",
        type: "registry:ui",
      },
      {
        path: "ui/tooltip/tooltip-content.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/tooltip/tooltip-portal.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/tooltip/tooltip-provider.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/tooltip/tooltip-trigger.svelte",
        type: "registry:ui",
      },
      {
        path: "ui/tooltip/tooltip.svelte",
        type: "registry:ui",
      },
    ],
    meta: {
      links: {
        docs: "https://force-ui.com/docs/components/svelte/tooltip",
      },
    },
  },
]
