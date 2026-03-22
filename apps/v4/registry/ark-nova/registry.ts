export const registry = {
  "name": "shadcn/ui",
  "homepage": "https://ui.shadcn.com",
  "items": [
    {
      "name": "accordion",
      "files": [
        {
          "path": "ui/accordion.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "alert",
      "files": [
        {
          "path": "ui/alert.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "alert-dialog",
      "registryDependencies": [
        "button"
      ],
      "files": [
        {
          "path": "ui/alert-dialog.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "aspect-ratio",
      "files": [
        {
          "path": "ui/aspect-ratio.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "avatar",
      "files": [
        {
          "path": "ui/avatar.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "badge",
      "files": [
        {
          "path": "ui/badge.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "breadcrumb",
      "files": [
        {
          "path": "ui/breadcrumb.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "button",
      "files": [
        {
          "path": "ui/button.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "button-group",
      "registryDependencies": [
        "separator"
      ],
      "files": [
        {
          "path": "ui/button-group.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "calendar",
      "dependencies": [
        "@ark-ui/react",
        "@internationalized/date"
      ],
      "registryDependencies": [
        "button"
      ],
      "files": [
        {
          "path": "ui/calendar.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "card",
      "files": [
        {
          "path": "ui/card.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "carousel",
      "dependencies": [
        "@ark-ui/react"
      ],
      "registryDependencies": [
        "button"
      ],
      "files": [
        {
          "path": "ui/carousel.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "chart",
      "dependencies": [
        "recharts@2.15.4"
      ],
      "registryDependencies": [
        "card"
      ],
      "files": [
        {
          "path": "ui/chart.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "checkbox",
      "files": [
        {
          "path": "ui/checkbox.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "collapsible",
      "files": [
        {
          "path": "ui/collapsible.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "combobox",
      "dependencies": [
        "@ark-ui/react"
      ],
      "registryDependencies": [
        "button",
        "input-group"
      ],
      "files": [
        {
          "path": "ui/combobox.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "command",
      "dependencies": [
        "cmdk"
      ],
      "registryDependencies": [
        "dialog",
        "input-group"
      ],
      "files": [
        {
          "path": "ui/command.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "context-menu",
      "files": [
        {
          "path": "ui/context-menu.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "dialog",
      "registryDependencies": [
        "button"
      ],
      "files": [
        {
          "path": "ui/dialog.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "drawer",
      "dependencies": [
        "@ark-ui/react"
      ],
      "files": [
        {
          "path": "ui/drawer.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "dropdown-menu",
      "files": [
        {
          "path": "ui/dropdown-menu.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "empty",
      "files": [
        {
          "path": "ui/empty.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "field",
      "registryDependencies": [
        "label",
        "separator"
      ],
      "files": [
        {
          "path": "ui/field.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "form",
      "type": "registry:ui"
    },
    {
      "name": "hover-card",
      "files": [
        {
          "path": "ui/hover-card.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "input",
      "files": [
        {
          "path": "ui/input.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "input-group",
      "registryDependencies": [
        "button",
        "input",
        "textarea"
      ],
      "files": [
        {
          "path": "ui/input-group.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "input-otp",
      "dependencies": [
        "@ark-ui/react"
      ],
      "files": [
        {
          "path": "ui/input-otp.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "item",
      "registryDependencies": [
        "separator"
      ],
      "files": [
        {
          "path": "ui/item.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "label",
      "files": [
        {
          "path": "ui/label.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "menubar",
      "registryDependencies": [
        "dropdown-menu"
      ],
      "files": [
        {
          "path": "ui/menubar.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "navigation-menu",
      "files": [
        {
          "path": "ui/navigation-menu.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "pagination",
      "registryDependencies": [
        "button"
      ],
      "files": [
        {
          "path": "ui/pagination.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "popover",
      "files": [
        {
          "path": "ui/popover.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "progress",
      "files": [
        {
          "path": "ui/progress.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "radio-group",
      "files": [
        {
          "path": "ui/radio-group.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "resizable",
      "dependencies": [
        "@ark-ui/react"
      ],
      "files": [
        {
          "path": "ui/resizable.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "scroll-area",
      "files": [
        {
          "path": "ui/scroll-area.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "select",
      "files": [
        {
          "path": "ui/select.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "separator",
      "files": [
        {
          "path": "ui/separator.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "sheet",
      "registryDependencies": [
        "button"
      ],
      "files": [
        {
          "path": "ui/sheet.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "skeleton",
      "files": [
        {
          "path": "ui/skeleton.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "slider",
      "files": [
        {
          "path": "ui/slider.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "sonner",
      "dependencies": [
        "@ark-ui/react"
      ],
      "files": [
        {
          "path": "ui/sonner.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "spinner",
      "files": [
        {
          "path": "ui/spinner.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "switch",
      "files": [
        {
          "path": "ui/switch.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "table",
      "files": [
        {
          "path": "ui/table.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "tabs",
      "files": [
        {
          "path": "ui/tabs.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "textarea",
      "files": [
        {
          "path": "ui/textarea.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "toggle",
      "files": [
        {
          "path": "ui/toggle.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "toggle-group",
      "registryDependencies": [
        "toggle"
      ],
      "files": [
        {
          "path": "ui/toggle-group.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "tooltip",
      "files": [
        {
          "path": "ui/tooltip.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "kbd",
      "files": [
        {
          "path": "ui/kbd.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "native-select",
      "files": [
        {
          "path": "ui/native-select.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "direction",
      "files": [
        {
          "path": "ui/direction.tsx",
          "type": "registry:ui"
        }
      ],
      "type": "registry:ui"
    },
    {
      "name": "accordion-example",
      "title": "Accordion",
      "registryDependencies": [
        "accordion",
        "button",
        "card",
        "example"
      ],
      "files": [
        {
          "path": "examples/accordion-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "alert-example",
      "title": "Alert",
      "registryDependencies": [
        "alert",
        "badge",
        "button",
        "example"
      ],
      "files": [
        {
          "path": "examples/alert-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "alert-dialog-example",
      "title": "Alert Dialog",
      "registryDependencies": [
        "alert-dialog",
        "button",
        "dialog",
        "example"
      ],
      "files": [
        {
          "path": "examples/alert-dialog-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "aspect-ratio-example",
      "title": "Aspect Ratio",
      "registryDependencies": [
        "aspect-ratio",
        "example"
      ],
      "files": [
        {
          "path": "examples/aspect-ratio-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "avatar-example",
      "title": "Avatar",
      "registryDependencies": [
        "avatar",
        "button",
        "empty",
        "example"
      ],
      "files": [
        {
          "path": "examples/avatar-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "badge-example",
      "title": "Badge",
      "registryDependencies": [
        "badge",
        "spinner",
        "example"
      ],
      "files": [
        {
          "path": "examples/badge-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "breadcrumb-example",
      "title": "Breadcrumb",
      "registryDependencies": [
        "breadcrumb",
        "dropdown-menu",
        "example"
      ],
      "files": [
        {
          "path": "examples/breadcrumb-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "button-example",
      "title": "Button",
      "registryDependencies": [
        "button",
        "example"
      ],
      "files": [
        {
          "path": "examples/button-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "button-group-example",
      "title": "Button Group",
      "registryDependencies": [
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
        "example"
      ],
      "files": [
        {
          "path": "examples/button-group-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "card-example",
      "title": "Card",
      "registryDependencies": [
        "avatar",
        "button",
        "card",
        "field",
        "input",
        "example"
      ],
      "files": [
        {
          "path": "examples/card-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "carousel-example",
      "title": "Carousel",
      "registryDependencies": [
        "card",
        "carousel",
        "example"
      ],
      "files": [
        {
          "path": "examples/carousel-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "chart-example",
      "title": "Chart",
      "registryDependencies": [
        "chart",
        "card",
        "example"
      ],
      "files": [
        {
          "path": "examples/chart-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "checkbox-example",
      "title": "Checkbox",
      "registryDependencies": [
        "checkbox",
        "field",
        "table",
        "example"
      ],
      "files": [
        {
          "path": "examples/checkbox-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "collapsible-example",
      "title": "Collapsible",
      "registryDependencies": [
        "button",
        "card",
        "collapsible",
        "field",
        "input",
        "tabs",
        "example"
      ],
      "files": [
        {
          "path": "examples/collapsible-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "combobox-example",
      "title": "Combobox",
      "registryDependencies": [
        "button",
        "card",
        "combobox",
        "dialog",
        "field",
        "input",
        "input-group",
        "item",
        "select",
        "example"
      ],
      "files": [
        {
          "path": "examples/combobox-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "command-example",
      "title": "Command",
      "registryDependencies": [
        "button",
        "command",
        "example"
      ],
      "files": [
        {
          "path": "examples/command-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "context-menu-example",
      "title": "Context Menu",
      "registryDependencies": [
        "button",
        "context-menu",
        "dialog",
        "example"
      ],
      "files": [
        {
          "path": "examples/context-menu-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "dialog-example",
      "title": "Dialog",
      "registryDependencies": [
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
        "example"
      ],
      "files": [
        {
          "path": "examples/dialog-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "drawer-example",
      "title": "Drawer",
      "registryDependencies": [
        "drawer",
        "example"
      ],
      "files": [
        {
          "path": "examples/drawer-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "dropdown-menu-example",
      "title": "Dropdown Menu",
      "registryDependencies": [
        "avatar",
        "button",
        "dialog",
        "dropdown-menu",
        "example"
      ],
      "files": [
        {
          "path": "examples/dropdown-menu-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "empty-example",
      "title": "Empty",
      "registryDependencies": [
        "button",
        "empty",
        "input-group",
        "kbd",
        "example"
      ],
      "files": [
        {
          "path": "examples/empty-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "field-example",
      "title": "Field",
      "registryDependencies": [
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
        "example"
      ],
      "files": [
        {
          "path": "examples/field-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "hover-card-example",
      "title": "Hover Card",
      "registryDependencies": [
        "button",
        "dialog",
        "hover-card",
        "example"
      ],
      "files": [
        {
          "path": "examples/hover-card-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "input-example",
      "title": "Input",
      "registryDependencies": [
        "button",
        "field",
        "input",
        "native-select",
        "select",
        "example"
      ],
      "files": [
        {
          "path": "examples/input-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "input-group-example",
      "title": "Input Group",
      "registryDependencies": [
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
        "example"
      ],
      "files": [
        {
          "path": "examples/input-group-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "input-otp-example",
      "title": "Input OTP",
      "registryDependencies": [
        "button",
        "card",
        "field",
        "input-otp",
        "example"
      ],
      "files": [
        {
          "path": "examples/input-otp-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "item-example",
      "title": "Item",
      "registryDependencies": [
        "button",
        "item",
        "example"
      ],
      "files": [
        {
          "path": "examples/item-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "kbd-example",
      "title": "Kbd",
      "registryDependencies": [
        "button",
        "input-group",
        "kbd",
        "tooltip",
        "example"
      ],
      "files": [
        {
          "path": "examples/kbd-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "label-example",
      "title": "Label",
      "registryDependencies": [
        "checkbox",
        "field",
        "input",
        "label",
        "textarea",
        "example"
      ],
      "files": [
        {
          "path": "examples/label-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "menubar-example",
      "title": "Menubar",
      "registryDependencies": [
        "button",
        "dialog",
        "menubar",
        "example"
      ],
      "files": [
        {
          "path": "examples/menubar-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "native-select-example",
      "title": "Native Select",
      "registryDependencies": [
        "field",
        "native-select",
        "example"
      ],
      "files": [
        {
          "path": "examples/native-select-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "navigation-menu-example",
      "title": "Navigation Menu",
      "registryDependencies": [
        "button",
        "dialog",
        "navigation-menu",
        "example"
      ],
      "files": [
        {
          "path": "examples/navigation-menu-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "pagination-example",
      "title": "Pagination",
      "registryDependencies": [
        "field",
        "pagination",
        "select",
        "example"
      ],
      "files": [
        {
          "path": "examples/pagination-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "popover-example",
      "title": "Popover",
      "registryDependencies": [
        "button",
        "dialog",
        "field",
        "input",
        "popover",
        "example"
      ],
      "files": [
        {
          "path": "examples/popover-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "progress-example",
      "title": "Progress",
      "registryDependencies": [
        "field",
        "item",
        "progress",
        "slider",
        "example"
      ],
      "files": [
        {
          "path": "examples/progress-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "radio-group-example",
      "title": "Radio Group",
      "registryDependencies": [
        "field",
        "radio-group",
        "example"
      ],
      "files": [
        {
          "path": "examples/radio-group-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "resizable-example",
      "title": "Resizable",
      "registryDependencies": [
        "resizable",
        "example"
      ],
      "files": [
        {
          "path": "examples/resizable-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "scroll-area-example",
      "title": "Scroll Area",
      "registryDependencies": [
        "scroll-area",
        "separator",
        "example"
      ],
      "files": [
        {
          "path": "examples/scroll-area-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "select-example",
      "title": "Select",
      "registryDependencies": [
        "button",
        "dialog",
        "field",
        "input",
        "item",
        "native-select",
        "select",
        "example"
      ],
      "files": [
        {
          "path": "examples/select-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "separator-example",
      "title": "Separator",
      "registryDependencies": [
        "separator",
        "example"
      ],
      "files": [
        {
          "path": "examples/separator-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "sheet-example",
      "title": "Sheet",
      "registryDependencies": [
        "button",
        "field",
        "input",
        "sheet",
        "example"
      ],
      "files": [
        {
          "path": "examples/sheet-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "skeleton-example",
      "title": "Skeleton",
      "registryDependencies": [
        "skeleton",
        "example"
      ],
      "files": [
        {
          "path": "examples/skeleton-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "slider-example",
      "title": "Slider",
      "registryDependencies": [
        "label",
        "slider",
        "example"
      ],
      "files": [
        {
          "path": "examples/slider-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "sonner-example",
      "title": "Sonner",
      "registryDependencies": [
        "sonner",
        "example"
      ],
      "files": [
        {
          "path": "examples/sonner-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "spinner-example",
      "title": "Spinner",
      "registryDependencies": [
        "badge",
        "button",
        "empty",
        "field",
        "input-group",
        "spinner",
        "example"
      ],
      "files": [
        {
          "path": "examples/spinner-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "switch-example",
      "title": "Switch",
      "registryDependencies": [
        "field",
        "label",
        "switch",
        "example"
      ],
      "files": [
        {
          "path": "examples/switch-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "table-example",
      "title": "Table",
      "registryDependencies": [
        "button",
        "dropdown-menu",
        "input",
        "select",
        "table",
        "example"
      ],
      "files": [
        {
          "path": "examples/table-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "tabs-example",
      "title": "Tabs",
      "registryDependencies": [
        "button",
        "dropdown-menu",
        "tabs",
        "example"
      ],
      "files": [
        {
          "path": "examples/tabs-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "textarea-example",
      "title": "Textarea",
      "registryDependencies": [
        "field",
        "textarea",
        "example"
      ],
      "files": [
        {
          "path": "examples/textarea-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "toggle-example",
      "title": "Toggle",
      "registryDependencies": [
        "toggle",
        "example"
      ],
      "files": [
        {
          "path": "examples/toggle-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "toggle-group-example",
      "title": "Toggle Group",
      "registryDependencies": [
        "input",
        "select",
        "toggle-group",
        "example"
      ],
      "files": [
        {
          "path": "examples/toggle-group-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "tooltip-example",
      "title": "Tooltip",
      "registryDependencies": [
        "button",
        "kbd",
        "tooltip",
        "example"
      ],
      "files": [
        {
          "path": "examples/tooltip-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "demo",
      "title": "Demo",
      "registryDependencies": [
        "alert-dialog",
        "badge",
        "button",
        "button-group",
        "card",
        "checkbox",
        "dropdown-menu",
        "field",
        "input-group",
        "item",
        "radio-group",
        "slider",
        "switch",
        "textarea"
      ],
      "files": [
        {
          "path": "examples/demo.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "component-example",
      "title": "Example",
      "registryDependencies": [
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
        "example"
      ],
      "files": [
        {
          "path": "examples/component-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "utils",
      "files": [
        {
          "path": "lib/utils.ts",
          "type": "registry:lib"
        }
      ],
      "type": "registry:lib"
    },
    {
      "name": "example",
      "title": "Example",
      "files": [
        {
          "path": "components/example.tsx",
          "type": "registry:component"
        }
      ],
      "type": "registry:component"
    },
    {
      "name": "use-mobile",
      "files": [
        {
          "path": "hooks/use-mobile.ts",
          "type": "registry:hook"
        }
      ],
      "type": "registry:hook"
    },
    {
      "name": "font-geist",
      "title": "Geist",
      "type": "registry:font",
      "font": {
        "family": "'Geist Variable', sans-serif",
        "provider": "google",
        "import": "Geist",
        "variable": "--font-sans",
        "subsets": [
          "latin"
        ],
        "dependency": "@fontsource-variable/geist"
      }
    },
    {
      "name": "font-inter",
      "title": "Inter",
      "type": "registry:font",
      "font": {
        "family": "'Inter Variable', sans-serif",
        "provider": "google",
        "import": "Inter",
        "variable": "--font-sans",
        "subsets": [
          "latin"
        ],
        "dependency": "@fontsource-variable/inter"
      }
    },
    {
      "name": "font-noto-sans",
      "title": "Noto Sans",
      "type": "registry:font",
      "font": {
        "family": "'Noto Sans Variable', sans-serif",
        "provider": "google",
        "import": "Noto_Sans",
        "variable": "--font-sans",
        "dependency": "@fontsource-variable/noto-sans"
      }
    },
    {
      "name": "font-nunito-sans",
      "title": "Nunito Sans",
      "type": "registry:font",
      "font": {
        "family": "'Nunito Sans Variable', sans-serif",
        "provider": "google",
        "import": "Nunito_Sans",
        "variable": "--font-sans",
        "dependency": "@fontsource-variable/nunito-sans"
      }
    },
    {
      "name": "font-figtree",
      "title": "Figtree",
      "type": "registry:font",
      "font": {
        "family": "'Figtree Variable', sans-serif",
        "provider": "google",
        "import": "Figtree",
        "variable": "--font-sans",
        "subsets": [
          "latin"
        ],
        "dependency": "@fontsource-variable/figtree"
      }
    },
    {
      "name": "font-roboto",
      "title": "Roboto",
      "type": "registry:font",
      "font": {
        "family": "'Roboto Variable', sans-serif",
        "provider": "google",
        "import": "Roboto",
        "variable": "--font-sans",
        "subsets": [
          "latin"
        ],
        "dependency": "@fontsource-variable/roboto"
      }
    },
    {
      "name": "font-raleway",
      "title": "Raleway",
      "type": "registry:font",
      "font": {
        "family": "'Raleway Variable', sans-serif",
        "provider": "google",
        "import": "Raleway",
        "variable": "--font-sans",
        "subsets": [
          "latin"
        ],
        "dependency": "@fontsource-variable/raleway"
      }
    },
    {
      "name": "font-dm-sans",
      "title": "DM Sans",
      "type": "registry:font",
      "font": {
        "family": "'DM Sans Variable', sans-serif",
        "provider": "google",
        "import": "DM_Sans",
        "variable": "--font-sans",
        "subsets": [
          "latin"
        ],
        "dependency": "@fontsource-variable/dm-sans"
      }
    },
    {
      "name": "font-public-sans",
      "title": "Public Sans",
      "type": "registry:font",
      "font": {
        "family": "'Public Sans Variable', sans-serif",
        "provider": "google",
        "import": "Public_Sans",
        "variable": "--font-sans",
        "subsets": [
          "latin"
        ],
        "dependency": "@fontsource-variable/public-sans"
      }
    },
    {
      "name": "font-outfit",
      "title": "Outfit",
      "type": "registry:font",
      "font": {
        "family": "'Outfit Variable', sans-serif",
        "provider": "google",
        "import": "Outfit",
        "variable": "--font-sans",
        "subsets": [
          "latin"
        ],
        "dependency": "@fontsource-variable/outfit"
      }
    },
    {
      "name": "font-jetbrains-mono",
      "title": "JetBrains Mono",
      "type": "registry:font",
      "font": {
        "family": "'JetBrains Mono Variable', monospace",
        "provider": "google",
        "import": "JetBrains_Mono",
        "variable": "--font-mono",
        "subsets": [
          "latin"
        ],
        "dependency": "@fontsource-variable/jetbrains-mono"
      }
    },
    {
      "name": "font-geist-mono",
      "title": "Geist Mono",
      "type": "registry:font",
      "font": {
        "family": "'Geist Mono Variable', monospace",
        "provider": "google",
        "import": "Geist_Mono",
        "variable": "--font-mono",
        "subsets": [
          "latin"
        ],
        "dependency": "@fontsource-variable/geist-mono"
      }
    },
    {
      "name": "font-noto-serif",
      "title": "Noto Serif",
      "type": "registry:font",
      "font": {
        "family": "'Noto Serif Variable', serif",
        "provider": "google",
        "import": "Noto_Serif",
        "variable": "--font-serif",
        "subsets": [
          "latin"
        ],
        "dependency": "@fontsource-variable/noto-serif"
      }
    },
    {
      "name": "font-roboto-slab",
      "title": "Roboto Slab",
      "type": "registry:font",
      "font": {
        "family": "'Roboto Slab Variable', serif",
        "provider": "google",
        "import": "Roboto_Slab",
        "variable": "--font-serif",
        "subsets": [
          "latin"
        ],
        "dependency": "@fontsource-variable/roboto-slab"
      }
    },
    {
      "name": "font-merriweather",
      "title": "Merriweather",
      "type": "registry:font",
      "font": {
        "family": "'Merriweather Variable', serif",
        "provider": "google",
        "import": "Merriweather",
        "variable": "--font-serif",
        "subsets": [
          "latin"
        ],
        "dependency": "@fontsource-variable/merriweather"
      }
    },
    {
      "name": "font-lora",
      "title": "Lora",
      "type": "registry:font",
      "font": {
        "family": "'Lora Variable', serif",
        "provider": "google",
        "import": "Lora",
        "variable": "--font-serif",
        "subsets": [
          "latin"
        ],
        "dependency": "@fontsource-variable/lora"
      }
    },
    {
      "name": "font-playfair-display",
      "title": "Playfair Display",
      "type": "registry:font",
      "font": {
        "family": "'Playfair Display Variable', serif",
        "provider": "google",
        "import": "Playfair_Display",
        "variable": "--font-serif",
        "subsets": [
          "latin"
        ],
        "dependency": "@fontsource-variable/playfair-display"
      }
    }
  ]
}
