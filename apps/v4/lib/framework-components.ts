// Static manifest of available components per framework base.
// This is used client-side to determine whether a component page exists
// for a given framework before navigating. Update this when adding new
// framework-specific component docs.

export const FRAMEWORK_COMPONENTS: Record<string, Set<string>> = {
  // React bases have all components — no need to check.
  radix: new Set(["*"]),
  base: new Set(["*"]),
  // Vue and Svelte: list available component slugs.
  vue: new Set(["button"]),
  svelte: new Set(["button"]),
}

export function hasComponentForBase(
  base: string,
  componentSlug: string
): boolean {
  const components = FRAMEWORK_COMPONENTS[base]
  if (!components) return false
  if (components.has("*")) return true
  return components.has(componentSlug)
}
