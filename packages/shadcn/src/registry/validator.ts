import { extractEnvVars } from "@/src/registry/env"
import { RegistryMissingEnvironmentVariablesError } from "@/src/registry/errors"
import { registryConfigItemSchema } from "@/src/registry/schema"
import { z } from "zod"

export function extractEnvVarsFromRegistryConfig(
  config: z.infer<typeof registryConfigItemSchema>
): string[] {
  const vars = new Set<string>()

  if (typeof config === "string") {
    extractEnvVars(config).forEach((v) => vars.add(v))
  } else {
    extractEnvVars(config.url).forEach((v) => vars.add(v))

    if (config.params) {
      Object.values(config.params).forEach((value) => {
        extractEnvVars(value).forEach((v) => vars.add(v))
      })
    }

    if (config.headers) {
      Object.values(config.headers).forEach((value) => {
        extractEnvVars(value).forEach((v) => vars.add(v))
      })
    }
  }

  return Array.from(vars)
}

export function validateRegistryConfig(
  registryName: string,
  config: z.infer<typeof registryConfigItemSchema>
): void {
  const requiredVars = extractEnvVarsFromRegistryConfig(config)
  const missing = requiredVars.filter((v) => !process.env[v])

  if (missing.length > 0) {
    throw new RegistryMissingEnvironmentVariablesError(registryName, missing)
  }
}
