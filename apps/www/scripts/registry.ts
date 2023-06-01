import * as z from "zod"

export const registrySchema = z.array(
  z.object({
    name: z.string(),
    dependencies: z.array(z.string()).optional(),
    componentDependencies: z.array(z.string()).optional(),
    files: z.array(z.string()),
    type: z.enum(["components:component", "components:ui"]),
  })
)

export type Registry = z.infer<typeof registrySchema>

export const registry: Registry = [
  {
    name: "accordion",
    type: "components:ui",
    dependencies: ["@radix-ui/react-accordion"],
    files: ["components/ui/accordion.tsx"],
  },
  {
    name: "alert",
    type: "components:ui",
    files: ["components/ui/alert.tsx"],
  },
  {
    name: "alert-dialog",
    type: "components:ui",
    dependencies: ["@radix-ui/react-alert-dialog"],
    files: ["components/ui/alert-dialog.tsx"],
  },
  {
    name: "aspect-ratio",
    type: "components:ui",
    dependencies: ["@radix-ui/react-aspect-ratio"],
    files: ["components/ui/aspect-ratio.tsx"],
  },
  {
    name: "avatar",
    type: "components:ui",
    dependencies: ["@radix-ui/react-avatar"],
    files: ["components/ui/avatar.tsx"],
  },
  {
    name: "badge",
    type: "components:ui",
    files: ["components/ui/badge.tsx"],
  },
  {
    name: "button",
    type: "components:ui",
    dependencies: ["@radix-ui/react-slot"],
    files: ["components/ui/button.tsx"],
  },
  {
    name: "calendar",
    type: "components:ui",
    dependencies: ["react-day-picker", "date-fns"],
    componentDependencies: ["button"],
    files: ["components/ui/calendar.tsx"],
  },
  {
    name: "card",
    type: "components:ui",
    files: ["components/ui/card.tsx"],
  },
  {
    name: "checkbox",
    type: "components:ui",
    dependencies: ["@radix-ui/react-checkbox"],
    files: ["components/ui/checkbox.tsx"],
  },
  {
    name: "collapsible",
    type: "components:ui",
    dependencies: ["@radix-ui/react-collapsible"],
    files: ["components/ui/collapsible.tsx"],
  },
  {
    name: "command",
    type: "components:ui",
    dependencies: ["cmdk"],
    componentDependencies: ["dialog"],
    files: ["components/ui/command.tsx"],
  },
  {
    name: "context-menu",
    type: "components:ui",
    dependencies: ["@radix-ui/react-context-menu"],
    files: ["components/ui/context-menu.tsx"],
  },
  {
    name: "dialog",
    type: "components:ui",
    dependencies: ["@radix-ui/react-dialog"],
    files: ["components/ui/dialog.tsx"],
  },
  {
    name: "dropdown-menu",
    type: "components:ui",
    dependencies: ["@radix-ui/react-dropdown-menu"],
    files: ["components/ui/dropdown-menu.tsx"],
  },
  {
    name: "hover-card",
    type: "components:ui",
    dependencies: ["@radix-ui/react-hover-card"],
    files: ["components/ui/hover-card.tsx"],
  },
  {
    name: "input",
    type: "components:ui",
    files: ["components/ui/input.tsx"],
  },
  {
    name: "label",
    type: "components:ui",
    dependencies: ["@radix-ui/react-label"],
    files: ["components/ui/label.tsx"],
  },
  {
    name: "menubar",
    type: "components:ui",
    dependencies: ["@radix-ui/react-menubar"],
    files: ["components/ui/menubar.tsx"],
  },
  {
    name: "navigation-menu",
    type: "components:ui",
    dependencies: ["@radix-ui/react-navigation-menu"],
    files: ["components/ui/navigation-menu.tsx"],
  },
  {
    name: "popover",
    type: "components:ui",
    dependencies: ["@radix-ui/react-popover"],
    files: ["components/ui/popover.tsx"],
  },
  {
    name: "progress",
    type: "components:ui",
    dependencies: ["@radix-ui/react-progress"],
    files: ["components/ui/progress.tsx"],
  },
  {
    name: "radio-group",
    type: "components:ui",
    dependencies: ["@radix-ui/react-radio-group"],
    files: ["components/ui/radio-group.tsx"],
  },
  {
    name: "scroll-area",
    type: "components:ui",
    dependencies: ["@radix-ui/react-scroll-area"],
    files: ["components/ui/scroll-area.tsx"],
  },
  {
    name: "select",
    type: "components:ui",
    dependencies: ["@radix-ui/react-select"],
    files: ["components/ui/select.tsx"],
  },
  {
    name: "separator",
    type: "components:ui",
    dependencies: ["@radix-ui/react-separator"],
    files: ["components/ui/separator.tsx"],
  },
  {
    name: "sheet",
    type: "components:ui",
    dependencies: ["@radix-ui/react-dialog"],
    files: ["components/ui/sheet.tsx"],
  },
  {
    name: "skeleton",
    type: "components:ui",
    files: ["components/ui/skeleton.tsx"],
  },
  {
    name: "slider",
    type: "components:ui",
    dependencies: ["@radix-ui/react-slider"],
    files: ["components/ui/slider.tsx"],
  },
  {
    name: "switch",
    type: "components:ui",
    dependencies: ["@radix-ui/react-switch"],
    files: ["components/ui/switch.tsx"],
  },
  {
    name: "table",
    type: "components:ui",
    files: ["components/ui/table.tsx"],
  },
  {
    name: "tabs",
    type: "components:ui",
    dependencies: ["@radix-ui/react-tabs"],
    files: ["components/ui/tabs.tsx"],
  },
  {
    name: "textarea",
    type: "components:ui",
    files: ["components/ui/textarea.tsx"],
  },
  {
    name: "toast",
    type: "components:ui",
    dependencies: ["@radix-ui/react-toast"],
    files: [
      "components/ui/toast.tsx",
      "components/ui/use-toast.ts",
      "components/ui/toaster.tsx",
    ],
  },
  {
    name: "toggle",
    type: "components:ui",
    dependencies: ["@radix-ui/react-toggle"],
    files: ["components/ui/toggle.tsx"],
  },
  {
    name: "tooltip",
    type: "components:ui",
    dependencies: ["@radix-ui/react-tooltip"],
    files: ["components/ui/tooltip.tsx"],
  },
  {
    name: "input-with-button",
    type: "components:component",
    componentDependencies: ["input", "button"],
    files: ["components/component/input-with-button.tsx"],
  },
]
