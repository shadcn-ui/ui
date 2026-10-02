import { REGISTRY_URL } from "@/src/registry/constants"

// This module must not import other registry modules. The registry context
// uses it to normalize header keys, and builder -> env -> context would
// otherwise form an import cycle.

/**
 * Resolves a registry URL from a path or URL string.
 * Handles special cases like v0 registry URLs that need /json suffix.
 *
 * The result is the URL fetchRegistry requests, and the key registry headers
 * are stored under.
 *
 * @param pathOrUrl - Either a relative path or a full URL
 * @returns The resolved registry URL
 */
export function resolveRegistryUrl(pathOrUrl: string) {
  let url: URL
  try {
    url = new URL(pathOrUrl)
  } catch {
    return `${REGISTRY_URL}/${pathOrUrl}`
  }

  // If the url contains /chat/b/, we assume it's the v0 registry.
  // We need to add the /json suffix if it's missing.
  if (url.pathname.match(/\/chat\/b\//) && !url.pathname.endsWith("/json")) {
    url.pathname = `${url.pathname}/json`
  }

  return url.toString()
}
