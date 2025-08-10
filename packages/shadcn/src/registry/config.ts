import { BUILTIN_REGISTRIES, FALLBACK_STYLE } from "@/src/registry/constants"
import { configSchema } from "@/src/schema"
import { Config, createConfig } from "@/src/utils/get-config"
import deepmerge from "deepmerge"

function resolveStyleFromConfig(config: Partial<Config> | Config) {
  if (!config.style) {
    return FALLBACK_STYLE
  }

  // Check if we should use new-york-v4 for Tailwind v4.
  // We assume that if tailwind.config is empty, we're using Tailwind v4.
  if (config.style === "new-york" && config.tailwind?.config === "") {
    return FALLBACK_STYLE
  }

  return config.style
}

export function configWithDefaults(config?: Partial<Config> | Config) {
  const baseConfig = createConfig({
    style: FALLBACK_STYLE,
    registries: BUILTIN_REGISTRIES,
  })

  if (!config) {
    return baseConfig
  }

  return configSchema.parse(
    deepmerge(baseConfig, {
      ...config,
      style: resolveStyleFromConfig(config),
      registries: { ...BUILTIN_REGISTRIES, ...config.registries },
    })
  )
}
