import { z } from "zod"

import { extractEnvVars } from "./env"
import { registryConfigItemSchema } from "./schema"

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
    const suggestions = missing.map((v) => {
      // Common patterns for environment variable names
      if (v.includes("TOKEN")) return `export ${v}="your-token-here"`
      if (v.includes("KEY")) return `export ${v}="your-api-key-here"`
      if (v.includes("SECRET")) return `export ${v}="your-secret-here"`
      return `export ${v}="your-value-here"`
    })

    throw new Error(
      `Registry "${registryName}" requires environment variables:\n\n` +
        missing.map((v) => `  • ${v}`).join("\n") +
        "\n\nSet them in your environment:\n\n" +
        suggestions.map((s) => `  ${s}`).join("\n") +
        "\n\nOr add them to a .env file in your project root."
    )
  }
}
