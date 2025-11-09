import "server-only"

import { registryItemSchema } from "shadcn/schema"

import { Base } from "@/registry/bases"

const allowedTypes = ["registry:example"]

export async function getItemsForBase(base: Base["name"]) {
  const { Index } = await import("@/registry/bases/__index__")
  const index = Index[base]

  if (!index) {
    return []
  }

  return Object.values(index).filter((item) => allowedTypes.includes(item.type))
}

export async function getBaseItem(name: string, base: Base["name"]) {
  const { Index } = await import("@/registry/bases/__index__")
  const index = Index[base]

  if (!index?.[name]) {
    return null
  }

  return registryItemSchema.parse(index[name])
}

export async function getBaseComponent(name: string, base: Base["name"]) {
  const { Index } = await import("@/registry/bases/__index__")
  const index = Index[base]

  if (!index?.[name]) {
    return null
  }

  return index[name].component
}
