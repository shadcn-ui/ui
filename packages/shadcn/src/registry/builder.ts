import { parseRegistryAndItemFromString } from "@/src/registry/parser"
import {
  registryConfigItemSchema,
  registryConfigSchema,
} from "@/src/registry/schema"
import { validateRegistryConfig } from "@/src/registry/validator"
import { z } from "zod"

import { expandEnvVars } from "./env"

const NAME_PLACEHOLDER = "{name}"
const ENV_VAR_PATTERN = /\${(\w+)}/g
const QUERY_PARAM_SEPARATOR = "?"
const QUERY_PARAM_DELIMITER = "&"

export function buildUrlAndHeadersForRegistryItem(
  name: string,
  registries: z.infer<typeof registryConfigSchema> = {}
) {
  const { registry, item } = parseRegistryAndItemFromString(name)

  if (!registry) {
    return null
  }

  const config = registries[registry]
  if (!config) {
    throw new Error(
      `Unknown registry "${registry}". Make sure it is defined in components.json as follows:\n` +
        `{\n  "registries": {\n    "${registry}": "https://example.com/{name}.json"\n  }\n}`
    )
  }

  // TODO: I don't like this here.
  // But this will do for now.
  validateRegistryConfig(registry, config)

  return {
    url: buildUrlFromRegistryConfig(item, config),
    headers: buildHeadersFromRegistryConfig(config),
  }
}

export function buildUrlFromRegistryConfig(
  item: string,
  config: z.infer<typeof registryConfigItemSchema>
) {
  if (typeof config === "string") {
    return expandEnvVars(config.replace(NAME_PLACEHOLDER, item))
  }

  const baseUrl = expandEnvVars(config.url.replace(NAME_PLACEHOLDER, item))

  if (!config.params) {
    return baseUrl
  }

  return appendQueryParams(baseUrl, config.params)
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
