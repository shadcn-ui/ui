import { describe, expect, it } from "vitest"

import {
  createAiMessageFaker,
  createChat,
  getMessageText,
  streamMessageParts,
  yieldMessageParts,
} from "./ai"

type DataParts = {
  weather: {
    city: string
    status: "loading" | "success" | "error"
    temperature?: number
    condition?: string
  }
  artifact: {
    id: string
    title: string
    kind: "code" | "document" | "image"
    status: "draft" | "streaming" | "complete"
  }
}

type Tools = {
  getWeather: {
    input: {
      city: string
    }
    output: {
      city: string
      temperature: number
      condition: string
    }
  }
  createFile: {
    input: {
      filename: string
      content: string
    }
    output: {
      filename: string
      url: string
    }
  }
}

const weatherLoading: DataParts["weather"] = {
  city: "San Francisco",
  status: "loading",
}

const weatherSuccess: DataParts["weather"] = {
  city: "San Francisco",
  status: "success",
  temperature: 72,
  condition: "sunny",
}

const weatherOutput: Tools["getWeather"]["output"] = {
  city: "San Francisco",
  temperature: 72,
  condition: "sunny",
}

const artifact: DataParts["artifact"] = {
  id: "artifact-1",
  title: "CitedAnswer.jsx",
  kind: "code",
  status: "complete",
}

async function readStream<T>(stream: ReadableStream<T>) {
  const chunks = []
  const reader = stream.getReader()

  while (true) {
    const { done, value } = await reader.read()

    if (done) {
      break
    }

    chunks.push(value)
  }

  return chunks
}

