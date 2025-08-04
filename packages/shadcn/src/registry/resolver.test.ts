/* eslint-disable turbo/no-undeclared-env-vars */
import { beforeEach, describe, expect, it, vi } from "vitest"

import { setRegistryHeaders } from "./context"
import { resolveRegistryItemsFromRegistries } from "./resolver"

// Mock the context module
vi.mock("./context", () => ({
  setRegistryHeaders: vi.fn(),
}))

describe("resolveRegistryItemsFromRegistries", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return empty array for empty input", () => {
    const result = resolveRegistryItemsFromRegistries([], {
      registries: {},
    } as any)
    expect(result).toEqual([])
    expect(setRegistryHeaders).toHaveBeenCalledWith({})
  })

  it("should return empty array for empty input with no registries", () => {
    const result = resolveRegistryItemsFromRegistries([], undefined)
    expect(result).toEqual([])
    expect(setRegistryHeaders).toHaveBeenCalledWith({})
  })

  it("should return non-registry items unchanged", () => {
    const items = ["button", "card", "dialog"]
    const config = { registries: {} } as any

    const result = resolveRegistryItemsFromRegistries(items, config)

    expect(result).toEqual(items)
    expect(setRegistryHeaders).toHaveBeenCalledWith({})
  })

  it("should resolve registry items with string config", () => {
    const items = ["@v0/button", "@v0/card"]
    const config = {
      registries: {
        "@v0": "https://v0.dev/chat/b/{name}/json",
      },
    } as any

    const result = resolveRegistryItemsFromRegistries(items, config)

    expect(result).toEqual([
      "https://v0.dev/chat/b/button/json",
      "https://v0.dev/chat/b/card/json",
    ])
    expect(setRegistryHeaders).toHaveBeenCalledWith({})
  })

  it("should resolve registry items with object config and headers", () => {
    const items = ["@private/button", "@private/card"]
    const config = {
      registries: {
        "@private": {
          url: "https://api.com/{name}.json",
          headers: {
            Authorization: "Bearer token123",
          },
        },
      },
    } as any

    const result = resolveRegistryItemsFromRegistries(items, config)

    expect(result).toEqual([
      "https://api.com/button.json",
      "https://api.com/card.json",
    ])
    expect(setRegistryHeaders).toHaveBeenCalledWith({
      "https://api.com/button.json": {
        Authorization: "Bearer token123",
      },
      "https://api.com/card.json": {
        Authorization: "Bearer token123",
      },
    })
  })

  it("should handle mixed registry and non-registry items", () => {
    const items = ["button", "@v0/card", "dialog", "@private/table"]
    const config = {
      registries: {
        "@v0": "https://v0.dev/chat/b/{name}/json",
        "@private": {
          url: "https://api.com/{name}.json",
          headers: {
            "X-API-Key": "secret123",
          },
        },
      },
    } as any

    const result = resolveRegistryItemsFromRegistries(items, config)

    expect(result).toEqual([
      "button",
      "https://v0.dev/chat/b/card/json",
      "dialog",
      "https://api.com/table.json",
    ])
    expect(setRegistryHeaders).toHaveBeenCalledWith({
      "https://api.com/table.json": {
        "X-API-Key": "secret123",
      },
    })
  })

  it("should handle environment variables in config", () => {
    process.env.API_TOKEN = "abc123"
    process.env.API_URL = "https://api.com"

    const items = ["@env/button"]
    const config = {
      registries: {
        "@env": {
          url: "${API_URL}/{name}.json",
          headers: {
            Authorization: "Bearer ${API_TOKEN}",
          },
        },
      },
    } as any

    const result = resolveRegistryItemsFromRegistries(items, config)

    expect(result).toEqual(["https://api.com/button.json"])
    expect(setRegistryHeaders).toHaveBeenCalledWith({
      "https://api.com/button.json": {
        Authorization: "Bearer abc123",
      },
    })

    delete process.env.API_TOKEN
    delete process.env.API_URL
  })

  it("should handle complex item paths", () => {
    const items = ["@acme/ui/button", "@acme/components/card"]
    const config = {
      registries: {
        "@acme": "https://api.com/{name}.json",
      },
    } as any

    const result = resolveRegistryItemsFromRegistries(items, config)

    expect(result).toEqual([
      "https://api.com/ui/button.json",
      "https://api.com/components/card.json",
    ])
    expect(setRegistryHeaders).toHaveBeenCalledWith({})
  })

  it("should handle URLs and local files unchanged", () => {
    const items = [
      "https://example.com/button.json",
      "./local/component.json",
      "@v0/card",
    ]
    const config = {
      registries: {
        "@v0": "https://v0.dev/chat/b/{name}/json",
      },
    } as any

    const result = resolveRegistryItemsFromRegistries(items, config)

    expect(result).toEqual([
      "https://example.com/button.json",
      "./local/component.json",
      "https://v0.dev/chat/b/card/json",
    ])
    expect(setRegistryHeaders).toHaveBeenCalledWith({})
  })

  it("should throw error for unknown registry", () => {
    const items = ["@unknown/button"]
    const config = { registries: {} } as any

    expect(() => {
      resolveRegistryItemsFromRegistries(items, config)
    }).toThrow('Unknown registry "@unknown"')
  })

  it("should handle multiple unknown registries", () => {
    const items = ["@unknown1/button", "@unknown2/card"]
    const config = { registries: {} } as any

    expect(() => {
      resolveRegistryItemsFromRegistries(items, config)
    }).toThrow('Unknown registry "@unknown1"')
  })

  it("should handle empty headers correctly", () => {
    const items = ["@empty/button"]
    const config = {
      registries: {
        "@empty": {
          url: "https://api.com/{name}.json",
          headers: {},
        },
      },
    } as any

    const result = resolveRegistryItemsFromRegistries(items, config)

    expect(result).toEqual(["https://api.com/button.json"])
    expect(setRegistryHeaders).toHaveBeenCalledWith({})
  })

  it("should handle headers with environment variables that expand to empty", () => {
    process.env.EMPTY_TOKEN = "some-value"

    const items = ["@empty/button"]
    const config = {
      registries: {
        "@empty": {
          url: "https://api.com/{name}.json",
          headers: {
            Authorization: "Bearer ${EMPTY_TOKEN}",
          },
        },
      },
    } as any

    const result = resolveRegistryItemsFromRegistries(items, config)

    expect(result).toEqual(["https://api.com/button.json"])
    expect(setRegistryHeaders).toHaveBeenCalledWith({
      "https://api.com/button.json": {
        Authorization: "Bearer some-value",
      },
    })

    delete process.env.EMPTY_TOKEN
  })

  it("should handle headers with mixed static and environment variables", () => {
    process.env.API_TOKEN = "secret123"

    const items = ["@mixed/button"]
    const config = {
      registries: {
        "@mixed": {
          url: "https://api.com/{name}.json",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer ${API_TOKEN}",
            "X-Custom": "static-value",
          },
        },
      },
    } as any

    const result = resolveRegistryItemsFromRegistries(items, config)

    expect(result).toEqual(["https://api.com/button.json"])
    expect(setRegistryHeaders).toHaveBeenCalledWith({
      "https://api.com/button.json": {
        "Content-Type": "application/json",
        Authorization: "Bearer secret123",
        "X-Custom": "static-value",
      },
    })

    delete process.env.API_TOKEN
  })

  it("should handle query parameters in URL config", () => {
    const items = ["@params/button"]
    const config = {
      registries: {
        "@params": {
          url: "https://api.com/{name}.json",
          params: {
            version: "1.0",
            format: "json",
          },
        },
      },
    } as any

    const result = resolveRegistryItemsFromRegistries(items, config)

    expect(result).toEqual([
      "https://api.com/button.json?version=1.0&format=json",
    ])
    expect(setRegistryHeaders).toHaveBeenCalledWith({})
  })

  it("should handle query parameters with environment variables", () => {
    process.env.API_VERSION = "2.0"

    const items = ["@params/button"]
    const config = {
      registries: {
        "@params": {
          url: "https://api.com/{name}.json",
          params: {
            version: "${API_VERSION}",
            format: "json",
          },
        },
      },
    } as any

    const result = resolveRegistryItemsFromRegistries(items, config)

    expect(result).toEqual([
      "https://api.com/button.json?version=2.0&format=json",
    ])
    expect(setRegistryHeaders).toHaveBeenCalledWith({})

    delete process.env.API_VERSION
  })

  it("should handle existing query parameters in URL", () => {
    const items = ["@existing/button"]
    const config = {
      registries: {
        "@existing": {
          url: "https://api.com/{name}.json?existing=true",
          params: {
            version: "1.0",
          },
        },
      },
    } as any

    const result = resolveRegistryItemsFromRegistries(items, config)

    expect(result).toEqual([
      "https://api.com/button.json?existing=true&version=1.0",
    ])
    expect(setRegistryHeaders).toHaveBeenCalledWith({})
  })
})
