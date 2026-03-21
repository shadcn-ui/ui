import { type Registry } from "shadcn/schema"

export const examples: Registry["items"] = [
  {
    name: "accordion-example",
    title: "Accordion",
    type: "registry:example",
    registryDependencies: ["accordion", "button", "card", "example"],
    files: [
      {
        path: "examples/accordion-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "alert-example",
    title: "Alert",
    type: "registry:example",
    registryDependencies: ["alert", "badge", "button", "example"],
    files: [
      {
        path: "examples/alert-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "alert-dialog-example",
    title: "Alert Dialog",
    type: "registry:example",
    registryDependencies: ["alert-dialog", "button", "dialog", "example"],
    files: [
      {
        path: "examples/alert-dialog-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "aspect-ratio-example",
    title: "Aspect Ratio",
    type: "registry:example",
    registryDependencies: ["aspect-ratio", "example"],
    files: [
      {
        path: "examples/aspect-ratio-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "avatar-example",
    title: "Avatar",
    type: "registry:example",
    registryDependencies: ["avatar", "button", "empty", "example"],
    files: [
      {
        path: "examples/avatar-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "badge-example",
    title: "Badge",
    type: "registry:example",
    registryDependencies: ["badge", "spinner", "example"],
    files: [
      {
        path: "examples/badge-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "breadcrumb-example",
    title: "Breadcrumb",
    type: "registry:example",
    registryDependencies: ["breadcrumb", "dropdown-menu", "example"],
    files: [
      {
        path: "examples/breadcrumb-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-example",
    title: "Button",
    type: "registry:example",
    registryDependencies: ["button", "example"],
    files: [
      {
        path: "examples/button-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "button-group-example",
    title: "Button Group",
    type: "registry:example",
    registryDependencies: [
      "button",
      "button-group",
      "dropdown-menu",
      "field",
      "input",
      "input-group",
      "label",
      "popover",
      "select",
      "tooltip",
      "example",
    ],
    files: [
      {
        path: "examples/button-group-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "calendar-example",
    title: "Calendar",
    type: "registry:example",
    registryDependencies: [
      "button",
      "calendar",
      "card",
      "field",
      "input",
      "label",
      "popover",
      "example",
    ],
    files: [
      {
        path: "examples/calendar-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "card-example",
    title: "Card",
    type: "registry:example",
    registryDependencies: [
      "avatar",
      "button",
      "card",
      "field",
      "input",
      "example",
    ],
    files: [
      {
        path: "examples/card-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "carousel-example",
    title: "Carousel",
    type: "registry:example",
    registryDependencies: ["card", "carousel", "example"],
    files: [
      {
        path: "examples/carousel-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "chart-example",
    title: "Chart",
    type: "registry:example",
    registryDependencies: ["chart", "card", "example"],
    files: [
      {
        path: "examples/chart-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "checkbox-example",
    title: "Checkbox",
    type: "registry:example",
    registryDependencies: ["checkbox", "field", "table", "example"],
    files: [
      {
        path: "examples/checkbox-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "collapsible-example",
    title: "Collapsible",
    type: "registry:example",
    registryDependencies: [
      "button",
      "card",
      "collapsible",
      "field",
      "input",
      "tabs",
      "example",
    ],
    files: [
      {
        path: "examples/collapsible-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "combobox-example",
    title: "Combobox",
    type: "registry:example",
    registryDependencies: [
      "button",
      "card",
      "combobox",
      "dialog",
      "field",
      "input",
      "input-group",
      "item",
      "select",
      "example",
    ],
    files: [
      {
        path: "examples/combobox-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "command-example",
    title: "Command",
    type: "registry:example",
    registryDependencies: ["button", "command", "example"],
    files: [
      {
        path: "examples/command-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "context-menu-example",
    title: "Context Menu",
    type: "registry:example",
    registryDependencies: ["button", "context-menu", "dialog", "example"],
    files: [
      {
        path: "examples/context-menu-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "dialog-example",
    title: "Dialog",
    type: "registry:example",
    registryDependencies: [
      "button",
      "checkbox",
      "dialog",
      "field",
      "input",
      "input-group",
      "kbd",
      "native-select",
      "select",
      "switch",
      "tabs",
      "textarea",
      "tooltip",
      "example",
    ],
    files: [
      {
        path: "examples/dialog-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "drawer-example",
    title: "Drawer",
    type: "registry:example",
    registryDependencies: ["drawer", "example"],
    files: [
      {
        path: "examples/drawer-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "dropdown-menu-example",
    title: "Dropdown Menu",
    type: "registry:example",
    registryDependencies: [
      "avatar",
      "button",
      "dialog",
      "dropdown-menu",
      "example",
    ],
    files: [
      {
        path: "examples/dropdown-menu-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "empty-example",
    title: "Empty",
    type: "registry:example",
    registryDependencies: ["button", "empty", "input-group", "kbd", "example"],
    files: [
      {
        path: "examples/empty-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "field-example",
    title: "Field",
    type: "registry:example",
    registryDependencies: [
      "badge",
      "checkbox",
      "field",
      "input",
      "input-otp",
      "native-select",
      "radio-group",
      "select",
      "slider",
      "switch",
      "textarea",
      "example",
    ],
    files: [
      {
        path: "examples/field-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "hover-card-example",
    title: "Hover Card",
    type: "registry:example",
    registryDependencies: ["button", "dialog", "hover-card", "example"],
    files: [
      {
        path: "examples/hover-card-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-example",
    title: "Input",
    type: "registry:example",
    registryDependencies: [
      "button",
      "field",
      "input",
      "native-select",
      "select",
      "example",
    ],
    files: [
      {
        path: "examples/input-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-group-example",
    title: "Input Group",
    type: "registry:example",
    registryDependencies: [
      "button",
      "button-group",
      "card",
      "dropdown-menu",
      "field",
      "input",
      "input-group",
      "kbd",
      "popover",
      "spinner",
      "textarea",
      "tooltip",
      "example",
    ],
    files: [
      {
        path: "examples/input-group-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "input-otp-example",
    title: "Input OTP",
    type: "registry:example",
    registryDependencies: ["button", "card", "field", "input-otp", "example"],
    files: [
      {
        path: "examples/input-otp-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "item-example",
    title: "Item",
    type: "registry:example",
    registryDependencies: ["button", "item", "example"],
    files: [
      {
        path: "examples/item-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "kbd-example",
    title: "Kbd",
    type: "registry:example",
    registryDependencies: [
      "button",
      "input-group",
      "kbd",
      "tooltip",
      "example",
    ],
    files: [
      {
        path: "examples/kbd-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "label-example",
    title: "Label",
    type: "registry:example",
    registryDependencies: [
      "checkbox",
      "field",
      "input",
      "label",
      "textarea",
      "example",
    ],
    files: [
      {
        path: "examples/label-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "menubar-example",
    title: "Menubar",
    type: "registry:example",
    registryDependencies: ["button", "dialog", "menubar", "example"],
    files: [
      {
        path: "examples/menubar-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "native-select-example",
    title: "Native Select",
    type: "registry:example",
    registryDependencies: ["field", "native-select", "example"],
    files: [
      {
        path: "examples/native-select-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "navigation-menu-example",
    title: "Navigation Menu",
    type: "registry:example",
    registryDependencies: ["button", "dialog", "navigation-menu", "example"],
    files: [
      {
        path: "examples/navigation-menu-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "pagination-example",
    title: "Pagination",
    type: "registry:example",
    registryDependencies: ["field", "pagination", "select", "example"],
    files: [
      {
        path: "examples/pagination-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "popover-example",
    title: "Popover",
    type: "registry:example",
    registryDependencies: [
      "button",
      "dialog",
      "field",
      "input",
      "popover",
      "example",
    ],
    files: [
      {
        path: "examples/popover-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "progress-example",
    title: "Progress",
    type: "registry:example",
    registryDependencies: ["field", "item", "progress", "slider", "example"],
    files: [
      {
        path: "examples/progress-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "radio-group-example",
    title: "Radio Group",
    type: "registry:example",
    registryDependencies: ["field", "radio-group", "example"],
    files: [
      {
        path: "examples/radio-group-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "resizable-example",
    title: "Resizable",
    type: "registry:example",
    registryDependencies: ["resizable", "example"],
    files: [
      {
        path: "examples/resizable-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "scroll-area-example",
    title: "Scroll Area",
    type: "registry:example",
    registryDependencies: ["scroll-area", "separator", "example"],
    files: [
      {
        path: "examples/scroll-area-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "select-example",
    title: "Select",
    type: "registry:example",
    registryDependencies: [
      "button",
      "dialog",
      "field",
      "input",
      "item",
      "native-select",
      "select",
      "example",
    ],
    files: [
      {
        path: "examples/select-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "separator-example",
    title: "Separator",
    type: "registry:example",
    registryDependencies: ["separator", "example"],
    files: [
      {
        path: "examples/separator-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "sheet-example",
    title: "Sheet",
    type: "registry:example",
    registryDependencies: ["button", "field", "input", "sheet", "example"],
    files: [
      {
        path: "examples/sheet-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "sidebar-example",
    title: "Sidebar",
    type: "registry:example",
    registryDependencies: [
      "button",
      "dropdown-menu",
      "item",
      "label",
      "sidebar",
      "example",
    ],
    files: [
      {
        path: "examples/sidebar-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "sidebar-icon-example",
    title: "Sidebar (Icon)",
    type: "registry:example",
    registryDependencies: [
      "avatar",
      "button",
      "collapsible",
      "dropdown-menu",
      "item",
      "sidebar",
      "example",
    ],
    files: [
      {
        path: "examples/sidebar-icon-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "sidebar-inset-example",
    title: "Sidebar (Inset)",
    type: "registry:example",
    registryDependencies: ["collapsible", "sidebar", "example"],
    files: [
      {
        path: "examples/sidebar-inset-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "sidebar-floating-example",
    title: "Sidebar (Floating)",
    type: "registry:example",
    registryDependencies: [
      "button",
      "card",
      "dropdown-menu",
      "field",
      "item",
      "sidebar",
      "example",
    ],
    files: [
      {
        path: "examples/sidebar-floating-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "skeleton-example",
    title: "Skeleton",
    type: "registry:example",
    registryDependencies: ["skeleton", "example"],
    files: [
      {
        path: "examples/skeleton-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "slider-example",
    title: "Slider",
    type: "registry:example",
    registryDependencies: ["label", "slider", "example"],
    files: [
      {
        path: "examples/slider-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "sonner-example",
    title: "Sonner",
    type: "registry:example",
    registryDependencies: ["sonner", "example"],
    files: [
      {
        path: "examples/sonner-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "spinner-example",
    title: "Spinner",
    type: "registry:example",
    registryDependencies: [
      "badge",
      "button",
      "empty",
      "field",
      "input-group",
      "spinner",
      "example",
    ],
    files: [
      {
        path: "examples/spinner-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "switch-example",
    title: "Switch",
    type: "registry:example",
    registryDependencies: ["field", "label", "switch", "example"],
    files: [
      {
        path: "examples/switch-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "table-example",
    title: "Table",
    type: "registry:example",
    registryDependencies: [
      "button",
      "dropdown-menu",
      "input",
      "select",
      "table",
      "example",
    ],
    files: [
      {
        path: "examples/table-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "tabs-example",
    title: "Tabs",
    type: "registry:example",
    registryDependencies: ["button", "dropdown-menu", "tabs", "example"],
    files: [
      {
        path: "examples/tabs-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "textarea-example",
    title: "Textarea",
    type: "registry:example",
    registryDependencies: ["field", "textarea", "example"],
    files: [
      {
        path: "examples/textarea-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "toggle-example",
    title: "Toggle",
    type: "registry:example",
    registryDependencies: ["toggle", "example"],
    files: [
      {
        path: "examples/toggle-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "toggle-group-example",
    title: "Toggle Group",
    type: "registry:example",
    registryDependencies: ["input", "select", "toggle-group", "example"],
    files: [
      {
        path: "examples/toggle-group-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "tooltip-example",
    title: "Tooltip",
    type: "registry:example",
    registryDependencies: ["button", "kbd", "tooltip", "example"],
    files: [
      {
        path: "examples/tooltip-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "component-example",
    title: "Example",
    type: "registry:example",
    registryDependencies: [
      "alert-dialog",
      "badge",
      "button",
      "card",
      "combobox",
      "dropdown-menu",
      "field",
      "input",
      "select",
      "textarea",
      "example",
    ],
    files: [
      {
        path: "examples/component-example.tsx",
        type: "registry:example",
      },
    ],
  },
]
