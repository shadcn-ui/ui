import { existsSync } from "fs"
import { beforeEach, describe, expect, test, vi } from "vitest"

import {
  findExistingEnvFile,
  getNewEnvKeys,
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

  test("should handle multi-line values (current limitation: breaks them)", () => {
    // This test documents that multi-line values are NOT properly supported
    const content = `SINGLE_LINE="This is fine"
MULTI_LINE="This is line 1
This is line 2
This is line 3"
NEXT_KEY=value`

    const result = parseEnvContent(content)

    // Current behavior: only gets first line of multi-line value
    expect(result.SINGLE_LINE).toBe("This is fine")
    expect(result.MULTI_LINE).toBe("This is line 1")
    // The other lines are lost/treated as malformed
    expect(result["This is line 2"]).toBeUndefined()
    expect(result.NEXT_KEY).toBe("value")
  })

  test("should handle escaped newlines in values", () => {
    const content = `KEY_WITH_ESCAPED_NEWLINE="Line 1\\nLine 2\\nLine 3"
REGULAR_KEY=regular_value`

    const result = parseEnvContent(content)

    // Escaped newlines are preserved as literal \n
    expect(result.KEY_WITH_ESCAPED_NEWLINE).toBe("Line 1\\nLine 2\\nLine 3")
    expect(result.REGULAR_KEY).toBe("regular_value")
  })

  test("should handle values with unmatched quotes", () => {
    const content = `GOOD_KEY="proper quotes"
BAD_KEY="unmatched quote
NEXT_KEY=value`

    const result = parseEnvContent(content)

    expect(result.GOOD_KEY).toBe("proper quotes")
    // Current behavior: strips the opening quote even if unmatched
    expect(result.BAD_KEY).toBe("unmatched quote")
    expect(result.NEXT_KEY).toBe("value")
  })

  test("should handle backtick quotes (not supported)", () => {
    const content = 'KEY1=`backtick value`\nKEY2="double quotes"'

    const result = parseEnvContent(content)

    // Backticks are not treated as quotes
    expect(result.KEY1).toBe("`backtick value`")
    expect(result.KEY2).toBe("double quotes")
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

  test("should handle multi-line values in merge (current limitation)", () => {
    const existing = `EXISTING_KEY=existing_value`
    const newContent = `MULTI_LINE_KEY="Line 1
Line 2
Line 3"
SIMPLE_KEY=simple`

    const result = mergeEnvContent(existing, newContent)

    // Current behavior: only the first line is added
    expect(result).toBe(`EXISTING_KEY=existing_value

MULTI_LINE_KEY=Line 1
SIMPLE_KEY=simple
`)

    // The multi-line value is broken
    expect(result).not.toContain("Line 2")
    expect(result).not.toContain("Line 3")
  })
})

describe("getNewEnvKeys", () => {
  test("should identify new keys", () => {
    const existing = `KEY1=value1
KEY2=value2`
    const newContent = `KEY1=ignored
KEY3=value3
KEY4=value4`

    const result = getNewEnvKeys(existing, newContent)
    expect(result).toEqual(["KEY3", "KEY4"])
  })

  test("should return empty array when all keys exist", () => {
    const existing = `KEY1=value1
KEY2=value2`
    const newContent = `KEY1=different
KEY2=different`

    const result = getNewEnvKeys(existing, newContent)
    expect(result).toEqual([])
  })

  test("should handle empty existing content", () => {
    const existing = ""
    const newContent = `KEY1=value1
KEY2=value2`

    const result = getNewEnvKeys(existing, newContent)
    expect(result).toEqual(["KEY1", "KEY2"])
  })
})

describe("findExistingEnvFile", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("should return .env.local if it exists", () => {
    vi.mocked(existsSync).mockImplementation((path) => {
      const pathStr = typeof path === "string" ? path : path.toString()
      return pathStr.endsWith(".env.local")
    })

    const result = findExistingEnvFile("/test/dir")
    expect(result).toBe("/test/dir/.env.local")
    expect(existsSync).toHaveBeenCalledWith("/test/dir/.env.local")
    expect(existsSync).toHaveBeenCalledTimes(1)
  })

  test("should return .env if .env.local doesn't exist", () => {
    vi.mocked(existsSync).mockImplementation((path) => {
      const pathStr = typeof path === "string" ? path : path.toString()
      return pathStr.endsWith(".env")
    })

    const result = findExistingEnvFile("/test/dir")
    expect(result).toBe("/test/dir/.env")
    expect(existsSync).toHaveBeenCalledWith("/test/dir/.env.local")
    expect(existsSync).toHaveBeenCalledWith("/test/dir/.env")
    expect(existsSync).toHaveBeenCalledTimes(2)
  })

  test("should return .env.development.local if earlier variants don't exist", () => {
    vi.mocked(existsSync).mockImplementation((path) => {
      const pathStr = typeof path === "string" ? path : path.toString()
      return pathStr.endsWith(".env.development.local")
    })

    const result = findExistingEnvFile("/test/dir")
    expect(result).toBe("/test/dir/.env.development.local")
    expect(existsSync).toHaveBeenCalledWith("/test/dir/.env.local")
    expect(existsSync).toHaveBeenCalledWith("/test/dir/.env")
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

    expect(existsSync).toHaveBeenCalledWith("/test/dir/.env.local")
    expect(existsSync).toHaveBeenCalledWith("/test/dir/.env")
    expect(existsSync).toHaveBeenCalledWith("/test/dir/.env.development.local")
    expect(existsSync).toHaveBeenCalledWith("/test/dir/.env.development")
  })
})
