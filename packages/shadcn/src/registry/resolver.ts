import { registryConfigSchema } from "@/src/registry/schema"
import { z } from "zod"

import {
  buildHeadersFromRegistryConfig,
  buildUrlFromRegistryConfig,
} from "./builder"
import { setRegistryHeaders } from "./context"
import { parseRegistryAndItemFromString } from "./parser"
import { validateRegistryConfig } from "./validator"

export function resolveRegistryItemsFromRegistries(
  items: string[],
  registries?: z.infer<typeof registryConfigSchema>
) {
  const registryHeaders: Record<string, Record<string, string>> = {}
  const resolvedItems = [...items]

  if (!registries) {
    // Clear any existing headers.
    setRegistryHeaders({})
    return resolvedItems
  }

  for (let i = 0; i < resolvedItems.length; i++) {
    const resolved = resolveRegistryItemFromRegistries(
      resolvedItems[i],
      registries
    )

    if (resolved) {
      // Replace registry item with resolved URL.
      resolvedItems[i] = resolved.url

      // Store headers for this URL if any exist.
      if (Object.keys(resolved.headers).length > 0) {
        registryHeaders[resolved.url] = resolved.headers
      }
    }
  }

  // Set registry headers in context for fetch operations.
  setRegistryHeaders(registryHeaders)

  return resolvedItems
}

export function resolveRegistryItemFromRegistries(
  name: string,
  registries?: z.infer<typeof registryConfigSchema>
) {
  const { registry, item } = parseRegistryAndItemFromString(name)

  if (!registry || !registries) {
    return null
  }

  const config = registries[registry]
  if (!config) {
    throw new Error(
      `Unknown registry "${registry}". Make sure it is defined in components.json as follows:\n` +
        `{\n  "registries": {\n    "${registry}": "https://example.com/{name}.json"\n  }\n}`
    )
  }

  validateRegistryConfig(registry, config)

  return {
    url: buildUrlFromRegistryConfig(item, config),
    headers: buildHeadersFromRegistryConfig(config),
  }
}
