import { describe, expect, it } from "vitest"

import {
  rawConfigSchema,
  rawConfigSchemaDeepPartial,
  registryConfigSchema,
} from "./schema"

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

describe("rawConfigSchema", () => {
  it("should require aliases field", () => {
    const config = {
      style: "vega",
      tailwind: {
        css: "./app/globals.css",
        baseColor: "neutral",
      },
      // Missing aliases - should fail
    }

    const result = rawConfigSchema.safeParse(config)
    expect(result.success).toBe(false)
  })

  it("should accept valid config with all required fields", () => {
    const validConfig = {
      style: "vega",
      tailwind: {
        css: "./app/globals.css",
        baseColor: "neutral",
      },
      aliases: {
        components: "@/components",
        utils: "@/lib/utils",
      },
    }

    const result = rawConfigSchema.safeParse(validConfig)
    expect(result.success).toBe(true)
  })
})

describe("rawConfigSchemaDeepPartial", () => {
  it("should allow omitting aliases entirely", () => {
    const partialConfig = {
      style: "vega",
      tailwind: {
        baseColor: "neutral",
        // Missing css - OK with deep partial
      },
      // Missing aliases - OK with deep partial
    }

    const result = rawConfigSchemaDeepPartial.safeParse(partialConfig)
    expect(result.success).toBe(true)
  })

  it("should allow partial tailwind config", () => {
    const partialConfig = {
      style: "vega",
      tailwind: {
        baseColor: "neutral",
        // Missing css - OK with deep partial
      },
      aliases: {
        components: "@/components",
        // Missing utils - OK with deep partial
      },
    }

    const result = rawConfigSchemaDeepPartial.safeParse(partialConfig)
    expect(result.success).toBe(true)
  })

  it("should accept config with rtl field", () => {
    const configWithRtl = {
      style: "vega",
      rtl: true,
      tailwind: {
        baseColor: "neutral",
      },
    }

    const result = rawConfigSchemaDeepPartial.safeParse(configWithRtl)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.rtl).toBe(true)
    }
  })

  it("should validate real-world registry:base config", () => {
    const realWorldConfig = {
      style: "radix-vega",
      iconLibrary: "lucide",
      menuColor: "default",
      menuAccent: "subtle",
      tailwind: {
        baseColor: "neutral",
      },
    }

    const result = rawConfigSchemaDeepPartial.optional().safeParse(realWorldConfig)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(realWorldConfig)
    }
  })

  it("should allow empty config", () => {
    const result = rawConfigSchemaDeepPartial.safeParse({})
    expect(result.success).toBe(true)
  })
})
