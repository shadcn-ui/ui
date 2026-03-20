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

  test("should format Zod errors correctly with multiple messages", () => {
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
})
