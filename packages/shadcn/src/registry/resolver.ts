import { buildRegistryUrl, getRegistryHeaders } from "./builder"
import { parseRegistryComponent } from "./parser"
import type { RegistryConfig, ResolvedRegistryComponent } from "./types"
import { validateRegistryConfig } from "./validator"

/**
 * Resolve registry URL for a component
 * @param name - Component name (possibly with registry prefix)
 * @param registries - Registry configuration map
 * @returns Object with URL and headers, or null if not a registry component
 */
export function resolveRegistryComponent(
  name: string,
  registries: Record<string, RegistryConfig> | undefined
): ResolvedRegistryComponent | null {
  const { registry, component } = parseRegistryComponent(name)

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
    url: buildRegistryUrl(registry, component, config),
    headers: getRegistryHeaders(config),
  }
}
