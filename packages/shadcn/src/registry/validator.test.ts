import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { extractRegistryEnvVars, validateRegistryConfig } from "./validator"

describe("extractRegistryEnvVars", () => {
  it("should extract vars from string config", () => {
    expect(extractRegistryEnvVars("https://api.com?token=${TOKEN}")).toEqual([
      "TOKEN",
    ])
  })

  it("should extract vars from object config", () => {
    const config = {
      url: "https://api.com/{name}?key=${API_KEY}",
      params: {
        version: "1.0",
        token: "${TOKEN}",
      },
      headers: {
        Authorization: "Bearer ${AUTH_TOKEN}",
        "X-Api-Key": "${API_KEY}",
      },
    }

    expect(extractRegistryEnvVars(config).sort()).toEqual([
      "API_KEY",
      "AUTH_TOKEN",
      "TOKEN",
    ])
  })

  it("should handle config without params or headers", () => {
    const config = {
      url: "https://api.com/{name}",
    }

    expect(extractRegistryEnvVars(config)).toEqual([])
  })
})

describe("validateRegistryConfig", () => {
  beforeEach(() => {
    process.env.TOKEN = "value"
  })

  afterEach(() => {
    delete process.env.TOKEN
  })

  it("should pass when all env vars are set", () => {
    expect(() => {
      validateRegistryConfig("@test", "https://api.com?token=${TOKEN}")
    }).not.toThrow()
  })

  it("should throw when env vars are missing", () => {
    expect(() => {
      validateRegistryConfig("@test", "https://api.com?token=${MISSING}")
    }).toThrow(/Registry "@test" requires environment variables/)
  })

  it("should list all missing variables", () => {
    const config = {
      url: "https://api.com/{name}",
      headers: {
        Auth: "${TOKEN1}",
        Key: "${TOKEN2}",
      },
    }

    expect(() => {
      validateRegistryConfig("@test", config)
    }).toThrow(/TOKEN1[\s\S]*TOKEN2/)
  })
})
