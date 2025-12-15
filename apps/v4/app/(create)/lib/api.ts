import "server-only"

import { registryItemSchema } from "shadcn/schema"

import { getThemesForBaseColor, type BaseName } from "@/registry/config"
import { ALLOWED_ITEM_TYPES } from "@/app/(create)/lib/constants"

export async function getItemsForBase(base: BaseName) {
  const { Index } = await import("@/registry/bases/__index__")
  const index = Index[base]

  if (!index) {
    return []
  }

  return Object.values(index).filter((item) =>
    ALLOWED_ITEM_TYPES.includes(item.type)
  )
}

export async function getBaseItem(name: string, base: BaseName) {
  const { Index } = await import("@/registry/bases/__index__")
  const index = Index[base]

  if (!index?.[name]) {
    return null
  }

  return registryItemSchema.parse(index[name])
}

export async function getBaseComponent(name: string, base: BaseName) {
  const { Index } = await import("@/registry/bases/__index__")
  const index = Index[base]

  if (!index?.[name]) {
    return null
  }

  return index[name].component
}

// Re-export for server-side use.
export { getThemesForBaseColor }
