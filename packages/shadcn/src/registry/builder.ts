import { REGISTRY_URL } from "@/src/registry/constants"
import { expandEnvVars } from "@/src/registry/env"
import { RegistryNotConfiguredError } from "@/src/registry/errors"
import { parseRegistryAndItemFromString } from "@/src/registry/parser"
import { isUrl } from "@/src/registry/utils"
import { validateRegistryConfig } from "@/src/registry/validator"
import { registryConfigItemSchema } from "@/src/schema"
import { Config } from "@/src/utils/get-config"
import { z } from "zod"

const NAME_PLACEHOLDER = "{name}"
const STYLE_PLACEHOLDER = "{style}"
const ENV_VAR_PATTERN = /\${(\w+)}/g
const QUERY_PARAM_SEPARATOR = "?"
const QUERY_PARAM_DELIMITER = "&"

export function buildUrlAndHeadersForRegistryItem(
  name: string,
  config?: Config
) {
  const { registry, item } = parseRegistryAndItemFromString(name)

  if (!registry) {
    return null
  }

  const registries = config?.registries || {}
  const registryConfig = registries[registry]
  if (!registryConfig) {
    throw new RegistryNotConfiguredError(registry)
  }

  // TODO: I don't like this here.
  // But this will do for now.
  validateRegistryConfig(registry, registryConfig)

  return {
    url: buildUrlFromRegistryConfig(item, registryConfig, config),
    headers: buildHeadersFromRegistryConfig(registryConfig),
  }
}

export function buildUrlFromRegistryConfig(
  item: string,
  registryConfig: z.infer<typeof registryConfigItemSchema>,
  config?: Config
) {
  if (typeof registryConfig === "string") {
    let url = registryConfig.replace(NAME_PLACEHOLDER, item)
    if (config?.style && url.includes(STYLE_PLACEHOLDER)) {
      url = url.replace(STYLE_PLACEHOLDER, config.style)
    }
    return expandEnvVars(url)
  }

  let baseUrl = registryConfig.url.replace(NAME_PLACEHOLDER, item)
  if (config?.style && baseUrl.includes(STYLE_PLACEHOLDER)) {
    baseUrl = baseUrl.replace(STYLE_PLACEHOLDER, config.style)
  }
  baseUrl = expandEnvVars(baseUrl)

  if (!registryConfig.params) {
    return baseUrl
  }

  return appendQueryParams(baseUrl, registryConfig.params)
}

export function buildHeadersFromRegistryConfig(
  config: z.infer<typeof registryConfigItemSchema>
) {
  if (typeof config === "string" || !config.headers) {
    return {}
  }

  const headers: Record<string, string> = {}

  for (const [key, value] of Object.entries(config.headers)) {
    const expandedValue = expandEnvVars(value)

    if (shouldIncludeHeader(value, expandedValue)) {
      headers[key] = expandedValue
    }
  }

  return headers
}

function appendQueryParams(baseUrl: string, params: Record<string, string>) {
  const urlParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    const expandedValue = expandEnvVars(value)
    if (expandedValue) {
      urlParams.append(key, expandedValue)
    }
  }

  const queryString = urlParams.toString()
  if (!queryString) {
    return baseUrl
  }

  const separator = baseUrl.includes(QUERY_PARAM_SEPARATOR)
    ? QUERY_PARAM_DELIMITER
    : QUERY_PARAM_SEPARATOR

  return `${baseUrl}${separator}${queryString}`
}

function shouldIncludeHeader(originalValue: string, expandedValue: string) {
  const trimmedExpanded = expandedValue.trim()

  if (!trimmedExpanded) {
    return false
  }

  // If the original value contains valid env vars, only include if expansion changed the value.
  if (originalValue.includes("${")) {
    // Check if there are actual env vars in the string
    const envVars = originalValue.match(ENV_VAR_PATTERN)
    if (envVars) {
      const templateWithoutVars = originalValue
        .replace(ENV_VAR_PATTERN, "")
        .trim()
      return trimmedExpanded !== templateWithoutVars
    }
  }

  return true
}

/**
 * Resolves a registry URL from a path or URL string.
 * Handles special cases like v0 registry URLs that need /json suffix.
 *
 * @param pathOrUrl - Either a relative path or a full URL
 * @returns The resolved registry URL
 */
export function resolveRegistryUrl(pathOrUrl: string) {
  if (isUrl(pathOrUrl)) {
    // If the url contains /chat/b/, we assume it's the v0 registry.
    // We need to add the /json suffix if it's missing.
    const url = new URL(pathOrUrl)
    if (url.pathname.match(/\/chat\/b\//) && !url.pathname.endsWith("/json")) {
      url.pathname = `${url.pathname}/json`
    }

    return url.toString()
  }

  return `${REGISTRY_URL}/${pathOrUrl}`
}
