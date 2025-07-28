import type { ParsedRegistryComponent } from "./types"

// Valid registry name pattern: @namespace where namespace is alphanumeric with hyphens/underscores
const REGISTRY_PATTERN = /^(@[a-zA-Z0-9](?:[a-zA-Z0-9-_]*[a-zA-Z0-9])?)\/(.+)$/

/**
 * Parse a component name to extract registry and component parts
 * @param name - Component name (e.g., "@v0/button" or "button")
 * @returns Object with registry and component name
 * @throws Error if registry name format is invalid
 */
export function parseRegistryComponent(name: string): ParsedRegistryComponent {
  // Quick check for @ prefix to avoid regex on non-registry components
  if (!name.startsWith("@")) {
    return {
      registry: null,
      component: name,
    }
  }

  // Check if it's a registry component (@namespace/name)
  const match = name.match(REGISTRY_PATTERN)
  if (match) {
    return {
      registry: match[1],
      component: match[2],
    }
  }

  // If it starts with @ but doesn't match pattern, it's malformed
  if (name.includes("@") && name.includes("/")) {
    throw new Error(
      `Invalid registry component format: "${name}". Expected format: @namespace/component-name`
    )
  }

  return {
    registry: null,
    component: name,
  }
}
