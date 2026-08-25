import type { UIMessage } from "ai"
import { describe, expect, expectTypeOf, it } from "vitest"

import { testChatContract } from "../test/chat-contract"
import { createChat } from "./index"
import { getMessageText } from "./parts"
import {
  artifact,
  weatherLoading,
  weatherOutput,
  weatherSuccess,
} from "./test-utils"
import type { DataParts, Tools } from "./test-utils"

testChatContract("AI SDK", () =>
  createChat().user("One").assistant("A").user("Two").assistant("B")
)

describe("AI SDK chat", () => {
  it("preserves the native message type through get and next", () => {
    type Metadata = { model: string }

    const chat = createChat<Metadata, DataParts, Tools>()
      .user("Weather?", { metadata: { model: "test" } })
      .assistant("Sunny.", { metadata: { model: "test" } })
    const messages = chat.get()
    const next = chat.next([])

    expectTypeOf(messages).toEqualTypeOf<
      Array<UIMessage<Metadata, DataParts, Tools>>
    >()
    expectTypeOf(next).toEqualTypeOf<UIMessage<
      Metadata,
      DataParts,
      Tools
    > | null>()
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

    const messages = chat.get(2)
    const [, assistantMessage] = messages
    const nextMessage = chat.next(messages)

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

    const initialMessages = chat.get(2)
    const nextMessage = chat.next(initialMessages)

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

  it("does not mutate playback when next is called again", () => {
    const chat = createChat()
      .user("Hello")
      .assistant("Hey.")
      .user("What's the weather?")
      .assistant("It's sunny.")
      .user("What time is it?")
      .assistant("It is noon.")

    const initialMessages = chat.get(2)
    const first = chat.next(initialMessages)
    const second = chat.next(initialMessages)

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
          text: "What's the weather?",
        },
      ],
    })
  })

  it("finds the next user message from a transcript", () => {
    const chat = createChat()
      .user("Hello")
      .assistant("Hey.")
      .user("What's the weather?")
      .assistant("It's sunny.")

    const [firstMessage] = chat.get(1)
    const nextMessage = chat.next([firstMessage])

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

  it("produces identical transcripts for identical scripts", () => {
    function script() {
      return createChat<unknown, DataParts, Tools>()
        .user("Hello")
        .assistant(({ writer }) => {
          writer.reasoning("Checking the forecast.")
          writer
            .tool("getWeather", {
              input: {
                city: "San Francisco",
              },
            })
            .output(weatherOutput)
          writer.text("It's sunny.")
        })
    }

    const first = script()
    const second = script()

    expect(first.get()).toEqual(second.get())
    expect(first.get().map((message) => message.id)).toEqual(["msg-1", "msg-2"])
  })

  it("materializes user text parts without a streaming state", () => {
    const chat = createChat().user("Hello").assistant("Hey.")

    const [userMessage, assistantMessage] = chat.get()

    expect(userMessage.parts[0]).toEqual({
      type: "text",
      text: "Hello",
    })
    expect(assistantMessage.parts[0]).toMatchObject({
      type: "text",
      state: "done",
    })
  })

  it("hydrates a chat from an existing transcript", () => {
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
      .user("Thanks!")
      .assistant("Anytime.")
    const recorded = source.get()

    const replay = createChat({ messages: recorded })

    expect(replay.get(2)).toEqual(recorded.slice(0, 2))
    expect(replay.next(recorded.slice(0, 2))).toMatchObject({
      id: recorded[2].id,
      role: "user",
    })
    expect(replay.get()).toEqual(recorded)
  })
  it("continues generated ids past the seeded range", () => {
    const source = createChat().user("Hello").assistant("Hey.")
    const replay = createChat({ messages: source.get() }).user("What's next?")

    const messages = replay.get()

    expect(messages.map((message) => message.id)).toEqual([
      "msg-1",
      "msg-2",
      "msg-3",
    ])
  })
})
