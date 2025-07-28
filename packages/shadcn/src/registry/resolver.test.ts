/* eslint-disable turbo/no-undeclared-env-vars */
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { resolveRegistryItemFromRegistries } from "./resolver"

describe("resolveRegistryItemFromRegistries", () => {
  beforeEach(() => {
    process.env.API_TOKEN = "test123"
  })

  afterEach(() => {
    delete process.env.API_TOKEN
  })

  it.each([
    ["button", {}],
    ["button", undefined],
  ])("should return null for non-registry item: %s", (input, registries) => {
    expect(resolveRegistryItemFromRegistries(input, registries)).toBeNull()
  })

  it("should throw for unknown registry", () => {
    expect(() => {
      resolveRegistryItemFromRegistries("@unknown/button", {})
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

    const result1 = resolveRegistryItemFromRegistries("@v0/button", registries)
    expect(result1).toEqual({
      url: "https://v0.dev/button.json",
      headers: {},
    })

    const result2 = resolveRegistryItemFromRegistries(
      "@private/table",
      registries
    )
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
      resolveRegistryItemFromRegistries("@test/button", registries)
    }).toThrow(/requires environment variables/)
  })

  it("should handle multiple registries with different auth types", () => {
    // Set up environment variables
    process.env.FOO_TOKEN = "foo-secret"
    process.env.EXAMPLE_API_KEY = "example-key"
    process.env.CORP_TOKEN = "corp-secret"
    process.env.CORP_USER = "john.doe"

    const registries = {
      "@foo": {
        url: "https://foo.registry.com/{name}.json",
        headers: {
          Authorization: "Bearer ${FOO_TOKEN}",
        },
      },
      "@example": {
        url: "https://example.com/registry/{name}",
        params: {
          apiKey: "${EXAMPLE_API_KEY}",
          version: "1.0",
        },
      },
      "@private": {
        url: "https://private.corp.com/components/{name}",
        headers: {
          "X-Corp-Token": "${CORP_TOKEN}",
          "X-Corp-User": "${CORP_USER}",
        },
      },
    }

    // Test resolving from different registries
    const testCases = [
      [
        "@foo/button",
        {
          url: "https://foo.registry.com/button.json",
          headers: { Authorization: "Bearer foo-secret" },
        },
      ],
      [
        "@example/dialog",
        {
          url: "https://example.com/registry/dialog?apiKey=example-key&version=1.0",
          headers: {},
        },
      ],
      [
        "@private/chart",
        {
          url: "https://private.corp.com/components/chart",
          headers: {
            "X-Corp-Token": "corp-secret",
            "X-Corp-User": "john.doe",
          },
        },
      ],
    ] as const

    testCases.forEach(([input, expected]) => {
      expect(resolveRegistryItemFromRegistries(input, registries)).toEqual(
        expected
      )
    })

    // Clean up
    delete process.env.FOO_TOKEN
    delete process.env.EXAMPLE_API_KEY
    delete process.env.CORP_TOKEN
    delete process.env.CORP_USER
  })

  it.each(["https://custom.com/component.json", "./local/component.json"])(
    "should return null for direct URL: %s",
    (url) => {
      const registries = {
        "@test": "https://test.com/{name}",
      }
      expect(resolveRegistryItemFromRegistries(url, registries)).toBeNull()
    }
  )
})
