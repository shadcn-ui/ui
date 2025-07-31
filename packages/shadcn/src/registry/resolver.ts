import { registryConfigSchema } from "@/src/registry/schema"
import { z } from "zod"

import { buildUrlAndHeadersForRegistryItem } from "./builder"
import { setRegistryHeaders } from "./context"

export function resolveRegistryItemsFromRegistries(
  items: string[],
  registries?: z.infer<typeof registryConfigSchema>
) {
  const registryHeaders: Record<string, Record<string, string>> = {}
  const resolvedItems = [...items]

  if (!registries) {
    setRegistryHeaders({})
  }

  for (let i = 0; i < resolvedItems.length; i++) {
    const resolved = buildUrlAndHeadersForRegistryItem(
      resolvedItems[i],
      registries
    )

    if (resolved) {
      resolvedItems[i] = resolved.url

      if (Object.keys(resolved.headers).length > 0) {
        registryHeaders[resolved.url] = resolved.headers
      }
    }
  }

  setRegistryHeaders(registryHeaders)

  return resolvedItems
}
