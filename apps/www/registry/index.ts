import { registryItemSchema } from "shadcn/registry"
import { z } from "zod"

import { blocks } from "@/registry/registry-blocks"
import { charts } from "@/registry/registry-charts"
import { examples } from "@/registry/registry-examples"
import { hooks } from "@/registry/registry-hooks"
import { internal } from "@/registry/registry-internal"
import { lib } from "@/registry/registry-lib"
import { themes } from "@/registry/registry-themes"
import { ui } from "@/registry/registry-ui"

export const registry = [
  ...ui,
  ...blocks,
  ...charts,
  ...lib,
  ...hooks,
  ...themes,

  // Internal use only.
  ...internal,
  ...examples,
] satisfies z.infer<typeof registryItemSchema>[]
