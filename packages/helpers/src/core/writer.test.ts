import { describe, expect, it } from "vitest"

import { createChatIds } from "./ids"
import { createChatPayloads } from "./payloads"
import type { TestData, TestTools } from "./test-utils"
import type { ChatEvent } from "./types"
import { DEFAULT_REASONING, DEFAULT_TEXT } from "./utils"
import { createEventWriter } from "./writer"

describe("createEventWriter", () => {
  function createWriterContext() {
    const ids = createChatIds()

    return { ids, payloads: createChatPayloads(ids) }
  }

  it("records text and reasoning events with generated part ids", () => {
    const events: ChatEvent<TestData, TestTools>[] = []
    const writer = createEventWriter(events, createWriterContext())

    writer.text().reasoning()

    expect(events).toMatchObject([
      {
        kind: "text",
        id: "text-1",
        text: DEFAULT_TEXT,
      },
      {
        kind: "reasoning",
        id: "reasoning-2",
        text: DEFAULT_REASONING,
      },
    ])
  })

  it("respects explicit stream text ids", () => {
    const events: ChatEvent<TestData, TestTools>[] = []
    const writer = createEventWriter(events, createWriterContext())

    writer.text("Hello", { id: "greeting" })

    expect(events[0]).toMatchObject({
      kind: "text",
      id: "greeting",
    })
  })

  it("records sleeps as after-start events", () => {
    const events: ChatEvent<TestData, TestTools>[] = []

    createEventWriter(events, createWriterContext()).sleep(100)

    expect(events).toEqual([
      {
        kind: "sleep",
        delayMs: 100,
        phase: "after-start",
      },
    ])
  })

  it("extracts data part names", () => {
    const events: ChatEvent<TestData, TestTools>[] = []

    createEventWriter(events, createWriterContext()).data({
      type: "data-weather",
      id: "weather-1",
      data: { city: "SF", status: "loading" },
      transient: true,
    })

    expect(events[0]).toMatchObject({
      kind: "data",
      name: "weather",
      id: "weather-1",
      transient: true,
    })
  })

  it("chains tool events through the handle", () => {
    const events: ChatEvent<TestData, TestTools>[] = []
    const writer = createEventWriter(events, createWriterContext())

    writer
      .tool("getWeather", { input: { city: "SF" } })
      .sleep(50)
      .output({ temperature: 72 })

    expect(events.map((event) => event.kind)).toEqual([
      "tool-input",
      "sleep",
      "tool-output",
    ])
    expect(events[0]).toMatchObject({
      kind: "tool-input",
      name: "getWeather",
      toolCallId: "call-1",
      input: { city: "SF" },
    })
    expect(events[2]).toMatchObject({
      kind: "tool-output",
      toolCallId: "call-1",
      output: { temperature: 72 },
    })
  })

  it("reserves explicit tool ids and detaches tool values", () => {
    const events: ChatEvent<TestData, TestTools>[] = []
    const context = createWriterContext()
    const input = { city: "SF" }
    const output = { temperature: 72 }
    const writer = createEventWriter(events, context)

    writer.tool("getWeather", { toolCallId: "call-2", input }).output(output)
    writer.tool("getWeather", { input: { city: "NYC" } })

    input.city = "mutated"
    output.temperature = 0

    expect(events).toMatchObject([
      { toolCallId: "call-2", input: { city: "SF" } },
      { toolCallId: "call-2", output: { temperature: 72 } },
      { toolCallId: "call-3" },
    ])
  })

  it("types tool inputs and outputs", () => {
    const events: ChatEvent<TestData, TestTools>[] = []
    const writer = createEventWriter(events, createWriterContext())

    if (false) {
      writer.tool("getWeather", {
        // @ts-expect-error getWeather input requires a string city.
        input: { city: 72 },
      })
      writer.tool("getWeather", {
        // @ts-expect-error getWeather output requires a numeric temperature.
        output: { temperature: "warm" },
      })
    }

    expect(events).toEqual([])
  })

  it("emits tool output and error from writer options", () => {
    const events: ChatEvent<TestData, TestTools>[] = []
    const writer = createEventWriter(events, createWriterContext())

    writer.tool("getWeather", {
      input: { city: "SF" },
      output: { temperature: 72 },
    })
    writer.tool("getWeather", {
      input: { city: "SF" },
      errorText: "Service down.",
    })

    expect(events.map((event) => event.kind)).toEqual([
      "tool-input",
      "tool-output",
      "tool-input",
      "tool-error",
    ])
  })

  it("records denied tool calls and defaults tool input to an empty object", () => {
    const events: ChatEvent<TestData, TestTools>[] = []
    const writer = createEventWriter(events, createWriterContext())

    writer.tool("getWeather").denied()

    expect(events).toMatchObject([
      {
        kind: "tool-input",
        input: {},
      },
      {
        kind: "tool-denied",
        toolCallId: "call-1",
      },
    ])
  })

  it("records payload-backed events", () => {
    const events: ChatEvent<TestData, TestTools>[] = []
    const writer = createEventWriter(events, createWriterContext())

    writer
      .sourceUrl()
      .sourceDocument()
      .file({ filename: "notes.txt" })
      .reasoningFile()
      .custom("app.widget")
      .stepStart()
      .error()

    expect(events.map((event) => event.kind)).toEqual([
      "source-url",
      "source-document",
      "file",
      "reasoning-file",
      "custom",
      "step-start",
      "error",
    ])
    expect(events[0]).toMatchObject({
      part: { sourceId: "source-1" },
    })
    expect(events[2]).toMatchObject({
      part: { filename: "notes.txt" },
    })
  })
})
