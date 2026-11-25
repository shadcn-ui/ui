import { describe, expect, it } from "vitest"

import {
  rawConfigSchema,
  registryBaseConfigSchema,
  registryChunkSchema,
  registryConfigSchema,
  registryItemSchema,
  registrySchema,
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
      expect(result.error.issues[0].message).toContain(
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
      expect(result.error.issues[0].message).toContain(
        "Registry URL must include {name} placeholder"
      )
    }
  })
})

describe("registrySchema", () => {
  it("should accept registry chunks with includes", () => {
    const result = registryChunkSchema.safeParse({
      include: ["./registry/ui/registry.json"],
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.items).toEqual([])
    }
  })

  it("should require name and homepage for root registries", () => {
    const result = registrySchema.safeParse({
      include: ["./registry/ui/registry.json"],
    })

    expect(result.success).toBe(false)
  })

  it("should reject registries without items or include", () => {
    const result = registryChunkSchema.safeParse({
      name: "example",
      homepage: "https://example.com",
    })

    expect(result.success).toBe(false)
  })

  it("should accept registries with pagination", () => {
    const result = registrySchema.safeParse({
      name: "example",
      homepage: "https://example.com",
      items: [{ name: "button", type: "registry:ui" }],
      pagination: {
        total: 100,
        offset: 0,
        limit: 1,
        hasMore: true,
      },
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.pagination).toEqual({
        total: 100,
        offset: 0,
        limit: 1,
        hasMore: true,
      })
    }
  })

  it("should accept registries without pagination", () => {
    const result = registrySchema.safeParse({
      name: "example",
      homepage: "https://example.com",
      items: [{ name: "button", type: "registry:ui" }],
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.pagination).toBeUndefined()
    }
  })

  it("should reject registries with invalid pagination", () => {
    const result = registrySchema.safeParse({
      name: "example",
      homepage: "https://example.com",
      items: [{ name: "button", type: "registry:ui" }],
      pagination: {
        total: "100",
      },
    })

    expect(result.success).toBe(false)
  })

  it("should reject invalid items", () => {
    const result = registrySchema.safeParse({
      name: "example",
      homepage: "https://example.com",
      items: [{ name: "button", type: "registry:nope" }],
    })

    expect(result.success).toBe(false)
  })
})

describe("rawConfigSchema", () => {
  const config = {
    style: "new-york",
    tailwind: { css: "app/globals.css", baseColor: "neutral" },
    aliases: { components: "@/components", utils: "@/lib/utils" },
  }

  it("should apply defaults to required fields", () => {
    const result = rawConfigSchema.parse(config)

    expect(result.rsc).toBe(false)
    expect(result.tsx).toBe(true)
    expect(result.tailwind.cssVariables).toBe(true)
  })

  it("should leave optional fields unset", () => {
    const result = rawConfigSchema.parse(config)

    expect(result).not.toHaveProperty("rtl")
    expect(result).not.toHaveProperty("menuColor")
    expect(result).not.toHaveProperty("menuAccent")
    expect(result.tailwind).not.toHaveProperty("prefix")
  })
})

describe("registryBaseConfigSchema", () => {
  it("should not apply defaults", () => {
    const result = registryBaseConfigSchema.parse({
      style: "nova",
      tailwind: { baseColor: "zinc" },
    })

    expect(result).toEqual({
      style: "nova",
      tailwind: { baseColor: "zinc" },
    })
  })

  it("should parse registry:base config without defaults", () => {
    const result = registryItemSchema.parse({
      name: "nova",
      type: "registry:base",
      config: { style: "nova" },
    })

    expect(result).toMatchObject({ config: { style: "nova" } })
    expect(result).not.toHaveProperty("config.rsc")
    expect(result).not.toHaveProperty("config.tsx")
  })

  it("should reject unknown keys", () => {
    const result = registryBaseConfigSchema.safeParse({ nope: true })

    expect(result.success).toBe(false)
  })
})
