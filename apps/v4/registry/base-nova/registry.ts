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
        "react-day-picker@latest",
        "date-fns"
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
        "embla-carousel-react"
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
        "@base-ui/react"
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
        "vaul"
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
        "input-otp"
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
        "react-resizable-panels"
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
      "name": "sidebar",
      "registryDependencies": [
        "button",
        "input",
        "separator",
        "sheet",
        "skeleton",
        "tooltip"
      ],
      "files": [
        {
          "path": "ui/sidebar.tsx",
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
        "sonner",
        "next-themes"
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
      "name": "accordion-demo",
      "title": "Accordion Demo",
      "registryDependencies": [
        "accordion"
      ],
      "files": [
        {
          "path": "demo/accordion-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "accordion-disabled",
      "title": "Accordion Disabled",
      "registryDependencies": [
        "accordion"
      ],
      "files": [
        {
          "path": "demo/accordion-disabled.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "accordion-multiple",
      "title": "Accordion Multiple",
      "registryDependencies": [
        "accordion"
      ],
      "files": [
        {
          "path": "demo/accordion-multiple.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "accordion-borders",
      "title": "Accordion Borders",
      "registryDependencies": [
        "accordion"
      ],
      "files": [
        {
          "path": "demo/accordion-borders.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "accordion-card",
      "title": "Accordion Card",
      "registryDependencies": [
        "accordion",
        "card"
      ],
      "files": [
        {
          "path": "demo/accordion-card.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "alert-demo",
      "title": "Alert Demo",
      "registryDependencies": [
        "alert"
      ],
      "files": [
        {
          "path": "demo/alert-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "alert-destructive",
      "title": "Alert Destructive",
      "registryDependencies": [
        "alert"
      ],
      "files": [
        {
          "path": "demo/alert-destructive.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "alert-dialog-demo",
      "title": "Alert Dialog Demo",
      "registryDependencies": [
        "alert-dialog",
        "button"
      ],
      "files": [
        {
          "path": "demo/alert-dialog-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "aspect-ratio-demo",
      "title": "Aspect Ratio Demo",
      "registryDependencies": [
        "aspect-ratio"
      ],
      "files": [
        {
          "path": "demo/aspect-ratio-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "avatar-demo",
      "title": "Avatar Demo",
      "registryDependencies": [
        "avatar"
      ],
      "files": [
        {
          "path": "demo/avatar-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "badge-demo",
      "title": "Badge Demo",
      "registryDependencies": [
        "badge"
      ],
      "files": [
        {
          "path": "demo/badge-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "badge-destructive",
      "title": "Badge Destructive",
      "registryDependencies": [
        "badge"
      ],
      "files": [
        {
          "path": "demo/badge-destructive.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "badge-outline",
      "title": "Badge Outline",
      "registryDependencies": [
        "badge"
      ],
      "files": [
        {
          "path": "demo/badge-outline.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "badge-secondary",
      "title": "Badge Secondary",
      "registryDependencies": [
        "badge"
      ],
      "files": [
        {
          "path": "demo/badge-secondary.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "breadcrumb-demo",
      "title": "Breadcrumb Demo",
      "registryDependencies": [
        "breadcrumb",
        "dropdown-menu"
      ],
      "files": [
        {
          "path": "demo/breadcrumb-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "breadcrumb-dropdown",
      "title": "Breadcrumb Dropdown",
      "registryDependencies": [
        "breadcrumb",
        "dropdown-menu"
      ],
      "files": [
        {
          "path": "demo/breadcrumb-dropdown.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "breadcrumb-ellipsis",
      "title": "Breadcrumb Ellipsis",
      "registryDependencies": [
        "breadcrumb"
      ],
      "files": [
        {
          "path": "demo/breadcrumb-ellipsis.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "breadcrumb-link",
      "title": "Breadcrumb Link",
      "registryDependencies": [
        "breadcrumb"
      ],
      "files": [
        {
          "path": "demo/breadcrumb-link.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "breadcrumb-responsive",
      "title": "Breadcrumb Responsive",
      "registryDependencies": [
        "breadcrumb",
        "button",
        "drawer",
        "dropdown-menu"
      ],
      "files": [
        {
          "path": "demo/breadcrumb-responsive.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "breadcrumb-separator",
      "title": "Breadcrumb Separator",
      "registryDependencies": [
        "breadcrumb"
      ],
      "files": [
        {
          "path": "demo/breadcrumb-separator.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-as-child",
      "title": "Button As Child",
      "registryDependencies": [
        "button"
      ],
      "files": [
        {
          "path": "demo/button-as-child.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-default",
      "title": "Button Default",
      "registryDependencies": [
        "button"
      ],
      "files": [
        {
          "path": "demo/button-default.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-demo",
      "title": "Button Demo",
      "registryDependencies": [
        "button"
      ],
      "files": [
        {
          "path": "demo/button-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-destructive",
      "title": "Button Destructive",
      "registryDependencies": [
        "button"
      ],
      "files": [
        {
          "path": "demo/button-destructive.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-ghost",
      "title": "Button Ghost",
      "registryDependencies": [
        "button"
      ],
      "files": [
        {
          "path": "demo/button-ghost.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-group-demo",
      "title": "Button Group Demo",
      "registryDependencies": [
        "button",
        "button-group",
        "dropdown-menu"
      ],
      "files": [
        {
          "path": "demo/button-group-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-group-dropdown",
      "title": "Button Group Dropdown",
      "registryDependencies": [
        "button",
        "button-group",
        "dropdown-menu"
      ],
      "files": [
        {
          "path": "demo/button-group-dropdown.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-group-input-group",
      "title": "Button Group Input Group",
      "registryDependencies": [
        "button",
        "button-group",
        "input-group",
        "tooltip"
      ],
      "files": [
        {
          "path": "demo/button-group-input-group.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-group-input",
      "title": "Button Group Input",
      "registryDependencies": [
        "button",
        "button-group",
        "input"
      ],
      "files": [
        {
          "path": "demo/button-group-input.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-group-nested",
      "title": "Button Group Nested",
      "registryDependencies": [
        "button",
        "button-group"
      ],
      "files": [
        {
          "path": "demo/button-group-nested.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-group-orientation",
      "title": "Button Group Orientation",
      "registryDependencies": [
        "button",
        "button-group"
      ],
      "files": [
        {
          "path": "demo/button-group-orientation.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-group-popover",
      "title": "Button Group Popover",
      "registryDependencies": [
        "button",
        "button-group",
        "popover",
        "separator",
        "textarea"
      ],
      "files": [
        {
          "path": "demo/button-group-popover.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-group-select",
      "title": "Button Group Select",
      "registryDependencies": [
        "button",
        "button-group",
        "input",
        "select"
      ],
      "files": [
        {
          "path": "demo/button-group-select.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-group-separator",
      "title": "Button Group Separator",
      "registryDependencies": [
        "button",
        "button-group"
      ],
      "files": [
        {
          "path": "demo/button-group-separator.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-group-size",
      "title": "Button Group Size",
      "registryDependencies": [
        "button",
        "button-group"
      ],
      "files": [
        {
          "path": "demo/button-group-size.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-group-split",
      "title": "Button Group Split",
      "registryDependencies": [
        "button",
        "button-group"
      ],
      "files": [
        {
          "path": "demo/button-group-split.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-icon",
      "title": "Button Icon",
      "registryDependencies": [
        "button"
      ],
      "files": [
        {
          "path": "demo/button-icon.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-link",
      "title": "Button Link",
      "registryDependencies": [
        "button"
      ],
      "files": [
        {
          "path": "demo/button-link.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-loading",
      "title": "Button Loading",
      "registryDependencies": [
        "button",
        "spinner"
      ],
      "files": [
        {
          "path": "demo/button-loading.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-outline",
      "title": "Button Outline",
      "registryDependencies": [
        "button"
      ],
      "files": [
        {
          "path": "demo/button-outline.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-rounded",
      "title": "Button Rounded",
      "registryDependencies": [
        "button"
      ],
      "files": [
        {
          "path": "demo/button-rounded.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-secondary",
      "title": "Button Secondary",
      "registryDependencies": [
        "button"
      ],
      "files": [
        {
          "path": "demo/button-secondary.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-size",
      "title": "Button Size",
      "registryDependencies": [
        "button"
      ],
      "files": [
        {
          "path": "demo/button-size.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "button-with-icon",
      "title": "Button With Icon",
      "registryDependencies": [
        "button"
      ],
      "files": [
        {
          "path": "demo/button-with-icon.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "calendar-demo",
      "title": "Calendar Demo",
      "registryDependencies": [
        "calendar"
      ],
      "files": [
        {
          "path": "demo/calendar-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "calendar-hijri",
      "title": "Calendar Hijri",
      "registryDependencies": [
        "button"
      ],
      "files": [
        {
          "path": "demo/calendar-hijri.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "card-demo",
      "title": "Card Demo",
      "registryDependencies": [
        "button",
        "card",
        "input",
        "label"
      ],
      "files": [
        {
          "path": "demo/card-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "carousel-api",
      "title": "Carousel Api",
      "registryDependencies": [
        "card",
        "carousel"
      ],
      "files": [
        {
          "path": "demo/carousel-api.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "carousel-demo",
      "title": "Carousel Demo",
      "registryDependencies": [
        "card",
        "carousel"
      ],
      "files": [
        {
          "path": "demo/carousel-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "carousel-orientation",
      "title": "Carousel Orientation",
      "registryDependencies": [
        "card",
        "carousel"
      ],
      "files": [
        {
          "path": "demo/carousel-orientation.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "carousel-plugin",
      "title": "Carousel Plugin",
      "registryDependencies": [
        "card",
        "carousel"
      ],
      "files": [
        {
          "path": "demo/carousel-plugin.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "carousel-size",
      "title": "Carousel Size",
      "registryDependencies": [
        "card",
        "carousel"
      ],
      "files": [
        {
          "path": "demo/carousel-size.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "carousel-spacing",
      "title": "Carousel Spacing",
      "registryDependencies": [
        "card",
        "carousel"
      ],
      "files": [
        {
          "path": "demo/carousel-spacing.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "chart-bar-demo-axis",
      "title": "Chart Bar Demo Axis",
      "registryDependencies": [
        "chart"
      ],
      "files": [
        {
          "path": "demo/chart-bar-demo-axis.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "chart-bar-demo-grid",
      "title": "Chart Bar Demo Grid",
      "registryDependencies": [
        "chart"
      ],
      "files": [
        {
          "path": "demo/chart-bar-demo-grid.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "chart-bar-demo-legend",
      "title": "Chart Bar Demo Legend",
      "registryDependencies": [
        "chart"
      ],
      "files": [
        {
          "path": "demo/chart-bar-demo-legend.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "chart-bar-demo-tooltip",
      "title": "Chart Bar Demo Tooltip",
      "registryDependencies": [
        "chart"
      ],
      "files": [
        {
          "path": "demo/chart-bar-demo-tooltip.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "chart-bar-demo",
      "title": "Chart Bar Demo",
      "registryDependencies": [
        "chart"
      ],
      "files": [
        {
          "path": "demo/chart-bar-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "chart-tooltip-demo",
      "title": "Chart Tooltip Demo",
      "registryDependencies": [],
      "files": [
        {
          "path": "demo/chart-tooltip-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "checkbox-demo",
      "title": "Checkbox Demo",
      "registryDependencies": [
        "checkbox",
        "label"
      ],
      "files": [
        {
          "path": "demo/checkbox-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "checkbox-disabled",
      "title": "Checkbox Disabled",
      "registryDependencies": [
        "checkbox"
      ],
      "files": [
        {
          "path": "demo/checkbox-disabled.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "checkbox-with-text",
      "title": "Checkbox With Text",
      "registryDependencies": [
        "checkbox"
      ],
      "files": [
        {
          "path": "demo/checkbox-with-text.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "collapsible-demo",
      "title": "Collapsible Demo",
      "registryDependencies": [
        "button",
        "collapsible"
      ],
      "files": [
        {
          "path": "demo/collapsible-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "combobox-demo",
      "title": "Combobox Demo",
      "registryDependencies": [
        "button",
        "command",
        "popover"
      ],
      "files": [
        {
          "path": "demo/combobox-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "combobox-dropdown-menu",
      "title": "Combobox Dropdown Menu",
      "registryDependencies": [
        "button",
        "command",
        "dropdown-menu"
      ],
      "files": [
        {
          "path": "demo/combobox-dropdown-menu.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "combobox-popover",
      "title": "Combobox Popover",
      "registryDependencies": [
        "button",
        "command",
        "popover"
      ],
      "files": [
        {
          "path": "demo/combobox-popover.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "combobox-responsive",
      "title": "Combobox Responsive",
      "registryDependencies": [
        "button",
        "command",
        "drawer",
        "popover"
      ],
      "files": [
        {
          "path": "demo/combobox-responsive.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "command-demo",
      "title": "Command Demo",
      "registryDependencies": [
        "command"
      ],
      "files": [
        {
          "path": "demo/command-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "command-dialog",
      "title": "Command Dialog",
      "registryDependencies": [
        "command"
      ],
      "files": [
        {
          "path": "demo/command-dialog.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "context-menu-demo",
      "title": "Context Menu Demo",
      "registryDependencies": [
        "context-menu"
      ],
      "files": [
        {
          "path": "demo/context-menu-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "data-table-demo",
      "title": "Data Table Demo",
      "registryDependencies": [
        "button",
        "checkbox",
        "dropdown-menu",
        "input",
        "table"
      ],
      "files": [
        {
          "path": "demo/data-table-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "date-picker-demo",
      "title": "Date Picker Demo",
      "registryDependencies": [
        "button",
        "calendar",
        "popover"
      ],
      "files": [
        {
          "path": "demo/date-picker-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "date-picker-with-presets",
      "title": "Date Picker With Presets",
      "registryDependencies": [
        "button",
        "calendar",
        "popover",
        "select"
      ],
      "files": [
        {
          "path": "demo/date-picker-with-presets.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "date-picker-with-range",
      "title": "Date Picker With Range",
      "registryDependencies": [
        "button",
        "calendar",
        "popover"
      ],
      "files": [
        {
          "path": "demo/date-picker-with-range.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "dialog-close-button",
      "title": "Dialog Close Button",
      "registryDependencies": [
        "button",
        "dialog",
        "input",
        "label"
      ],
      "files": [
        {
          "path": "demo/dialog-close-button.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "dialog-demo",
      "title": "Dialog Demo",
      "registryDependencies": [
        "button",
        "dialog",
        "input",
        "label"
      ],
      "files": [
        {
          "path": "demo/dialog-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "drawer-demo",
      "title": "Drawer Demo",
      "registryDependencies": [
        "button",
        "drawer"
      ],
      "files": [
        {
          "path": "demo/drawer-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "drawer-dialog",
      "title": "Drawer Dialog",
      "registryDependencies": [
        "button",
        "dialog",
        "drawer",
        "input",
        "label"
      ],
      "files": [
        {
          "path": "demo/drawer-dialog.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "dropdown-menu-checkboxes",
      "title": "Dropdown Menu Checkboxes",
      "registryDependencies": [
        "button",
        "dropdown-menu"
      ],
      "files": [
        {
          "path": "demo/dropdown-menu-checkboxes.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "dropdown-menu-demo",
      "title": "Dropdown Menu Demo",
      "registryDependencies": [
        "button",
        "dropdown-menu"
      ],
      "files": [
        {
          "path": "demo/dropdown-menu-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "dropdown-menu-dialog",
      "title": "Dropdown Menu Dialog",
      "registryDependencies": [
        "button",
        "dialog",
        "dropdown-menu",
        "field",
        "input",
        "label",
        "textarea"
      ],
      "files": [
        {
          "path": "demo/dropdown-menu-dialog.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "dropdown-menu-radio-group",
      "title": "Dropdown Menu Radio Group",
      "registryDependencies": [
        "button",
        "dropdown-menu"
      ],
      "files": [
        {
          "path": "demo/dropdown-menu-radio-group.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "empty-avatar-group",
      "title": "Empty Avatar Group",
      "registryDependencies": [
        "avatar",
        "button",
        "empty"
      ],
      "files": [
        {
          "path": "demo/empty-avatar-group.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "empty-avatar",
      "title": "Empty Avatar",
      "registryDependencies": [
        "avatar",
        "button",
        "empty"
      ],
      "files": [
        {
          "path": "demo/empty-avatar.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "empty-background",
      "title": "Empty Background",
      "registryDependencies": [
        "button",
        "empty"
      ],
      "files": [
        {
          "path": "demo/empty-background.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "empty-demo",
      "title": "Empty Demo",
      "registryDependencies": [
        "button",
        "empty"
      ],
      "files": [
        {
          "path": "demo/empty-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "empty-icon",
      "title": "Empty Icon",
      "registryDependencies": [
        "empty"
      ],
      "files": [
        {
          "path": "demo/empty-icon.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "empty-input-group",
      "title": "Empty Input Group",
      "registryDependencies": [
        "empty",
        "input-group",
        "kbd"
      ],
      "files": [
        {
          "path": "demo/empty-input-group.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "empty-outline",
      "title": "Empty Outline",
      "registryDependencies": [
        "button",
        "empty"
      ],
      "files": [
        {
          "path": "demo/empty-outline.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "field-checkbox",
      "title": "Field Checkbox",
      "registryDependencies": [
        "checkbox",
        "field"
      ],
      "files": [
        {
          "path": "demo/field-checkbox.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "field-choice-card",
      "title": "Field Choice Card",
      "registryDependencies": [
        "field",
        "radio-group"
      ],
      "files": [
        {
          "path": "demo/field-choice-card.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "field-demo",
      "title": "Field Demo",
      "registryDependencies": [
        "button",
        "checkbox",
        "field",
        "input",
        "select",
        "textarea"
      ],
      "files": [
        {
          "path": "demo/field-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "field-fieldset",
      "title": "Field Fieldset",
      "registryDependencies": [
        "field",
        "input"
      ],
      "files": [
        {
          "path": "demo/field-fieldset.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "field-group",
      "title": "Field Group",
      "registryDependencies": [
        "checkbox",
        "field"
      ],
      "files": [
        {
          "path": "demo/field-group.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "field-input",
      "title": "Field Input",
      "registryDependencies": [
        "field",
        "input"
      ],
      "files": [
        {
          "path": "demo/field-input.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "field-radio",
      "title": "Field Radio",
      "registryDependencies": [
        "field",
        "radio-group"
      ],
      "files": [
        {
          "path": "demo/field-radio.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "field-responsive",
      "title": "Field Responsive",
      "registryDependencies": [
        "button",
        "field",
        "input",
        "textarea"
      ],
      "files": [
        {
          "path": "demo/field-responsive.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "field-select",
      "title": "Field Select",
      "registryDependencies": [
        "field",
        "select"
      ],
      "files": [
        {
          "path": "demo/field-select.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "field-slider",
      "title": "Field Slider",
      "registryDependencies": [
        "field",
        "slider"
      ],
      "files": [
        {
          "path": "demo/field-slider.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "field-switch",
      "title": "Field Switch",
      "registryDependencies": [
        "field",
        "switch"
      ],
      "files": [
        {
          "path": "demo/field-switch.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "field-textarea",
      "title": "Field Textarea",
      "registryDependencies": [
        "field",
        "textarea"
      ],
      "files": [
        {
          "path": "demo/field-textarea.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "hover-card-demo",
      "title": "Hover Card Demo",
      "registryDependencies": [
        "avatar",
        "button",
        "hover-card"
      ],
      "files": [
        {
          "path": "demo/hover-card-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "input-demo",
      "title": "Input Demo",
      "registryDependencies": [
        "input"
      ],
      "files": [
        {
          "path": "demo/input-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "input-disabled",
      "title": "Input Disabled",
      "registryDependencies": [
        "input"
      ],
      "files": [
        {
          "path": "demo/input-disabled.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "input-file",
      "title": "Input File",
      "registryDependencies": [
        "input",
        "label"
      ],
      "files": [
        {
          "path": "demo/input-file.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "input-group-button-group",
      "title": "Input Group Button Group",
      "registryDependencies": [
        "button-group",
        "input-group",
        "label"
      ],
      "files": [
        {
          "path": "demo/input-group-button-group.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "input-group-button",
      "title": "Input Group Button",
      "registryDependencies": [
        "input-group",
        "popover"
      ],
      "files": [
        {
          "path": "demo/input-group-button.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "input-group-custom",
      "title": "Input Group Custom",
      "registryDependencies": [
        "input-group"
      ],
      "files": [
        {
          "path": "demo/input-group-custom.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "input-group-demo",
      "title": "Input Group Demo",
      "registryDependencies": [
        "dropdown-menu",
        "input-group",
        "separator",
        "tooltip"
      ],
      "files": [
        {
          "path": "demo/input-group-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "input-group-dropdown",
      "title": "Input Group Dropdown",
      "registryDependencies": [
        "dropdown-menu",
        "input-group"
      ],
      "files": [
        {
          "path": "demo/input-group-dropdown.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "input-group-icon",
      "title": "Input Group Icon",
      "registryDependencies": [
        "input-group"
      ],
      "files": [
        {
          "path": "demo/input-group-icon.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "input-group-label",
      "title": "Input Group Label",
      "registryDependencies": [
        "input-group",
        "label",
        "tooltip"
      ],
      "files": [
        {
          "path": "demo/input-group-label.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "input-group-spinner",
      "title": "Input Group Spinner",
      "registryDependencies": [
        "input-group",
        "spinner"
      ],
      "files": [
        {
          "path": "demo/input-group-spinner.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "input-group-text",
      "title": "Input Group Text",
      "registryDependencies": [
        "input-group"
      ],
      "files": [
        {
          "path": "demo/input-group-text.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "input-group-textarea",
      "title": "Input Group Textarea",
      "registryDependencies": [
        "input-group"
      ],
      "files": [
        {
          "path": "demo/input-group-textarea.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "input-group-tooltip",
      "title": "Input Group Tooltip",
      "registryDependencies": [
        "input-group",
        "tooltip"
      ],
      "files": [
        {
          "path": "demo/input-group-tooltip.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "input-otp-controlled",
      "title": "Input Otp Controlled",
      "registryDependencies": [
        "input-otp"
      ],
      "files": [
        {
          "path": "demo/input-otp-controlled.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "input-otp-demo",
      "title": "Input Otp Demo",
      "registryDependencies": [
        "input-otp"
      ],
      "files": [
        {
          "path": "demo/input-otp-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "input-otp-pattern",
      "title": "Input Otp Pattern",
      "registryDependencies": [
        "input-otp"
      ],
      "files": [
        {
          "path": "demo/input-otp-pattern.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "input-otp-separator",
      "title": "Input Otp Separator",
      "registryDependencies": [
        "input-otp"
      ],
      "files": [
        {
          "path": "demo/input-otp-separator.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "input-with-button",
      "title": "Input With Button",
      "registryDependencies": [
        "button",
        "input"
      ],
      "files": [
        {
          "path": "demo/input-with-button.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "input-with-label",
      "title": "Input With Label",
      "registryDependencies": [
        "input",
        "label"
      ],
      "files": [
        {
          "path": "demo/input-with-label.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "input-with-text",
      "title": "Input With Text",
      "registryDependencies": [
        "input",
        "label"
      ],
      "files": [
        {
          "path": "demo/input-with-text.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "item-avatar",
      "title": "Item Avatar",
      "registryDependencies": [
        "avatar",
        "button",
        "item"
      ],
      "files": [
        {
          "path": "demo/item-avatar.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "item-demo",
      "title": "Item Demo",
      "registryDependencies": [
        "button",
        "item"
      ],
      "files": [
        {
          "path": "demo/item-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "item-dropdown",
      "title": "Item Dropdown",
      "registryDependencies": [
        "avatar",
        "button",
        "dropdown-menu",
        "item"
      ],
      "files": [
        {
          "path": "demo/item-dropdown.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "item-group",
      "title": "Item Group",
      "registryDependencies": [
        "avatar",
        "button",
        "item"
      ],
      "files": [
        {
          "path": "demo/item-group.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "item-header",
      "title": "Item Header",
      "registryDependencies": [
        "item"
      ],
      "files": [
        {
          "path": "demo/item-header.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "item-icon",
      "title": "Item Icon",
      "registryDependencies": [
        "button",
        "item"
      ],
      "files": [
        {
          "path": "demo/item-icon.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "item-image",
      "title": "Item Image",
      "registryDependencies": [
        "item"
      ],
      "files": [
        {
          "path": "demo/item-image.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "item-link",
      "title": "Item Link",
      "registryDependencies": [
        "item"
      ],
      "files": [
        {
          "path": "demo/item-link.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "item-size",
      "title": "Item Size",
      "registryDependencies": [
        "button",
        "item"
      ],
      "files": [
        {
          "path": "demo/item-size.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "item-variant",
      "title": "Item Variant",
      "registryDependencies": [
        "button",
        "item"
      ],
      "files": [
        {
          "path": "demo/item-variant.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "kbd-button",
      "title": "Kbd Button",
      "registryDependencies": [
        "button",
        "kbd"
      ],
      "files": [
        {
          "path": "demo/kbd-button.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "kbd-demo",
      "title": "Kbd Demo",
      "registryDependencies": [
        "kbd"
      ],
      "files": [
        {
          "path": "demo/kbd-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "kbd-group",
      "title": "Kbd Group",
      "registryDependencies": [
        "kbd"
      ],
      "files": [
        {
          "path": "demo/kbd-group.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "kbd-input-group",
      "title": "Kbd Input Group",
      "registryDependencies": [
        "input-group",
        "kbd"
      ],
      "files": [
        {
          "path": "demo/kbd-input-group.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "kbd-tooltip",
      "title": "Kbd Tooltip",
      "registryDependencies": [
        "button",
        "button-group",
        "kbd",
        "tooltip"
      ],
      "files": [
        {
          "path": "demo/kbd-tooltip.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "label-demo",
      "title": "Label Demo",
      "registryDependencies": [
        "checkbox",
        "label"
      ],
      "files": [
        {
          "path": "demo/label-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "menubar-demo",
      "title": "Menubar Demo",
      "registryDependencies": [
        "menubar"
      ],
      "files": [
        {
          "path": "demo/menubar-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "native-select-demo",
      "title": "Native Select Demo",
      "registryDependencies": [
        "native-select"
      ],
      "files": [
        {
          "path": "demo/native-select-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "native-select-disabled",
      "title": "Native Select Disabled",
      "registryDependencies": [
        "native-select"
      ],
      "files": [
        {
          "path": "demo/native-select-disabled.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "native-select-groups",
      "title": "Native Select Groups",
      "registryDependencies": [
        "native-select"
      ],
      "files": [
        {
          "path": "demo/native-select-groups.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "native-select-invalid",
      "title": "Native Select Invalid",
      "registryDependencies": [
        "native-select"
      ],
      "files": [
        {
          "path": "demo/native-select-invalid.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "navigation-menu-demo",
      "title": "Navigation Menu Demo",
      "registryDependencies": [
        "navigation-menu"
      ],
      "files": [
        {
          "path": "demo/navigation-menu-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "pagination-demo",
      "title": "Pagination Demo",
      "registryDependencies": [
        "pagination"
      ],
      "files": [
        {
          "path": "demo/pagination-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "popover-demo",
      "title": "Popover Demo",
      "registryDependencies": [
        "button",
        "input",
        "label",
        "popover"
      ],
      "files": [
        {
          "path": "demo/popover-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "progress-demo",
      "title": "Progress Demo",
      "registryDependencies": [
        "progress"
      ],
      "files": [
        {
          "path": "demo/progress-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "radio-group-demo",
      "title": "Radio Group Demo",
      "registryDependencies": [
        "label",
        "radio-group"
      ],
      "files": [
        {
          "path": "demo/radio-group-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "resizable-demo-with-handle",
      "title": "Resizable Demo With Handle",
      "registryDependencies": [
        "resizable"
      ],
      "files": [
        {
          "path": "demo/resizable-demo-with-handle.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "resizable-demo",
      "title": "Resizable Demo",
      "registryDependencies": [
        "resizable"
      ],
      "files": [
        {
          "path": "demo/resizable-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "resizable-handle",
      "title": "Resizable Handle",
      "registryDependencies": [
        "resizable"
      ],
      "files": [
        {
          "path": "demo/resizable-handle.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "resizable-vertical",
      "title": "Resizable Vertical",
      "registryDependencies": [
        "resizable"
      ],
      "files": [
        {
          "path": "demo/resizable-vertical.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "scroll-area-demo",
      "title": "Scroll Area Demo",
      "registryDependencies": [
        "scroll-area",
        "separator"
      ],
      "files": [
        {
          "path": "demo/scroll-area-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "scroll-area-horizontal-demo",
      "title": "Scroll Area Horizontal Demo",
      "registryDependencies": [
        "scroll-area"
      ],
      "files": [
        {
          "path": "demo/scroll-area-horizontal-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "select-demo",
      "title": "Select Demo",
      "registryDependencies": [
        "select"
      ],
      "files": [
        {
          "path": "demo/select-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "select-scrollable",
      "title": "Select Scrollable",
      "registryDependencies": [
        "select"
      ],
      "files": [
        {
          "path": "demo/select-scrollable.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "separator-demo",
      "title": "Separator Demo",
      "registryDependencies": [
        "separator"
      ],
      "files": [
        {
          "path": "demo/separator-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "sheet-demo",
      "title": "Sheet Demo",
      "registryDependencies": [
        "button",
        "input",
        "label",
        "sheet"
      ],
      "files": [
        {
          "path": "demo/sheet-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "sheet-side",
      "title": "Sheet Side",
      "registryDependencies": [
        "button",
        "input",
        "label",
        "sheet"
      ],
      "files": [
        {
          "path": "demo/sheet-side.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "skeleton-card",
      "title": "Skeleton Card",
      "registryDependencies": [
        "skeleton"
      ],
      "files": [
        {
          "path": "demo/skeleton-card.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "skeleton-demo",
      "title": "Skeleton Demo",
      "registryDependencies": [
        "skeleton"
      ],
      "files": [
        {
          "path": "demo/skeleton-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "slider-demo",
      "title": "Slider Demo",
      "registryDependencies": [
        "slider"
      ],
      "files": [
        {
          "path": "demo/slider-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "sonner-demo",
      "title": "Sonner Demo",
      "registryDependencies": [
        "button"
      ],
      "files": [
        {
          "path": "demo/sonner-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "sonner-types",
      "title": "Sonner Types",
      "registryDependencies": [
        "button"
      ],
      "files": [
        {
          "path": "demo/sonner-types.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "spinner-badge",
      "title": "Spinner Badge",
      "registryDependencies": [
        "badge",
        "spinner"
      ],
      "files": [
        {
          "path": "demo/spinner-badge.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "spinner-basic",
      "title": "Spinner Basic",
      "registryDependencies": [
        "spinner"
      ],
      "files": [
        {
          "path": "demo/spinner-basic.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "spinner-button",
      "title": "Spinner Button",
      "registryDependencies": [
        "button",
        "spinner"
      ],
      "files": [
        {
          "path": "demo/spinner-button.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "spinner-color",
      "title": "Spinner Color",
      "registryDependencies": [
        "spinner"
      ],
      "files": [
        {
          "path": "demo/spinner-color.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "spinner-custom",
      "title": "Spinner Custom",
      "registryDependencies": [],
      "files": [
        {
          "path": "demo/spinner-custom.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "spinner-demo",
      "title": "Spinner Demo",
      "registryDependencies": [
        "item",
        "spinner"
      ],
      "files": [
        {
          "path": "demo/spinner-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "spinner-empty",
      "title": "Spinner Empty",
      "registryDependencies": [
        "button",
        "empty",
        "spinner"
      ],
      "files": [
        {
          "path": "demo/spinner-empty.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "spinner-input-group",
      "title": "Spinner Input Group",
      "registryDependencies": [
        "input-group",
        "spinner"
      ],
      "files": [
        {
          "path": "demo/spinner-input-group.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "spinner-item",
      "title": "Spinner Item",
      "registryDependencies": [
        "button",
        "item",
        "progress",
        "spinner"
      ],
      "files": [
        {
          "path": "demo/spinner-item.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "spinner-size",
      "title": "Spinner Size",
      "registryDependencies": [
        "spinner"
      ],
      "files": [
        {
          "path": "demo/spinner-size.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "switch-demo",
      "title": "Switch Demo",
      "registryDependencies": [
        "label",
        "switch"
      ],
      "files": [
        {
          "path": "demo/switch-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "table-demo",
      "title": "Table Demo",
      "registryDependencies": [
        "table"
      ],
      "files": [
        {
          "path": "demo/table-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "tabs-demo",
      "title": "Tabs Demo",
      "registryDependencies": [
        "button",
        "card",
        "input",
        "label",
        "tabs"
      ],
      "files": [
        {
          "path": "demo/tabs-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "textarea-demo",
      "title": "Textarea Demo",
      "registryDependencies": [
        "textarea"
      ],
      "files": [
        {
          "path": "demo/textarea-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "textarea-disabled",
      "title": "Textarea Disabled",
      "registryDependencies": [
        "textarea"
      ],
      "files": [
        {
          "path": "demo/textarea-disabled.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "textarea-with-button",
      "title": "Textarea With Button",
      "registryDependencies": [
        "button",
        "textarea"
      ],
      "files": [
        {
          "path": "demo/textarea-with-button.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "textarea-with-label",
      "title": "Textarea With Label",
      "registryDependencies": [
        "label",
        "textarea"
      ],
      "files": [
        {
          "path": "demo/textarea-with-label.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "textarea-with-text",
      "title": "Textarea With Text",
      "registryDependencies": [
        "label",
        "textarea"
      ],
      "files": [
        {
          "path": "demo/textarea-with-text.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "toggle-demo",
      "title": "Toggle Demo",
      "registryDependencies": [
        "toggle"
      ],
      "files": [
        {
          "path": "demo/toggle-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "toggle-disabled",
      "title": "Toggle Disabled",
      "registryDependencies": [
        "toggle"
      ],
      "files": [
        {
          "path": "demo/toggle-disabled.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "toggle-group-demo",
      "title": "Toggle Group Demo",
      "registryDependencies": [
        "toggle-group"
      ],
      "files": [
        {
          "path": "demo/toggle-group-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "toggle-group-disabled",
      "title": "Toggle Group Disabled",
      "registryDependencies": [
        "toggle-group"
      ],
      "files": [
        {
          "path": "demo/toggle-group-disabled.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "toggle-group-lg",
      "title": "Toggle Group Lg",
      "registryDependencies": [
        "toggle-group"
      ],
      "files": [
        {
          "path": "demo/toggle-group-lg.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "toggle-group-outline",
      "title": "Toggle Group Outline",
      "registryDependencies": [
        "toggle-group"
      ],
      "files": [
        {
          "path": "demo/toggle-group-outline.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "toggle-group-single",
      "title": "Toggle Group Single",
      "registryDependencies": [
        "toggle-group"
      ],
      "files": [
        {
          "path": "demo/toggle-group-single.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "toggle-group-sm",
      "title": "Toggle Group Sm",
      "registryDependencies": [
        "toggle-group"
      ],
      "files": [
        {
          "path": "demo/toggle-group-sm.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "toggle-group-spacing",
      "title": "Toggle Group Spacing",
      "registryDependencies": [
        "toggle-group"
      ],
      "files": [
        {
          "path": "demo/toggle-group-spacing.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "toggle-lg",
      "title": "Toggle Lg",
      "registryDependencies": [
        "toggle"
      ],
      "files": [
        {
          "path": "demo/toggle-lg.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "toggle-outline",
      "title": "Toggle Outline",
      "registryDependencies": [
        "toggle"
      ],
      "files": [
        {
          "path": "demo/toggle-outline.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "toggle-sm",
      "title": "Toggle Sm",
      "registryDependencies": [
        "toggle"
      ],
      "files": [
        {
          "path": "demo/toggle-sm.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "toggle-with-text",
      "title": "Toggle With Text",
      "registryDependencies": [
        "toggle"
      ],
      "files": [
        {
          "path": "demo/toggle-with-text.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "tooltip-demo",
      "title": "Tooltip Demo",
      "registryDependencies": [
        "button",
        "tooltip"
      ],
      "files": [
        {
          "path": "demo/tooltip-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "typography-blockquote",
      "title": "Typography Blockquote",
      "registryDependencies": [],
      "files": [
        {
          "path": "demo/typography-blockquote.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "typography-demo",
      "title": "Typography Demo",
      "registryDependencies": [],
      "files": [
        {
          "path": "demo/typography-demo.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "typography-h1",
      "title": "Typography H1",
      "registryDependencies": [],
      "files": [
        {
          "path": "demo/typography-h1.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "typography-h2",
      "title": "Typography H2",
      "registryDependencies": [],
      "files": [
        {
          "path": "demo/typography-h2.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "typography-h3",
      "title": "Typography H3",
      "registryDependencies": [],
      "files": [
        {
          "path": "demo/typography-h3.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "typography-h4",
      "title": "Typography H4",
      "registryDependencies": [],
      "files": [
        {
          "path": "demo/typography-h4.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "typography-inline-code",
      "title": "Typography Inline Code",
      "registryDependencies": [],
      "files": [
        {
          "path": "demo/typography-inline-code.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "typography-large",
      "title": "Typography Large",
      "registryDependencies": [],
      "files": [
        {
          "path": "demo/typography-large.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "typography-lead",
      "title": "Typography Lead",
      "registryDependencies": [],
      "files": [
        {
          "path": "demo/typography-lead.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "typography-list",
      "title": "Typography List",
      "registryDependencies": [],
      "files": [
        {
          "path": "demo/typography-list.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "typography-muted",
      "title": "Typography Muted",
      "registryDependencies": [],
      "files": [
        {
          "path": "demo/typography-muted.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "typography-p",
      "title": "Typography P",
      "registryDependencies": [],
      "files": [
        {
          "path": "demo/typography-p.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "typography-small",
      "title": "Typography Small",
      "registryDependencies": [],
      "files": [
        {
          "path": "demo/typography-small.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "typography-table",
      "title": "Typography Table",
      "registryDependencies": [],
      "files": [
        {
          "path": "demo/typography-table.tsx",
          "type": "registry:internal"
        }
      ],
      "type": "registry:internal"
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
      "name": "calendar-example",
      "title": "Calendar",
      "registryDependencies": [
        "button",
        "calendar",
        "card",
        "field",
        "input",
        "label",
        "popover",
        "example"
      ],
      "files": [
        {
          "path": "examples/calendar-example.tsx",
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
      "name": "sidebar-example",
      "title": "Sidebar",
      "registryDependencies": [
        "button",
        "dropdown-menu",
        "item",
        "label",
        "sidebar",
        "example"
      ],
      "files": [
        {
          "path": "examples/sidebar-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "sidebar-icon-example",
      "title": "Sidebar (Icon)",
      "registryDependencies": [
        "avatar",
        "button",
        "collapsible",
        "dropdown-menu",
        "item",
        "sidebar",
        "example"
      ],
      "files": [
        {
          "path": "examples/sidebar-icon-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "sidebar-inset-example",
      "title": "Sidebar (Inset)",
      "registryDependencies": [
        "collapsible",
        "sidebar",
        "example"
      ],
      "files": [
        {
          "path": "examples/sidebar-inset-example.tsx",
          "type": "registry:example"
        }
      ],
      "type": "registry:example"
    },
    {
      "name": "sidebar-floating-example",
      "title": "Sidebar (Floating)",
      "registryDependencies": [
        "button",
        "card",
        "dropdown-menu",
        "field",
        "item",
        "sidebar",
        "example"
      ],
      "files": [
        {
          "path": "examples/sidebar-floating-example.tsx",
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
      "dependencies": [
        "clsx",
        "tailwind-merge"
      ],
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
      "name": "preview",
      "title": "Home",
      "registryDependencies": [
        "alert-dialog",
        "avatar",
        "badge",
        "button",
        "button-group",
        "card",
        "checkbox",
        "combobox",
        "dropdown-menu",
        "empty",
        "field",
        "input",
        "input-group",
        "item",
        "label",
        "popover",
        "radio-group",
        "select",
        "separator",
        "sheet",
        "slider",
        "spinner",
        "switch",
        "textarea",
        "tooltip",
        "example"
      ],
      "files": [
        {
          "path": "blocks/preview.tsx",
          "type": "registry:block"
        }
      ],
      "type": "registry:block"
    },
    {
      "name": "elevenlabs",
      "title": "Elevenlabs",
      "registryDependencies": [
        "example",
        "button",
        "card"
      ],
      "files": [
        {
          "path": "blocks/elevenlabs.tsx",
          "type": "registry:block"
        }
      ],
      "type": "registry:block"
    },
    {
      "name": "github",
      "title": "GitHub",
      "registryDependencies": [
        "avatar",
        "badge",
        "button",
        "card",
        "checkbox",
        "combobox",
        "command",
        "drawer",
        "dropdown-menu",
        "empty",
        "field",
        "input",
        "input-group",
        "item",
        "kbd",
        "native-select",
        "popover",
        "separator",
        "spinner",
        "tabs",
        "textarea",
        "tooltip",
        "example"
      ],
      "files": [
        {
          "path": "blocks/github.tsx",
          "type": "registry:block"
        }
      ],
      "type": "registry:block"
    },
    {
      "name": "vercel",
      "title": "Vercel",
      "registryDependencies": [
        "alert",
        "badge",
        "button",
        "calendar",
        "card",
        "chart",
        "dialog",
        "dropdown-menu",
        "empty",
        "field",
        "input-group",
        "item",
        "native-select",
        "popover",
        "textarea",
        "example"
      ],
      "files": [
        {
          "path": "blocks/vercel.tsx",
          "type": "registry:block"
        }
      ],
      "type": "registry:block"
    },
    {
      "name": "chatgpt",
      "title": "ChatGPT",
      "registryDependencies": [
        "alert",
        "alert-dialog",
        "badge",
        "button",
        "card",
        "dropdown-menu",
        "field",
        "input-group",
        "item",
        "kbd",
        "popover",
        "tooltip",
        "example"
      ],
      "files": [
        {
          "path": "blocks/chatgpt.tsx",
          "type": "registry:block"
        }
      ],
      "type": "registry:block"
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
      "name": "sink",
      "registryDependencies": [
        "accordion-example",
        "alert-dialog-example",
        "alert-example",
        "aspect-ratio-example",
        "avatar-example",
        "badge-example",
        "breadcrumb-example",
        "button-example",
        "button-group-example",
        "calendar-example",
        "card-example",
        "carousel-example",
        "chart-example",
        "checkbox-example",
        "collapsible-example",
        "combobox-example",
        "command-example",
        "context-menu-example",
        "dialog-example",
        "drawer-example",
        "dropdown-menu-example",
        "empty-example",
        "field-example",
        "hover-card-example",
        "input-example",
        "input-group-example",
        "input-otp-example",
        "item-example",
        "kbd-example",
        "label-example",
        "menubar-example",
        "native-select-example",
        "navigation-menu-example",
        "pagination-example",
        "popover-example",
        "progress-example",
        "radio-group-example",
        "resizable-example",
        "scroll-area-example",
        "select-example",
        "separator-example",
        "sheet-example",
        "skeleton-example",
        "slider-example",
        "sonner-example",
        "spinner-example",
        "switch-example",
        "table-example",
        "tabs-example",
        "textarea-example",
        "toggle-example",
        "toggle-group-example",
        "tooltip-example"
      ],
      "files": [
        {
          "path": "internal/sink.tsx",
          "type": "registry:page",
          "target": "app/sink/page.tsx"
        }
      ],
      "type": "registry:internal"
    },
    {
      "name": "font-geist-sans",
      "title": "Geist Sans",
      "type": "registry:font",
      "font": {
        "family": "'Geist Variable', sans-serif",
        "provider": "google",
        "import": "Geist",
        "variable": "--font-sans",
        "subsets": [
          "latin"
        ]
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
        ]
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
        "variable": "--font-sans"
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
        "variable": "--font-sans"
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
        ]
      }
    },
    {
      "name": "font-roboto",
      "title": "Roboto",
      "type": "registry:font",
      "font": {
        "family": "'Roboto', sans-serif",
        "provider": "google",
        "import": "Roboto",
        "variable": "--font-sans",
        "subsets": [
          "latin"
        ]
      }
    },
    {
      "name": "font-raleway",
      "title": "Raleway",
      "type": "registry:font",
      "font": {
        "family": "'Raleway', sans-serif",
        "provider": "google",
        "import": "Raleway",
        "variable": "--font-sans",
        "subsets": [
          "latin"
        ]
      }
    },
    {
      "name": "font-dm-sans",
      "title": "DM Sans",
      "type": "registry:font",
      "font": {
        "family": "'DM Sans', sans-serif",
        "provider": "google",
        "import": "DM_Sans",
        "variable": "--font-sans",
        "subsets": [
          "latin"
        ]
      }
    },
    {
      "name": "font-public-sans",
      "title": "Public Sans",
      "type": "registry:font",
      "font": {
        "family": "'Public Sans', sans-serif",
        "provider": "google",
        "import": "Public_Sans",
        "variable": "--font-sans",
        "subsets": [
          "latin"
        ]
      }
    },
    {
      "name": "font-outfit",
      "title": "Outfit",
      "type": "registry:font",
      "font": {
        "family": "'Outfit', sans-serif",
        "provider": "google",
        "import": "Outfit",
        "variable": "--font-sans",
        "subsets": [
          "latin"
        ]
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
        "variable": "--font-sans",
        "subsets": [
          "latin"
        ]
      }
    }
  ]
}
