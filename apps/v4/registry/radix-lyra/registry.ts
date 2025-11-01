import { registryItemSchema, type Registry } from "shadcn/schema"
import { z } from "zod"

import { examples } from "./examples/_registry"
import { ui } from "./ui/_registry"

export const registry = {
  name: "shadcn/ui",
  homepage: "https://ui.shadcn.com",
  items: z.array(registryItemSchema).parse([...examples, ...ui]),
} satisfies Registry
