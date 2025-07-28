/* eslint-disable turbo/no-undeclared-env-vars */

import { resolveRegistryComponent } from "@/src/registry/resolver"
import type { RegistryConfig } from "@/src/registry/types"
import { describe, expect, it } from "vitest"

describe("Multiple Registry Components", () => {
  it("should handle multiple components from different registries", () => {
    // Mock registries with different auth systems
    const registries: Record<string, RegistryConfig> = {
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

    // Set up environment variables
    process.env.FOO_TOKEN = "foo-secret"
    process.env.EXAMPLE_API_KEY = "example-key"
    process.env.CORP_TOKEN = "corp-secret"
    process.env.CORP_USER = "john.doe"

    // Test resolving multiple components
    const components = [
      "@foo/button",
      "@example/dialog",
      "@private/chart",
      "https://custom.com/component.json?token=CUSTOM_TOKEN",
    ]

    const resolvedComponents = components.map((comp) => {
      const resolved = resolveRegistryComponent(comp, registries)
      return resolved ? resolved : { url: comp, headers: {} }
    })

    // Verify each component resolves correctly
    expect(resolvedComponents[0]).toEqual({
      url: "https://foo.registry.com/button.json",
      headers: {
        Authorization: "Bearer foo-secret",
      },
    })

    expect(resolvedComponents[1]).toEqual({
      url: "https://example.com/registry/dialog?apiKey=example-key&version=1.0",
      headers: {},
    })

    expect(resolvedComponents[2]).toEqual({
      url: "https://private.corp.com/components/chart",
      headers: {
        "X-Corp-Token": "corp-secret",
        "X-Corp-User": "john.doe",
      },
    })

    // Direct URL passes through unchanged
    expect(resolvedComponents[3]).toEqual({
      url: "https://custom.com/component.json?token=CUSTOM_TOKEN",
      headers: {},
    })

    // Clean up
    delete process.env.FOO_TOKEN
    delete process.env.EXAMPLE_API_KEY
    delete process.env.CORP_TOKEN
    delete process.env.CORP_USER
  })

  it("should build correct registry headers map", () => {
    const registries: Record<string, RegistryConfig> = {
      "@auth1": {
        url: "https://auth1.com/{name}",
        headers: { "X-Token": "token1" },
      },
      "@auth2": {
        url: "https://auth2.com/{name}",
        headers: { Authorization: "Bearer token2" },
      },
    }

    // Simulate what happens in the add command
    const components = ["@auth1/comp1", "@auth2/comp2", "regular-component"]
    const registryHeaders: Record<string, Record<string, string>> = {}

    components.forEach((comp) => {
      const resolved = resolveRegistryComponent(comp, registries)
      if (resolved && Object.keys(resolved.headers).length > 0) {
        registryHeaders[resolved.url] = resolved.headers
      }
    })

    // Each URL gets its own headers
    expect(registryHeaders).toEqual({
      "https://auth1.com/comp1": { "X-Token": "token1" },
      "https://auth2.com/comp2": { Authorization: "Bearer token2" },
    })
  })
})
