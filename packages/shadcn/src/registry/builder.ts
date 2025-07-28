import { expandEnvVars } from "./env"
import type { RegistryConfig } from "./types"

/**
 * Build a registry URL with environment variable expansion
 * @param registry - Registry name (e.g., "@v0")
 * @param component - Component name
 * @param config - Registry configuration
 * @returns Resolved URL
 */
export function buildRegistryUrl(
  _registry: string,
  component: string,
  config: RegistryConfig
): string {
  if (typeof config === "string") {
    return expandEnvVars(config.replace("{name}", component))
  }

  let url = expandEnvVars(config.url.replace("{name}", component))

  // Add query parameters
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

/**
 * Get authentication headers from registry config
 * @param config - Registry configuration
 * @returns Headers object with expanded environment variables
 */
export function getRegistryHeaders(
  config: RegistryConfig
): Record<string, string> {
  if (typeof config === "string" || !config.headers) {
    return {}
  }

  const headers: Record<string, string> = {}
  for (const [key, value] of Object.entries(config.headers)) {
    const expanded = expandEnvVars(value)
    // Check if expansion resulted in meaningful content
    // Skip if the value contains env vars but they all expanded to empty
    const hasEnvVars = value.includes("${")
    const templateWithoutVars = value.replace(/\${[^}]+}/g, "").trim()

    if (hasEnvVars) {
      // For values with env vars, only include if expansion added content
      if (expanded.trim() !== templateWithoutVars) {
        headers[key] = expanded
      }
    } else {
      // For static values, include if non-empty
      if (expanded.trim()) {
        headers[key] = expanded
      }
    }
  }
  return headers
}
