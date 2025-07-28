import { registryConfigItemSchema } from "@/src/registry/schema"
import { z } from "zod"

import { expandEnvVars } from "./env"

export function buildUrlFromRegistryConfig(
  item: string,
  config: z.infer<typeof registryConfigItemSchema>
): string {
  if (typeof config === "string") {
    return expandEnvVars(config.replace("{name}", item))
  }

  let url = expandEnvVars(config.url.replace("{name}", item))

  if (config.params) {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(config.params)) {
      const expanded = expandEnvVars(value)
      if (expanded) {
        params.append(key, expanded)
      }
    }
    const queryString = params.toString()
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString
    }
  }

  return url
}

export function buildHeadersFromRegistryConfig(
  config: z.infer<typeof registryConfigItemSchema>
): Record<string, string> {
  if (typeof config === "string" || !config.headers) {
    return {}
  }

  const headers: Record<string, string> = {}
  for (const [key, value] of Object.entries(config.headers)) {
    const expanded = expandEnvVars(value)

    if (value.includes("${")) {
      const templateWithoutVars = value.replace(/\${[^}]+}/g, "").trim()
      if (expanded.trim() !== templateWithoutVars) {
        headers[key] = expanded
      }
    } else {
      if (expanded.trim()) {
        headers[key] = expanded
      }
    }
  }
  return headers
}
