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
    registryDependencies: ["textarea", "button"],
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
    registryDependencies: ["textarea", "label"],
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
    registryDependencies: ["textarea", "label"],
    files: [
      {
        path: "demo/textarea-with-text.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "radio-group-demo",
    title: "Radio Group Demo",
    type: "registry:example",
    registryDependencies: ["radio-group", "label"],
    files: [
      {
        path: "demo/radio-group-demo.tsx",
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
    registryDependencies: ["sheet", "button", "input", "label"],
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
    registryDependencies: ["sheet", "button", "input", "label"],
    files: [
      {
        path: "demo/sheet-side.tsx",
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
    name: "combobox-responsive",
    title: "Combobox Responsive",
    type: "registry:example",
    registryDependencies: ["command", "popover", "drawer", "button"],
    files: [
      {
        path: "demo/combobox-responsive.tsx",
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
    registryDependencies: ["collapsible", "button"],
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
    registryDependencies: ["command", "popover", "button"],
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
    registryDependencies: ["command", "dropdown-menu", "button"],
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
    registryDependencies: ["command", "popover", "button"],
    files: [
      {
        path: "demo/combobox-popover.tsx",
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
]
