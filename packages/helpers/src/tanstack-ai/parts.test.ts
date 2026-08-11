import { describe, expect, it } from "vitest"

import { createChat } from "./index"
import { createWeatherChat, weatherOutput } from "./test-utils"

describe("TanStack parts", () => {
  it("materializes writer events into TanStack message parts", () => {
    const chat = createWeatherChat()
    const [userMessage, assistantMessage] = chat.get()

    expect(userMessage).toMatchObject({
      id: "msg-1",
      role: "user",
      parts: [
        {
          type: "text",
          content: "What's the weather?",
        },
      ],
    })
    expect(assistantMessage.parts.map((part) => part.type)).toEqual([
      "thinking",
      "tool-call",
      "tool-result",
      "text",
    ])
    expect(assistantMessage.parts[1]).toMatchObject({
      type: "tool-call",
      id: "call-1",
      name: "getWeather",
      state: "complete",
      input: {
        city: "San Francisco",
      },
      output: weatherOutput,
    })
    expect(assistantMessage.parts[2]).toMatchObject({
      type: "tool-result",
      toolCallId: "call-1",
      state: "complete",
    })
  })
})

describe("TanStack approval parts", () => {
  it("materializes a needsApproval call with a pending approval", () => {
    const chat = createChat()
      .user("What's the weather?")
      .assistant(({ writer }) => {
        writer.tool("getWeather", {
          input: { city: "San Francisco" },
          needsApproval: true,
          output: weatherOutput,
        })
      })
    const [, assistantMessage] = chat.get()

    expect(assistantMessage.parts).toMatchObject([
      {
        type: "tool-call",
        id: "call-1",
        name: "getWeather",
        approval: { id: "approval-1", needsApproval: true },
      },
    ])
  })
})
