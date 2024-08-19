import { blocks } from "@/registry/blocks"
import { charts } from "@/registry/charts"
import { examples } from "@/registry/examples"
import { hooks } from "@/registry/hooks"
import { lib } from "@/registry/lib"
import { Registry } from "@/registry/schema"
import { ui } from "@/registry/ui"

export const registry: Registry = [
  ...ui,
  ...examples,
  ...blocks,
  ...charts,
  ...lib,
  ...hooks,
]
