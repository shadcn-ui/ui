import { type Registry } from "shadcn/schema"

export const demo: Registry["items"] = [
  {
    name: "accordion-demo",
    title: "Accordion Demo",
    type: "registry:internal",
    registryDependencies: ["accordion"],
    files: [
      {
        path: "demo/accordion-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "accordion-disabled",
    title: "Accordion Disabled",
    type: "registry:internal",
    registryDependencies: ["accordion"],
    files: [
      {
        path: "demo/accordion-disabled.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "accordion-multiple",
    title: "Accordion Multiple",
    type: "registry:internal",
    registryDependencies: ["accordion"],
    files: [
      {
        path: "demo/accordion-multiple.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "accordion-borders",
    title: "Accordion Borders",
    type: "registry:internal",
    registryDependencies: ["accordion"],
    files: [
      {
        path: "demo/accordion-borders.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "accordion-card",
    title: "Accordion Card",
    type: "registry:internal",
    registryDependencies: ["accordion", "card"],
    files: [
      {
        path: "demo/accordion-card.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "alert-demo",
    title: "Alert Demo",
    type: "registry:internal",
    registryDependencies: ["alert"],
    files: [
      {
        path: "demo/alert-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "alert-destructive",
    title: "Alert Destructive",
    type: "registry:internal",
    registryDependencies: ["alert"],
    files: [
      {
        path: "demo/alert-destructive.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "alert-dialog-demo",
    title: "Alert Dialog Demo",
    type: "registry:internal",
    registryDependencies: ["alert-dialog", "button"],
    files: [
      {
        path: "demo/alert-dialog-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "aspect-ratio-demo",
    title: "Aspect Ratio Demo",
    type: "registry:internal",
    registryDependencies: ["aspect-ratio"],
    files: [
      {
        path: "demo/aspect-ratio-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "avatar-demo",
    title: "Avatar Demo",
    type: "registry:internal",
    registryDependencies: ["avatar"],
    files: [
      {
        path: "demo/avatar-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "badge-demo",
    title: "Badge Demo",
    type: "registry:internal",
    registryDependencies: ["badge"],
    files: [
      {
        path: "demo/badge-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "badge-destructive",
    title: "Badge Destructive",
    type: "registry:internal",
    registryDependencies: ["badge"],
    files: [
      {
        path: "demo/badge-destructive.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "badge-outline",
    title: "Badge Outline",
    type: "registry:internal",
    registryDependencies: ["badge"],
    files: [
      {
        path: "demo/badge-outline.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "badge-secondary",
    title: "Badge Secondary",
    type: "registry:internal",
    registryDependencies: ["badge"],
    files: [
      {
        path: "demo/badge-secondary.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "breadcrumb-demo",
    title: "Breadcrumb Demo",
    type: "registry:internal",
    registryDependencies: ["breadcrumb", "dropdown-menu"],
    files: [
      {
        path: "demo/breadcrumb-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "breadcrumb-dropdown",
    title: "Breadcrumb Dropdown",
    type: "registry:internal",
    registryDependencies: ["breadcrumb", "dropdown-menu"],
    files: [
      {
        path: "demo/breadcrumb-dropdown.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "breadcrumb-ellipsis",
    title: "Breadcrumb Ellipsis",
    type: "registry:internal",
    registryDependencies: ["breadcrumb", "dropdown-menu"],
    files: [
      {
        path: "demo/breadcrumb-ellipsis.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "breadcrumb-link",
    title: "Breadcrumb Link",
    type: "registry:internal",
    registryDependencies: ["breadcrumb"],
    files: [
      {
        path: "demo/breadcrumb-link.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "breadcrumb-responsive",
    title: "Breadcrumb Responsive",
    type: "registry:internal",
    registryDependencies: ["breadcrumb", "button", "drawer", "dropdown-menu"],
    files: [
      {
        path: "demo/breadcrumb-responsive.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "breadcrumb-separator",
    title: "Breadcrumb Separator",
    type: "registry:internal",
    registryDependencies: ["breadcrumb"],
    files: [
      {
        path: "demo/breadcrumb-separator.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-as-child",
    title: "Button As Child",
    type: "registry:internal",
    registryDependencies: ["button"],
    files: [
      {
        path: "demo/button-as-child.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-default",
    title: "Button Default",
    type: "registry:internal",
    registryDependencies: ["button"],
    files: [
      {
        path: "demo/button-default.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-demo",
    title: "Button Demo",
    type: "registry:internal",
    registryDependencies: ["button"],
    files: [
      {
        path: "demo/button-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-destructive",
    title: "Button Destructive",
    type: "registry:internal",
    registryDependencies: ["button"],
    files: [
      {
        path: "demo/button-destructive.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-ghost",
    title: "Button Ghost",
    type: "registry:internal",
    registryDependencies: ["button"],
    files: [
      {
        path: "demo/button-ghost.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-group-demo",
    title: "Button Group Demo",
    type: "registry:internal",
    registryDependencies: ["button", "button-group"],
    files: [
      {
        path: "demo/button-group-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-group-dropdown",
    title: "Button Group Dropdown",
    type: "registry:internal",
    registryDependencies: ["button", "button-group", "dropdown-menu"],
    files: [
      {
        path: "demo/button-group-dropdown.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-group-input-group",
    title: "Button Group Input Group",
    type: "registry:internal",
    registryDependencies: ["button", "button-group", "input-group"],
    files: [
      {
        path: "demo/button-group-input-group.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-group-input",
    title: "Button Group Input",
    type: "registry:internal",
    registryDependencies: ["button", "button-group", "input"],
    files: [
      {
        path: "demo/button-group-input.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-group-nested",
    title: "Button Group Nested",
    type: "registry:internal",
    registryDependencies: ["button", "button-group"],
    files: [
      {
        path: "demo/button-group-nested.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-group-orientation",
    title: "Button Group Orientation",
    type: "registry:internal",
    registryDependencies: ["button", "button-group"],
    files: [
      {
        path: "demo/button-group-orientation.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-group-popover",
    title: "Button Group Popover",
    type: "registry:internal",
    registryDependencies: [
      "button",
      "button-group",
      "popover",
      "separator",
      "textarea",
    ],
    files: [
      {
        path: "demo/button-group-popover.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-group-select",
    title: "Button Group Select",
    type: "registry:internal",
    registryDependencies: ["button", "button-group", "input", "select"],
    files: [
      {
        path: "demo/button-group-select.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-group-separator",
    title: "Button Group Separator",
    type: "registry:internal",
    registryDependencies: ["button", "button-group"],
    files: [
      {
        path: "demo/button-group-separator.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-group-size",
    title: "Button Group Size",
    type: "registry:internal",
    registryDependencies: ["button", "button-group"],
    files: [
      {
        path: "demo/button-group-size.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-group-split",
    title: "Button Group Split",
    type: "registry:internal",
    registryDependencies: ["button", "button-group", "dropdown-menu"],
    files: [
      {
        path: "demo/button-group-split.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-icon",
    title: "Button Icon",
    type: "registry:internal",
    registryDependencies: ["button"],
    files: [
      {
        path: "demo/button-icon.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-link",
    title: "Button Link",
    type: "registry:internal",
    registryDependencies: ["button"],
    files: [
      {
        path: "demo/button-link.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-loading",
    title: "Button Loading",
    type: "registry:internal",
    registryDependencies: ["button", "spinner"],
    files: [
      {
        path: "demo/button-loading.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-outline",
    title: "Button Outline",
    type: "registry:internal",
    registryDependencies: ["button"],
    files: [
      {
        path: "demo/button-outline.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-rounded",
    title: "Button Rounded",
    type: "registry:internal",
    registryDependencies: ["button"],
    files: [
      {
        path: "demo/button-rounded.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-secondary",
    title: "Button Secondary",
    type: "registry:internal",
    registryDependencies: ["button"],
    files: [
      {
        path: "demo/button-secondary.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-size",
    title: "Button Size",
    type: "registry:internal",
    registryDependencies: ["button"],
    files: [
      {
        path: "demo/button-size.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "button-with-icon",
    title: "Button With Icon",
    type: "registry:internal",
    registryDependencies: ["button"],
    files: [
      {
        path: "demo/button-with-icon.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "calendar-demo",
    title: "Calendar Demo",
    type: "registry:internal",
    registryDependencies: ["calendar"],
    files: [
      {
        path: "demo/calendar-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "calendar-hijri",
    title: "Calendar Hijri",
    type: "registry:internal",
    registryDependencies: ["button"],
    files: [
      {
        path: "demo/calendar-hijri.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "card-demo",
    title: "Card Demo",
    type: "registry:internal",
    registryDependencies: ["button", "card", "input", "label"],
    files: [
      {
        path: "demo/card-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "carousel-api",
    title: "Carousel Api",
    type: "registry:internal",
    registryDependencies: ["card", "carousel"],
    files: [
      {
        path: "demo/carousel-api.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "carousel-demo",
    title: "Carousel Demo",
    type: "registry:internal",
    registryDependencies: ["card", "carousel"],
    files: [
      {
        path: "demo/carousel-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "carousel-orientation",
    title: "Carousel Orientation",
    type: "registry:internal",
    registryDependencies: ["card", "carousel"],
    files: [
      {
        path: "demo/carousel-orientation.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "carousel-plugin",
    title: "Carousel Plugin",
    type: "registry:internal",
    registryDependencies: ["card", "carousel"],
    files: [
      {
        path: "demo/carousel-plugin.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "carousel-size",
    title: "Carousel Size",
    type: "registry:internal",
    registryDependencies: ["card", "carousel"],
    files: [
      {
        path: "demo/carousel-size.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "carousel-spacing",
    title: "Carousel Spacing",
    type: "registry:internal",
    registryDependencies: ["card", "carousel"],
    files: [
      {
        path: "demo/carousel-spacing.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "chart-bar-demo",
    title: "Chart Bar Demo",
    type: "registry:internal",
    registryDependencies: ["chart"],
    files: [
      {
        path: "demo/chart-bar-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "chart-bar-demo-axis",
    title: "Chart Bar Demo Axis",
    type: "registry:internal",
    registryDependencies: ["chart"],
    files: [
      {
        path: "demo/chart-bar-demo-axis.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "chart-bar-demo-grid",
    title: "Chart Bar Demo Grid",
    type: "registry:internal",
    registryDependencies: ["chart"],
    files: [
      {
        path: "demo/chart-bar-demo-grid.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "chart-bar-demo-legend",
    title: "Chart Bar Demo Legend",
    type: "registry:internal",
    registryDependencies: ["chart"],
    files: [
      {
        path: "demo/chart-bar-demo-legend.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "chart-bar-demo-tooltip",
    title: "Chart Bar Demo Tooltip",
    type: "registry:internal",
    registryDependencies: ["chart"],
    files: [
      {
        path: "demo/chart-bar-demo-tooltip.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "chart-tooltip-demo",
    title: "Chart Tooltip Demo",
    type: "registry:internal",
    registryDependencies: [],
    files: [
      {
        path: "demo/chart-tooltip-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "checkbox-demo",
    title: "Checkbox Demo",
    type: "registry:internal",
    registryDependencies: ["checkbox", "label"],
    files: [
      {
        path: "demo/checkbox-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "checkbox-disabled",
    title: "Checkbox Disabled",
    type: "registry:internal",
    registryDependencies: ["checkbox"],
    files: [
      {
        path: "demo/checkbox-disabled.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "checkbox-with-text",
    title: "Checkbox With Text",
    type: "registry:internal",
    registryDependencies: ["checkbox"],
    files: [
      {
        path: "demo/checkbox-with-text.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "collapsible-demo",
    title: "Collapsible Demo",
    type: "registry:internal",
    registryDependencies: ["button", "collapsible"],
    files: [
      {
        path: "demo/collapsible-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "combobox-demo",
    title: "Combobox Demo",
    type: "registry:internal",
    registryDependencies: ["button", "command", "popover"],
    files: [
      {
        path: "demo/combobox-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "combobox-dropdown-menu",
    title: "Combobox Dropdown Menu",
    type: "registry:internal",
    registryDependencies: ["button", "command", "dropdown-menu"],
    files: [
      {
        path: "demo/combobox-dropdown-menu.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "combobox-popover",
    title: "Combobox Popover",
    type: "registry:internal",
    registryDependencies: ["button", "command", "popover"],
    files: [
      {
        path: "demo/combobox-popover.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "combobox-responsive",
    title: "Combobox Responsive",
    type: "registry:internal",
    registryDependencies: ["button", "command", "drawer", "popover"],
    files: [
      {
        path: "demo/combobox-responsive.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "command-demo",
    title: "Command Demo",
    type: "registry:internal",
    registryDependencies: ["command"],
    files: [
      {
        path: "demo/command-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "command-dialog",
    title: "Command Dialog",
    type: "registry:internal",
    registryDependencies: ["command"],
    files: [
      {
        path: "demo/command-dialog.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "context-menu-demo",
    title: "Context Menu Demo",
    type: "registry:internal",
    registryDependencies: ["context-menu"],
    files: [
      {
        path: "demo/context-menu-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "data-table-demo",
    title: "Data Table Demo",
    type: "registry:internal",
    registryDependencies: [
      "button",
      "checkbox",
      "dropdown-menu",
      "input",
      "table",
    ],
    files: [
      {
        path: "demo/data-table-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "date-picker-demo",
    title: "Date Picker Demo",
    type: "registry:internal",
    registryDependencies: ["button", "calendar", "popover"],
    files: [
      {
        path: "demo/date-picker-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "date-picker-with-presets",
    title: "Date Picker With Presets",
    type: "registry:internal",
    registryDependencies: ["button", "calendar", "popover", "select"],
    files: [
      {
        path: "demo/date-picker-with-presets.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "date-picker-with-range",
    title: "Date Picker With Range",
    type: "registry:internal",
    registryDependencies: ["button", "calendar", "popover"],
    files: [
      {
        path: "demo/date-picker-with-range.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "dialog-close-button",
    title: "Dialog Close Button",
    type: "registry:internal",
    registryDependencies: ["button", "dialog", "input", "label"],
    files: [
      {
        path: "demo/dialog-close-button.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "dialog-demo",
    title: "Dialog Demo",
    type: "registry:internal",
    registryDependencies: ["button", "dialog", "input", "label"],
    files: [
      {
        path: "demo/dialog-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "drawer-demo",
    title: "Drawer Demo",
    type: "registry:internal",
    registryDependencies: ["button", "drawer"],
    files: [
      {
        path: "demo/drawer-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "drawer-dialog",
    title: "Drawer Dialog",
    type: "registry:internal",
    registryDependencies: ["button", "dialog", "drawer", "input", "label"],
    files: [
      {
        path: "demo/drawer-dialog.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "dropdown-menu-checkboxes",
    title: "Dropdown Menu Checkboxes",
    type: "registry:internal",
    registryDependencies: ["button", "dropdown-menu"],
    files: [
      {
        path: "demo/dropdown-menu-checkboxes.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "dropdown-menu-demo",
    title: "Dropdown Menu Demo",
    type: "registry:internal",
    registryDependencies: ["button", "dropdown-menu"],
    files: [
      {
        path: "demo/dropdown-menu-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "dropdown-menu-dialog",
    title: "Dropdown Menu Dialog",
    type: "registry:internal",
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
        path: "demo/dropdown-menu-dialog.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "dropdown-menu-radio-group",
    title: "Dropdown Menu Radio Group",
    type: "registry:internal",
    registryDependencies: ["button", "dropdown-menu"],
    files: [
      {
        path: "demo/dropdown-menu-radio-group.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "empty-avatar-group",
    title: "Empty Avatar Group",
    type: "registry:internal",
    registryDependencies: ["avatar", "button", "empty"],
    files: [
      {
        path: "demo/empty-avatar-group.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "empty-avatar",
    title: "Empty Avatar",
    type: "registry:internal",
    registryDependencies: ["avatar", "button", "empty"],
    files: [
      {
        path: "demo/empty-avatar.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "empty-background",
    title: "Empty Background",
    type: "registry:internal",
    registryDependencies: ["button", "empty"],
    files: [
      {
        path: "demo/empty-background.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "empty-demo",
    title: "Empty Demo",
    type: "registry:internal",
    registryDependencies: ["button", "empty"],
    files: [
      {
        path: "demo/empty-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "empty-icon",
    title: "Empty Icon",
    type: "registry:internal",
    registryDependencies: ["empty"],
    files: [
      {
        path: "demo/empty-icon.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "empty-input-group",
    title: "Empty Input Group",
    type: "registry:internal",
    registryDependencies: ["empty", "input-group", "kbd"],
    files: [
      {
        path: "demo/empty-input-group.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "empty-outline",
    title: "Empty Outline",
    type: "registry:internal",
    registryDependencies: ["button", "empty"],
    files: [
      {
        path: "demo/empty-outline.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "field-checkbox",
    title: "Field Checkbox",
    type: "registry:internal",
    registryDependencies: ["checkbox", "field"],
    files: [
      {
        path: "demo/field-checkbox.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "field-choice-card",
    title: "Field Choice Card",
    type: "registry:internal",
    registryDependencies: ["field", "radio-group"],
    files: [
      {
        path: "demo/field-choice-card.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "field-demo",
    title: "Field Demo",
    type: "registry:internal",
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
        path: "demo/field-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "field-fieldset",
    title: "Field Fieldset",
    type: "registry:internal",
    registryDependencies: ["field", "input"],
    files: [
      {
        path: "demo/field-fieldset.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "field-group",
    title: "Field Group",
    type: "registry:internal",
    registryDependencies: ["checkbox", "field"],
    files: [
      {
        path: "demo/field-group.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "field-input",
    title: "Field Input",
    type: "registry:internal",
    registryDependencies: ["field", "input"],
    files: [
      {
        path: "demo/field-input.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "field-radio",
    title: "Field Radio",
    type: "registry:internal",
    registryDependencies: ["field", "radio-group"],
    files: [
      {
        path: "demo/field-radio.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "field-responsive",
    title: "Field Responsive",
    type: "registry:internal",
    registryDependencies: ["button", "field", "input", "textarea"],
    files: [
      {
        path: "demo/field-responsive.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "field-select",
    title: "Field Select",
    type: "registry:internal",
    registryDependencies: ["field", "select"],
    files: [
      {
        path: "demo/field-select.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "field-slider",
    title: "Field Slider",
    type: "registry:internal",
    registryDependencies: ["field", "slider"],
    files: [
      {
        path: "demo/field-slider.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "field-switch",
    title: "Field Switch",
    type: "registry:internal",
    registryDependencies: ["field", "switch"],
    files: [
      {
        path: "demo/field-switch.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "field-textarea",
    title: "Field Textarea",
    type: "registry:internal",
    registryDependencies: ["field", "textarea"],
    files: [
      {
        path: "demo/field-textarea.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "hover-card-demo",
    title: "Hover Card Demo",
    type: "registry:internal",
    registryDependencies: ["avatar", "button", "hover-card"],
    files: [
      {
        path: "demo/hover-card-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "input-demo",
    title: "Input Demo",
    type: "registry:internal",
    registryDependencies: ["input"],
    files: [
      {
        path: "demo/input-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "input-disabled",
    title: "Input Disabled",
    type: "registry:internal",
    registryDependencies: ["input"],
    files: [
      {
        path: "demo/input-disabled.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "input-file",
    title: "Input File",
    type: "registry:internal",
    registryDependencies: ["input", "label"],
    files: [
      {
        path: "demo/input-file.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "input-group-button-group",
    title: "Input Group Button Group",
    type: "registry:internal",
    registryDependencies: ["button-group", "input-group", "label"],
    files: [
      {
        path: "demo/input-group-button-group.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "input-group-button",
    title: "Input Group Button",
    type: "registry:internal",
    registryDependencies: ["input-group"],
    files: [
      {
        path: "demo/input-group-button.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "input-group-custom",
    title: "Input Group Custom",
    type: "registry:internal",
    registryDependencies: ["input-group"],
    files: [
      {
        path: "demo/input-group-custom.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "input-group-demo",
    title: "Input Group Demo",
    type: "registry:internal",
    registryDependencies: [
      "dropdown-menu",
      "input-group",
      "separator",
      "tooltip",
    ],
    files: [
      {
        path: "demo/input-group-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "input-group-dropdown",
    title: "Input Group Dropdown",
    type: "registry:internal",
    registryDependencies: ["dropdown-menu", "input-group"],
    files: [
      {
        path: "demo/input-group-dropdown.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "input-group-icon",
    title: "Input Group Icon",
    type: "registry:internal",
    registryDependencies: ["input-group"],
    files: [
      {
        path: "demo/input-group-icon.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "input-group-label",
    title: "Input Group Label",
    type: "registry:internal",
    registryDependencies: ["input-group", "label"],
    files: [
      {
        path: "demo/input-group-label.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "input-group-spinner",
    title: "Input Group Spinner",
    type: "registry:internal",
    registryDependencies: ["input-group", "spinner"],
    files: [
      {
        path: "demo/input-group-spinner.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "input-group-text",
    title: "Input Group Text",
    type: "registry:internal",
    registryDependencies: ["input-group"],
    files: [
      {
        path: "demo/input-group-text.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "input-group-textarea",
    title: "Input Group Textarea",
    type: "registry:internal",
    registryDependencies: ["input-group"],
    files: [
      {
        path: "demo/input-group-textarea.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "input-group-tooltip",
    title: "Input Group Tooltip",
    type: "registry:internal",
    registryDependencies: ["input-group", "tooltip"],
    files: [
      {
        path: "demo/input-group-tooltip.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "input-otp-controlled",
    title: "Input OTP Controlled",
    type: "registry:internal",
    registryDependencies: ["input-otp"],
    files: [
      {
        path: "demo/input-otp-controlled.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "input-otp-demo",
    title: "Input OTP Demo",
    type: "registry:internal",
    registryDependencies: ["input-otp"],
    files: [
      {
        path: "demo/input-otp-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "input-otp-pattern",
    title: "Input OTP Pattern",
    type: "registry:internal",
    registryDependencies: ["input-otp"],
    files: [
      {
        path: "demo/input-otp-pattern.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "input-otp-separator",
    title: "Input OTP Separator",
    type: "registry:internal",
    registryDependencies: ["input-otp"],
    files: [
      {
        path: "demo/input-otp-separator.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "input-with-button",
    title: "Input With Button",
    type: "registry:internal",
    registryDependencies: ["button", "input"],
    files: [
      {
        path: "demo/input-with-button.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "input-with-label",
    title: "Input With Label",
    type: "registry:internal",
    registryDependencies: ["input", "label"],
    files: [
      {
        path: "demo/input-with-label.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "input-with-text",
    title: "Input With Text",
    type: "registry:internal",
    registryDependencies: ["input", "label"],
    files: [
      {
        path: "demo/input-with-text.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "item-avatar",
    title: "Item Avatar",
    type: "registry:internal",
    registryDependencies: ["avatar", "button", "item"],
    files: [
      {
        path: "demo/item-avatar.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "item-demo",
    title: "Item Demo",
    type: "registry:internal",
    registryDependencies: ["button", "item"],
    files: [
      {
        path: "demo/item-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "item-dropdown",
    title: "Item Dropdown",
    type: "registry:internal",
    registryDependencies: ["button", "dropdown-menu", "item"],
    files: [
      {
        path: "demo/item-dropdown.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "item-group",
    title: "Item Group",
    type: "registry:internal",
    registryDependencies: ["avatar", "button", "item"],
    files: [
      {
        path: "demo/item-group.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "item-header",
    title: "Item Header",
    type: "registry:internal",
    registryDependencies: ["item"],
    files: [
      {
        path: "demo/item-header.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "item-icon",
    title: "Item Icon",
    type: "registry:internal",
    registryDependencies: ["button", "item"],
    files: [
      {
        path: "demo/item-icon.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "item-image",
    title: "Item Image",
    type: "registry:internal",
    registryDependencies: ["item"],
    files: [
      {
        path: "demo/item-image.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "item-link",
    title: "Item Link",
    type: "registry:internal",
    registryDependencies: ["item"],
    files: [
      {
        path: "demo/item-link.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "item-size",
    title: "Item Size",
    type: "registry:internal",
    registryDependencies: ["button", "item"],
    files: [
      {
        path: "demo/item-size.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "item-variant",
    title: "Item Variant",
    type: "registry:internal",
    registryDependencies: ["item"],
    files: [
      {
        path: "demo/item-variant.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "kbd-button",
    title: "Kbd Button",
    type: "registry:internal",
    registryDependencies: ["button", "kbd"],
    files: [
      {
        path: "demo/kbd-button.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "kbd-demo",
    title: "Kbd Demo",
    type: "registry:internal",
    registryDependencies: ["kbd"],
    files: [
      {
        path: "demo/kbd-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "kbd-group",
    title: "Kbd Group",
    type: "registry:internal",
    registryDependencies: ["kbd"],
    files: [
      {
        path: "demo/kbd-group.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "kbd-input-group",
    title: "Kbd Input Group",
    type: "registry:internal",
    registryDependencies: ["input-group", "kbd"],
    files: [
      {
        path: "demo/kbd-input-group.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "kbd-tooltip",
    title: "Kbd Tooltip",
    type: "registry:internal",
    registryDependencies: ["button", "button-group", "kbd", "tooltip"],
    files: [
      {
        path: "demo/kbd-tooltip.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "label-demo",
    title: "Label Demo",
    type: "registry:internal",
    registryDependencies: ["checkbox", "label"],
    files: [
      {
        path: "demo/label-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "menubar-demo",
    title: "Menubar Demo",
    type: "registry:internal",
    registryDependencies: ["menubar"],
    files: [
      {
        path: "demo/menubar-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "native-select-demo",
    title: "Native Select Demo",
    type: "registry:internal",
    registryDependencies: ["native-select"],
    files: [
      {
        path: "demo/native-select-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "native-select-disabled",
    title: "Native Select Disabled",
    type: "registry:internal",
    registryDependencies: ["native-select"],
    files: [
      {
        path: "demo/native-select-disabled.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "native-select-groups",
    title: "Native Select Groups",
    type: "registry:internal",
    registryDependencies: ["native-select"],
    files: [
      {
        path: "demo/native-select-groups.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "native-select-invalid",
    title: "Native Select Invalid",
    type: "registry:internal",
    registryDependencies: ["native-select"],
    files: [
      {
        path: "demo/native-select-invalid.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "navigation-menu-demo",
    title: "Navigation Menu Demo",
    type: "registry:internal",
    registryDependencies: ["navigation-menu"],
    files: [
      {
        path: "demo/navigation-menu-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "pagination-demo",
    title: "Pagination Demo",
    type: "registry:internal",
    registryDependencies: ["pagination"],
    files: [
      {
        path: "demo/pagination-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "popover-demo",
    title: "Popover Demo",
    type: "registry:internal",
    registryDependencies: ["button", "input", "label", "popover"],
    files: [
      {
        path: "demo/popover-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "progress-demo",
    title: "Progress Demo",
    type: "registry:internal",
    registryDependencies: ["progress"],
    files: [
      {
        path: "demo/progress-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "radio-group-demo",
    title: "Radio Group Demo",
    type: "registry:internal",
    registryDependencies: ["label", "radio-group"],
    files: [
      {
        path: "demo/radio-group-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "resizable-demo",
    title: "Resizable Demo",
    type: "registry:internal",
    registryDependencies: ["resizable"],
    files: [
      {
        path: "demo/resizable-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "resizable-demo-with-handle",
    title: "Resizable Demo With Handle",
    type: "registry:internal",
    registryDependencies: ["resizable"],
    files: [
      {
        path: "demo/resizable-demo-with-handle.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "resizable-handle",
    title: "Resizable Handle",
    type: "registry:internal",
    registryDependencies: ["resizable"],
    files: [
      {
        path: "demo/resizable-handle.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "resizable-vertical",
    title: "Resizable Vertical",
    type: "registry:internal",
    registryDependencies: ["resizable"],
    files: [
      {
        path: "demo/resizable-vertical.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "scroll-area-demo",
    title: "Scroll Area Demo",
    type: "registry:internal",
    registryDependencies: ["scroll-area", "separator"],
    files: [
      {
        path: "demo/scroll-area-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "scroll-area-horizontal-demo",
    title: "Scroll Area Horizontal Demo",
    type: "registry:internal",
    registryDependencies: ["scroll-area"],
    files: [
      {
        path: "demo/scroll-area-horizontal-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "select-demo",
    title: "Select Demo",
    type: "registry:internal",
    registryDependencies: ["select"],
    files: [
      {
        path: "demo/select-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "select-scrollable",
    title: "Select Scrollable",
    type: "registry:internal",
    registryDependencies: ["select"],
    files: [
      {
        path: "demo/select-scrollable.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "separator-demo",
    title: "Separator Demo",
    type: "registry:internal",
    registryDependencies: ["separator"],
    files: [
      {
        path: "demo/separator-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "sheet-demo",
    title: "Sheet Demo",
    type: "registry:internal",
    registryDependencies: ["button", "input", "label", "sheet"],
    files: [
      {
        path: "demo/sheet-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "sheet-side",
    title: "Sheet Side",
    type: "registry:internal",
    registryDependencies: ["button", "input", "label", "sheet"],
    files: [
      {
        path: "demo/sheet-side.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "skeleton-card",
    title: "Skeleton Card",
    type: "registry:internal",
    registryDependencies: ["skeleton"],
    files: [
      {
        path: "demo/skeleton-card.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "skeleton-demo",
    title: "Skeleton Demo",
    type: "registry:internal",
    registryDependencies: ["skeleton"],
    files: [
      {
        path: "demo/skeleton-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "slider-demo",
    title: "Slider Demo",
    type: "registry:internal",
    registryDependencies: ["slider"],
    files: [
      {
        path: "demo/slider-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "sonner-demo",
    title: "Sonner Demo",
    type: "registry:internal",
    registryDependencies: ["button", "sonner"],
    files: [
      {
        path: "demo/sonner-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "sonner-types",
    title: "Sonner Types",
    type: "registry:internal",
    registryDependencies: ["button", "sonner"],
    files: [
      {
        path: "demo/sonner-types.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "spinner-badge",
    title: "Spinner Badge",
    type: "registry:internal",
    registryDependencies: ["badge", "spinner"],
    files: [
      {
        path: "demo/spinner-badge.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "spinner-basic",
    title: "Spinner Basic",
    type: "registry:internal",
    registryDependencies: ["spinner"],
    files: [
      {
        path: "demo/spinner-basic.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "spinner-button",
    title: "Spinner Button",
    type: "registry:internal",
    registryDependencies: ["button", "spinner"],
    files: [
      {
        path: "demo/spinner-button.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "spinner-color",
    title: "Spinner Color",
    type: "registry:internal",
    registryDependencies: ["spinner"],
    files: [
      {
        path: "demo/spinner-color.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "spinner-custom",
    title: "Spinner Custom",
    type: "registry:internal",
    registryDependencies: ["spinner"],
    files: [
      {
        path: "demo/spinner-custom.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "spinner-demo",
    title: "Spinner Demo",
    type: "registry:internal",
    registryDependencies: ["spinner"],
    files: [
      {
        path: "demo/spinner-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "spinner-empty",
    title: "Spinner Empty",
    type: "registry:internal",
    registryDependencies: ["empty", "spinner"],
    files: [
      {
        path: "demo/spinner-empty.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "spinner-input-group",
    title: "Spinner Input Group",
    type: "registry:internal",
    registryDependencies: ["input-group", "spinner"],
    files: [
      {
        path: "demo/spinner-input-group.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "spinner-item",
    title: "Spinner Item",
    type: "registry:internal",
    registryDependencies: ["button", "item", "progress", "spinner"],
    files: [
      {
        path: "demo/spinner-item.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "spinner-size",
    title: "Spinner Size",
    type: "registry:internal",
    registryDependencies: ["spinner"],
    files: [
      {
        path: "demo/spinner-size.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "switch-demo",
    title: "Switch Demo",
    type: "registry:internal",
    registryDependencies: ["label", "switch"],
    files: [
      {
        path: "demo/switch-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "table-demo",
    title: "Table Demo",
    type: "registry:internal",
    registryDependencies: ["table"],
    files: [
      {
        path: "demo/table-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "tabs-demo",
    title: "Tabs Demo",
    type: "registry:internal",
    registryDependencies: ["button", "card", "input", "label", "tabs"],
    files: [
      {
        path: "demo/tabs-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "textarea-demo",
    title: "Textarea Demo",
    type: "registry:internal",
    registryDependencies: ["textarea"],
    files: [
      {
        path: "demo/textarea-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "textarea-disabled",
    title: "Textarea Disabled",
    type: "registry:internal",
    registryDependencies: ["textarea"],
    files: [
      {
        path: "demo/textarea-disabled.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "textarea-with-button",
    title: "Textarea With Button",
    type: "registry:internal",
    registryDependencies: ["button", "textarea"],
    files: [
      {
        path: "demo/textarea-with-button.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "textarea-with-label",
    title: "Textarea With Label",
    type: "registry:internal",
    registryDependencies: ["label", "textarea"],
    files: [
      {
        path: "demo/textarea-with-label.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "textarea-with-text",
    title: "Textarea With Text",
    type: "registry:internal",
    registryDependencies: ["label", "textarea"],
    files: [
      {
        path: "demo/textarea-with-text.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "toggle-demo",
    title: "Toggle Demo",
    type: "registry:internal",
    registryDependencies: ["toggle"],
    files: [
      {
        path: "demo/toggle-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "toggle-disabled",
    title: "Toggle Disabled",
    type: "registry:internal",
    registryDependencies: ["toggle"],
    files: [
      {
        path: "demo/toggle-disabled.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "toggle-group-demo",
    title: "Toggle Group Demo",
    type: "registry:internal",
    registryDependencies: ["toggle-group"],
    files: [
      {
        path: "demo/toggle-group-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "toggle-group-disabled",
    title: "Toggle Group Disabled",
    type: "registry:internal",
    registryDependencies: ["toggle-group"],
    files: [
      {
        path: "demo/toggle-group-disabled.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "toggle-group-lg",
    title: "Toggle Group Lg",
    type: "registry:internal",
    registryDependencies: ["toggle-group"],
    files: [
      {
        path: "demo/toggle-group-lg.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "toggle-group-outline",
    title: "Toggle Group Outline",
    type: "registry:internal",
    registryDependencies: ["toggle-group"],
    files: [
      {
        path: "demo/toggle-group-outline.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "toggle-group-single",
    title: "Toggle Group Single",
    type: "registry:internal",
    registryDependencies: ["toggle-group"],
    files: [
      {
        path: "demo/toggle-group-single.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "toggle-group-sm",
    title: "Toggle Group Sm",
    type: "registry:internal",
    registryDependencies: ["toggle-group"],
    files: [
      {
        path: "demo/toggle-group-sm.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "toggle-group-spacing",
    title: "Toggle Group Spacing",
    type: "registry:internal",
    registryDependencies: ["toggle-group"],
    files: [
      {
        path: "demo/toggle-group-spacing.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "toggle-lg",
    title: "Toggle Lg",
    type: "registry:internal",
    registryDependencies: ["toggle"],
    files: [
      {
        path: "demo/toggle-lg.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "toggle-outline",
    title: "Toggle Outline",
    type: "registry:internal",
    registryDependencies: ["toggle"],
    files: [
      {
        path: "demo/toggle-outline.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "toggle-sm",
    title: "Toggle Sm",
    type: "registry:internal",
    registryDependencies: ["toggle"],
    files: [
      {
        path: "demo/toggle-sm.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "toggle-with-text",
    title: "Toggle With Text",
    type: "registry:internal",
    registryDependencies: ["toggle"],
    files: [
      {
        path: "demo/toggle-with-text.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "tooltip-demo",
    title: "Tooltip Demo",
    type: "registry:internal",
    registryDependencies: ["button", "tooltip"],
    files: [
      {
        path: "demo/tooltip-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "typography-blockquote",
    title: "Typography Blockquote",
    type: "registry:internal",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-blockquote.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "typography-demo",
    title: "Typography Demo",
    type: "registry:internal",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-demo.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "typography-h1",
    title: "Typography H1",
    type: "registry:internal",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-h1.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "typography-h2",
    title: "Typography H2",
    type: "registry:internal",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-h2.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "typography-h3",
    title: "Typography H3",
    type: "registry:internal",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-h3.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "typography-h4",
    title: "Typography H4",
    type: "registry:internal",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-h4.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "typography-inline-code",
    title: "Typography Inline Code",
    type: "registry:internal",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-inline-code.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "typography-large",
    title: "Typography Large",
    type: "registry:internal",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-large.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "typography-lead",
    title: "Typography Lead",
    type: "registry:internal",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-lead.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "typography-list",
    title: "Typography List",
    type: "registry:internal",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-list.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "typography-muted",
    title: "Typography Muted",
    type: "registry:internal",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-muted.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "typography-p",
    title: "Typography P",
    type: "registry:internal",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-p.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "typography-small",
    title: "Typography Small",
    type: "registry:internal",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-small.tsx",
        type: "registry:internal",
      },
    ],
  },
  {
    name: "typography-table",
    title: "Typography Table",
    type: "registry:internal",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-table.tsx",
        type: "registry:internal",
      },
    ],
  },
]
