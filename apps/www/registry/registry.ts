import { blocks } from "@/registry/blocks"
import { charts } from "@/registry/charts"
import { examples } from "@/registry/examples"
import { Registry } from "@/registry/schema"
import { ui } from "@/registry/ui"

export const registry: Registry = [...ui, ...examples, ...blocks, ...charts]
