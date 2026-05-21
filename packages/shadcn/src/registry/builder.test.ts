/* eslint-disable turbo/no-undeclared-env-vars */

import { REGISTRY_URL } from "@/src/registry/constants"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import {
  buildHeadersFromRegistryConfig,
  buildUrlAndHeadersForRegistryItem,
  buildUrlFromRegistryConfig,
  resolveRegistryUrl,
} from "./builder"

describe("buildUrlFromRegistryConfig", () => {
  beforeEach(() => {
    process.env.TEST_TOKEN = "abc123"
    process.env.API_VERSION = "v2"
    process.env.API_KEY = "key456"
  })

  afterEach(() => {
    delete process.env.TEST_TOKEN
    delete process.env.API_VERSION
    delete process.env.API_KEY
  })

  it("should build URL from string config", () => {
    const url = buildUrlFromRegistryConfig(
      "chat-component",
      "https://v0.dev/chat/b/{name}/json"
    )
    expect(url).toBe("https://v0.dev/chat/b/chat-component/json")
  })

  it("should replace style placeholder in URL", () => {
    const url = buildUrlFromRegistryConfig(
      "button",
      "https://ui.shadcn.com/r/styles/{style}/{name}.json",
      { style: "new-york" } as any
    )
    expect(url).toBe("https://ui.shadcn.com/r/styles/new-york/button.json")
  })

  it("should handle both name and style placeholders", () => {
    const url = buildUrlFromRegistryConfig(
      "accordion",
      "https://example.com/{style}/components/{name}",
      { style: "default" } as any
    )
    expect(url).toBe("https://example.com/default/components/accordion")
  })

  it("should build URL with env vars", () => {
    const url = buildUrlFromRegistryConfig(
      "button",
      "https://api.com/{name}?token=${TEST_TOKEN}"
    )
    expect(url).toBe("https://api.com/button?token=abc123")
  })

  it("should build URL with params", () => {
    const config = {
      url: "https://api.com/{name}",
      params: {
        version: "${API_VERSION}",
        format: "json",
      },
    }

    const url = buildUrlFromRegistryConfig("table", config)
    expect(url).toBe("https://api.com/table?version=v2&format=json")
  })

  it("should skip empty param values", () => {
    const config = {
      url: "https://api.com/{name}",
      params: {
        token: "${MISSING_VAR}",
        format: "json",
      },
    }

    const url = buildUrlFromRegistryConfig("table", config)
    expect(url).toBe("https://api.com/table?format=json")
  })

  it("should handle existing query params", () => {
    const config = {
      url: "https://api.com/{name}?existing=true",
      params: {
        new: "param",
      },
    }

    const url = buildUrlFromRegistryConfig("table", config)
    expect(url).toBe("https://api.com/table?existing=true&new=param")
  })

  it("should handle URL with no params", () => {
    const config = {
      url: "https://api.com/{name}",
    }

    const url = buildUrlFromRegistryConfig("table", config)
    expect(url).toBe("https://api.com/table")
  })

  it("should handle multiple env vars in params", () => {
    const config = {
      url: "https://api.com/{name}",
      params: {
        token: "${TEST_TOKEN}",
        version: "${API_VERSION}",
        key: "${API_KEY}",
      },
    }

    const url = buildUrlFromRegistryConfig("table", config)
    expect(url).toBe("https://api.com/table?token=abc123&version=v2&key=key456")
  })

  it("should handle all empty env vars in params", () => {
    const config = {
      url: "https://api.com/{name}",
      params: {
        token: "${MISSING_VAR1}",
        key: "${MISSING_VAR2}",
      },
    }

    const url = buildUrlFromRegistryConfig("table", config)
    expect(url).toBe("https://api.com/table")
  })

  it("should handle mixed static and env var params", () => {
    const config = {
      url: "https://api.com/{name}",
      params: {
        static: "value",
        env: "${TEST_TOKEN}",
        empty: "${MISSING_VAR}",
      },
    }

    const url = buildUrlFromRegistryConfig("table", config)
    expect(url).toBe("https://api.com/table?static=value&env=abc123")
  })

  it("should handle special characters in params", () => {
    const config = {
      url: "https://api.com/{name}",
      params: {
        "user-id": "123",
        "api-key": "${TEST_TOKEN}",
        "content-type": "application/json",
      },
    }

    const url = buildUrlFromRegistryConfig("table", config)
    expect(url).toBe(
      "https://api.com/table?user-id=123&api-key=abc123&content-type=application%2Fjson"
    )
  })

  it("should handle URL with multiple existing query params", () => {
    const config = {
      url: "https://api.com/{name}?param1=value1&param2=value2",
      params: {
        newParam: "newValue",
        envParam: "${TEST_TOKEN}",
      },
    }

    const url = buildUrlFromRegistryConfig("table", config)
    expect(url).toBe(
      "https://api.com/table?param1=value1&param2=value2&newParam=newValue&envParam=abc123"
    )
  })
})

