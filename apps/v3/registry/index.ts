import { type Registry } from "shadcn/registry"

import { ui } from "@/www/registry/registry-ui"

const items = ui.filter((item) => ["registry:ui"].includes(item.type))

export const registry = {
  name: "shadcn/ui",
  homepage: "https://ui.shadcn.com",
  items,
} satisfies Registry
