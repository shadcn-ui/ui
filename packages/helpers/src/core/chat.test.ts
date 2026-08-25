import { describe, expect, it } from "vitest"

import { createChatRuntime } from "./chat"
import { createTestChat, createTestFormat, readStream } from "./test-utils"
import type {
  TestData,
  TestMessage,
  TestPart,
  TestTools,
  TestTransport,
} from "./test-utils"
import type { NeutralChunk } from "./types"

describe("createChatRuntime", () => {
  it("creates user and assistant turns with sequential ids and metadata", () => {
    const chat = createTestChat().user("Hello").assistant("Hey.")
    const messages = chat.get()

    expect(messages).toMatchObject([
      {
        id: "msg-1",
        role: "user",
        metadata: { createdAt: "2026-01-01T00:00:00.000Z" },
        parts: [{ type: "text", text: "Hello" }],
      },
      {
        id: "msg-2",
        role: "assistant",
        parts: [{ type: "text", text: "Hey." }],
      },
    ])
  })

  it("attaches user files as parts", () => {
    const chat = createTestChat().user("See attached.", {
      files: [
        {
          filename: "report.pdf",
          mediaType: "application/pdf",
          url: "https://example.com/report.pdf",
        },
      ],
    })

    expect(chat.get()[0].parts).toMatchObject([
      { type: "text", text: "See attached." },
      { type: "file", filename: "report.pdf" },
    ])
  })

  it("stores explicit assistant parts as-is", () => {
    const parts = [{ type: "text", text: "Prebuilt." }]
    const chat = createTestChat().assistant(parts)

    expect(chat.get()[0].parts).toMatchObject(parts)
  })

  it("returns cloned messages from get", () => {
    const chat = createTestChat().user("Hello")
    const [first] = chat.get()

    first.parts[0].text = "Mutated"

    expect(chat.get()[0].parts[0].text).toBe("Hello")
  })

  it("owns explicit parts and deeply detached snapshots", () => {
    const parts = [
      {
        type: "tool-getWeather",
        input: { location: { city: "SF" } },
      },
    ]
    const chat = createTestChat().assistant(parts)

    ;(parts[0].input.location as { city: string }).city = "mutated input"

    const [snapshot] = chat.get()
    const snapshotPart = snapshot.parts[0] as unknown as {
      input: { location: { city: string } }
    }

    snapshotPart.input.location.city = "mutated snapshot"

    expect(chat.get()[0].parts[0]).toMatchObject({
      input: { location: { city: "SF" } },
    })
  })

  it("returns a transcript prefix without mutating playback", () => {
    const chat = createTestChat()
      .user("One")
      .assistant("A")
      .user("Two")
      .assistant("B")
      .user("Three")

    const initialMessages = chat.get(2)
    const first = chat.next(initialMessages)
    const second = chat.next(initialMessages)

    expect(first?.parts[0].text).toBe("Two")
    expect(second?.parts[0].text).toBe("Two")
  })

  it("finds the next user turn from a transcript by id", () => {
    const chat = createTestChat().user("One").assistant("A").user("Two")

    const [firstMessage] = chat.get(1)
    const nextMessage = chat.next([firstMessage])

    expect(nextMessage?.parts[0].text).toBe("Two")
  })

  it("falls back to role and text matching for unscripted transcripts", () => {
    const chat = createTestChat().user("One").assistant("A").user("Two")

    const next = chat.next([
      {
        id: "external-1",
        role: "user",
        parts: [{ type: "text", text: "One" }],
      },
    ])

    expect(next?.parts[0].text).toBe("Two")
  })

  it("returns the first user message for an empty transcript and null when exhausted", () => {
    const chat = createTestChat().user("One").assistant("A")

    expect(chat.next([])?.parts[0].text).toBe("One")
    expect(chat.next(chat.get())).toBeNull()
  })

  it("rejects invalid get counts", () => {
    const chat = createTestChat().user("One")

    expect(() => chat.get(-1)).toThrowError(
      "count must be a non-negative integer."
    )
    expect(() => chat.get(1.5)).toThrowError(
      "count must be a non-negative integer."
    )
  })

  it("requires counts for get and message transcripts for next", () => {
    const chat = createTestChat()

    if (false) {
      // @ts-expect-error get accepts a count, not an options object.
      chat.get({ count: 1 })
      // @ts-expect-error next requires the current message transcript.
      chat.next()
      // @ts-expect-error next accepts messages, not transcript indexes.
      chat.next([1])
    }

    expect(chat.get()).toEqual([])
  })

  it("streams the next scripted assistant turn through the transport", async () => {
    const chat = createTestChat()
      .user("Weather?")
      .assistant(({ writer }) => {
        writer.reasoning("Checking.", { mode: "instant" })
        writer
          .tool("getWeather", { input: { city: "SF" } })
          .output({ temperature: 72 })
        writer.text("Sunny.", { mode: "instant" })
      })

    const [userMessage] = chat.get(1)
    const { context, options } = chat.transport({ delayMs: 0 })
    const turn = context.resolveTurn([userMessage])

    expect(options).toEqual({ delayMs: 0 })
    expect(turn?.role).toBe("assistant")

    const chunks = await readStream(
      context.streamTurn(turn!, (chunk) => chunk, options)
    )

    expect(chunks.map((chunk) => chunk.type)).toEqual([
      "start",
      "reasoning-start",
      "reasoning-delta",
      "reasoning-end",
      "tool-input-available",
      "tool-output-available",
      "text-start",
      "text-delta",
      "text-end",
      "finish",
    ])
  })

  it("streams scripted errors and stops", async () => {
    const chat = createTestChat().user("Hello").error("Model unavailable.")

    const [userMessage] = chat.get(1)
    const { context } = chat.transport()
    const turn = context.resolveTurn([userMessage])
    const chunks = await readStream(
      context.streamTurn(turn!, (chunk) => chunk, { delayMs: 0 })
    )

    expect(chunks).toMatchObject([
      { type: "start" },
      { type: "error", errorText: "Model unavailable." },
    ])
  })

  it("resolves turns by message id", () => {
    const chat = createTestChat()
      .user("One")
      .assistant("A", { id: "assistant-a" })
      .user("Two")
      .assistant("B", { id: "assistant-b" })

    const { context } = chat.transport()

    expect(context.resolveTurn([], "assistant-b")?.message.id).toBe(
      "assistant-b"
    )

    const turnAfterOne = context.resolveTurn(chat.get(1))

    expect(turnAfterOne?.message.id).toBe("assistant-a")
  })

  it("carries assistant metadata on the finish chunk", async () => {
    const chat = createTestChat()
      .user("Hello")
      .assistant("Hey.", { metadata: { model: "gpt-5" } })

    const [userMessage] = chat.get(1)
    const { context } = chat.transport()
    const turn = context.resolveTurn([userMessage])
    const chunks = await readStream(
      context.streamTurn(turn!, (chunk) => chunk, { delayMs: 0 })
    )
    const finish = chunks.find((chunk) => chunk.type === "finish")

    expect(finish).toMatchObject({
      messageMetadata: { model: "gpt-5" },
    })
  })

  it("sleeps before the next scripted turn", async () => {
    const chat = createTestChat()
      .user("Hello")
      .sleep(60)
      .assistant(({ writer }) => {
        writer.text("Hey.", { mode: "instant" })
      })

    const [userMessage] = chat.get(1)
    const { context } = chat.transport()
    const turn = context.resolveTurn([userMessage])
    const startedAt = Date.now()
    const chunks = await readStream(
      context.streamTurn(turn!, (chunk) => chunk, { delayMs: 0 })
    )

    expect(Date.now() - startedAt).toBeGreaterThanOrEqual(40)
    expect(chunks[0]).toMatchObject({ type: "start" })
  })
})

