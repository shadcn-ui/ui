import { type Registry } from "shadcn/schema"

export const examples: Registry["items"] = [
  {
    name: "cover-example",
    title: "Cover",
    type: "registry:example",
    files: [
      {
        path: "examples/cover-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "accordion-example",
    title: "Accordion",
    type: "registry:example",
    registryDependencies: ["accordion"],
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
    registryDependencies: ["alert"],
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
    registryDependencies: ["alert-dialog", "button"],
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
    registryDependencies: ["aspect-ratio"],
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
    registryDependencies: ["avatar"],
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
    registryDependencies: ["badge"],
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
    registryDependencies: ["breadcrumb"],
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
    registryDependencies: ["button"],
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
    registryDependencies: ["button-group"],
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
      "drawer",
      "input",
      "label",
      "popover",
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
    registryDependencies: ["card"],
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
    registryDependencies: ["carousel"],
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
    registryDependencies: ["chart", "card"],
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
    registryDependencies: ["checkbox"],
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
    registryDependencies: ["collapsible"],
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
    registryDependencies: ["avatar", "button", "command", "popover"],
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
    registryDependencies: ["command"],
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
    registryDependencies: ["context-menu"],
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
    registryDependencies: ["dialog"],
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
    registryDependencies: ["drawer"],
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
    registryDependencies: ["dropdown-menu"],
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
    registryDependencies: ["empty"],
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
    registryDependencies: ["field"],
    files: [
      {
        path: "examples/field-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "form-example",
    title: "Form",
    type: "registry:example",
    registryDependencies: [
      "button",
      "calendar",
      "checkbox",
      "form",
      "input",
      "popover",
      "radio-group",
      "select",
      "switch",
      "textarea",
    ],
    files: [
      {
        path: "examples/form-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "hover-card-example",
    title: "Hover Card",
    type: "registry:example",
    registryDependencies: ["hover-card"],
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
    registryDependencies: ["input"],
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
    registryDependencies: ["input-group"],
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
    registryDependencies: ["input-otp"],
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
    registryDependencies: ["item"],
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
    registryDependencies: ["kbd"],
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
    registryDependencies: ["label"],
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
    registryDependencies: ["menubar"],
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
    registryDependencies: ["native-select"],
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
    registryDependencies: ["navigation-menu"],
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
    registryDependencies: ["pagination"],
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
    registryDependencies: ["popover"],
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
    registryDependencies: ["progress"],
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
    registryDependencies: ["radio-group"],
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
    registryDependencies: ["resizable"],
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
    registryDependencies: ["scroll-area"],
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
    registryDependencies: ["select"],
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
    registryDependencies: ["separator"],
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
    registryDependencies: ["sheet"],
    files: [
      {
        path: "examples/sheet-example.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "skeleton-example",
    title: "Skeleton",
    type: "registry:example",
    registryDependencies: ["skeleton"],
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
    registryDependencies: ["slider"],
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
    registryDependencies: ["sonner"],
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
    registryDependencies: ["spinner"],
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
    registryDependencies: ["switch"],
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
    registryDependencies: ["table"],
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
    registryDependencies: ["tabs"],
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
    registryDependencies: ["textarea"],
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
    registryDependencies: ["toggle"],
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
    registryDependencies: ["toggle-group"],
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
    registryDependencies: ["tooltip"],
    files: [
      {
        path: "examples/tooltip-example.tsx",
        type: "registry:example",
      },
    ],
  },
]
