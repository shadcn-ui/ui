import type { UIMessage } from "@tanstack/ai-client"
import type { ClientTool } from "@tanstack/ai/client"
import { describe, expect, expectTypeOf, it } from "vitest"

import { testChatContract } from "../test/chat-contract"
import { createChat } from "./index"
import { weatherOutput } from "./test-utils"

type TestSchema<T> = {
  readonly "~standard": {
    readonly version: 1
    readonly vendor: "test"
    readonly types: {
      readonly input: T
      readonly output: T
    }
    readonly jsonSchema: {
      readonly input: () => Record<string, unknown>
      readonly output: () => Record<string, unknown>
    }
  }
}

type WeatherTools = readonly [
  ClientTool<
    TestSchema<{ city: string }>,
    TestSchema<typeof weatherOutput>,
    "getWeather"
  >,
]

testChatContract("TanStack AI", () =>
  createChat().user("One").assistant("A").user("Two").assistant("B")
)

describe("TanStack chat", () => {
  it("returns native messages and exposes only supported writer operations", () => {
    const chat = createChat<WeatherTools, { summary: string }>().assistant(
      ({ writer }) => {
        writer
          .tool("getWeather", { input: { city: "San Francisco" } })
          .output(weatherOutput)

        if (false) {
          // @ts-expect-error TanStack's AG-UI transport has no data-part equivalent.
          writer.data({ type: "data-weather", data: {} })
          // @ts-expect-error TanStack's AG-UI transport has no source-part equivalent.
          writer.sourceUrl()
          // @ts-expect-error Only tools declared in the client tool tuple are accepted.
          writer.tool("missing")
          writer.tool("getWeather", {
            // @ts-expect-error The declared input requires a string city.
            input: { city: 72 },
          })
          // @ts-expect-error TanStack messages do not preserve text part IDs.
          writer.text("Hello", { id: "text-1" })
          writer.tool("getWeather", {
            // @ts-expect-error TanStack messages do not preserve neutral tool titles.
            title: "Weather",
          })
        }
      }
    )
    const messages = chat.get()

    expectTypeOf(messages).toEqualTypeOf<
      Array<UIMessage<WeatherTools, { summary: string }>>
    >()
    expect(messages[0].parts[0]).toMatchObject({
      type: "tool-call",
      name: "getWeather",
    })

    if (false) {
      // @ts-expect-error TanStack AI does not expose source parts.
      createChat({ sourceIdPrefix: "source" })
    }
  })

  it("hydrates a chat from an existing transcript", () => {
    const source = createChat()
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

    expect(replay.get()).toEqual(recorded)
    expect(replay.next(recorded.slice(0, 2))).toMatchObject({
      id: recorded[2].id,
      role: "user",
    })
  })
})
