import { describe, expect, test } from "vitest"

import { highlighter } from "../../src/utils/highlighter"
import { generateRandomString } from "../../test/fuzz-utils"

describe("fuzzing", () => {
  test("should handle various input strings", () => {
    const testCases = Array.from({ length: 100 }, () => ({
      text: generateRandomString(Math.floor(Math.random() * 100) + 1),
    }))

    for (const { text } of testCases) {
      try {
        // Test each highlighter function
        const errorResult = highlighter.error(text)
        const warnResult = highlighter.warn(text)
        const infoResult = highlighter.info(text)
        const successResult = highlighter.success(text)

        // All results should be strings
        expect(typeof errorResult).toBe("string")
        expect(typeof warnResult).toBe("string")
        expect(typeof infoResult).toBe("string")
        expect(typeof successResult).toBe("string")

        // All results should have the same length as input
        expect(errorResult.length).toBe(text.length)
        expect(warnResult.length).toBe(text.length)
        expect(infoResult.length).toBe(text.length)
        expect(successResult.length).toBe(text.length)
      } catch (error) {
        console.error(`Failed with text: ${text}`, error)
        throw error
      }
    }
  })

  test("should handle edge cases", () => {
    const edgeCases = [
      "", // Empty string
      " ", // Single space
      "   ", // Multiple spaces
      "0", // Zero as string
      "null", // "null" as string
      "undefined", // "undefined" as string
      "NaN", // "NaN" as string
      "true", // "true" as string
      "false", // "false" as string
      "[]", // Empty array as string
      "{}", // Empty object as string
    ]

    for (const text of edgeCases) {
      try {
        // Test each highlighter function
        const errorResult = highlighter.error(text)
        const warnResult = highlighter.warn(text)
        const infoResult = highlighter.info(text)
        const successResult = highlighter.success(text)

        // All results should be strings
        expect(typeof errorResult).toBe("string")
        expect(typeof warnResult).toBe("string")
        expect(typeof infoResult).toBe("string")
        expect(typeof successResult).toBe("string")

        // All results should have the same length as input
        expect(errorResult.length).toBe(text.length)
        expect(warnResult.length).toBe(text.length)
        expect(infoResult.length).toBe(text.length)
        expect(successResult.length).toBe(text.length)
      } catch (error) {
        console.error(`Failed with edge case: ${text}`, error)
        throw error
      }
    }
  })
})
