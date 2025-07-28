import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { resolveRegistryComponent } from "./resolver"

describe("resolveRegistryComponent", () => {
  beforeEach(() => {
    process.env.API_TOKEN = "test123"
  })

  afterEach(() => {
    delete process.env.API_TOKEN
  })

  it("should return null for non-registry components", () => {
    expect(resolveRegistryComponent("button", {})).toBeNull()
    expect(resolveRegistryComponent("button", undefined)).toBeNull()
  })

  it("should throw for unknown registry", () => {
    expect(() => {
      resolveRegistryComponent("@unknown/button", {})
    }).toThrow(/Unknown registry "@unknown"/)
  })

  it("should resolve registry component", () => {
    const registries = {
      "@v0": "https://v0.dev/{name}.json",
      "@private": {
        url: "https://api.com/{name}",
        headers: {
          Authorization: "Bearer ${API_TOKEN}",
        },
      },
    }

    const result1 = resolveRegistryComponent("@v0/button", registries)
    expect(result1).toEqual({
      url: "https://v0.dev/button.json",
      headers: {},
    })

    const result2 = resolveRegistryComponent("@private/table", registries)
    expect(result2).toEqual({
      url: "https://api.com/table",
      headers: {
        Authorization: "Bearer test123",
      },
    })
  })

  it("should validate config before resolving", () => {
    const registries = {
      "@test": "https://api.com/{name}?token=${MISSING}",
    }

    expect(() => {
      resolveRegistryComponent("@test/button", registries)
    }).toThrow(/requires environment variables/)
  })
})
