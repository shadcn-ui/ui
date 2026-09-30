import { describe, expect, it } from "vitest"

import { lowerEvents } from "./lower"
import { chunkSteps } from "./test-utils"
import type { TestData, TestTools } from "./test-utils"
import { splitTextDeltas } from "./utils"

describe("lowerEvents", () => {
  it("places before-start sleeps ahead of the start chunk", () => {
    const steps = lowerEvents(
      [
        { kind: "sleep", delayMs: 100, phase: "before-start" },
        {
          kind: "text",
          id: "text-1",
          text: "Hi",
          options: { mode: "instant" },
        },
      ],
      { delayMs: 0 }
    )

    expect(chunkSteps(steps)).toEqual([
      "sleep",
      "start",
      "text-start",
      "text-delta",
      "text-end",
      "finish",
      "close",
    ])
  })

  it("keeps later sleeps after the start chunk", () => {
    const steps = lowerEvents(
      [
        { kind: "step-start" },
        { kind: "sleep", delayMs: 100, phase: "after-start" },
      ],
      { delayMs: 0 }
    )

    expect(chunkSteps(steps)).toEqual([
      "start",
      "start-step",
      "sleep",
      "finish",
      "close",
    ])
  })

  it("omits delta sleeps when delayMs is undefined", () => {
    const steps = lowerEvents(
      [{ kind: "text", id: "text-1", text: "Hello there world" }],
      { delayMs: undefined }
    )

    expect(chunkSteps(steps)).toEqual([
      "start",
      "text-start",
      "text-delta",
      "text-delta",
      "text-delta",
      "text-end",
      "finish",
      "close",
    ])
  })

  it("splits streamed text into word deltas with sleeps", () => {
    const steps = lowerEvents(
      [{ kind: "text", id: "text-1", text: "Hello there world" }],
      { delayMs: 25 }
    )

    expect(chunkSteps(steps)).toEqual([
      "start",
      "text-start",
      "sleep",
      "text-delta",
      "sleep",
      "text-delta",
      "sleep",
      "text-delta",
      "text-end",
      "finish",
      "close",
    ])
    expect(
      steps.flatMap((step) =>
        step.kind === "chunk" && step.chunk.type === "text-delta"
          ? [step.chunk.delta]
          : []
      )
    ).toEqual(splitTextDeltas("Hello there world"))
  })

  it("emits a single delta in instant mode and none of the word sleeps when delay is zero", () => {
    const steps = lowerEvents(
      [
        {
          kind: "reasoning",
          id: "reasoning-1",
          text: "Thinking about it",
          options: { mode: "instant" },
        },
      ],
      { delayMs: 0 }
    )

    expect(chunkSteps(steps)).toEqual([
      "start",
      "reasoning-start",
      "reasoning-delta",
      "reasoning-end",
      "finish",
      "close",
    ])
  })

  it("honors per-event delay overrides", () => {
    const steps = lowerEvents(
      [
        {
          kind: "text",
          id: "text-1",
          text: "Hi",
          options: { mode: "instant", delayMs: 10 },
        },
      ],
      { delayMs: 0 }
    )

    expect(chunkSteps(steps)).toEqual([
      "start",
      "text-start",
      "sleep",
      "text-delta",
      "text-end",
      "finish",
      "close",
    ])
  })

  it("closes after an error chunk without a finish", () => {
    const steps = lowerEvents(
      [
        {
          kind: "text",
          id: "text-1",
          text: "Hi",
          options: { mode: "instant" },
        },
        { kind: "error", errorText: "Boom." },
        { kind: "step-start" },
      ],
      { delayMs: 0 }
    )

    expect(chunkSteps(steps)).toEqual([
      "start",
      "text-start",
      "text-delta",
      "text-end",
      "error",
      "close",
    ])
  })

  it("carries message metadata on the finish chunk", () => {
    const steps = lowerEvents([], {
      delayMs: 0,
      messageMetadata: { model: "gpt-5" },
    })
    const finish = steps.find(
      (step) => step.kind === "chunk" && step.chunk.type === "finish"
    )

    expect(finish).toMatchObject({
      chunk: {
        type: "finish",
        finishReason: "stop",
        messageMetadata: { model: "gpt-5" },
      },
    })
  })

  it("maps tool events to tool chunks", () => {
    const steps = lowerEvents<unknown, TestData, TestTools>(
      [
        {
          kind: "tool-input",
          name: "getWeather",
          toolCallId: "call-1",
          input: { city: "SF" },
        },
        {
          kind: "tool-output",
          toolCallId: "call-1",
          output: { temperature: 72 },
        },
        { kind: "tool-error", toolCallId: "call-1", errorText: "Down." },
        { kind: "tool-denied", toolCallId: "call-1" },
      ],
      { delayMs: 0 }
    )

    expect(chunkSteps(steps)).toEqual([
      "start",
      "tool-input-available",
      "tool-output-available",
      "tool-output-error",
      "tool-output-denied",
      "finish",
      "close",
    ])
  })
})
