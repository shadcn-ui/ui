"use server"

import { getRegistryItem, getRegistryItems } from "@/lib/registry"

const allowedTypes = ["registry:example"]

export async function getRegistryItemsForLibrary(library: any) {
  const items = await getRegistryItems(
    library,
    (item) => allowedTypes.includes(item.type) && item !== null
  )

  return items
}

export async function getRegistryItemForLibrary(name: string, library: any) {
  const item = await getRegistryItem(name, library)

  console.log(item)

  if (!item || !allowedTypes.includes(item.type)) {
    return null
  }

  return item
}
