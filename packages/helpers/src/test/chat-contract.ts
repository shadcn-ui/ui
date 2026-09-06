import { describe, expect, it } from "vitest"

type ContractMessage = {
  id: string
  role: string
  parts: unknown[]
}

type ContractChat<MESSAGE extends ContractMessage> = {
  get(count?: number): MESSAGE[]
  next(messages: readonly MESSAGE[]): MESSAGE | null
}

function mutateNestedValue(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(mutateNestedValue)
  }

  if (value === null || typeof value !== "object") {
    return false
  }

  for (const [key, child] of Object.entries(value)) {
    if (typeof child === "string") {
      const object = value as Record<string, unknown>

      object[key] = "mutated"
      return true
    }

    if (mutateNestedValue(child)) {
      return true
    }
  }

  return false
}

export function testChatContract<MESSAGE extends ContractMessage>(
  adapter: string,
  createFixture: () => ContractChat<MESSAGE>
) {
  describe(`${adapter} chat contract`, () => {
    it("reads the full transcript or a prefix without advancing", () => {
      const chat = createFixture()
      const messages = chat.get()

      expect(messages.map((message) => message.role)).toEqual([
        "user",
        "assistant",
        "user",
        "assistant",
      ])
      expect(chat.get(2)).toEqual(messages.slice(0, 2))
      expect(chat.get()).toEqual(messages)
    })

    it("finds the next user message from the supplied transcript", () => {
      const chat = createFixture()
      const messages = chat.get()

      expect(chat.next(messages.slice(0, 2))?.id).toBe(messages[2].id)
      expect(chat.next(messages.slice(0, 2))?.id).toBe(messages[2].id)
      expect(chat.next(messages)).toBeNull()
    })

    it("returns detached transcript snapshots", () => {
      const chat = createFixture()
      const expected = chat.get()
      const snapshot = chat.get()

      expect(mutateNestedValue(snapshot[0].parts)).toBe(true)
      expect(chat.get()).toEqual(expected)
    })
  })
}
