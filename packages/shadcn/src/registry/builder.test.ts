/* eslint-disable turbo/no-undeclared-env-vars */
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import {
  buildHeadersFromRegistryConfig,
  buildUrlFromRegistryConfig,
} from "./builder"

describe("buildUrlFromRegistryConfig", () => {
  beforeEach(() => {
    process.env.TEST_TOKEN = "abc123"
    process.env.API_VERSION = "v2"
  })

  afterEach(() => {
    delete process.env.TEST_TOKEN
    delete process.env.API_VERSION
  })

  it("should build URL from string config", () => {
    const url = buildUrlFromRegistryConfig(
      "chat-component",
      "https://v0.dev/chat/b/{name}/json"
    )
    expect(url).toBe("https://v0.dev/chat/b/chat-component/json")
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
})

describe("buildHeadersFromRegistryConfig", () => {
  beforeEach(() => {
    process.env.AUTH_TOKEN = "secret123"
    process.env.CLIENT_ID = "client456"
  })

  afterEach(() => {
    delete process.env.AUTH_TOKEN
    delete process.env.CLIENT_ID
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
})
