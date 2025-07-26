import { existsSync } from "fs"
import { beforeEach, describe, expect, test, vi } from "vitest"

import {
  findExistingEnvFile,
  isEnvFile,
  mergeEnvContent,
  parseEnvContent,
} from "./env-helpers"

// Mock fs module
vi.mock("fs", () => ({
  existsSync: vi.fn(),
}))

describe("isEnvFile", () => {
  test("should identify .env files", () => {
    expect(isEnvFile("/path/to/.env")).toBe(true)
    expect(isEnvFile(".env")).toBe(true)
    expect(isEnvFile("/path/to/.env.local")).toBe(true)
    expect(isEnvFile(".env.local")).toBe(true)
    expect(isEnvFile(".env.example")).toBe(true)
    expect(isEnvFile(".env.development.local")).toBe(true)
    expect(isEnvFile(".env.production.local")).toBe(true)
    expect(isEnvFile(".env.test.local")).toBe(true)
  })

  test("should not identify non-.env files", () => {
    expect(isEnvFile("/path/to/file.txt")).toBe(false)
    expect(isEnvFile("environment.ts")).toBe(false)
    expect(isEnvFile("/path/to/.environment")).toBe(false)
    expect(isEnvFile("env.config")).toBe(false)
  })
})

describe("parseEnvContent", () => {
  test("should parse basic key-value pairs", () => {
    const content = `KEY1=value1
KEY2=value2`
    expect(parseEnvContent(content)).toEqual({
      KEY1: "value1",
      KEY2: "value2",
    })
  })

  test("should handle comments and empty lines", () => {
    const content = `# This is a comment
KEY1=value1

# Another comment
KEY2=value2
`
    expect(parseEnvContent(content)).toEqual({
      KEY1: "value1",
      KEY2: "value2",
    })
  })

  test("should handle quoted values", () => {
    const content = `KEY1="value with spaces"
KEY2='single quotes'`
    expect(parseEnvContent(content)).toEqual({
      KEY1: "value with spaces",
      KEY2: "single quotes",
    })
  })

  test("should handle values with equals signs", () => {
    const content = `DATABASE_URL=postgresql://user:pass@host:5432/db?ssl=true`
    expect(parseEnvContent(content)).toEqual({
      DATABASE_URL: "postgresql://user:pass@host:5432/db?ssl=true",
    })
  })

  test("should handle empty values", () => {
    const content = `EMPTY_KEY=
KEY_WITH_VALUE=value`
    expect(parseEnvContent(content)).toEqual({
      EMPTY_KEY: "",
      KEY_WITH_VALUE: "value",
    })
  })

  test("should skip malformed lines", () => {
    const content = `VALID_KEY=value
this is not a valid line
ANOTHER_KEY=another_value`
    expect(parseEnvContent(content)).toEqual({
      VALID_KEY: "value",
      ANOTHER_KEY: "another_value",
    })
  })
})

