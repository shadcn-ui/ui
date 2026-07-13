import { describe, expect, it } from "vitest"

import { createChat } from "./index"
import { readStream, weatherLoading, weatherOutput } from "./test-utils"
import type { DataParts, Tools } from "./test-utils"

describe("AI SDK transport", () => {
  it("chains tool output after an in-stream sleep", async () => {
    const chat = createChat<unknown, DataParts, Tools>()
      .user("Weather?")
      .assistant(({ writer }) => {
        writer
          .tool("getWeather", {
            input: {
              city: "San Francisco",
            },
          })
          .sleep(100)
          .output(weatherOutput)
      })

    const [userMessage] = chat.get(1)
    const stream = await chat.transport().sendMessages({
      trigger: "submit-message",
      chatId: "chat-1",
      messageId: undefined,
      messages: [userMessage],
      abortSignal: undefined,
    })
    const reader = stream.getReader()

    expect((await reader.read()).value?.type).toBe("start")
    expect((await reader.read()).value?.type).toBe("tool-input-available")

    const startedAt = Date.now()
    const outputChunk = await reader.read()

    expect(outputChunk.value?.type).toBe("tool-output-available")
    expect(Date.now() - startedAt).toBeGreaterThanOrEqual(75)
  })

  it("streams denied static tool parts", async () => {
    const chat = createChat<unknown, DataParts, Tools>()
      .user("Use the available tools.")
      .assistant([
        {
          type: "tool-getWeather",
          toolCallId: "call-weather",
          state: "output-denied",
          input: { city: "San Francisco" },
          approval: {
            id: "approval-weather",
            approved: false,
          },
        },
        {
          type: "dynamic-tool",
          toolName: "searchDocs",
          toolCallId: "call-docs",
          state: "output-denied",
          input: { query: "streaming" },
          approval: {
            id: "approval-docs",
            approved: false,
          },
        },
      ])
    const [userMessage] = chat.get(1)
    const stream = await chat.transport({ delayMs: 0 }).sendMessages({
      trigger: "submit-message",
      chatId: "chat-1",
      messageId: undefined,
      messages: [userMessage],
      abortSignal: undefined,
    })
    const chunks = await readStream(stream)

    expect(chunks.map((chunk) => chunk.type)).toEqual([
      "start",
      "tool-input-available",
      "tool-output-denied",
      "tool-input-available",
      "tool-output-denied",
      "finish",
    ])
  })

  it("streams the next scripted assistant response through the transport", async () => {
    const chat = createChat<unknown, DataParts, Tools>()
      .user("Hello")
      .assistant("Hey, how's it going?")
      .user("What's the weather?")
      .assistant(({ writer }) => {
        writer.reasoning("I need to call the weather tool.", {
          mode: "instant",
        })
        writer.data({
          type: "data-weather",
          id: "weather-1",
          data: weatherLoading,
        })

        const weather = writer.tool("getWeather", {
          input: {
            city: "San Francisco",
          },
        })

        weather.output(weatherOutput)
        writer.text("It's sunny.", {
          mode: "instant",
        })
      })

    const initialMessages = chat.get(2)
    const nextMessage = chat.next(initialMessages)

    if (!nextMessage) {
      throw new Error("Expected next message.")
    }

    const stream = await chat.transport().sendMessages({
      trigger: "submit-message",
      chatId: "chat-1",
      messageId: undefined,
      messages: [
        ...initialMessages,
        {
          id: nextMessage.id ?? "next-message",
          role: nextMessage.role ?? "user",
          metadata: nextMessage.metadata,
          parts: nextMessage.parts,
        },
      ],
      abortSignal: undefined,
    })
    const chunks = await readStream(stream)

    expect(chunks.map((chunk) => chunk.type)).toEqual([
      "start",
      "reasoning-start",
      "reasoning-delta",
      "reasoning-end",
      "data-weather",
      "tool-input-available",
      "tool-output-available",
      "text-start",
      "text-delta",
      "text-end",
      "finish",
    ])
    expect(chunks).toContainEqual(
      expect.objectContaining({
        type: "tool-output-available",
        output: {
          city: "San Francisco",
          temperature: 72,
          condition: "sunny",
        },
      })
    )
  })

  it("preserves streamed file filenames", async () => {
    const chat = createChat()
      .user("Send the report.")
      .assistant(({ writer }) => {
        writer.file({
          filename: "report.pdf",
          mediaType: "application/pdf",
          url: "https://example.com/report.pdf",
        })
      })

    const [userMessage] = chat.get(1)
    const stream = await chat.transport().sendMessages({
      trigger: "submit-message",
      chatId: "chat-1",
      messageId: undefined,
      messages: [userMessage],
      abortSignal: undefined,
    })
    const chunks = await readStream(stream)

    expect(chunks).toContainEqual(
      expect.objectContaining({
        type: "file",
        filename: "report.pdf",
        mediaType: "application/pdf",
        url: "https://example.com/report.pdf",
      })
    )
  })

  it("sleeps before the next scripted turn", async () => {
    const chat = createChat()
      .user("Hello")
      .sleep(100)
      .assistant(({ writer }) => {
        writer.text("Hey.", {
          mode: "instant",
        })
      })

    const [userMessage] = chat.get(1)
    const startedAt = Date.now()
    const stream = await chat.transport().sendMessages({
      trigger: "submit-message",
      chatId: "chat-1",
      messageId: undefined,
      messages: [userMessage],
      abortSignal: undefined,
    })
    const reader = stream.getReader()
    const firstChunk = await reader.read()

    if (firstChunk.done) {
      throw new Error("Expected first chunk.")
    }

    const chunks = [firstChunk.value]

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      chunks.push(value)
    }

    expect(firstChunk.value?.type).toBe("start")
    expect(Date.now() - startedAt).toBeGreaterThanOrEqual(75)
    expect(chunks.map((chunk) => chunk.type)).toEqual([
      "start",
      "text-start",
      "text-delta",
      "text-end",
      "finish",
    ])
  })

  it("emits a bare start chunk before assistant parts", async () => {
    const chat = createChat().user("Hello").assistant("Hey.")

    const [userMessage] = chat.get(1)
    const stream = await chat.transport().sendMessages({
      trigger: "submit-message",
      chatId: "chat-1",
      messageId: undefined,
      messages: [userMessage],
      abortSignal: undefined,
    })
    const reader = stream.getReader()
    const firstChunk = await reader.read()

    if (firstChunk.done) {
      throw new Error("Expected first chunk.")
    }

    expect(firstChunk.value).toEqual({
      type: "start",
    })

    const secondChunk = await reader.read()

    if (secondChunk.done) {
      throw new Error("Expected second chunk.")
    }

    expect(secondChunk.value?.type).toBe("text-start")
  })

  it("streams an app-level error before assistant content", async () => {
    const chat = createChat().user("Hello").error("Model unavailable.")

    const [userMessage] = chat.get(1)
    const stream = await chat.transport().sendMessages({
      trigger: "submit-message",
      chatId: "chat-1",
      messageId: undefined,
      messages: [userMessage],
      abortSignal: undefined,
    })
    const chunks = await readStream(stream)

    expect(chunks).toEqual([
      {
        type: "start",
      },
      {
        type: "error",
        errorText: "Model unavailable.",
      },
    ])
  })

  it("streams an app-level error after partial assistant content", async () => {
    const chat = createChat()
      .user("Hello")
      .assistant(({ writer }) => {
        writer.text("Partial answer.", {
          mode: "instant",
        })
        writer.error("Connection lost.")
      })

    const [userMessage] = chat.get(1)
    const stream = await chat.transport().sendMessages({
      trigger: "submit-message",
      chatId: "chat-1",
      messageId: undefined,
      messages: [userMessage],
      abortSignal: undefined,
    })
    const chunks = await readStream(stream)

    expect(chunks.map((chunk) => chunk.type)).toEqual([
      "start",
      "text-start",
      "text-delta",
      "text-end",
      "error",
    ])
    expect(chunks.at(-1)).toEqual({
      type: "error",
      errorText: "Connection lost.",
    })
  })

  it("emits an abort chunk when the request is aborted mid-stream", async () => {
    const chat = createChat()
      .user("Hello")
      .assistant(({ writer }) => {
        writer.text("First.", {
          mode: "instant",
        })
        writer.sleep(150)
        writer.text("Second.", {
          mode: "instant",
        })
      })

    const [userMessage] = chat.get(1)
    const controller = new AbortController()
    const stream = await chat.transport({ delayMs: 0 }).sendMessages({
      trigger: "submit-message",
      chatId: "chat-1",
      messageId: undefined,
      messages: [userMessage],
      abortSignal: controller.signal,
    })
    const reader = stream.getReader()
    const received: string[] = []

    while (received.at(-1) !== "text-end") {
      const { done, value } = await reader.read()

      if (done) {
        throw new Error("Expected more chunks before the abort.")
      }

      received.push(value.type)
    }

    controller.abort()

    const chunks = []

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      chunks.push(value)
    }

    expect(received).toEqual(["start", "text-start", "text-delta", "text-end"])
    expect(chunks.map((chunk) => chunk.type)).toEqual(["abort"])
  })

  it("throws when no scripted assistant response remains", async () => {
    const chat = createChat().user("Hello").assistant("Hey.")
    const messages = chat.get()

    await expect(
      chat.transport().sendMessages({
        trigger: "submit-message",
        chatId: "chat-1",
        messageId: undefined,
        messages,
        abortSignal: undefined,
      })
    ).rejects.toThrow("No assistant response found for this transcript.")
  })

  it("disables delta delays when delayMs is explicitly undefined", async () => {
    const chat = createChat()
      .user("Hello")
      .assistant("This reply has several streamed words.")

    const [userMessage] = chat.get(1)
    const startedAt = Date.now()
    const stream = await chat.transport({ delayMs: undefined }).sendMessages({
      trigger: "submit-message",
      chatId: "chat-1",
      messageId: undefined,
      messages: [userMessage],
      abortSignal: undefined,
    })
    const chunks = await readStream(stream)

    expect(Date.now() - startedAt).toBeLessThan(100)
    expect(
      chunks.filter((chunk) => chunk.type === "text-delta").length
    ).toBeGreaterThan(1)
  })
  it("streams hydrated assistant turns through the transport", async () => {
    const source = createChat<unknown, DataParts, Tools>()
      .user("What's the weather?")
      .assistant(({ writer }) => {
        writer
          .tool("getWeather", {
            input: { city: "San Francisco" },
          })
          .output(weatherOutput)
        writer.text("It's sunny.", { mode: "instant" })
      })

    const replay = createChat<unknown, DataParts, Tools>({
      messages: source.get(),
    })
    const [userMessage] = replay.get(1)
    const stream = await replay.transport({ delayMs: 0 }).sendMessages({
      trigger: "submit-message",
      chatId: "chat-1",
      messageId: undefined,
      messages: [userMessage],
      abortSignal: undefined,
    })
    const chunks = await readStream(stream)

    expect(chunks.map((chunk) => chunk.type)).toEqual([
      "start",
      "tool-input-available",
      "tool-output-available",
      "text-start",
      "text-delta",
      "text-end",
      "finish",
    ])
  })
  it("streams a string fallback when the script is exhausted", async () => {
    const chat = createChat().user("Hello").assistant("Hey.")
    const [unknownMessage] = createChat()
      .user("Something unscripted", { id: "unknown-1" })
      .get()
    const stream = await chat
      .transport({ delayMs: 0, fallback: "This demo is scripted." })
      .sendMessages({
        trigger: "submit-message",
        chatId: "chat-1",
        messageId: undefined,
        messages: [...chat.get(), unknownMessage],
        abortSignal: undefined,
      })
    const chunks = await readStream(stream)

    expect(chunks.map((chunk) => chunk.type)).toEqual([
      "start",
      "text-start",
      "text-delta",
      "text-delta",
      "text-delta",
      "text-delta",
      "text-end",
      "finish",
    ])
    expect(chunks).toContainEqual(
      expect.objectContaining({
        type: "text-delta",
        delta: "scripted.",
      })
    )
  })

  it("passes the transcript to a fallback writer callback", async () => {
    const chat = createChat().user("Hello").assistant("Hey.")
    const [unknownMessage] = createChat()
      .user("Something unscripted", { id: "unknown-1" })
      .get()
    const stream = await chat
      .transport({
        delayMs: 0,
        fallback: ({ writer, messages }) => {
          writer.text(`You sent ${messages.length} messages.`, {
            mode: "instant",
          })
        },
      })
      .sendMessages({
        trigger: "submit-message",
        chatId: "chat-1",
        messageId: undefined,
        messages: [...chat.get(), unknownMessage],
        abortSignal: undefined,
      })
    const chunks = await readStream(stream)

    expect(chunks).toContainEqual(
      expect.objectContaining({
        type: "text-delta",
        delta: "You sent 3 messages.",
      })
    )
  })

  it("prefers scripted turns over the fallback", async () => {
    const chat = createChat().user("Hello").assistant("Hey.", {
      id: "scripted-reply",
    })

    const [userMessage] = chat.get(1)
    const stream = await chat
      .transport({ delayMs: 0, fallback: "Should not stream." })
      .sendMessages({
        trigger: "submit-message",
        chatId: "chat-1",
        messageId: undefined,
        messages: [userMessage],
        abortSignal: undefined,
      })
    const chunks = await readStream(stream)

    expect(chunks).toContainEqual(
      expect.objectContaining({
        type: "text-delta",
        delta: "Hey.",
      })
    )
  })

  it("still throws without a fallback", async () => {
    const chat = createChat().user("Hello").assistant("Hey.")

    await expect(
      chat.transport().sendMessages({
        trigger: "submit-message",
        chatId: "chat-1",
        messageId: undefined,
        messages: chat.get(),
        abortSignal: undefined,
      })
    ).rejects.toThrow("No assistant response found for this transcript.")
  })
})