describe("buildHeadersFromRegistryConfig", () => {
  beforeEach(() => {
    process.env.AUTH_TOKEN = "secret123"
    process.env.CLIENT_ID = "client456"
    process.env.API_KEY = "key789"
  })

  afterEach(() => {
    delete process.env.AUTH_TOKEN
    delete process.env.CLIENT_ID
    delete process.env.API_KEY
  })

  it("should return empty object for string config", () => {
    expect(buildHeadersFromRegistryConfig("https://api.com/{name}")).toEqual({})
  })

  it("should return empty object for config without headers", () => {
    expect(
      buildHeadersFromRegistryConfig({ url: "https://api.com/{name}" })
    ).toEqual({})
  })

  it("should expand headers with env vars", () => {
    const config = {
      url: "https://api.com/{name}",
      headers: {
        Authorization: "Bearer ${AUTH_TOKEN}",
        "X-Client-Id": "${CLIENT_ID}",
      },
    }

    expect(buildHeadersFromRegistryConfig(config)).toEqual({
      Authorization: "Bearer secret123",
      "X-Client-Id": "client456",
    })
  })

  it("should skip headers with empty values", () => {
    const config = {
      url: "https://api.com/{name}",
      headers: {
        Authorization: "Bearer ${MISSING_VAR}",
        "X-Client-Id": "${CLIENT_ID}",
      },
    }

    expect(buildHeadersFromRegistryConfig(config)).toEqual({
      "X-Client-Id": "client456",
    })
  })

  it("should handle headers with mixed static and env var content", () => {
    const config = {
      url: "https://api.com/{name}",
      headers: {
        Authorization: "Bearer ${AUTH_TOKEN}",
        "Content-Type": "application/json",
        "X-Custom": "prefix-${CLIENT_ID}-suffix",
      },
    }

    expect(buildHeadersFromRegistryConfig(config)).toEqual({
      Authorization: "Bearer secret123",
      "Content-Type": "application/json",
      "X-Custom": "prefix-client456-suffix",
    })
  })

  it("should skip headers with only env vars that are empty", () => {
    const config = {
      url: "https://api.com/{name}",
      headers: {
        "X-Missing": "${MISSING_VAR1}",
        "X-Also-Missing": "${MISSING_VAR2}",
        "X-Present": "${CLIENT_ID}",
      },
    }

    expect(buildHeadersFromRegistryConfig(config)).toEqual({
      "X-Present": "client456",
    })
  })

  it("should handle headers with whitespace-only values", () => {
    const config = {
      url: "https://api.com/{name}",
      headers: {
        "X-Empty": "   ",
        "X-Whitespace": "  ${MISSING_VAR}  ",
        "X-Valid": "  ${CLIENT_ID}  ",
      },
    }

    expect(buildHeadersFromRegistryConfig(config)).toEqual({
      "X-Valid": "  client456  ",
    })
  })

  it("should handle complex env var patterns", () => {
    const config = {
      url: "https://api.com/{name}",
      headers: {
        "X-Complex": "Bearer ${AUTH_TOKEN} with ${CLIENT_ID} and ${API_KEY}",
        "X-Simple": "${CLIENT_ID}",
        "X-Mixed": "static-${AUTH_TOKEN}-${MISSING_VAR}-${API_KEY}",
      },
    }

    expect(buildHeadersFromRegistryConfig(config)).toEqual({
      "X-Complex": "Bearer secret123 with client456 and key789",
      "X-Simple": "client456",
      "X-Mixed": "static-secret123--key789",
    })
  })

  it("should handle headers with only static content", () => {
    const config = {
      url: "https://api.com/{name}",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "shadcn-ui/1.0.0",
      },
    }

    expect(buildHeadersFromRegistryConfig(config)).toEqual({
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "shadcn-ui/1.0.0",
    })
  })

  it("should handle headers with template-like content but no env vars", () => {
    const config = {
      url: "https://api.com/{name}",
      headers: {
        "X-Template": "This is a template ${but not an env var}",
        "X-Regular": "Regular header value",
      },
    }

    expect(buildHeadersFromRegistryConfig(config)).toEqual({
      "X-Template": "This is a template ${but not an env var}",
      "X-Regular": "Regular header value",
    })
  })

  it("should handle case where env var expansion doesn't change the value", () => {
    const config = {
      url: "https://api.com/{name}",
      headers: {
        "X-No-Change": "static value",
        "X-With-Env": "prefix-${CLIENT_ID}-suffix",
      },
    }

    expect(buildHeadersFromRegistryConfig(config)).toEqual({
      "X-No-Change": "static value",
      "X-With-Env": "prefix-client456-suffix",
    })
  })
})

