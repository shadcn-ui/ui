import { StreamProcessor } from "@tanstack/ai/client"
import { describe, expect, it } from "vitest"

import { createChat } from "./index"
import { getMessageText } from "./parts"
import { collectChunks, createWeatherChat, weatherOutput } from "./test-utils"

describe("TanStack transport", () => {
  it("streams the golden AG-UI event sequence with runContext ids", async () => {
    const chat = createWeatherChat()
    const initialMessages = chat.get(1)
    const transport = chat.transport({ delayMs: 0 })
    const chunks = await collectChunks(
      transport.connect(initialMessages, undefined, undefined, {
        threadId: "thread-1",
        runId: "run-1",
      })
    )

    expect(chunks.map((chunk) => chunk.type)).toEqual([
      "RUN_STARTED",
      "REASONING_MESSAGE_START",
      "REASONING_MESSAGE_CONTENT",
      "REASONING_MESSAGE_END",
      "TOOL_CALL_START",
      "TOOL_CALL_ARGS",
      "TOOL_CALL_END",
      "TOOL_CALL_RESULT",
      "TEXT_MESSAGE_START",
      "TEXT_MESSAGE_CONTENT",
      "TEXT_MESSAGE_END",
      "RUN_FINISHED",
    ])
    expect(chunks[0]).toMatchObject({
      type: "RUN_STARTED",
      threadId: "thread-1",
      runId: "run-1",
    })
    expect(chunks[4]).toMatchObject({
      type: "TOOL_CALL_START",
      toolCallId: "call-1",
      toolCallName: "getWeather",
      parentMessageId: "msg-2",
    })
    expect(chunks[7]).toMatchObject({
      type: "TOOL_CALL_RESULT",
      toolCallId: "call-1",
      content: JSON.stringify(weatherOutput),
    })
    expect(chunks.at(-1)).toMatchObject({
      type: "RUN_FINISHED",
      threadId: "thread-1",
      runId: "run-1",
      finishReason: "stop",
    })
  })

  it("uses chat ids when runContext is omitted", async () => {
    const chat = createChat().user("Hello").assistant("Hi")
    const initialMessages = chat.get(1)
    const transport = chat.transport({ delayMs: 0 })
    const chunks = await collectChunks(transport.connect(initialMessages))

    expect(chunks[0]).toMatchObject({
      type: "RUN_STARTED",
      threadId: "thread-chat",
      runId: "run-chat",
    })
    expect(chunks.at(-1)).toMatchObject({
      type: "RUN_FINISHED",
      threadId: "thread-chat",
      runId: "run-chat",
    })
  })

  it("round-trips through the real TanStack StreamProcessor", async () => {
    const chat = createWeatherChat()
    const initialMessages = chat.get(1)
    const transport = chat.transport({ delayMs: 0 })
    const processor = new StreamProcessor()

    processor.setMessages(initialMessages)
    processor.prepareAssistantMessage()

    await processor.process(
      transport.connect(initialMessages, undefined, undefined, {
        threadId: "thread-1",
        runId: "run-1",
      })
    )

    const messages = processor.getMessages()
    const assistantMessage = messages[messages.length - 1]

    expect(messages.length).toBeGreaterThanOrEqual(2)
    expect(assistantMessage.role).toBe("assistant")
    expect(getMessageText(assistantMessage)).toBe("It's sunny.")

    const toolCallPart = assistantMessage.parts.find(
      (part) => part.type === "tool-call"
    )

    if (!toolCallPart || toolCallPart.type !== "tool-call") {
      throw new Error("Expected a tool-call part.")
    }

    // The installed StreamProcessor (0.40.0) keeps the accumulated
    // `arguments` JSON string on the final part; it does not persist a
    // parsed `input` field.
    expect(toolCallPart).toMatchObject({
      name: "getWeather",
      state: "complete",
      arguments: JSON.stringify({ city: "San Francisco" }),
      output: weatherOutput,
    })
  })

  it("streams an app-level error as RUN_ERROR", async () => {
    const chat = createChat().user("Hello").error("Model unavailable.")
    const initialMessages = chat.get(1)
    const transport = chat.transport({ delayMs: 0 })
    const chunks = await collectChunks(
      transport.connect(initialMessages, undefined, undefined, {
        threadId: "thread-1",
        runId: "run-1",
      })
    )

    expect(chunks.map((chunk) => chunk.type)).toEqual([
      "RUN_STARTED",
      "RUN_ERROR",
    ])
    expect(chunks.at(-1)).toMatchObject({
      type: "RUN_ERROR",
      message: "Model unavailable.",
    })
  })

  it("throws when no scripted assistant turn matches", () => {
    const chat = createChat().user("Hello")
    const transport = chat.transport()

    expect(() =>
      transport.connect(chat.get(), undefined, undefined, {
        threadId: "thread-1",
        runId: "run-1",
      })
    ).toThrowError("No assistant response found for this transcript.")
  })

  it("honors scripted before-start sleeps", async () => {
    const chat = createChat()
      .user("Hello")
      .sleep(50)
      .assistant(({ writer }) => {
        writer.text("Hey.", {
          mode: "instant",
        })
      })

    const initialMessages = chat.get(1)
    const transport = chat.transport({ delayMs: 0 })
    const startedAt = Date.now()
    const iterator = transport
      .connect(initialMessages, undefined, undefined, {
        threadId: "thread-1",
        runId: "run-1",
      })
      [Symbol.asyncIterator]()
    const first = await iterator.next()

    expect(Date.now() - startedAt).toBeGreaterThanOrEqual(35)
    expect(first.value).toMatchObject({
      type: "RUN_STARTED",
    })

    while (!(await iterator.next()).done) {
      // Drain the remaining chunks.
    }
  })
  it("streams hydrated assistant turns through connect", async () => {
    const source = createChat().user("Hello").assistant("Hey there.")
    const replay = createChat({ messages: source.get() })
    const initialMessages = replay.get(1)

    const chunks = await collectChunks(
      replay
        .transport({ delayMs: 0 })
        .connect(initialMessages, undefined, undefined, {
          threadId: "thread-1",
          runId: "run-1",
        })
    )

    expect(chunks[0]).toMatchObject({
      type: "RUN_STARTED",
      threadId: "thread-1",
      runId: "run-1",
    })
    expect(chunks.at(-1)).toMatchObject({
      type: "RUN_FINISHED",
    })
  })
  it("streams a fallback response when the script is exhausted", async () => {
    const chat = createChat().user("Hello").assistant("Hey.")
    const [unknownMessage] = createChat()
      .user("Something unscripted", { id: "unknown-1" })
      .get()

    const chunks = await collectChunks(
      chat
        .transport({ delayMs: 0, fallback: "This demo is scripted." })
        .connect([...chat.get(), unknownMessage], undefined, undefined, {
          threadId: "thread-1",
          runId: "run-1",
        })
    )

    expect(chunks.map((chunk) => chunk.type)).toContain("TEXT_MESSAGE_CONTENT")
    expect(
      chunks
        .filter((chunk) => chunk.type === "TEXT_MESSAGE_CONTENT")
        .map((chunk) => ("delta" in chunk ? chunk.delta : ""))
        .join("")
    ).toBe("This demo is scripted.")
    expect(chunks.at(-1)).toMatchObject({
      type: "RUN_FINISHED",
    })
  })
})
