import { describe, expect, it } from "vitest"

import { streamMessageParts, yieldMessageParts } from "./chat"
import { createChat } from "./index"
import { getToolCalls } from "./parts"
import {
  artifact,
  weatherLoading,
  weatherOutput,
  weatherSuccess,
} from "./test-utils"
import type { DataParts, TestMessage, Tools } from "./test-utils"

describe("AI SDK parts", () => {
  it("creates typed messages with explicit parts", () => {
    const [message] = createChat<TestMessage>()
      .assistant(({ writer }) => {
        writer.text("Here is the forecast.")
        writer.data({
          type: "data-weather",
          id: "weather-1",
          data: weatherSuccess,
        })
        writer.tool("getWeather", {
          toolCallId: "call-weather",
          input: {
            city: "San Francisco",
          },
          output: weatherOutput,
        })
      })
      .get()

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

  it("creates rich messages with the fluent writer", () => {
    const [message] = createChat<TestMessage>()
      .assistant(
        ({ writer }) => {
          writer.stepStart()
          writer.reasoning("I should call a tool first.")
          writer.tool("createFile", {
            input: {
              filename: "answer.md",
              content: "Done.",
            },
            output: {
              filename: "answer.md",
              url: "https://example.com/answer.md",
            },
          })
          writer.data({
            type: "data-artifact",
            data: artifact,
          })
          writer.text("The file is ready.")
        },
        {
          id: "assistant-1",
        }
      )
      .get()

    expect(message.id).toBe("assistant-1")
    expect(message.parts.map((part) => part.type)).toEqual([
      "step-start",
      "reasoning",
      "tool-createFile",
      "data-artifact",
      "text",
    ])
  })

  it("yields message snapshots as parts become available", () => {
    const [message] = createChat()
      .assistant(
        ({ writer }) => {
          writer.reasoning("Checking context.")
          writer.text("Done.")
        },
        {
          id: "assistant-1",
        }
      )
      .get()

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
    const [message] = createChat()
      .assistant(({ writer }) => {
        writer.text("First.")
        writer.text("Second.")
      })
      .get()
    const snapshots = []

    for await (const snapshot of streamMessageParts(message)) {
      snapshots.push(snapshot)
    }

    expect(snapshots.map((snapshot) => snapshot.parts.length)).toEqual([1, 2])
  })

  it("materializes all writer part variants", () => {
    const [message] = createChat<TestMessage>()
      .assistant(
        ({ writer }) => {
          writer.stepStart()
          writer.reasoning("I will gather context before answering.")
          writer.sourceUrl({
            sourceId: "source-ai-sdk",
            title: "AI SDK",
            url: "https://ai-sdk.dev",
          })
          writer.file({
            filename: "receipt.png",
            mediaType: "image/png",
            url: "https://example.com/receipt.png",
          })
          writer.data({
            type: "data-weather",
            id: "weather-1",
            data: weatherLoading,
          })
          writer.tool("getWeather", {
            title: "Get weather",
            input: { city: "San Francisco" },
            output: weatherOutput,
          })
          writer.data({
            type: "data-weather",
            id: "weather-1",
            data: weatherSuccess,
          })
          writer.data({
            type: "data-artifact",
            data: artifact,
          })
          writer.text("The weather is sunny and the artifact is ready.")
        },
        {
          id: "sample-all-parts",
        }
      )
      .get()

    expect(message.id).toBe("sample-all-parts")
    expect(message.parts.map((part) => part.type)).toEqual([
      "step-start",
      "reasoning",
      "source-url",
      "file",
      "data-weather",
      "tool-getWeather",
      "data-artifact",
      "text",
    ])
    expect(message.parts).toContainEqual(
      expect.objectContaining({
        type: "data-weather",
        id: "weather-1",
        data: weatherSuccess,
      })
    )
  })
})

describe("AI SDK approval parts", () => {
  function createApprovalMessage() {
    const [, assistantMessage] = createChat<TestMessage>()
      .user("Fetch the weather?")
      .assistant(({ writer }) => {
        writer.tool("getWeather", {
          input: { city: "San Francisco" },
          needsApproval: true,
          output: weatherOutput,
        })
      })
      .get(2)

    return assistantMessage
  }

  it("materializes a needsApproval call as an approval-requested part", () => {
    expect(createApprovalMessage().parts).toMatchObject([
      {
        type: "tool-getWeather",
        toolCallId: "call-1",
        state: "approval-requested",
        input: { city: "San Francisco" },
        approval: { id: "approval-1" },
      },
    ])
  })

  it("summarizes tool calls with their approval state", () => {
    const message = createApprovalMessage()
    const respondedMessage = {
      ...message,
      parts: message.parts.map((part) =>
        part.type === "tool-getWeather"
          ? ({
              ...part,
              state: "approval-responded",
              approval: { id: "approval-1", approved: true },
            } as (typeof message.parts)[number])
          : part
      ),
    }

    expect(getToolCalls(respondedMessage)).toMatchObject([
      {
        toolCallId: "call-1",
        name: "getWeather",
        state: "approval-responded",
        input: { city: "San Francisco" },
        approval: { id: "approval-1", approved: true },
      },
    ])
  })

  it("hydrates approval-requested parts back into approval events", () => {
    const chat = createChat<TestMessage>({
      messages: [createApprovalMessage()],
    })
    const [message] = chat.get(1)

    expect(message.parts).toMatchObject([
      {
        type: "tool-getWeather",
        state: "approval-requested",
        approval: { id: "approval-1" },
      },
    ])
  })
})