describe("buildUrlAndHeadersForRegistryItem", () => {
  it("should resolve non-registry items through @shadcn registry", () => {
    const input = "button"
    const config = {} as any
    // Non-prefixed items are resolved through the built-in @shadcn registry
    expect(buildUrlAndHeadersForRegistryItem(input, config)).toEqual({
      url: "https://ui.shadcn.com/r/styles/{style}/button.json",
      headers: {},
    })
  })

  it("should throw error for unknown registry", () => {
    expect(() => {
      buildUrlAndHeadersForRegistryItem("@unknown/button", {} as any)
    }).toThrow('Unknown registry "@unknown"')
  })

  it("should resolve registry items with string config", () => {
    const config = {
      registries: {
        "@v0": "https://v0.dev/chat/b/{name}/json",
      },
    } as any

    const result1 = buildUrlAndHeadersForRegistryItem("@v0/button", config)
    expect(result1).toEqual({
      url: "https://v0.dev/chat/b/button/json",
      headers: {},
    })

    const result2 = buildUrlAndHeadersForRegistryItem("@v0/data-table", config)
    expect(result2).toEqual({
      url: "https://v0.dev/chat/b/data-table/json",
      headers: {},
    })
  })

  it("should resolve registry items with object config", () => {
    const config = {
      registries: {
        "@test": {
          url: "https://api.com/{name}.json",
          headers: {
            Authorization: "Bearer token123",
          },
        },
      },
    } as any

    const result = buildUrlAndHeadersForRegistryItem("@test/button", config)
    expect(result).toEqual({
      url: "https://api.com/button.json",
      headers: {
        Authorization: "Bearer token123",
      },
    })
  })

  it("should handle environment variables in config", () => {
    process.env.TEST_TOKEN = "abc123"
    process.env.API_URL = "https://api.com"

    const config = {
      registries: {
        "@env": {
          url: "${API_URL}/{name}.json",
          headers: {
            Authorization: "Bearer ${TEST_TOKEN}",
          },
        },
      },
    } as any

    const result = buildUrlAndHeadersForRegistryItem("@env/button", config)
    expect(result).toEqual({
      url: "https://api.com/button.json",
      headers: {
        Authorization: "Bearer abc123",
      },
    })

    delete process.env.TEST_TOKEN
    delete process.env.API_URL
  })

  it("should handle complex item paths", () => {
    const config = {
      registries: {
        "@acme": "https://api.com/{name}.json",
      },
    } as any

    const result = buildUrlAndHeadersForRegistryItem("@acme/ui/button", config)
    expect(result).toEqual({
      url: "https://api.com/ui/button.json",
      headers: {},
    })
  })

  it("should handle URLs and local files", () => {
    const config = { registries: {} } as any

    // URLs should return null (not registry items)
    expect(
      buildUrlAndHeadersForRegistryItem("https://example.com/button", config)
    ).toBeNull()

    // Local files should return null (not registry items)
    expect(
      buildUrlAndHeadersForRegistryItem("./local/button", config)
    ).toBeNull()
  })
})

describe("resolveRegistryUrl", () => {
  it("should return the URL as-is for valid URLs", () => {
    const url = "https://example.com/component.json"
    expect(resolveRegistryUrl(url)).toBe(url)
  })

  it("should append /json to v0 registry URLs", () => {
    const v0Url = "https://v0.dev/chat/b/abc123"
    expect(resolveRegistryUrl(v0Url)).toBe("https://v0.dev/chat/b/abc123/json")
  })

  it("should not append /json if already present", () => {
    const v0Url = "https://v0.dev/chat/b/abc123/json"
    expect(resolveRegistryUrl(v0Url)).toBe(v0Url)
  })

  it("should prepend REGISTRY_URL for non-URLs", () => {
    expect(resolveRegistryUrl("test.json")).toBe(`${REGISTRY_URL}/test.json`)
    expect(resolveRegistryUrl("styles/default/button.json")).toBe(
      `${REGISTRY_URL}/styles/default/button.json`
    )
  })
})
