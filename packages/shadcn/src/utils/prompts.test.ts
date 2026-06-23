import _prompts from "prompts"
import { describe, expect, it, vi } from "vitest"

import prompts from "./prompts"

vi.mock("prompts", () => {
  const fn = vi.fn()
  return { default: fn, __esModule: true }
})

describe("prompts wrapper", () => {
  it("should strip control characters from string values", async () => {
    vi.mocked(_prompts).mockImplementation(async (questions: any) => {
      const q = Array.isArray(questions) ? questions[0] : questions
      return { name: q.format("\x15my-app") }
    })

    const result = await prompts({ type: "text", name: "name", message: "?" })
    expect(result).toEqual({ name: "my-app" })
  })

  it("should strip all C0 control characters and DEL", async () => {
    vi.mocked(_prompts).mockImplementation(async (questions: any) => {
      const q = Array.isArray(questions) ? questions[0] : questions
      return { name: q.format("\x00\x01\x1f\x7fclean") }
    })

    const result = await prompts({ type: "text", name: "name", message: "?" })
    expect(result).toEqual({ name: "clean" })
  })

  it("should preserve existing format callbacks", async () => {
    vi.mocked(_prompts).mockImplementation(async (questions: any) => {
      const q = Array.isArray(questions) ? questions[0] : questions
      return { name: q.format("\x15  my-app  ") }
    })

    const result = await prompts({
      type: "text",
      name: "name",
      message: "?",
      format: (value: string) => value.trim(),
    })
    expect(result).toEqual({ name: "my-app" })
  })

  it("should pass non-string values through unchanged", async () => {
    vi.mocked(_prompts).mockImplementation(async (questions: any) => {
      const q = Array.isArray(questions) ? questions[0] : questions
      return { confirmed: q.format(true) }
    })

    const result = await prompts({
      type: "toggle",
      name: "confirmed",
      message: "?",
    })
    expect(result).toEqual({ confirmed: true })
  })

  it("should handle arrays of questions", async () => {
    vi.mocked(_prompts).mockImplementation(async (questions: any) => {
      expect(Array.isArray(questions)).toBe(true)
      expect(questions).toHaveLength(2)
      return {
        type: questions[0].format("next"),
        name: questions[1].format("\x15my-app"),
      }
    })

    const result = await prompts([
      { type: "select", name: "type", message: "?" },
      { type: "text", name: "name", message: "?" },
    ])
    expect(result).toEqual({ type: "next", name: "my-app" })
  })

  it("should preserve unicode and printable characters", async () => {
    vi.mocked(_prompts).mockImplementation(async (questions: any) => {
      const q = Array.isArray(questions) ? questions[0] : questions
      return { name: q.format("café-app-日本語") }
    })

    const result = await prompts({ type: "text", name: "name", message: "?" })
    expect(result).toEqual({ name: "café-app-日本語" })
  })
})
