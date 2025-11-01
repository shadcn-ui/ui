"use server"

import { getRegistryItems } from "@/lib/registry"
import { type DesignSystemSearchParams } from "@/app/(new)/lib/search-params"

const allowedTypes = ["registry:example"]

export async function getRegistryItemsUsingParams(
  params: DesignSystemSearchParams
) {
  // Wait for 1 second.
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const items = await getRegistryItems(params.style, (item) =>
    allowedTypes.includes(item.type)
  )

  return items
}