describe("createAiMessageFaker", () => {
  it("creates typed messages with explicit parts", () => {
    const faker = createAiMessageFaker<unknown, DataParts, Tools>()

    const message = faker.assistant([
      faker.parts.text("Here is the forecast."),
      faker.parts.data({
        type: "data-weather",
        id: "weather-1",
        data: weatherSuccess,
      }),
      faker.parts.tool("getWeather", {
        toolCallId: "call-weather",
        input: {
          city: "San Francisco",
        },
        output: weatherOutput,
      }),
    ])

    expect(message).toMatchObject({
      id: "msg-1",
      role: "assistant",
      parts: [
        {
          type: "text",
          text: "Here is the forecast.",
        },
        {
          type: "data-weather",
          id: "weather-1",
          data: {
            city: "San Francisco",
            status: "success",
          },
        },
        {
          type: "tool-getWeather",
          toolCallId: "call-weather",
          state: "output-available",
        },
      ],
    })
  })

  it("keeps repeated data part ids for reconciliation scenarios", () => {
    const faker = createAiMessageFaker<unknown, DataParts, Tools>()

    const updates = faker.parts.dataUpdates(
      "weather",
      [
        weatherLoading,
        {
          ...weatherSuccess,
          temperature: 70,
          condition: "cloudy",
        },
      ],
      {
        id: "weather-1",
      }
    )

    expect(updates).toHaveLength(2)
    expect(updates.map((part) => part.id)).toEqual(["weather-1", "weather-1"])
    expect(updates[0]).toMatchObject({
      type: "data-weather",
      data: {
        status: "loading",
      },
    })
    expect(updates[1]).toMatchObject({
      type: "data-weather",
      data: {
        status: "success",
        condition: "cloudy",
      },
    })
  })

  it("supports fluent message building", () => {
    const faker = createAiMessageFaker<unknown, DataParts, Tools>()

    const message = faker
      .builder("assistant", {
        id: "assistant-1",
      })
      .stepStart()
      .reasoning("I should call a tool first.")
      .tool("createFile", {
        input: {
          filename: "answer.md",
          content: "Done.",
        },
        output: {
          filename: "answer.md",
          url: "https://example.com/answer.md",
        },
      })
      .data({
        type: "data-artifact",
        data: artifact,
      })
      .text("The file is ready.")
      .build()

    expect(message.id).toBe("assistant-1")
    expect(message.parts.map((part) => part.type)).toEqual([
      "step-start",
      "reasoning",
      "tool-createFile",
      "data-artifact",
      "text",
    ])
  })

  it("supports the messageBuilder alias", () => {
    const faker = createAiMessageFaker()

    const message = faker.messageBuilder("assistant").text("Done.").build()

    expect(message.parts).toMatchObject([
      {
        type: "text",
        text: "Done.",
      },
    ])
  })

  it("yields message snapshots as parts become available", () => {
    const faker = createAiMessageFaker()
    const message = faker
      .builder("assistant")
      .reasoning("Checking context.")
      .text("Done.")
      .build({
        id: "assistant-1",
      })

    const snapshots = Array.from(
      yieldMessageParts(message, {
        includeEmpty: true,
      })
    )

    expect(snapshots.map((snapshot) => snapshot.parts.length)).toEqual([
      0, 1, 2,
    ])
    expect(message.parts).toHaveLength(2)
  })

  it("streams message snapshots with the async generator", async () => {
    const faker = createAiMessageFaker()
    const message = faker
      .builder("assistant")
      .text("First.")
      .text("Second.")
      .build()

    const snapshots = []

    for await (const snapshot of streamMessageParts(message)) {
      snapshots.push(snapshot)
    }

    expect(snapshots.map((snapshot) => snapshot.parts.length)).toEqual([1, 2])
  })

  it("creates an all-parts message from explicit data", () => {
    const faker = createAiMessageFaker<unknown, DataParts, Tools>()
    const message = faker
      .builder("assistant")
      .stepStart()
      .reasoning("I will gather context before answering.")
      .sourceUrl({
        sourceId: "source-ai-sdk",
        title: "AI SDK",
        url: "https://ai-sdk.dev",
      })
      .file({
        filename: "receipt.png",
        mediaType: "image/png",
        url: "https://example.com/receipt.png",
      })
      .data({
        type: "data-weather",
        id: "weather-1",
        data: weatherLoading,
      })
      .tool("getWeather", {
        title: "Get weather",
        input: { city: "San Francisco" },
        output: weatherOutput,
      })
      .data({
        type: "data-weather",
        id: "weather-1",
        data: weatherSuccess,
      })
      .data({
        type: "data-artifact",
        data: artifact,
      })
      .text("The weather is sunny and the artifact is ready.")
      .build({
        id: "sample-all-parts",
      })

    expect(message.id).toBe("sample-all-parts")
    expect(message.parts.map((part) => part.type)).toEqual([
      "step-start",
      "reasoning",
      "source-url",
      "file",
      "data-weather",
      "tool-getWeather",
      "data-weather",
      "data-artifact",
      "text",
    ])
  })

  it("creates chat fixture user messages with attachments", () => {
    const chat = createChat().user("Analyze this PDF and summarize it.", {
      files: [
        {
          filename: "report.pdf",
          mediaType: "application/pdf",
          url: "https://example.com/report.pdf",
        },
      ],
    })

    const [message] = chat.get()

    expect(message).toMatchObject({
      role: "user",
      parts: [
        {
          type: "text",
          text: "Analyze this PDF and summarize it.",
        },
        {
          type: "file",
          filename: "report.pdf",
          mediaType: "application/pdf",
          url: "https://example.com/report.pdf",
        },
      ],
    })
  })

  it("creates a default chat fixture with createChat", () => {
    const chat = createChat().user("Hello").assistant("Hey.")

    expect(chat.get().map((message) => message.role)).toEqual([
      "user",
      "assistant",
    ])
  })

  it("gets text from chat fixture messages", () => {
    const chat = createChat()
      .user("Hello")
      .assistant(({ writer }) => {
        writer.reasoning("Reasoning should not be included.")
        writer.text("Hey, ")
        writer.text("how's it going?")
      })
      .user("What's next?")

    const messages = chat.get({ count: 2 })
    const [, assistantMessage] = messages
    const nextMessage = chat.next()

    expect(messages.map(getMessageText).join("\n")).toBe(
      "Hello\nHey, how's it going?"
    )
    expect(getMessageText(assistantMessage)).toBe("Hey, how's it going?")
    expect(nextMessage ? getMessageText(nextMessage) : "").toBe("What's next?")
  })

  it("supports assistant ids and metadata in chat fixtures", () => {
    const chat = createChat<{ model: string }>()
      .user("Hello")
      .assistant("Hey.", {
        id: "assistant-1",
        metadata: {
          model: "gpt-5",
        },
      })

    const [, assistantMessage] = chat.get()

    expect(assistantMessage).toMatchObject({
      id: "assistant-1",
      role: "assistant",
      metadata: {
        model: "gpt-5",
      },
    })
  })

  it("creates arbitrary data and tool parts with createChat", () => {
    const chat = createChat().assistant(({ writer }) => {
      writer.data({
        type: "data-invoice",
        id: "invoice-1",
        data: {
          id: "inv-1",
          status: "paid",
        },
      })

      writer
        .tool("lookupInvoice", {
          input: {
            id: "inv-1",
          },
        })
        .output({
          id: "inv-1",
          total: 128,
        })
    })

    const [message] = chat.get()

    expect(message.parts).toMatchObject([
      {
        type: "data-invoice",
        id: "invoice-1",
        data: {
          status: "paid",
        },
      },
      {
        type: "tool-lookupInvoice",
        state: "output-available",
        input: {
          id: "inv-1",
        },
        output: {
          total: 128,
        },
      },
    ])
  })

  it("returns top messages and then the next scripted message", () => {
    const chat = createChat()
      .user("Hello")
      .assistant("Hey, how's it going?")
      .user("What's the weather?")
      .assistant("It's sunny.")

    const initialMessages = chat.get({ count: 2 })
    const nextMessage = chat.next()

    expect(initialMessages.map((message) => message.role)).toEqual([
      "user",
      "assistant",
    ])
    expect(nextMessage).toMatchObject({
      role: "user",
      parts: [
        {
          type: "text",
          text: "What's the weather?",
        },
      ],
    })
  })

  it("does not rewind the next user message when get is called again", () => {
    const chat = createChat()
      .user("Hello")
      .assistant("Hey.")
      .user("What's the weather?")
      .assistant("It's sunny.")
      .user("What time is it?")
      .assistant("It is noon.")

    chat.get({ count: 2 })
    const first = chat.next()
    chat.get({ count: 2 })
    const second = chat.next()

    expect(first).toMatchObject({
      role: "user",
      parts: [
        {
          type: "text",
          text: "What's the weather?",
        },
      ],
    })
    expect(second).toMatchObject({
      role: "user",
      parts: [
        {
          type: "text",
          text: "What time is it?",
        },
      ],
    })
  })

  it("finds the next user message from a transcript without moving the cursor", () => {
    const chat = createChat()
      .user("Hello")
      .assistant("Hey.")
      .user("What's the weather?")
      .assistant("It's sunny.")

    const [firstMessage] = chat.get({ count: 1 })
    const nextFromTranscript = chat.next({
      after: [firstMessage],
    })
    const nextFromCursor = chat.next()

    expect(nextFromTranscript).toMatchObject({
      role: "user",
      parts: [
        {
          type: "text",
          text: "What's the weather?",
        },
      ],
    })
    expect(nextFromCursor).toMatchObject({
      role: "user",
      parts: [
        {
          type: "text",
          text: "What's the weather?",
        },
      ],
    })
  })

  it("materializes assistant writer parts into the final chat transcript", () => {
    const chat = createChat<unknown, DataParts, Tools>().assistant(
      ({ writer }) => {
        writer.reasoning("I need to call the weather tool.")
        writer.data({
          type: "data-weather",
          id: "weather-1",
          data: weatherLoading,
        })

        const weather = writer.tool("getWeather", {
          title: "Checking weather",
          input: {
            city: "San Francisco",
          },
        })

        writer.sleep(100)

        weather.output(weatherOutput)

        writer.data({
          type: "data-weather",
          id: "weather-1",
          data: weatherSuccess,
        })
        writer.text("It's sunny and 72 degrees in San Francisco.")
      }
    )

    const [message] = chat.get()

    expect(message.parts.map((part) => part.type)).toEqual([
      "reasoning",
      "data-weather",
      "tool-getWeather",
      "text",
    ])
    expect(message.parts[1]).toMatchObject({
      type: "data-weather",
      id: "weather-1",
      data: {
        status: "success",
      },
    })
    expect(message.parts[2]).toMatchObject({
      type: "tool-getWeather",
      state: "output-available",
      output: {
        condition: "sunny",
      },
    })
  })

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

    const [userMessage] = chat.get({ count: 1 })
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

  it("streams the next scripted assistant response through the fake transport", async () => {
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

    const initialMessages = chat.get({ count: 2 })
    const nextMessage = chat.next()

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

  it("streams chat-level data before the next assistant response", async () => {
    const chat = createChat<unknown, DataParts, Tools>()
      .user("What's the weather?")
      .data({
        type: "data-weather",
        id: "weather-1",
        data: weatherLoading,
      })
      .assistant(({ writer }) => {
        writer.text("I'll check that for you.", {
          mode: "instant",
        })
      })

    const [, assistantMessage] = chat.get()

    expect(assistantMessage.parts[0]).toMatchObject({
      type: "data-weather",
      id: "weather-1",
      data: {
        status: "loading",
      },
    })

    const [userMessage] = chat.get({ count: 1 })
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
      "data-weather",
      "text-start",
      "text-delta",
      "text-end",
      "finish",
    ])
    expect(chunks[1]).toMatchObject({
      type: "data-weather",
      id: "weather-1",
      data: {
        status: "loading",
      },
    })
  })

  it("returns scripted chat-level data with timeline order", () => {
    const chat = createChat<unknown, DataParts, Tools>()
      .user("Can't make it.")
      .data({
        type: "data-weather",
        id: "weather-1",
        data: weatherLoading,
        transient: true,
      })
      .user("What should we do instead?")
      .data({
        type: "data-artifact",
        id: "artifact-1",
        data: artifact,
      })
      .assistant("I'll adjust the plan.")

    expect(chat.getData({ count: 1 })).toMatchObject([
      {
        type: "data-weather",
        id: "weather-1",
        transient: true,
        data: {
          status: "loading",
        },
        order: 0.5,
      },
    ])
    expect(chat.getData()).toMatchObject([
      {
        type: "data-weather",
        order: 0.5,
      },
      {
        type: "data-artifact",
        order: 1.5,
      },
    ])
  })

  it("returns scripted chat-level data with sleep delays", () => {
    const chat = createChat<unknown, DataParts, Tools>()
      .user("Hello.")
      .sleep(100)
      .data({
        type: "data-weather",
        id: "weather-1",
        data: weatherLoading,
        transient: true,
      })
      .sleep(200)
      .data({
        type: "data-artifact",
        id: "artifact-1",
        data: artifact,
        transient: true,
      })
      .user("What changed?")

    expect(chat.getData({ count: 1 })).toMatchObject([
      {
        type: "data-weather",
        order: 0.5,
        delayMs: 100,
      },
      {
        type: "data-artifact",
        order: 0.5,
        delayMs: 300,
      },
    ])
  })

  it("streams transient chat-level data without adding it to message parts", async () => {
    const chat = createChat<unknown, DataParts, Tools>()
      .user("What's the weather?")
      .data({
        type: "data-weather",
        id: "weather-1",
        data: weatherLoading,
        transient: true,
      })
      .assistant(({ writer }) => {
        writer.text("I'll check that for you.", {
          mode: "instant",
        })
      })

    const [, assistantMessage] = chat.get()

    expect(assistantMessage.parts.map((part) => part.type)).toEqual(["text"])

    const [userMessage] = chat.get({ count: 1 })
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
      "data-weather",
      "text-start",
      "text-delta",
      "text-end",
      "finish",
    ])
    expect(chunks[1]).toMatchObject({
      type: "data-weather",
      id: "weather-1",
      transient: true,
      data: {
        status: "loading",
      },
    })
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

    const [userMessage] = chat.get({ count: 1 })
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

  it("does not replay consumed chat-level data across scripted user turns", async () => {
    const chat = createChat<unknown, DataParts, Tools>()
      .user("Can't make it.")
      .data({
        type: "data-weather",
        id: "weather-1",
        data: weatherLoading,
        transient: true,
      })
      .user("What should we do instead?")
      .assistant(({ writer }) => {
        writer.text("I'll adjust the plan.", {
          mode: "instant",
        })
      })

    const initialMessages = chat.get({ count: 1 })
    const nextMessage = chat.next({ after: initialMessages })

    expect(chat.getData({ count: 1 })).toMatchObject([
      {
        type: "data-weather",
        id: "weather-1",
        transient: true,
        order: 0.5,
      },
    ])

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
      "text-start",
      "text-delta",
      "text-end",
      "finish",
    ])
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

    const [userMessage] = chat.get({ count: 1 })
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

    const [userMessage] = chat.get({ count: 1 })
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

    const [userMessage] = chat.get({ count: 1 })
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

    const [userMessage] = chat.get({ count: 1 })
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
})
