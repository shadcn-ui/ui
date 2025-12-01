import { registryItemSchema, type Registry } from "shadcn/schema"
import { z } from "zod"

import { blocks } from "./blocks/_registry"
import { components } from "./components/_registry"
import { examples } from "./examples/_registry"
import { lib } from "./lib/_registry"
import { ui } from "./ui/_registry"

export const registry = {
  name: "shadcn/ui",
  homepage: "https://ui.shadcn.com",
  items: z
    .array(registryItemSchema)
    .parse([...ui, ...examples, ...lib, ...components, ...blocks]),
} satisfies Registry
