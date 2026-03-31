import { type Registry } from "shadcn/schema"

export const examples: Registry["items"] = [
  {
    name: "accordion-demo",
    title: "Accordion Demo",
    type: "registry:example",
    registryDependencies: ["accordion"],
    files: [
      {
        path: "examples/accordion-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "alert-demo",
    title: "Alert Demo",
    type: "registry:example",
    registryDependencies: ["alert"],
    files: [
      {
        path: "examples/alert-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "alert-destructive",
    title: "Alert Destructive",
    type: "registry:example",
    registryDependencies: ["alert"],
    files: [
      {
        path: "examples/alert-destructive.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "alert-dialog-demo",
    title: "Alert Dialog Demo",
    type: "registry:example",
    registryDependencies: [
      "alert-dialog",
      "button",
    ],
    files: [
      {
        path: "examples/alert-dialog-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "aspect-ratio-demo",
    title: "Aspect Ratio Demo",
    type: "registry:example",
    registryDependencies: ["aspect-ratio"],
    files: [
      {
        path: "examples/aspect-ratio-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "avatar-demo",
    title: "Avatar Demo",
    type: "registry:example",
    registryDependencies: ["avatar"],
    files: [
      {
        path: "examples/avatar-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "badge-demo",
    title: "Badge Demo",
    type: "registry:example",
    registryDependencies: ["badge"],
    files: [
      {
        path: "examples/badge-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "badge-destructive",
    title: "Badge Destructive",
    type: "registry:example",
    registryDependencies: ["badge"],
    files: [
      {
        path: "examples/badge-destructive.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "badge-outline",
    title: "Badge Outline",
    type: "registry:example",
    registryDependencies: ["badge"],
    files: [
      {
        path: "examples/badge-outline.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "badge-secondary",
    title: "Badge Secondary",
    type: "registry:example",
    registryDependencies: ["badge"],
    files: [
      {
        path: "examples/badge-secondary.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "breadcrumb-demo",
    title: "Breadcrumb Demo",
    type: "registry:example",
    registryDependencies: [
      "breadcrumb",
      "dropdown-menu",
    ],
    files: [
      {
        path: "examples/breadcrumb-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "breadcrumb-dropdown",
    title: "Breadcrumb Dropdown",
    type: "registry:example",
    registryDependencies: [
      "breadcrumb",
      "dropdown-menu",
    ],
    files: [
      {
        path: "examples/breadcrumb-dropdown.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "breadcrumb-ellipsis",
    title: "Breadcrumb Ellipsis",
    type: "registry:example",
    registryDependencies: ["breadcrumb"],
    files: [
      {
        path: "examples/breadcrumb-ellipsis.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "breadcrumb-link",
    title: "Breadcrumb Link",
    type: "registry:example",
    registryDependencies: ["breadcrumb"],
    files: [
      {
        path: "examples/breadcrumb-link.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "breadcrumb-responsive",
    title: "Breadcrumb Responsive",
    type: "registry:example",
    registryDependencies: [
      "breadcrumb",
      "button",
      "drawer",
      "dropdown-menu",
    ],
    files: [
      {
        path: "examples/breadcrumb-responsive.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "breadcrumb-separator",
    title: "Breadcrumb Separator",
    type: "registry:example",
    registryDependencies: ["breadcrumb"],
    files: [
      {
        path: "examples/breadcrumb-separator.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-default",
    title: "Button Default",
    type: "registry:example",
    registryDependencies: ["button"],
    files: [
      {
        path: "examples/button-default.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-demo",
    title: "Button Demo",
    type: "registry:example",
    registryDependencies: ["button"],
    files: [
      {
        path: "examples/button-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-destructive",
    title: "Button Destructive",
    type: "registry:example",
    registryDependencies: ["button"],
    files: [
      {
        path: "examples/button-destructive.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-ghost",
    title: "Button Ghost",
    type: "registry:example",
    registryDependencies: ["button"],
    files: [
      {
        path: "examples/button-ghost.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-demo",
    title: "Button Group Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "button-group",
      "dropdown-menu",
    ],
    files: [
      {
        path: "examples/button-group-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-dropdown-menu-demo",
    title: "Button Group Dropdown Menu Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "button-group",
      "dropdown-menu",
    ],
    files: [
      {
        path: "examples/button-group-dropdown-menu-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-input-demo",
    title: "Button Group Input Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "button-group",
      "input",
    ],
    files: [
      {
        path: "examples/button-group-input-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-input-group-demo",
    title: "Button Group Input Group Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "button-group",
      "input-group",
      "tooltip",
    ],
    files: [
      {
        path: "examples/button-group-input-group-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-nested-demo",
    title: "Button Group Nested Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "button-group",
    ],
    files: [
      {
        path: "examples/button-group-nested-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-orientation-demo",
    title: "Button Group Orientation Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "button-group",
    ],
    files: [
      {
        path: "examples/button-group-orientation-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-popover-demo",
    title: "Button Group Popover Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "button-group",
      "popover",
      "separator",
      "textarea",
    ],
    files: [
      {
        path: "examples/button-group-popover-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-select-demo",
    title: "Button Group Select Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "button-group",
      "input",
      "select",
    ],
    files: [
      {
        path: "examples/button-group-select-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-separator-demo",
    title: "Button Group Separator Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "button-group",
    ],
    files: [
      {
        path: "examples/button-group-separator-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-size-demo",
    title: "Button Group Size Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "button-group",
    ],
    files: [
      {
        path: "examples/button-group-size-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-split-demo",
    title: "Button Group Split Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "button-group",
    ],
    files: [
      {
        path: "examples/button-group-split-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-icon",
    title: "Button Icon",
    type: "registry:example",
    registryDependencies: ["button"],
    files: [
      {
        path: "examples/button-icon.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-link",
    title: "Button Link",
    type: "registry:example",
    registryDependencies: ["button"],
    files: [
      {
        path: "examples/button-link.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-loading",
    title: "Button Loading",
    type: "registry:example",
    registryDependencies: [
      "button",
      "spinner",
    ],
    files: [
      {
        path: "examples/button-loading.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-outline",
    title: "Button Outline",
    type: "registry:example",
    registryDependencies: ["button"],
    files: [
      {
        path: "examples/button-outline.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-rounded",
    title: "Button Rounded",
    type: "registry:example",
    registryDependencies: ["button"],
    files: [
      {
        path: "examples/button-rounded.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-secondary",
    title: "Button Secondary",
    type: "registry:example",
    registryDependencies: ["button"],
    files: [
      {
        path: "examples/button-secondary.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-size",
    title: "Button Size",
    type: "registry:example",
    registryDependencies: ["button"],
    files: [
      {
        path: "examples/button-size.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-with-icon",
    title: "Button With Icon",
    type: "registry:example",
    registryDependencies: ["button"],
    files: [
      {
        path: "examples/button-with-icon.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "calendar-demo",
    title: "Calendar Demo",
    type: "registry:example",
    dependencies: ["@internationalized/date"],
    registryDependencies: ["calendar"],
    files: [
      {
        path: "examples/calendar-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "calendar-with-selects",
    title: "Calendar With Selects",
    type: "registry:example",
    dependencies: ["bits-ui"],
    registryDependencies: [
      "calendar",
      "select",
      "utils",
    ],
    files: [
      {
        path: "examples/calendar-with-selects.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "card-demo",
    title: "Card Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "card",
      "input",
      "label",
    ],
    files: [
      {
        path: "examples/card-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "card-with-form",
    title: "Card With Form",
    type: "registry:example",
    registryDependencies: [
      "button",
      "card",
      "input",
      "label",
      "select",
    ],
    files: [
      {
        path: "examples/card-with-form.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "carousel-api",
    title: "Carousel Api",
    type: "registry:example",
    registryDependencies: [
      "card",
      "carousel",
    ],
    files: [
      {
        path: "examples/carousel-api.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "carousel-demo",
    title: "Carousel Demo",
    type: "registry:example",
    registryDependencies: [
      "card",
      "carousel",
    ],
    files: [
      {
        path: "examples/carousel-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "carousel-orientation",
    title: "Carousel Orientation",
    type: "registry:example",
    registryDependencies: [
      "card",
      "carousel",
    ],
    files: [
      {
        path: "examples/carousel-orientation.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "carousel-plugin",
    title: "Carousel Plugin",
    type: "registry:example",
    registryDependencies: [
      "card",
      "carousel",
    ],
    files: [
      {
        path: "examples/carousel-plugin.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "carousel-size",
    title: "Carousel Size",
    type: "registry:example",
    registryDependencies: [
      "card",
      "carousel",
    ],
    files: [
      {
        path: "examples/carousel-size.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "carousel-spacing",
    title: "Carousel Spacing",
    type: "registry:example",
    registryDependencies: [
      "card",
      "carousel",
    ],
    files: [
      {
        path: "examples/carousel-spacing.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "chart-bar-axis-tick-demo",
    title: "Chart Bar Axis Tick Demo",
    type: "registry:example",
    registryDependencies: ["chart"],
    files: [
      {
        path: "examples/chart-bar-axis-tick-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "chart-bar-demo",
    title: "Chart Bar Demo",
    type: "registry:example",
    registryDependencies: ["chart"],
    files: [
      {
        path: "examples/chart-bar-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "chart-bar-legend-demo",
    title: "Chart Bar Legend Demo",
    type: "registry:example",
    registryDependencies: ["chart"],
    files: [
      {
        path: "examples/chart-bar-legend-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "chart-bar-tooltip-demo",
    title: "Chart Bar Tooltip Demo",
    type: "registry:example",
    registryDependencies: ["chart"],
    files: [
      {
        path: "examples/chart-bar-tooltip-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "chart-tooltip-demo",
    title: "Chart Tooltip Demo",
    type: "registry:example",
    files: [
      {
        path: "examples/chart-tooltip-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "checkbox-demo",
    title: "Checkbox Demo",
    type: "registry:example",
    registryDependencies: [
      "checkbox",
      "label",
    ],
    files: [
      {
        path: "examples/checkbox-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "checkbox-disabled",
    title: "Checkbox Disabled",
    type: "registry:example",
    registryDependencies: [
      "checkbox",
      "label",
    ],
    files: [
      {
        path: "examples/checkbox-disabled.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "checkbox-form-multiple",
    title: "Checkbox Form Multiple",
    type: "registry:example",
    dependencies: [
      "svelte-sonner",
      "sveltekit-superforms",
      "zod",
    ],
    registryDependencies: [
      "checkbox",
      "form",
    ],
    files: [
      {
        path: "examples/checkbox-form-multiple.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "checkbox-form-single",
    title: "Checkbox Form Single",
    type: "registry:example",
    dependencies: [
      "svelte-sonner",
      "sveltekit-superforms",
      "zod",
    ],
    registryDependencies: [
      "checkbox",
      "form",
    ],
    files: [
      {
        path: "examples/checkbox-form-single.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "checkbox-with-text",
    title: "Checkbox With Text",
    type: "registry:example",
    registryDependencies: [
      "checkbox",
      "label",
    ],
    files: [
      {
        path: "examples/checkbox-with-text.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "collapsible-demo",
    title: "Collapsible Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "collapsible",
    ],
    files: [
      {
        path: "examples/collapsible-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "combobox-demo",
    title: "Combobox Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "command",
      "popover",
      "utils",
    ],
    files: [
      {
        path: "examples/combobox-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "combobox-dropdown-menu",
    title: "Combobox Dropdown Menu",
    type: "registry:example",
    registryDependencies: [
      "button",
      "command",
      "dropdown-menu",
    ],
    files: [
      {
        path: "examples/combobox-dropdown-menu.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "combobox-form",
    title: "Combobox Form",
    type: "registry:example",
    dependencies: [
      "bits-ui",
      "svelte-sonner",
      "sveltekit-superforms",
      "zod",
    ],
    registryDependencies: [
      "button",
      "command",
      "form",
      "popover",
      "utils",
    ],
    files: [
      {
        path: "examples/combobox-form.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "combobox-popover",
    title: "Combobox Popover",
    type: "registry:example",
    dependencies: ["bits-ui"],
    registryDependencies: [
      "button",
      "command",
      "popover",
      "utils",
    ],
    files: [
      {
        path: "examples/combobox-popover.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "combobox-responsive",
    title: "Combobox Responsive",
    type: "registry:example",
    registryDependencies: [
      "button",
      "command",
      "drawer",
      "popover",
    ],
    files: [
      {
        path: "examples/combobox-responsive.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "command-demo",
    title: "Command Demo",
    type: "registry:example",
    registryDependencies: ["command"],
    files: [
      {
        path: "examples/command-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "command-dialog",
    title: "Command Dialog",
    type: "registry:example",
    registryDependencies: ["command"],
    files: [
      {
        path: "examples/command-dialog.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "context-menu-demo",
    title: "Context Menu Demo",
    type: "registry:example",
    registryDependencies: ["context-menu"],
    files: [
      {
        path: "examples/context-menu-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "dark-mode-dropdown-menu",
    title: "Dark Mode Dropdown Menu",
    type: "registry:example",
    registryDependencies: [
      "button",
      "dropdown-menu",
    ],
    files: [
      {
        path: "examples/dark-mode-dropdown-menu.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "dark-mode-light-switch",
    title: "Dark Mode Light Switch",
    type: "registry:example",
    registryDependencies: ["button"],
    files: [
      {
        path: "examples/dark-mode-light-switch.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "data-table-demo",
    title: "Data Table Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "data-table",
      "dropdown-menu",
      "input",
      "table",
    ],
    files: [
      {
        path: "examples/data-table-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "date-picker-demo",
    title: "Date Picker Demo",
    type: "registry:example",
    dependencies: ["@internationalized/date"],
    registryDependencies: [
      "button",
      "calendar",
      "popover",
      "utils",
    ],
    files: [
      {
        path: "examples/date-picker-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "date-picker-form",
    title: "Date Picker Form",
    type: "registry:example",
    dependencies: [
      "svelte-sonner",
      "sveltekit-superforms",
      "zod",
    ],
    registryDependencies: [
      "button",
      "calendar",
      "form",
      "popover",
      "utils",
    ],
    files: [
      {
        path: "examples/date-picker-form.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "date-picker-with-presets",
    title: "Date Picker With Presets",
    type: "registry:example",
    registryDependencies: [
      "button",
      "calendar",
      "popover",
      "select",
      "utils",
    ],
    files: [
      {
        path: "examples/date-picker-with-presets.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "date-picker-with-range",
    title: "Date Picker With Range",
    type: "registry:example",
    dependencies: ["bits-ui"],
    registryDependencies: [
      "button",
      "popover",
      "range-calendar",
      "utils",
    ],
    files: [
      {
        path: "examples/date-picker-with-range.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "dialog-close-button",
    title: "Dialog Close Button",
    type: "registry:example",
    registryDependencies: [
      "button",
      "dialog",
      "input",
      "label",
    ],
    files: [
      {
        path: "examples/dialog-close-button.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "dialog-demo",
    title: "Dialog Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "dialog",
      "input",
      "label",
    ],
    files: [
      {
        path: "examples/dialog-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "drawer-demo",
    title: "Drawer Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "drawer",
    ],
    files: [
      {
        path: "examples/drawer-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "drawer-dialog",
    title: "Drawer Dialog",
    type: "registry:example",
    registryDependencies: [
      "button",
      "dialog",
      "drawer",
      "input",
      "label",
    ],
    files: [
      {
        path: "examples/drawer-dialog.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "dropdown-menu-checkboxes",
    title: "Dropdown Menu Checkboxes",
    type: "registry:example",
    registryDependencies: [
      "button",
      "dropdown-menu",
    ],
    files: [
      {
        path: "examples/dropdown-menu-checkboxes.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "dropdown-menu-demo",
    title: "Dropdown Menu Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "dropdown-menu",
    ],
    files: [
      {
        path: "examples/dropdown-menu-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "dropdown-menu-dialog",
    title: "Dropdown Menu Dialog",
    type: "registry:example",
    registryDependencies: [
      "button",
      "dialog",
      "dropdown-menu",
      "field",
      "input",
      "label",
      "textarea",
    ],
    files: [
      {
        path: "examples/dropdown-menu-dialog.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "dropdown-menu-radio-group",
    title: "Dropdown Menu Radio Group",
    type: "registry:example",
    registryDependencies: [
      "button",
      "dropdown-menu",
    ],
    files: [
      {
        path: "examples/dropdown-menu-radio-group.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "empty-avatar-demo",
    title: "Empty Avatar Demo",
    type: "registry:example",
    registryDependencies: [
      "avatar",
      "button",
      "empty",
    ],
    files: [
      {
        path: "examples/empty-avatar-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "empty-avatar-group-demo",
    title: "Empty Avatar Group Demo",
    type: "registry:example",
    registryDependencies: [
      "avatar",
      "button",
      "empty",
    ],
    files: [
      {
        path: "examples/empty-avatar-group-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "empty-background-demo",
    title: "Empty Background Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "empty",
    ],
    files: [
      {
        path: "examples/empty-background-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "empty-demo",
    title: "Empty Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "empty",
    ],
    files: [
      {
        path: "examples/empty-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "empty-input-group-demo",
    title: "Empty Input Group Demo",
    type: "registry:example",
    registryDependencies: [
      "empty",
      "input-group",
      "kbd",
    ],
    files: [
      {
        path: "examples/empty-input-group-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "empty-outline-demo",
    title: "Empty Outline Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "empty",
    ],
    files: [
      {
        path: "examples/empty-outline-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-checkbox-demo",
    title: "Field Checkbox Demo",
    type: "registry:example",
    registryDependencies: [
      "checkbox",
      "field",
    ],
    files: [
      {
        path: "examples/field-checkbox-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-checkbox",
    title: "Field Checkbox",
    type: "registry:example",
    registryDependencies: [
      "checkbox",
      "field",
    ],
    files: [
      {
        path: "examples/field-checkbox.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-choice-card",
    title: "Field Choice Card",
    type: "registry:example",
    registryDependencies: [
      "field",
      "radio-group",
    ],
    files: [
      {
        path: "examples/field-choice-card.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-demo",
    title: "Field Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "checkbox",
      "field",
      "input",
      "select",
      "textarea",
    ],
    files: [
      {
        path: "examples/field-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-field-group-demo",
    title: "Field Field Group Demo",
    type: "registry:example",
    registryDependencies: [
      "checkbox",
      "field",
    ],
    files: [
      {
        path: "examples/field-field-group-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-field-set-demo",
    title: "Field Field Set Demo",
    type: "registry:example",
    registryDependencies: [
      "field",
      "input",
    ],
    files: [
      {
        path: "examples/field-field-set-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-input-demo",
    title: "Field Input Demo",
    type: "registry:example",
    registryDependencies: [
      "field",
      "input",
    ],
    files: [
      {
        path: "examples/field-input-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-input",
    title: "Field Input",
    type: "registry:example",
    registryDependencies: [
      "field",
      "input",
    ],
    files: [
      {
        path: "examples/field-input.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-radio-demo",
    title: "Field Radio Demo",
    type: "registry:example",
    registryDependencies: [
      "field",
      "radio-group",
    ],
    files: [
      {
        path: "examples/field-radio-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-radio",
    title: "Field Radio",
    type: "registry:example",
    registryDependencies: [
      "field",
      "radio-group",
    ],
    files: [
      {
        path: "examples/field-radio.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-responsive-layout-demo",
    title: "Field Responsive Layout Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "field",
      "input",
      "textarea",
    ],
    files: [
      {
        path: "examples/field-responsive-layout-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-select-demo",
    title: "Field Select Demo",
    type: "registry:example",
    registryDependencies: [
      "field",
      "select",
    ],
    files: [
      {
        path: "examples/field-select-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-select",
    title: "Field Select",
    type: "registry:example",
    registryDependencies: [
      "field",
      "select",
    ],
    files: [
      {
        path: "examples/field-select.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-slider-demo",
    title: "Field Slider Demo",
    type: "registry:example",
    registryDependencies: [
      "field",
      "slider",
    ],
    files: [
      {
        path: "examples/field-slider-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-slider",
    title: "Field Slider",
    type: "registry:example",
    registryDependencies: [
      "field",
      "slider",
    ],
    files: [
      {
        path: "examples/field-slider.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-switch-demo",
    title: "Field Switch Demo",
    type: "registry:example",
    registryDependencies: [
      "field",
      "switch",
    ],
    files: [
      {
        path: "examples/field-switch-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-switch",
    title: "Field Switch",
    type: "registry:example",
    registryDependencies: [
      "field",
      "switch",
    ],
    files: [
      {
        path: "examples/field-switch.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-textarea-demo",
    title: "Field Textarea Demo",
    type: "registry:example",
    registryDependencies: [
      "field",
      "textarea",
    ],
    files: [
      {
        path: "examples/field-textarea-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-textarea",
    title: "Field Textarea",
    type: "registry:example",
    registryDependencies: [
      "field",
      "textarea",
    ],
    files: [
      {
        path: "examples/field-textarea.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "form-demo",
    title: "Form Demo",
    type: "registry:example",
    dependencies: [
      "svelte-sonner",
      "sveltekit-superforms",
      "zod",
    ],
    registryDependencies: [
      "form",
      "input",
    ],
    files: [
      {
        path: "examples/form-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "hover-card-demo",
    title: "Hover Card Demo",
    type: "registry:example",
    registryDependencies: [
      "avatar",
      "hover-card",
    ],
    files: [
      {
        path: "examples/hover-card-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-demo",
    title: "Input Demo",
    type: "registry:example",
    registryDependencies: ["input"],
    files: [
      {
        path: "examples/input-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-disabled",
    title: "Input Disabled",
    type: "registry:example",
    registryDependencies: ["input"],
    files: [
      {
        path: "examples/input-disabled.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-file",
    title: "Input File",
    type: "registry:example",
    registryDependencies: [
      "input",
      "label",
    ],
    files: [
      {
        path: "examples/input-file.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-button-demo",
    title: "Input Group Button Demo",
    type: "registry:example",
    registryDependencies: [
      "input-group",
      "popover",
    ],
    files: [
      {
        path: "examples/input-group-button-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-button-group-demo",
    title: "Input Group Button Group Demo",
    type: "registry:example",
    registryDependencies: [
      "button-group",
      "input-group",
      "label",
    ],
    files: [
      {
        path: "examples/input-group-button-group-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-custom-input-demo",
    title: "Input Group Custom Input Demo",
    type: "registry:example",
    registryDependencies: ["input-group"],
    files: [
      {
        path: "examples/input-group-custom-input-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-demo",
    title: "Input Group Demo",
    type: "registry:example",
    registryDependencies: [
      "dropdown-menu",
      "input-group",
      "separator",
      "tooltip",
    ],
    files: [
      {
        path: "examples/input-group-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-dropdown-demo",
    title: "Input Group Dropdown Demo",
    type: "registry:example",
    registryDependencies: [
      "dropdown-menu",
      "input-group",
    ],
    files: [
      {
        path: "examples/input-group-dropdown-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-icon-demo",
    title: "Input Group Icon Demo",
    type: "registry:example",
    registryDependencies: ["input-group"],
    files: [
      {
        path: "examples/input-group-icon-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-label-demo",
    title: "Input Group Label Demo",
    type: "registry:example",
    registryDependencies: [
      "input-group",
      "label",
      "tooltip",
    ],
    files: [
      {
        path: "examples/input-group-label-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-spinner-demo",
    title: "Input Group Spinner Demo",
    type: "registry:example",
    registryDependencies: [
      "input-group",
      "spinner",
    ],
    files: [
      {
        path: "examples/input-group-spinner-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-text-demo",
    title: "Input Group Text Demo",
    type: "registry:example",
    registryDependencies: ["input-group"],
    files: [
      {
        path: "examples/input-group-text-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-textarea-demo",
    title: "Input Group Textarea Demo",
    type: "registry:example",
    registryDependencies: ["input-group"],
    files: [
      {
        path: "examples/input-group-textarea-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-tooltip-demo",
    title: "Input Group Tooltip Demo",
    type: "registry:example",
    registryDependencies: [
      "input-group",
      "tooltip",
    ],
    files: [
      {
        path: "examples/input-group-tooltip-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-invalid",
    title: "Input Invalid",
    type: "registry:example",
    registryDependencies: ["input"],
    files: [
      {
        path: "examples/input-invalid.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-otp-controlled",
    title: "Input Otp Controlled",
    type: "registry:example",
    registryDependencies: ["input-otp"],
    files: [
      {
        path: "examples/input-otp-controlled.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-otp-demo",
    title: "Input Otp Demo",
    type: "registry:example",
    registryDependencies: ["input-otp"],
    files: [
      {
        path: "examples/input-otp-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-otp-form",
    title: "Input Otp Form",
    type: "registry:example",
    dependencies: [
      "svelte-sonner",
      "sveltekit-superforms",
      "zod",
    ],
    registryDependencies: [
      "form",
      "input-otp",
    ],
    files: [
      {
        path: "examples/input-otp-form.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-otp-invalid",
    title: "Input Otp Invalid",
    type: "registry:example",
    registryDependencies: ["input-otp"],
    files: [
      {
        path: "examples/input-otp-invalid.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-otp-pattern",
    title: "Input Otp Pattern",
    type: "registry:example",
    dependencies: ["bits-ui"],
    registryDependencies: ["input-otp"],
    files: [
      {
        path: "examples/input-otp-pattern.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-otp-separator",
    title: "Input Otp Separator",
    type: "registry:example",
    registryDependencies: ["input-otp"],
    files: [
      {
        path: "examples/input-otp-separator.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-with-button",
    title: "Input With Button",
    type: "registry:example",
    registryDependencies: [
      "button",
      "input",
    ],
    files: [
      {
        path: "examples/input-with-button.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-with-label",
    title: "Input With Label",
    type: "registry:example",
    registryDependencies: [
      "input",
      "label",
    ],
    files: [
      {
        path: "examples/input-with-label.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-with-text",
    title: "Input With Text",
    type: "registry:example",
    registryDependencies: [
      "input",
      "label",
    ],
    files: [
      {
        path: "examples/input-with-text.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "item-avatar-demo",
    title: "Item Avatar Demo",
    type: "registry:example",
    registryDependencies: [
      "avatar",
      "button",
      "item",
    ],
    files: [
      {
        path: "examples/item-avatar-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "item-demo",
    title: "Item Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "item",
    ],
    files: [
      {
        path: "examples/item-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "item-dropdown-demo",
    title: "Item Dropdown Demo",
    type: "registry:example",
    registryDependencies: [
      "avatar",
      "button",
      "dropdown-menu",
      "item",
    ],
    files: [
      {
        path: "examples/item-dropdown-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "item-group-demo",
    title: "Item Group Demo",
    type: "registry:example",
    registryDependencies: [
      "avatar",
      "button",
      "item",
    ],
    files: [
      {
        path: "examples/item-group-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "item-header-demo",
    title: "Item Header Demo",
    type: "registry:example",
    registryDependencies: ["item"],
    files: [
      {
        path: "examples/item-header-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "item-icon-demo",
    title: "Item Icon Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "item",
    ],
    files: [
      {
        path: "examples/item-icon-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "item-image-demo",
    title: "Item Image Demo",
    type: "registry:example",
    registryDependencies: ["item"],
    files: [
      {
        path: "examples/item-image-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "item-link-demo",
    title: "Item Link Demo",
    type: "registry:example",
    registryDependencies: ["item"],
    files: [
      {
        path: "examples/item-link-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "item-size-demo",
    title: "Item Size Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "item",
    ],
    files: [
      {
        path: "examples/item-size-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "item-variants-demo",
    title: "Item Variants Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "item",
    ],
    files: [
      {
        path: "examples/item-variants-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "kbd-button-demo",
    title: "Kbd Button Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "kbd",
    ],
    files: [
      {
        path: "examples/kbd-button-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "kbd-demo",
    title: "Kbd Demo",
    type: "registry:example",
    registryDependencies: ["kbd"],
    files: [
      {
        path: "examples/kbd-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "kbd-group-demo",
    title: "Kbd Group Demo",
    type: "registry:example",
    registryDependencies: ["kbd"],
    files: [
      {
        path: "examples/kbd-group-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "kbd-input-group-demo",
    title: "Kbd Input Group Demo",
    type: "registry:example",
    registryDependencies: [
      "input-group",
      "kbd",
    ],
    files: [
      {
        path: "examples/kbd-input-group-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "kbd-tooltip-demo",
    title: "Kbd Tooltip Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "button-group",
      "kbd",
      "tooltip",
    ],
    files: [
      {
        path: "examples/kbd-tooltip-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "label-demo",
    title: "Label Demo",
    type: "registry:example",
    registryDependencies: [
      "checkbox",
      "label",
    ],
    files: [
      {
        path: "examples/label-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "menubar-demo",
    title: "Menubar Demo",
    type: "registry:example",
    registryDependencies: ["menubar"],
    files: [
      {
        path: "examples/menubar-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "native-select-demo",
    title: "Native Select Demo",
    type: "registry:example",
    registryDependencies: ["native-select"],
    files: [
      {
        path: "examples/native-select-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "native-select-disabled",
    title: "Native Select Disabled",
    type: "registry:example",
    registryDependencies: ["native-select"],
    files: [
      {
        path: "examples/native-select-disabled.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "native-select-groups",
    title: "Native Select Groups",
    type: "registry:example",
    registryDependencies: ["native-select"],
    files: [
      {
        path: "examples/native-select-groups.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "native-select-invalid",
    title: "Native Select Invalid",
    type: "registry:example",
    registryDependencies: ["native-select"],
    files: [
      {
        path: "examples/native-select-invalid.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "navigation-menu-demo",
    title: "Navigation Menu Demo",
    type: "registry:example",
    registryDependencies: [
      "navigation-menu",
      "utils",
    ],
    files: [
      {
        path: "examples/navigation-menu-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "pagination-demo",
    title: "Pagination Demo",
    type: "registry:example",
    registryDependencies: ["pagination"],
    files: [
      {
        path: "examples/pagination-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "popover-demo",
    title: "Popover Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "input",
      "label",
      "popover",
    ],
    files: [
      {
        path: "examples/popover-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "progress-demo",
    title: "Progress Demo",
    type: "registry:example",
    registryDependencies: ["progress"],
    files: [
      {
        path: "examples/progress-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "radio-group-demo",
    title: "Radio Group Demo",
    type: "registry:example",
    registryDependencies: [
      "label",
      "radio-group",
    ],
    files: [
      {
        path: "examples/radio-group-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "radio-group-form",
    title: "Radio Group Form",
    type: "registry:example",
    dependencies: [
      "svelte-sonner",
      "sveltekit-superforms",
      "zod",
    ],
    registryDependencies: [
      "form",
      "radio-group",
    ],
    files: [
      {
        path: "examples/radio-group-form.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "range-calendar-demo",
    title: "Range Calendar Demo",
    type: "registry:example",
    dependencies: ["@internationalized/date"],
    registryDependencies: ["range-calendar"],
    files: [
      {
        path: "examples/range-calendar-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "resizable-demo",
    title: "Resizable Demo",
    type: "registry:example",
    registryDependencies: ["resizable"],
    files: [
      {
        path: "examples/resizable-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "resizable-handle",
    title: "Resizable Handle",
    type: "registry:example",
    registryDependencies: ["resizable"],
    files: [
      {
        path: "examples/resizable-handle.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "resizable-vertical",
    title: "Resizable Vertical",
    type: "registry:example",
    registryDependencies: ["resizable"],
    files: [
      {
        path: "examples/resizable-vertical.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "scroll-area-both",
    title: "Scroll Area Both",
    type: "registry:example",
    registryDependencies: ["scroll-area"],
    files: [
      {
        path: "examples/scroll-area-both.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "scroll-area-demo",
    title: "Scroll Area Demo",
    type: "registry:example",
    registryDependencies: [
      "scroll-area",
      "separator",
    ],
    files: [
      {
        path: "examples/scroll-area-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "scroll-area-horizontal",
    title: "Scroll Area Horizontal",
    type: "registry:example",
    registryDependencies: ["scroll-area"],
    files: [
      {
        path: "examples/scroll-area-horizontal.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "select-demo",
    title: "Select Demo",
    type: "registry:example",
    registryDependencies: ["select"],
    files: [
      {
        path: "examples/select-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "select-form",
    title: "Select Form",
    type: "registry:example",
    dependencies: [
      "svelte-sonner",
      "sveltekit-superforms",
      "zod",
    ],
    registryDependencies: [
      "form",
      "select",
    ],
    files: [
      {
        path: "examples/select-form.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "select-scrollable",
    title: "Select Scrollable",
    type: "registry:example",
    registryDependencies: ["select"],
    files: [
      {
        path: "examples/select-scrollable.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "separator-demo",
    title: "Separator Demo",
    type: "registry:example",
    registryDependencies: ["separator"],
    files: [
      {
        path: "examples/separator-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "sheet-demo",
    title: "Sheet Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "input",
      "label",
      "sheet",
    ],
    files: [
      {
        path: "examples/sheet-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "sheet-side",
    title: "Sheet Side",
    type: "registry:example",
    registryDependencies: [
      "button",
      "sheet",
    ],
    files: [
      {
        path: "examples/sheet-side.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "skeleton-card",
    title: "Skeleton Card",
    type: "registry:example",
    registryDependencies: ["skeleton"],
    files: [
      {
        path: "examples/skeleton-card.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "skeleton-demo",
    title: "Skeleton Demo",
    type: "registry:example",
    registryDependencies: ["skeleton"],
    files: [
      {
        path: "examples/skeleton-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "slider-demo",
    title: "Slider Demo",
    type: "registry:example",
    registryDependencies: ["slider"],
    files: [
      {
        path: "examples/slider-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "slider-multiple",
    title: "Slider Multiple",
    type: "registry:example",
    registryDependencies: ["slider"],
    files: [
      {
        path: "examples/slider-multiple.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "slider-vertical",
    title: "Slider Vertical",
    type: "registry:example",
    registryDependencies: ["slider"],
    files: [
      {
        path: "examples/slider-vertical.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "sonner-demo",
    title: "Sonner Demo",
    type: "registry:example",
    dependencies: ["svelte-sonner"],
    registryDependencies: ["button"],
    files: [
      {
        path: "examples/sonner-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "sonner-types",
    title: "Sonner Types",
    type: "registry:example",
    dependencies: ["svelte-sonner"],
    registryDependencies: ["button"],
    files: [
      {
        path: "examples/sonner-types.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "spinner-badge-demo",
    title: "Spinner Badge Demo",
    type: "registry:example",
    registryDependencies: [
      "badge",
      "spinner",
    ],
    files: [
      {
        path: "examples/spinner-badge-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "spinner-button-demo",
    title: "Spinner Button Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "spinner",
    ],
    files: [
      {
        path: "examples/spinner-button-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "spinner-color-demo",
    title: "Spinner Color Demo",
    type: "registry:example",
    registryDependencies: ["spinner"],
    files: [
      {
        path: "examples/spinner-color-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "spinner-custom-demo",
    title: "Spinner Custom Demo",
    type: "registry:example",
    registryDependencies: ["utils"],
    files: [
      {
        path: "examples/spinner-custom-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "spinner-demo",
    title: "Spinner Demo",
    type: "registry:example",
    registryDependencies: [
      "item",
      "spinner",
    ],
    files: [
      {
        path: "examples/spinner-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "spinner-empty-demo",
    title: "Spinner Empty Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "empty",
      "spinner",
    ],
    files: [
      {
        path: "examples/spinner-empty-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "spinner-input-group-demo",
    title: "Spinner Input Group Demo",
    type: "registry:example",
    registryDependencies: [
      "input-group",
      "spinner",
    ],
    files: [
      {
        path: "examples/spinner-input-group-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "spinner-item-demo",
    title: "Spinner Item Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "item",
      "progress",
      "spinner",
    ],
    files: [
      {
        path: "examples/spinner-item-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "spinner-size-demo",
    title: "Spinner Size Demo",
    type: "registry:example",
    registryDependencies: ["spinner"],
    files: [
      {
        path: "examples/spinner-size-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "switch-demo",
    title: "Switch Demo",
    type: "registry:example",
    registryDependencies: [
      "label",
      "switch",
    ],
    files: [
      {
        path: "examples/switch-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "switch-form",
    title: "Switch Form",
    type: "registry:example",
    dependencies: [
      "svelte-sonner",
      "sveltekit-superforms",
      "zod",
    ],
    registryDependencies: [
      "form",
      "switch",
    ],
    files: [
      {
        path: "examples/switch-form.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "table-demo",
    title: "Table Demo",
    type: "registry:example",
    registryDependencies: ["table"],
    files: [
      {
        path: "examples/table-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "tabs-demo",
    title: "Tabs Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "card",
      "input",
      "label",
      "tabs",
    ],
    files: [
      {
        path: "examples/tabs-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "textarea-demo",
    title: "Textarea Demo",
    type: "registry:example",
    registryDependencies: ["textarea"],
    files: [
      {
        path: "examples/textarea-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "textarea-disabled",
    title: "Textarea Disabled",
    type: "registry:example",
    registryDependencies: ["textarea"],
    files: [
      {
        path: "examples/textarea-disabled.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "textarea-form",
    title: "Textarea Form",
    type: "registry:example",
    dependencies: [
      "svelte-sonner",
      "sveltekit-superforms",
      "zod",
    ],
    registryDependencies: [
      "form",
      "textarea",
    ],
    files: [
      {
        path: "examples/textarea-form.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "textarea-with-button",
    title: "Textarea With Button",
    type: "registry:example",
    registryDependencies: [
      "button",
      "textarea",
    ],
    files: [
      {
        path: "examples/textarea-with-button.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "textarea-with-label",
    title: "Textarea With Label",
    type: "registry:example",
    registryDependencies: [
      "label",
      "textarea",
    ],
    files: [
      {
        path: "examples/textarea-with-label.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "textarea-with-text",
    title: "Textarea With Text",
    type: "registry:example",
    registryDependencies: [
      "label",
      "textarea",
    ],
    files: [
      {
        path: "examples/textarea-with-text.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "toggle-demo",
    title: "Toggle Demo",
    type: "registry:example",
    registryDependencies: ["toggle"],
    files: [
      {
        path: "examples/toggle-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "toggle-disabled",
    title: "Toggle Disabled",
    type: "registry:example",
    registryDependencies: ["toggle"],
    files: [
      {
        path: "examples/toggle-disabled.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "toggle-group-demo",
    title: "Toggle Group Demo",
    type: "registry:example",
    registryDependencies: ["toggle-group"],
    files: [
      {
        path: "examples/toggle-group-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "toggle-group-disabled",
    title: "Toggle Group Disabled",
    type: "registry:example",
    registryDependencies: ["toggle-group"],
    files: [
      {
        path: "examples/toggle-group-disabled.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "toggle-group-lg",
    title: "Toggle Group Lg",
    type: "registry:example",
    registryDependencies: ["toggle-group"],
    files: [
      {
        path: "examples/toggle-group-lg.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "toggle-group-outline",
    title: "Toggle Group Outline",
    type: "registry:example",
    registryDependencies: ["toggle-group"],
    files: [
      {
        path: "examples/toggle-group-outline.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "toggle-group-single",
    title: "Toggle Group Single",
    type: "registry:example",
    registryDependencies: ["toggle-group"],
    files: [
      {
        path: "examples/toggle-group-single.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "toggle-group-sm",
    title: "Toggle Group Sm",
    type: "registry:example",
    registryDependencies: ["toggle-group"],
    files: [
      {
        path: "examples/toggle-group-sm.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "toggle-group-spacing",
    title: "Toggle Group Spacing",
    type: "registry:example",
    registryDependencies: ["toggle-group"],
    files: [
      {
        path: "examples/toggle-group-spacing.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "toggle-lg",
    title: "Toggle Lg",
    type: "registry:example",
    registryDependencies: ["toggle"],
    files: [
      {
        path: "examples/toggle-lg.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "toggle-outline",
    title: "Toggle Outline",
    type: "registry:example",
    registryDependencies: ["toggle"],
    files: [
      {
        path: "examples/toggle-outline.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "toggle-sm",
    title: "Toggle Sm",
    type: "registry:example",
    registryDependencies: ["toggle"],
    files: [
      {
        path: "examples/toggle-sm.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "toggle-with-text",
    title: "Toggle With Text",
    type: "registry:example",
    registryDependencies: ["toggle"],
    files: [
      {
        path: "examples/toggle-with-text.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "tooltip-demo",
    title: "Tooltip Demo",
    type: "registry:example",
    registryDependencies: [
      "button",
      "tooltip",
    ],
    files: [
      {
        path: "examples/tooltip-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-blockquote",
    title: "Typography Blockquote",
    type: "registry:example",
    files: [
      {
        path: "examples/typography-blockquote.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-demo",
    title: "Typography Demo",
    type: "registry:example",
    files: [
      {
        path: "examples/typography-demo.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-h1",
    title: "Typography H1",
    type: "registry:example",
    files: [
      {
        path: "examples/typography-h1.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-h2",
    title: "Typography H2",
    type: "registry:example",
    files: [
      {
        path: "examples/typography-h2.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-h3",
    title: "Typography H3",
    type: "registry:example",
    files: [
      {
        path: "examples/typography-h3.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-h4",
    title: "Typography H4",
    type: "registry:example",
    files: [
      {
        path: "examples/typography-h4.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-inline-code",
    title: "Typography Inline Code",
    type: "registry:example",
    files: [
      {
        path: "examples/typography-inline-code.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-large",
    title: "Typography Large",
    type: "registry:example",
    files: [
      {
        path: "examples/typography-large.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-lead",
    title: "Typography Lead",
    type: "registry:example",
    files: [
      {
        path: "examples/typography-lead.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-list",
    title: "Typography List",
    type: "registry:example",
    files: [
      {
        path: "examples/typography-list.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-muted",
    title: "Typography Muted",
    type: "registry:example",
    files: [
      {
        path: "examples/typography-muted.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-p",
    title: "Typography P",
    type: "registry:example",
    files: [
      {
        path: "examples/typography-p.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-small",
    title: "Typography Small",
    type: "registry:example",
    files: [
      {
        path: "examples/typography-small.svelte",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-table",
    title: "Typography Table",
    type: "registry:example",
    files: [
      {
        path: "examples/typography-table.svelte",
        type: "registry:example",
      },
    ],
  },
]
