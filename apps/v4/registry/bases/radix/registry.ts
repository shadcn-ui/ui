import { registryItemSchema, type Registry } from "shadcn/schema"
import { z } from "zod"

import { fonts } from "@/registry/fonts"

import { blocks } from "./blocks/_registry"
import { components } from "./components/_registry"
import { examples } from "./examples/_registry"
import { hooks } from "./hooks/_registry"
import { internal } from "./internal/_registry"
import { lib } from "./lib/_registry"
import { ui } from "./ui/_registry"

export const registry = {
  name: "shadcn/ui",
  homepage: "https://ui.shadcn.com",
  items: z
    .array(registryItemSchema)
    .parse([
      ...ui,
      ...examples,
      ...lib,
      ...components,
      ...internal,
      ...blocks,
      ...hooks,
      ...fonts,
    ]),
} satisfies Registry
