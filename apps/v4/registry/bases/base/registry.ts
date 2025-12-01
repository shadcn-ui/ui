import { registryItemSchema, type Registry } from "shadcn/schema"
import { z } from "zod"

import { blocks } from "./blocks/_registry"

export const registry = {
  name: "shadcn/ui",
  homepage: "https://ui.shadcn.com",
  items: z.array(registryItemSchema).parse([...blocks]),
} satisfies Registry
