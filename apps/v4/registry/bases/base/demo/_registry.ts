import { type Registry } from "shadcn/schema"

export const demo: Registry["items"] = [
  {
    name: "accordion-demo",
    title: "Accordion Demo",
    type: "registry:example",
    registryDependencies: ["accordion"],
    files: [
      {
        path: "demo/accordion-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "accordion-disabled",
    title: "Accordion Disabled",
    type: "registry:example",
    registryDependencies: ["accordion"],
    files: [
      {
        path: "demo/accordion-disabled.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "accordion-multiple",
    title: "Accordion Multiple",
    type: "registry:example",
    registryDependencies: ["accordion"],
    files: [
      {
        path: "demo/accordion-multiple.tsx",
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
        path: "demo/alert-demo.tsx",
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
        path: "demo/alert-destructive.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "alert-dialog-demo",
    title: "Alert Dialog Demo",
    type: "registry:example",
    registryDependencies: ["alert-dialog", "button"],
    files: [
      {
        path: "demo/alert-dialog-demo.tsx",
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
        path: "demo/aspect-ratio-demo.tsx",
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
        path: "demo/avatar-demo.tsx",
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
        path: "demo/badge-demo.tsx",
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
        path: "demo/badge-destructive.tsx",
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
        path: "demo/badge-outline.tsx",
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
        path: "demo/badge-secondary.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "breadcrumb-demo",
    title: "Breadcrumb Demo",
    type: "registry:example",
    registryDependencies: ["breadcrumb", "dropdown-menu"],
    files: [
      {
        path: "demo/breadcrumb-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "breadcrumb-dropdown",
    title: "Breadcrumb Dropdown",
    type: "registry:example",
    registryDependencies: ["breadcrumb", "dropdown-menu"],
    files: [
      {
        path: "demo/breadcrumb-dropdown.tsx",
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
        path: "demo/breadcrumb-ellipsis.tsx",
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
        path: "demo/breadcrumb-link.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "breadcrumb-responsive",
    title: "Breadcrumb Responsive",
    type: "registry:example",
    registryDependencies: ["breadcrumb", "button", "drawer", "dropdown-menu"],
    files: [
      {
        path: "demo/breadcrumb-responsive.tsx",
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
        path: "demo/breadcrumb-separator.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-as-child",
    title: "Button As Child",
    type: "registry:example",
    registryDependencies: ["button"],
    files: [
      {
        path: "demo/button-as-child.tsx",
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
        path: "demo/button-default.tsx",
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
        path: "demo/button-demo.tsx",
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
        path: "demo/button-destructive.tsx",
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
        path: "demo/button-ghost.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-demo",
    title: "Button Group Demo",
    type: "registry:example",
    registryDependencies: ["button", "button-group", "dropdown-menu"],
    files: [
      {
        path: "demo/button-group-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-dropdown",
    title: "Button Group Dropdown",
    type: "registry:example",
    registryDependencies: ["button", "button-group", "dropdown-menu"],
    files: [
      {
        path: "demo/button-group-dropdown.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-input-group",
    title: "Button Group Input Group",
    type: "registry:example",
    registryDependencies: ["button", "button-group", "input-group", "tooltip"],
    files: [
      {
        path: "demo/button-group-input-group.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-input",
    title: "Button Group Input",
    type: "registry:example",
    registryDependencies: ["button", "button-group", "input"],
    files: [
      {
        path: "demo/button-group-input.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-nested",
    title: "Button Group Nested",
    type: "registry:example",
    registryDependencies: ["button", "button-group"],
    files: [
      {
        path: "demo/button-group-nested.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-orientation",
    title: "Button Group Orientation",
    type: "registry:example",
    registryDependencies: ["button", "button-group"],
    files: [
      {
        path: "demo/button-group-orientation.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-popover",
    title: "Button Group Popover",
    type: "registry:example",
    registryDependencies: ["button", "button-group", "popover", "separator", "textarea"],
    files: [
      {
        path: "demo/button-group-popover.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-select",
    title: "Button Group Select",
    type: "registry:example",
    registryDependencies: ["button", "button-group", "input", "select"],
    files: [
      {
        path: "demo/button-group-select.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-separator",
    title: "Button Group Separator",
    type: "registry:example",
    registryDependencies: ["button", "button-group"],
    files: [
      {
        path: "demo/button-group-separator.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-size",
    title: "Button Group Size",
    type: "registry:example",
    registryDependencies: ["button", "button-group"],
    files: [
      {
        path: "demo/button-group-size.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-split",
    title: "Button Group Split",
    type: "registry:example",
    registryDependencies: ["button", "button-group"],
    files: [
      {
        path: "demo/button-group-split.tsx",
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
        path: "demo/button-icon.tsx",
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
        path: "demo/button-link.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-loading",
    title: "Button Loading",
    type: "registry:example",
    registryDependencies: ["button", "spinner"],
    files: [
      {
        path: "demo/button-loading.tsx",
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
        path: "demo/button-outline.tsx",
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
        path: "demo/button-rounded.tsx",
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
        path: "demo/button-secondary.tsx",
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
        path: "demo/button-size.tsx",
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
        path: "demo/button-with-icon.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "calendar-demo",
    title: "Calendar Demo",
    type: "registry:example",
    registryDependencies: ["calendar"],
    files: [
      {
        path: "demo/calendar-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "calendar-hijri",
    title: "Calendar Hijri",
    type: "registry:example",
    registryDependencies: ["button"],
    files: [
      {
        path: "demo/calendar-hijri.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "card-demo",
    title: "Card Demo",
    type: "registry:example",
    registryDependencies: ["button", "card", "input", "label"],
    files: [
      {
        path: "demo/card-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "carousel-api",
    title: "Carousel Api",
    type: "registry:example",
    registryDependencies: ["card", "carousel"],
    files: [
      {
        path: "demo/carousel-api.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "carousel-demo",
    title: "Carousel Demo",
    type: "registry:example",
    registryDependencies: ["card", "carousel"],
    files: [
      {
        path: "demo/carousel-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "carousel-orientation",
    title: "Carousel Orientation",
    type: "registry:example",
    registryDependencies: ["card", "carousel"],
    files: [
      {
        path: "demo/carousel-orientation.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "carousel-plugin",
    title: "Carousel Plugin",
    type: "registry:example",
    registryDependencies: ["card", "carousel"],
    files: [
      {
        path: "demo/carousel-plugin.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "carousel-size",
    title: "Carousel Size",
    type: "registry:example",
    registryDependencies: ["card", "carousel"],
    files: [
      {
        path: "demo/carousel-size.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "carousel-spacing",
    title: "Carousel Spacing",
    type: "registry:example",
    registryDependencies: ["card", "carousel"],
    files: [
      {
        path: "demo/carousel-spacing.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "chart-bar-demo-axis",
    title: "Chart Bar Demo Axis",
    type: "registry:example",
    registryDependencies: ["chart"],
    files: [
      {
        path: "demo/chart-bar-demo-axis.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "chart-bar-demo-grid",
    title: "Chart Bar Demo Grid",
    type: "registry:example",
    registryDependencies: ["chart"],
    files: [
      {
        path: "demo/chart-bar-demo-grid.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "chart-bar-demo-legend",
    title: "Chart Bar Demo Legend",
    type: "registry:example",
    registryDependencies: ["chart"],
    files: [
      {
        path: "demo/chart-bar-demo-legend.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "chart-bar-demo-tooltip",
    title: "Chart Bar Demo Tooltip",
    type: "registry:example",
    registryDependencies: ["chart"],
    files: [
      {
        path: "demo/chart-bar-demo-tooltip.tsx",
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
        path: "demo/chart-bar-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "chart-tooltip-demo",
    title: "Chart Tooltip Demo",
    type: "registry:example",
    registryDependencies: [],
    files: [
      {
        path: "demo/chart-tooltip-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "checkbox-demo",
    title: "Checkbox Demo",
    type: "registry:example",
    registryDependencies: ["checkbox", "label"],
    files: [
      {
        path: "demo/checkbox-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "checkbox-disabled",
    title: "Checkbox Disabled",
    type: "registry:example",
    registryDependencies: ["checkbox"],
    files: [
      {
        path: "demo/checkbox-disabled.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "checkbox-with-text",
    title: "Checkbox With Text",
    type: "registry:example",
    registryDependencies: ["checkbox"],
    files: [
      {
        path: "demo/checkbox-with-text.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "collapsible-demo",
    title: "Collapsible Demo",
    type: "registry:example",
    registryDependencies: ["button", "collapsible"],
    files: [
      {
        path: "demo/collapsible-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "combobox-demo",
    title: "Combobox Demo",
    type: "registry:example",
    registryDependencies: ["button", "command", "popover"],
    files: [
      {
        path: "demo/combobox-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "combobox-dropdown-menu",
    title: "Combobox Dropdown Menu",
    type: "registry:example",
    registryDependencies: ["button", "command", "dropdown-menu"],
    files: [
      {
        path: "demo/combobox-dropdown-menu.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "combobox-popover",
    title: "Combobox Popover",
    type: "registry:example",
    registryDependencies: ["button", "command", "popover"],
    files: [
      {
        path: "demo/combobox-popover.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "combobox-responsive",
    title: "Combobox Responsive",
    type: "registry:example",
    registryDependencies: ["button", "command", "drawer", "popover"],
    files: [
      {
        path: "demo/combobox-responsive.tsx",
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
        path: "demo/command-demo.tsx",
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
        path: "demo/command-dialog.tsx",
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
        path: "demo/context-menu-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "data-table-demo",
    title: "Data Table Demo",
    type: "registry:example",
    registryDependencies: ["button", "checkbox", "dropdown-menu", "input", "table"],
    files: [
      {
        path: "demo/data-table-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "date-picker-demo",
    title: "Date Picker Demo",
    type: "registry:example",
    registryDependencies: ["button", "calendar", "popover"],
    files: [
      {
        path: "demo/date-picker-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "date-picker-with-presets",
    title: "Date Picker With Presets",
    type: "registry:example",
    registryDependencies: ["button", "calendar", "popover", "select"],
    files: [
      {
        path: "demo/date-picker-with-presets.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "date-picker-with-range",
    title: "Date Picker With Range",
    type: "registry:example",
    registryDependencies: ["button", "calendar", "popover"],
    files: [
      {
        path: "demo/date-picker-with-range.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "dialog-close-button",
    title: "Dialog Close Button",
    type: "registry:example",
    registryDependencies: ["button", "dialog", "input", "label"],
    files: [
      {
        path: "demo/dialog-close-button.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "dialog-demo",
    title: "Dialog Demo",
    type: "registry:example",
    registryDependencies: ["button", "dialog", "input", "label"],
    files: [
      {
        path: "demo/dialog-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "drawer-demo",
    title: "Drawer Demo",
    type: "registry:example",
    registryDependencies: ["button", "drawer"],
    files: [
      {
        path: "demo/drawer-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "drawer-dialog",
    title: "Drawer Dialog",
    type: "registry:example",
    registryDependencies: ["button", "dialog", "drawer", "input", "label"],
    files: [
      {
        path: "demo/drawer-dialog.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "dropdown-menu-checkboxes",
    title: "Dropdown Menu Checkboxes",
    type: "registry:example",
    registryDependencies: ["button", "dropdown-menu"],
    files: [
      {
        path: "demo/dropdown-menu-checkboxes.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "dropdown-menu-demo",
    title: "Dropdown Menu Demo",
    type: "registry:example",
    registryDependencies: ["button", "dropdown-menu"],
    files: [
      {
        path: "demo/dropdown-menu-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "dropdown-menu-dialog",
    title: "Dropdown Menu Dialog",
    type: "registry:example",
    registryDependencies: ["button", "dialog", "dropdown-menu", "field", "input", "label", "textarea"],
    files: [
      {
        path: "demo/dropdown-menu-dialog.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "dropdown-menu-radio-group",
    title: "Dropdown Menu Radio Group",
    type: "registry:example",
    registryDependencies: ["button", "dropdown-menu"],
    files: [
      {
        path: "demo/dropdown-menu-radio-group.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "empty-avatar-group",
    title: "Empty Avatar Group",
    type: "registry:example",
    registryDependencies: ["avatar", "button", "empty"],
    files: [
      {
        path: "demo/empty-avatar-group.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "empty-avatar",
    title: "Empty Avatar",
    type: "registry:example",
    registryDependencies: ["avatar", "button", "empty"],
    files: [
      {
        path: "demo/empty-avatar.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "empty-background",
    title: "Empty Background",
    type: "registry:example",
    registryDependencies: ["button", "empty"],
    files: [
      {
        path: "demo/empty-background.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "empty-demo",
    title: "Empty Demo",
    type: "registry:example",
    registryDependencies: ["button", "empty"],
    files: [
      {
        path: "demo/empty-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "empty-icon",
    title: "Empty Icon",
    type: "registry:example",
    registryDependencies: ["empty"],
    files: [
      {
        path: "demo/empty-icon.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "empty-input-group",
    title: "Empty Input Group",
    type: "registry:example",
    registryDependencies: ["empty", "input-group", "kbd"],
    files: [
      {
        path: "demo/empty-input-group.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "empty-outline",
    title: "Empty Outline",
    type: "registry:example",
    registryDependencies: ["button", "empty"],
    files: [
      {
        path: "demo/empty-outline.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-checkbox",
    title: "Field Checkbox",
    type: "registry:example",
    registryDependencies: ["checkbox", "field"],
    files: [
      {
        path: "demo/field-checkbox.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-choice-card",
    title: "Field Choice Card",
    type: "registry:example",
    registryDependencies: ["field", "radio-group"],
    files: [
      {
        path: "demo/field-choice-card.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-demo",
    title: "Field Demo",
    type: "registry:example",
    registryDependencies: ["button", "checkbox", "field", "input", "select", "textarea"],
    files: [
      {
        path: "demo/field-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-fieldset",
    title: "Field Fieldset",
    type: "registry:example",
    registryDependencies: ["field", "input"],
    files: [
      {
        path: "demo/field-fieldset.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-group",
    title: "Field Group",
    type: "registry:example",
    registryDependencies: ["checkbox", "field"],
    files: [
      {
        path: "demo/field-group.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-input",
    title: "Field Input",
    type: "registry:example",
    registryDependencies: ["field", "input"],
    files: [
      {
        path: "demo/field-input.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-radio",
    title: "Field Radio",
    type: "registry:example",
    registryDependencies: ["field", "radio-group"],
    files: [
      {
        path: "demo/field-radio.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-responsive",
    title: "Field Responsive",
    type: "registry:example",
    registryDependencies: ["button", "field", "input", "textarea"],
    files: [
      {
        path: "demo/field-responsive.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-select",
    title: "Field Select",
    type: "registry:example",
    registryDependencies: ["field", "select"],
    files: [
      {
        path: "demo/field-select.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-slider",
    title: "Field Slider",
    type: "registry:example",
    registryDependencies: ["field", "slider"],
    files: [
      {
        path: "demo/field-slider.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-switch",
    title: "Field Switch",
    type: "registry:example",
    registryDependencies: ["field", "switch"],
    files: [
      {
        path: "demo/field-switch.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-textarea",
    title: "Field Textarea",
    type: "registry:example",
    registryDependencies: ["field", "textarea"],
    files: [
      {
        path: "demo/field-textarea.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "hover-card-demo",
    title: "Hover Card Demo",
    type: "registry:example",
    registryDependencies: ["avatar", "button", "hover-card"],
    files: [
      {
        path: "demo/hover-card-demo.tsx",
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
        path: "demo/input-demo.tsx",
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
        path: "demo/input-disabled.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-file",
    title: "Input File",
    type: "registry:example",
    registryDependencies: ["input", "label"],
    files: [
      {
        path: "demo/input-file.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-button-group",
    title: "Input Group Button Group",
    type: "registry:example",
    registryDependencies: ["button-group", "input-group", "label"],
    files: [
      {
        path: "demo/input-group-button-group.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-button",
    title: "Input Group Button",
    type: "registry:example",
    registryDependencies: ["input-group", "popover"],
    files: [
      {
        path: "demo/input-group-button.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-custom",
    title: "Input Group Custom",
    type: "registry:example",
    registryDependencies: ["input-group"],
    files: [
      {
        path: "demo/input-group-custom.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-demo",
    title: "Input Group Demo",
    type: "registry:example",
    registryDependencies: ["dropdown-menu", "input-group", "separator", "tooltip"],
    files: [
      {
        path: "demo/input-group-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-dropdown",
    title: "Input Group Dropdown",
    type: "registry:example",
    registryDependencies: ["dropdown-menu", "input-group"],
    files: [
      {
        path: "demo/input-group-dropdown.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-icon",
    title: "Input Group Icon",
    type: "registry:example",
    registryDependencies: ["input-group"],
    files: [
      {
        path: "demo/input-group-icon.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-label",
    title: "Input Group Label",
    type: "registry:example",
    registryDependencies: ["input-group", "label", "tooltip"],
    files: [
      {
        path: "demo/input-group-label.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-spinner",
    title: "Input Group Spinner",
    type: "registry:example",
    registryDependencies: ["input-group", "spinner"],
    files: [
      {
        path: "demo/input-group-spinner.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-text",
    title: "Input Group Text",
    type: "registry:example",
    registryDependencies: ["input-group"],
    files: [
      {
        path: "demo/input-group-text.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-textarea",
    title: "Input Group Textarea",
    type: "registry:example",
    registryDependencies: ["input-group"],
    files: [
      {
        path: "demo/input-group-textarea.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-tooltip",
    title: "Input Group Tooltip",
    type: "registry:example",
    registryDependencies: ["input-group", "tooltip"],
    files: [
      {
        path: "demo/input-group-tooltip.tsx",
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
        path: "demo/input-otp-controlled.tsx",
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
        path: "demo/input-otp-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-otp-pattern",
    title: "Input Otp Pattern",
    type: "registry:example",
    registryDependencies: ["input-otp"],
    files: [
      {
        path: "demo/input-otp-pattern.tsx",
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
        path: "demo/input-otp-separator.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-with-button",
    title: "Input With Button",
    type: "registry:example",
    registryDependencies: ["button", "input"],
    files: [
      {
        path: "demo/input-with-button.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-with-label",
    title: "Input With Label",
    type: "registry:example",
    registryDependencies: ["input", "label"],
    files: [
      {
        path: "demo/input-with-label.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-with-text",
    title: "Input With Text",
    type: "registry:example",
    registryDependencies: ["input", "label"],
    files: [
      {
        path: "demo/input-with-text.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "item-avatar",
    title: "Item Avatar",
    type: "registry:example",
    registryDependencies: ["avatar", "button", "item"],
    files: [
      {
        path: "demo/item-avatar.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "item-demo",
    title: "Item Demo",
    type: "registry:example",
    registryDependencies: ["button", "item"],
    files: [
      {
        path: "demo/item-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "item-dropdown",
    title: "Item Dropdown",
    type: "registry:example",
    registryDependencies: ["avatar", "button", "dropdown-menu", "item"],
    files: [
      {
        path: "demo/item-dropdown.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "item-group",
    title: "Item Group",
    type: "registry:example",
    registryDependencies: ["avatar", "button", "item"],
    files: [
      {
        path: "demo/item-group.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "item-header",
    title: "Item Header",
    type: "registry:example",
    registryDependencies: ["item"],
    files: [
      {
        path: "demo/item-header.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "item-icon",
    title: "Item Icon",
    type: "registry:example",
    registryDependencies: ["button", "item"],
    files: [
      {
        path: "demo/item-icon.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "item-image",
    title: "Item Image",
    type: "registry:example",
    registryDependencies: ["item"],
    files: [
      {
        path: "demo/item-image.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "item-link",
    title: "Item Link",
    type: "registry:example",
    registryDependencies: ["item"],
    files: [
      {
        path: "demo/item-link.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "item-size",
    title: "Item Size",
    type: "registry:example",
    registryDependencies: ["button", "item"],
    files: [
      {
        path: "demo/item-size.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "item-variant",
    title: "Item Variant",
    type: "registry:example",
    registryDependencies: ["button", "item"],
    files: [
      {
        path: "demo/item-variant.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "kbd-button",
    title: "Kbd Button",
    type: "registry:example",
    registryDependencies: ["button", "kbd"],
    files: [
      {
        path: "demo/kbd-button.tsx",
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
        path: "demo/kbd-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "kbd-group",
    title: "Kbd Group",
    type: "registry:example",
    registryDependencies: ["kbd"],
    files: [
      {
        path: "demo/kbd-group.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "kbd-input-group",
    title: "Kbd Input Group",
    type: "registry:example",
    registryDependencies: ["input-group", "kbd"],
    files: [
      {
        path: "demo/kbd-input-group.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "kbd-tooltip",
    title: "Kbd Tooltip",
    type: "registry:example",
    registryDependencies: ["button", "button-group", "kbd", "tooltip"],
    files: [
      {
        path: "demo/kbd-tooltip.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "label-demo",
    title: "Label Demo",
    type: "registry:example",
    registryDependencies: ["checkbox", "label"],
    files: [
      {
        path: "demo/label-demo.tsx",
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
        path: "demo/menubar-demo.tsx",
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
        path: "demo/native-select-demo.tsx",
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
        path: "demo/native-select-disabled.tsx",
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
        path: "demo/native-select-groups.tsx",
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
        path: "demo/native-select-invalid.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "navigation-menu-demo",
    title: "Navigation Menu Demo",
    type: "registry:example",
    registryDependencies: ["navigation-menu"],
    files: [
      {
        path: "demo/navigation-menu-demo.tsx",
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
        path: "demo/pagination-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "popover-demo",
    title: "Popover Demo",
    type: "registry:example",
    registryDependencies: ["button", "input", "label", "popover"],
    files: [
      {
        path: "demo/popover-demo.tsx",
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
        path: "demo/progress-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "radio-group-demo",
    title: "Radio Group Demo",
    type: "registry:example",
    registryDependencies: ["label", "radio-group"],
    files: [
      {
        path: "demo/radio-group-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "resizable-demo-with-handle",
    title: "Resizable Demo With Handle",
    type: "registry:example",
    registryDependencies: ["resizable"],
    files: [
      {
        path: "demo/resizable-demo-with-handle.tsx",
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
        path: "demo/resizable-demo.tsx",
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
        path: "demo/resizable-handle.tsx",
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
        path: "demo/resizable-vertical.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "scroll-area-demo",
    title: "Scroll Area Demo",
    type: "registry:example",
    registryDependencies: ["scroll-area", "separator"],
    files: [
      {
        path: "demo/scroll-area-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "scroll-area-horizontal-demo",
    title: "Scroll Area Horizontal Demo",
    type: "registry:example",
    registryDependencies: ["scroll-area"],
    files: [
      {
        path: "demo/scroll-area-horizontal-demo.tsx",
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
        path: "demo/select-demo.tsx",
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
        path: "demo/select-scrollable.tsx",
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
        path: "demo/separator-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "sheet-demo",
    title: "Sheet Demo",
    type: "registry:example",
    registryDependencies: ["button", "input", "label", "sheet"],
    files: [
      {
        path: "demo/sheet-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "sheet-side",
    title: "Sheet Side",
    type: "registry:example",
    registryDependencies: ["button", "input", "label", "sheet"],
    files: [
      {
        path: "demo/sheet-side.tsx",
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
        path: "demo/skeleton-card.tsx",
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
        path: "demo/skeleton-demo.tsx",
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
        path: "demo/slider-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "sonner-demo",
    title: "Sonner Demo",
    type: "registry:example",
    registryDependencies: ["button"],
    files: [
      {
        path: "demo/sonner-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "sonner-types",
    title: "Sonner Types",
    type: "registry:example",
    registryDependencies: ["button"],
    files: [
      {
        path: "demo/sonner-types.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "spinner-badge",
    title: "Spinner Badge",
    type: "registry:example",
    registryDependencies: ["badge", "spinner"],
    files: [
      {
        path: "demo/spinner-badge.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "spinner-basic",
    title: "Spinner Basic",
    type: "registry:example",
    registryDependencies: ["spinner"],
    files: [
      {
        path: "demo/spinner-basic.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "spinner-button",
    title: "Spinner Button",
    type: "registry:example",
    registryDependencies: ["button", "spinner"],
    files: [
      {
        path: "demo/spinner-button.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "spinner-color",
    title: "Spinner Color",
    type: "registry:example",
    registryDependencies: ["spinner"],
    files: [
      {
        path: "demo/spinner-color.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "spinner-custom",
    title: "Spinner Custom",
    type: "registry:example",
    registryDependencies: [],
    files: [
      {
        path: "demo/spinner-custom.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "spinner-demo",
    title: "Spinner Demo",
    type: "registry:example",
    registryDependencies: ["item", "spinner"],
    files: [
      {
        path: "demo/spinner-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "spinner-empty",
    title: "Spinner Empty",
    type: "registry:example",
    registryDependencies: ["button", "empty", "spinner"],
    files: [
      {
        path: "demo/spinner-empty.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "spinner-input-group",
    title: "Spinner Input Group",
    type: "registry:example",
    registryDependencies: ["input-group", "spinner"],
    files: [
      {
        path: "demo/spinner-input-group.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "spinner-item",
    title: "Spinner Item",
    type: "registry:example",
    registryDependencies: ["button", "item", "progress", "spinner"],
    files: [
      {
        path: "demo/spinner-item.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "spinner-size",
    title: "Spinner Size",
    type: "registry:example",
    registryDependencies: ["spinner"],
    files: [
      {
        path: "demo/spinner-size.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "switch-demo",
    title: "Switch Demo",
    type: "registry:example",
    registryDependencies: ["label", "switch"],
    files: [
      {
        path: "demo/switch-demo.tsx",
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
        path: "demo/table-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "tabs-demo",
    title: "Tabs Demo",
    type: "registry:example",
    registryDependencies: ["button", "card", "input", "label", "tabs"],
    files: [
      {
        path: "demo/tabs-demo.tsx",
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
        path: "demo/textarea-demo.tsx",
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
        path: "demo/textarea-disabled.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "textarea-with-button",
    title: "Textarea With Button",
    type: "registry:example",
    registryDependencies: ["button", "textarea"],
    files: [
      {
        path: "demo/textarea-with-button.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "textarea-with-label",
    title: "Textarea With Label",
    type: "registry:example",
    registryDependencies: ["label", "textarea"],
    files: [
      {
        path: "demo/textarea-with-label.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "textarea-with-text",
    title: "Textarea With Text",
    type: "registry:example",
    registryDependencies: ["label", "textarea"],
    files: [
      {
        path: "demo/textarea-with-text.tsx",
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
        path: "demo/toggle-demo.tsx",
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
        path: "demo/toggle-disabled.tsx",
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
        path: "demo/toggle-group-demo.tsx",
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
        path: "demo/toggle-group-disabled.tsx",
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
        path: "demo/toggle-group-lg.tsx",
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
        path: "demo/toggle-group-outline.tsx",
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
        path: "demo/toggle-group-single.tsx",
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
        path: "demo/toggle-group-sm.tsx",
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
        path: "demo/toggle-group-spacing.tsx",
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
        path: "demo/toggle-lg.tsx",
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
        path: "demo/toggle-outline.tsx",
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
        path: "demo/toggle-sm.tsx",
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
        path: "demo/toggle-with-text.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "tooltip-demo",
    title: "Tooltip Demo",
    type: "registry:example",
    registryDependencies: ["button", "tooltip"],
    files: [
      {
        path: "demo/tooltip-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-blockquote",
    title: "Typography Blockquote",
    type: "registry:example",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-blockquote.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-demo",
    title: "Typography Demo",
    type: "registry:example",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-h1",
    title: "Typography H1",
    type: "registry:example",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-h1.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-h2",
    title: "Typography H2",
    type: "registry:example",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-h2.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-h3",
    title: "Typography H3",
    type: "registry:example",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-h3.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-h4",
    title: "Typography H4",
    type: "registry:example",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-h4.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-inline-code",
    title: "Typography Inline Code",
    type: "registry:example",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-inline-code.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-large",
    title: "Typography Large",
    type: "registry:example",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-large.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-lead",
    title: "Typography Lead",
    type: "registry:example",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-lead.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-list",
    title: "Typography List",
    type: "registry:example",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-list.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-muted",
    title: "Typography Muted",
    type: "registry:example",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-muted.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-p",
    title: "Typography P",
    type: "registry:example",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-p.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-small",
    title: "Typography Small",
    type: "registry:example",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-small.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "typography-table",
    title: "Typography Table",
    type: "registry:example",
    registryDependencies: [],
    files: [
      {
        path: "demo/typography-table.tsx",
        type: "registry:example",
      },
    ],
  }
]
