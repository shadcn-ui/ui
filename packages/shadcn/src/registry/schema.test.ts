import { describe, expect, it } from "vitest"

import { registryConfigSchema } from "./schema"

describe("registryConfigSchema", () => {
  it("should accept valid registry names starting with @", () => {
    const validConfig = {
      "@v0": "https://v0.dev/{name}.json",
      "@acme": {
        url: "https://acme.com/{name}.json",
        headers: {
          Authorization: "Bearer token",
        },
      },
    }

    const result = registryConfigSchema.safeParse(validConfig)
    expect(result.success).toBe(true)
  })

  it("should reject registry names not starting with @", () => {
    const invalidConfig = {
      v0: "https://v0.dev/{name}.json",
      acme: "https://acme.com/{name}.json",
    }

    const result = registryConfigSchema.safeParse(invalidConfig)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toContain(
        "Registry names must start with @"
      )
    }
  })

  it("should reject URLs without {name} placeholder", () => {
    const invalidConfig = {
      "@v0": "https://v0.dev/component.json",
    }

    const result = registryConfigSchema.safeParse(invalidConfig)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toContain(
        "Registry URL must include {name} placeholder"
      )
    }
  })
})
