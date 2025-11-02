"use server"

import { getRegistryItems } from "@/lib/registry"
import type { DesignSystemStyle } from "@/app/(new)/lib/style"

const allowedTypes = ["registry:example"]

export async function getRegistryItemsUsingParams(
  style: DesignSystemStyle["name"]
) {
  console.log("Fetching items for style:", style)
  const items = await getRegistryItems(style, (item) =>
    allowedTypes.includes(item.type)
  )

  return items
}