describe("mergeEnvContent", () => {
  test("should append only new keys", () => {
    const existing = `KEY1=value1`
    const newContent = `KEY2=value2`
    const result = mergeEnvContent(existing, newContent)
    expect(result).toBe(`KEY1=value1

KEY2=value2
`)
  })

  test("should preserve existing values and NOT overwrite them", () => {
    const existing = `KEY1=existing_value
KEY2=value2`
    const newContent = `KEY1=new_value_should_be_ignored
KEY3=value3`
    const result = mergeEnvContent(existing, newContent)
    expect(result).toBe(`KEY1=existing_value
KEY2=value2

KEY3=value3
`)

    expect(result).toContain("KEY1=existing_value")
    expect(result).not.toContain("KEY1=new_value_should_be_ignored")
  })

  test("should handle empty existing content", () => {
    const existing = ""
    const newContent = "KEY1=value1"
    const result = mergeEnvContent(existing, newContent)
    expect(result).toBe(`KEY1=value1
`)
  })

  test("should not add any content if all keys already exist", () => {
    const existing = `KEY1=value1
KEY2=value2`
    const newContent = `KEY1=ignored
KEY2=ignored`
    const result = mergeEnvContent(existing, newContent)

    expect(result).toBe(`KEY1=value1
KEY2=value2
`)
  })

  test("should return unchanged content when all keys exist and formatting is correct", () => {
    const existing = `KEY1=value1
KEY2=value2
`
    const newContent = `KEY1=ignored
KEY2=ignored`
    const result = mergeEnvContent(existing, newContent)

    expect(result).toBe(existing)
  })

  test("should handle existing content with comments", () => {
    const existing = `# Production configuration
KEY1=value1
# API Keys
KEY2=value2`
    const newContent = `KEY3=value3
KEY1=should_be_ignored`
    const result = mergeEnvContent(existing, newContent)

    expect(result).toBe(`# Production configuration
KEY1=value1
# API Keys
KEY2=value2

KEY3=value3
`)
  })

  test("should maintain proper formatting", () => {
    const existing = `KEY1=value1
KEY2=value2
`
    const newContent = `KEY3=value3`
    const result = mergeEnvContent(existing, newContent)

    expect(result).toBe(`KEY1=value1
KEY2=value2

KEY3=value3
`)
  })

  test("should handle multiple new keys", () => {
    const existing = `KEY1=value1`
    const newContent = `KEY2=value2
KEY3=value3
KEY4=value4`
    const result = mergeEnvContent(existing, newContent)

    expect(result).toBe(`KEY1=value1

KEY2=value2
KEY3=value3
KEY4=value4
`)
  })
})

describe("findExistingEnvFile", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("should return .env if it exists", () => {
    vi.mocked(existsSync).mockImplementation((path) => {
      const pathStr = typeof path === "string" ? path : path.toString()
      return pathStr.endsWith(".env")
    })

    const result = findExistingEnvFile("/test/dir")
    expect(result).toBe("/test/dir/.env")
    expect(existsSync).toHaveBeenCalledWith("/test/dir/.env")
    expect(existsSync).toHaveBeenCalledTimes(1)
  })

  test("should return .env.local if .env doesn't exist", () => {
    vi.mocked(existsSync).mockImplementation((path) => {
      const pathStr = typeof path === "string" ? path : path.toString()
      return pathStr.endsWith(".env.local")
    })

    const result = findExistingEnvFile("/test/dir")
    expect(result).toBe("/test/dir/.env.local")
    expect(existsSync).toHaveBeenCalledWith("/test/dir/.env")
    expect(existsSync).toHaveBeenCalledWith("/test/dir/.env.local")
    expect(existsSync).toHaveBeenCalledTimes(2)
  })

  test("should return .env.development.local if earlier variants don't exist", () => {
    vi.mocked(existsSync).mockImplementation((path) => {
      const pathStr = typeof path === "string" ? path : path.toString()
      return pathStr.endsWith(".env.development.local")
    })

    const result = findExistingEnvFile("/test/dir")
    expect(result).toBe("/test/dir/.env.development.local")
    expect(existsSync).toHaveBeenCalledWith("/test/dir/.env")
    expect(existsSync).toHaveBeenCalledWith("/test/dir/.env.local")
    expect(existsSync).toHaveBeenCalledWith("/test/dir/.env.development.local")
    expect(existsSync).toHaveBeenCalledTimes(3)
  })

  test("should return null if no env files exist", () => {
    vi.mocked(existsSync).mockReturnValue(false)

    const result = findExistingEnvFile("/test/dir")
    expect(result).toBeNull()
    expect(existsSync).toHaveBeenCalledTimes(4)
  })

  test("should check all variants in correct order", () => {
    vi.mocked(existsSync).mockReturnValue(false)

    findExistingEnvFile("/test/dir")

    expect(existsSync).toHaveBeenCalledWith("/test/dir/.env")
    expect(existsSync).toHaveBeenCalledWith("/test/dir/.env.local")
    expect(existsSync).toHaveBeenCalledWith("/test/dir/.env.development.local")
    expect(existsSync).toHaveBeenCalledWith("/test/dir/.env.development")
  })
})
