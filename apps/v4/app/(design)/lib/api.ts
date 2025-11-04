"use server"

import { getRegistryItem, getRegistryItems } from "@/lib/registry"
import type { DesignSystemStyle } from "@/app/(design)/lib/style"

const allowedTypes = ["registry:example"]

export async function getRegistryItemsForStyle(
  style: DesignSystemStyle["name"]
) {
  const items = await getRegistryItems(
    style,
    (item) => allowedTypes.includes(item.type) && item !== null
  )

  return items
}

export async function getRegistryItemForStyle(
  name: string,
  style: DesignSystemStyle["name"]
) {
  const item = await getRegistryItem(name, style)

  console.log(item)

  if (!item || !allowedTypes.includes(item.type)) {
    return null
  }

  return item
}
