import { describe, expect, test, vi, beforeEach, afterEach } from "vitest"
import { z } from "zod"
import { handleError } from "../../src/utils/handle-error"
import { logger } from "../../src/utils/logger"

vi.mock("../../src/utils/logger", () => ({
  logger: {
    error: vi.fn(),
    break: vi.fn(),
  },
}))

vi.mock("../../src/utils/highlighter", () => ({
  highlighter: {
    info: (s: string) => s,
  },
}))

describe("handleError", () => {
  let processExitSpy: any

  beforeEach(() => {
    processExitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit")
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    processExitSpy.mockRestore()
  })

  test("should format Zod errors correctly with a single message", () => {
    const schema = z.object({
      name: z.string().min(5, "Too short"),
    })

    const result = schema.safeParse({ name: "abc" })

    if (!result.success) {
      try {
        handleError(result.error)
      } catch (e: any) {
        if (e.message !== "process.exit") throw e
      }

      expect(logger.error).toHaveBeenCalledWith("- name: Too short.")
    }
  })

  test("should join multiple Zod errors for the same field with a space and periods", () => {
    const schema = z.object({
      name: z.string().min(5, "Too short").describe("Must be a string"),
    }).refine(data => data.name.includes("!"), {
      message: "Must include !",
      path: ["name"]
    })

    const result = schema.safeParse({ name: "abc" })

    if (!result.success) {
      try {
        handleError(result.error)
      } catch (e: any) {
        if (e.message !== "process.exit") throw e
      }

      // Zod flattens multiple errors for the same path into an array
      expect(logger.error).toHaveBeenCalledWith("- name: Too short. Must include !.")
    }
  })

  test("should handle top-level form errors", () => {
    const schema = z.object({
      name: z.string()
    }).refine(() => false, {
      message: "Global error"
    })

    const result = schema.safeParse({ name: "test" })

    if (!result.success) {
      try {
        handleError(result.error)
      } catch (e: any) {
        if (e.message !== "process.exit") throw e
      }

      expect(logger.error).toHaveBeenCalledWith("- Global error.")
    }
  })

  test("should normalize varied punctuation and whitespace", () => {
    const schema = z.object({
      field1: z.string(),
      field2: z.string(),
      field3: z.string(),
    }).refine(() => false, {
      message: "  Too many spaces  ",
      path: ["field1"]
    }).refine(() => false, {
      message: "Ends with bang!",
      path: ["field2"]
    }).refine(() => false, {
      message: "Ends with question?",
      path: ["field3"]
    })

    const result = schema.safeParse({ field1: "a", field2: "b", field3: "c" })

    if (!result.success) {
      try {
        handleError(result.error)
      } catch (e: any) {
        if (e.message !== "process.exit") throw e
      }

      expect(logger.error).toHaveBeenCalledWith("- field1: Too many spaces.")
      expect(logger.error).toHaveBeenCalledWith("- field2: Ends with bang!.")
      expect(logger.error).toHaveBeenCalledWith("- field3: Ends with question?.")
    }
  })

  test("should handle multiple failing fields", () => {
    const schema = z.object({
      first: z.string().min(5),
      second: z.string().min(5),
    })

    const result = schema.safeParse({ first: "a", second: "b" })

    if (!result.success) {
      try {
        handleError(result.error)
      } catch (e: any) {
        if (e.message !== "process.exit") throw e
      }

      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("- first:"))
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("- second:"))
    }
  })

  test("should log a generic message for unknown error types", () => {
    try {
      handleError({ some: "random object" })
    } catch (e: any) {
      if (e.message !== "process.exit") throw e
    }

    expect(logger.error).toHaveBeenCalledWith("An unknown error occurred. Please check the logs for more details.")
  })
})
