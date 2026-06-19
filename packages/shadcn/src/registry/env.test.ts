/* eslint-disable turbo/no-undeclared-env-vars */
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { expandEnvVars, extractEnvVars } from "./env"

describe("expandEnvVars", () => {
  beforeEach(() => {
    process.env.TEST_TOKEN = "abc123"
    process.env.API_KEY = "secret"
  })

  afterEach(() => {
    delete process.env.TEST_TOKEN
    delete process.env.API_KEY
  })

  it("should expand environment variables", () => {
    expect(expandEnvVars("Bearer ${TEST_TOKEN}")).toBe("Bearer abc123")
    expect(expandEnvVars("key=${API_KEY}&token=${TEST_TOKEN}")).toBe(
      "key=secret&token=abc123"
    )
  })

  it("should replace missing env vars with empty string", () => {
    expect(expandEnvVars("Bearer ${MISSING_VAR}")).toBe("Bearer ")
    expect(expandEnvVars("${VAR1}:${VAR2}")).toBe(":")
  })

  it("should handle strings without env vars", () => {
    expect(expandEnvVars("no variables here")).toBe("no variables here")
    expect(expandEnvVars("https://example.com")).toBe("https://example.com")
  })
})

describe("extractEnvVars", () => {
  it("should extract environment variable names", () => {
    expect(extractEnvVars("Bearer ${TOKEN}")).toEqual(["TOKEN"])
    expect(extractEnvVars("${VAR1} and ${VAR2}")).toEqual(["VAR1", "VAR2"])
    expect(extractEnvVars("${SAME} and ${SAME}")).toEqual(["SAME", "SAME"])
  })

  it("should return empty array for no variables", () => {
    expect(extractEnvVars("no variables")).toEqual([])
    expect(extractEnvVars("")).toEqual([])
  })
})
