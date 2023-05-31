import * as z from "zod"

export const registrySchema = z.array(
  z.object({
    name: z.string(),
    dependencies: z.array(z.string()).optional(),
    componentDependencies: z.array(z.string()).optional(),
    files: z.array(z.string()),
    type: z.enum(["component", "ui"]),
  })
)

export type Registry = z.infer<typeof registrySchema>

export const registry: Registry = [
  {
    name: "accordion",
    type: "ui",
    dependencies: ["@radix-ui/react-accordion"],
    files: ["components/ui/accordion.tsx"],
  },
  {
    name: "alert",
    type: "ui",
    files: ["components/ui/alert.tsx"],
  },
  {
    name: "alert-dialog",
    type: "ui",
    dependencies: ["@radix-ui/react-alert-dialog"],
    files: ["components/ui/alert-dialog.tsx"],
  },
  {
    name: "aspect-ratio",
    type: "ui",
    dependencies: ["@radix-ui/react-aspect-ratio"],
    files: ["components/ui/aspect-ratio.tsx"],
  },
  {
    name: "avatar",
    type: "ui",
    dependencies: ["@radix-ui/react-avatar"],
    files: ["components/ui/avatar.tsx"],
  },
  {
    name: "badge",
    type: "ui",
    files: ["components/ui/badge.tsx"],
  },
  {
    name: "button",
    type: "ui",
    dependencies: ["@radix-ui/react-slot"],
    files: ["components/ui/button.tsx"],
  },
  {
    name: "calendar",
    type: "ui",
    dependencies: ["react-day-picker", "date-fns"],
    componentDependencies: ["button"],
    files: ["components/ui/calendar.tsx"],
  },
  {
    name: "card",
    type: "ui",
    files: ["components/ui/card.tsx"],
  },
  {
    name: "checkbox",
    type: "ui",
    dependencies: ["@radix-ui/react-checkbox"],
    files: ["components/ui/checkbox.tsx"],
  },
  {
    name: "collapsible",
    type: "ui",
    dependencies: ["@radix-ui/react-collapsible"],
    files: ["components/ui/collapsible.tsx"],
  },
  {
    name: "command",
    type: "ui",
    dependencies: ["cmdk"],
    componentDependencies: ["dialog"],
    files: ["components/ui/command.tsx"],
  },
  {
    name: "context-menu",
    type: "ui",
    dependencies: ["@radix-ui/react-context-menu"],
    files: ["components/ui/context-menu.tsx"],
  },
  {
    name: "dialog",
    type: "ui",
    dependencies: ["@radix-ui/react-dialog"],
    files: ["components/ui/dialog.tsx"],
  },
  {
    name: "dropdown-menu",
    type: "ui",
    dependencies: ["@radix-ui/react-dropdown-menu"],
    files: ["components/ui/dropdown-menu.tsx"],
  },
  {
    name: "hover-card",
    type: "ui",
    dependencies: ["@radix-ui/react-hover-card"],
    files: ["components/ui/hover-card.tsx"],
  },
  {
    name: "input",
    type: "ui",
    files: ["components/ui/input.tsx"],
  },
  {
    name: "label",
    type: "ui",
    dependencies: ["@radix-ui/react-label"],
    files: ["components/ui/label.tsx"],
  },
  {
    name: "menubar",
    type: "ui",
    dependencies: ["@radix-ui/react-menubar"],
    files: ["components/ui/menubar.tsx"],
  },
  {
    name: "navigation-menu",
    type: "ui",
    dependencies: ["@radix-ui/react-navigation-menu"],
    files: ["components/ui/navigation-menu.tsx"],
  },
  {
    name: "popover",
    type: "ui",
    dependencies: ["@radix-ui/react-popover"],
    files: ["components/ui/popover.tsx"],
  },
  {
    name: "progress",
    type: "ui",
    dependencies: ["@radix-ui/react-progress"],
    files: ["components/ui/progress.tsx"],
  },
  {
    name: "radio-group",
    type: "ui",
    dependencies: ["@radix-ui/react-radio-group"],
    files: ["components/ui/radio-group.tsx"],
  },
  {
    name: "scroll-area",
    type: "ui",
    dependencies: ["@radix-ui/react-scroll-area"],
    files: ["components/ui/scroll-area.tsx"],
  },
  {
    name: "select",
    type: "ui",
    dependencies: ["@radix-ui/react-select"],
    files: ["components/ui/select.tsx"],
  },
  {
    name: "separator",
    type: "ui",
    dependencies: ["@radix-ui/react-separator"],
    files: ["components/ui/separator.tsx"],
  },
  {
    name: "sheet",
    type: "ui",
    dependencies: ["@radix-ui/react-dialog"],
    files: ["components/ui/sheet.tsx"],
  },
  {
    name: "skeleton",
    type: "ui",
    files: ["components/ui/skeleton.tsx"],
  },
  {
    name: "slider",
    type: "ui",
    dependencies: ["@radix-ui/react-slider"],
    files: ["components/ui/slider.tsx"],
  },
  {
    name: "switch",
    type: "ui",
    dependencies: ["@radix-ui/react-switch"],
    files: ["components/ui/switch.tsx"],
  },
  {
    name: "table",
    type: "ui",
    files: ["components/ui/table.tsx"],
  },
  {
    name: "tabs",
    type: "ui",
    dependencies: ["@radix-ui/react-tabs"],
    files: ["components/ui/tabs.tsx"],
  },
  {
    name: "textarea",
    type: "ui",
    files: ["components/ui/textarea.tsx"],
  },
  {
    name: "toast",
    type: "ui",
    dependencies: ["@radix-ui/react-toast"],
    files: [
      "components/ui/toast.tsx",
      "components/ui/use-toast.ts",
      "components/ui/toaster.tsx",
    ],
  },
  {
    name: "toggle",
    type: "ui",
    dependencies: ["@radix-ui/react-toggle"],
    files: ["components/ui/toggle.tsx"],
  },
  {
    name: "tooltip",
    type: "ui",
    dependencies: ["@radix-ui/react-tooltip"],
    files: ["components/ui/tooltip.tsx"],
  },
]