describe("createChatRuntime hydration and fallback", () => {
  it("seeds turns from existing messages and reserves message ids", () => {
    const format = createTestFormat<TestData, TestTools>()
    const source = createTestChat().user("Hello").assistant("Hey.")
    const recorded = source.get()

    const replay = createChatRuntime<
      TestMessage,
      TestPart,
      NeutralChunk<unknown, TestData, TestTools>,
      TestTransport<TestData, TestTools>,
      unknown,
      TestData,
      TestTools
    >(format, { messages: recorded })

    expect(replay.get()).toEqual(recorded)

    replay.user("What's next?")

    const messages = replay.get()

    expect(messages[2].id).toBe("msg-3")
    expect(messages.map((message) => message.role)).toEqual([
      "user",
      "assistant",
      "user",
    ])
  })

  it("continues past the highest seeded id without relying on transcript length", () => {
    const format = createTestFormat<TestData, TestTools>()
    const replay = createChatRuntime<
      TestMessage,
      TestPart,
      NeutralChunk<unknown, TestData, TestTools>,
      TestTransport<TestData, TestTools>,
      unknown,
      TestData,
      TestTools
    >(format, {
      messages: [
        {
          id: "msg-2",
          role: "assistant",
          parts: [{ type: "text", text: "Seeded" }],
        },
      ],
    })

    replay.user("Next")

    expect(replay.get().map((message) => message.id)).toEqual([
      "msg-2",
      "msg-3",
    ])
  })

  it("resolves a fallback turn only when configured", () => {
    const chat = createTestChat().user("Hello").assistant("Hey.")
    // A transcript containing the full script is exhausted — no scripted
    // assistant turn remains, which is when the fallback kicks in.
    const exhausted: TestMessage[] = [
      ...chat.get(),
      {
        id: "unknown-1",
        role: "user",
        parts: [{ type: "text", text: "Unscripted" }],
      },
    ]

    const strict = chat.transport()

    expect(strict.context.resolveTurn(exhausted)).toBeUndefined()

    const lenient = chat.transport({ fallback: "Scripted demo." })
    const turn = lenient.context.resolveTurn(exhausted)

    expect(turn).toMatchObject({
      role: "assistant",
    })
    expect(turn?.events).toContainEqual(
      expect.objectContaining({
        kind: "text",
        text: "Scripted demo.",
      })
    )
  })

  it("does not add fallback turns to the script", () => {
    const chat = createTestChat().user("Hello").assistant("Hey.")
    const transport = chat.transport({ fallback: "Scripted demo." })

    transport.context.resolveTurn([
      ...chat.get(),
      {
        id: "unknown-1",
        role: "user",
        parts: [{ type: "text", text: "Unscripted" }],
      },
    ])

    expect(chat.get()).toHaveLength(2)
  })
})
