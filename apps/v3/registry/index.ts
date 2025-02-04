import { registrySchema, type Registry } from "shadcn/registry"

import { blocks } from "@/www/registry/registry-blocks"
import { ui } from "@/www/registry/registry-ui"

const DEPRECATED_ITEMS = ["toast"]

const { items } = registrySchema.parse({
  items: [
    ...ui,
    ...blocks,
    {
      name: "use-mobile",
      type: "registry:hook",
      files: [
        {
          path: "hooks/use-mobile.ts",
          type: "registry:hook",
        },
      ],
    },
  ].filter((item) => {
    console.log(item.name)
    return !DEPRECATED_ITEMS.includes(item.name)
  }),
})

export const registry = {
  name: "shadcn/ui",
  homepage: "https://ui.shadcn.com",
  items,
} satisfies Registry
