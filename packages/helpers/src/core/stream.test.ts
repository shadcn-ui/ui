import { describe, expect, it } from "vitest"

import { lowerEvents } from "./lower"
import { createTurnStream } from "./stream"
import { readStream } from "./test-utils"

describe("createTurnStream", () => {
  it("plays chunks through the encoder in order", async () => {
    const steps = lowerEvents(
      [
        {
          kind: "text",
          id: "text-1",
          text: "Hi",
          options: { mode: "instant" },
        },
      ],
      { delayMs: 0 }
    )
    const chunks = await readStream(
      createTurnStream(steps, (chunk) => ({ encoded: chunk.type }))
    )

    expect(chunks).toEqual([
      { encoded: "start" },
      { encoded: "text-start" },
      { encoded: "text-delta" },
      { encoded: "text-end" },
      { encoded: "finish" },
    ])
  })

  it("skips chunks when the encoder returns null and expands arrays", async () => {
    const steps = lowerEvents(
      [
        {
          kind: "text",
          id: "text-1",
          text: "Hi",
          options: { mode: "instant" },
        },
      ],
      { delayMs: 0 }
    )
    const chunks = await readStream(
      createTurnStream(steps, (chunk) => {
        if (chunk.type === "finish") {
          return null
        }

        if (chunk.type === "text-delta") {
          return [chunk.type, chunk.type]
        }

        return chunk.type
      })
    )

    expect(chunks).toEqual([
      "start",
      "text-start",
      "text-delta",
      "text-delta",
      "text-end",
    ])
  })

  it("waits for sleep steps", async () => {
    const steps = lowerEvents(
      [
        { kind: "sleep", delayMs: 60, phase: "before-start" },
        {
          kind: "text",
          id: "text-1",
          text: "Hi",
          options: { mode: "instant" },
        },
      ],
      { delayMs: 0 }
    )
    const startedAt = Date.now()
    const chunks = await readStream(
      createTurnStream(steps, (chunk) => chunk.type)
    )

    expect(Date.now() - startedAt).toBeGreaterThanOrEqual(40)
    expect(chunks[0]).toBe("start")
  })

  it("closes silently when aborted during before-start sleeps", async () => {
    const steps = lowerEvents(
      [{ kind: "sleep", delayMs: 500, phase: "before-start" }],
      {
        delayMs: 0,
      }
    )
    const controller = new AbortController()
    const startedAt = Date.now()
    const streamPromise = readStream(
      createTurnStream(steps, (chunk) => chunk.type, controller.signal)
    )

    setTimeout(() => controller.abort(), 10)

    expect(await streamPromise).toEqual([])
    expect(Date.now() - startedAt).toBeLessThan(250)
  })

  it("closes without chunks when the signal is already aborted", async () => {
    const steps = lowerEvents(
      [
        {
          kind: "text",
          id: "text-1",
          text: "Hi",
          options: { mode: "instant" },
        },
      ],
      { delayMs: 0 }
    )
    const controller = new AbortController()

    controller.abort()

    const chunks = await readStream(
      createTurnStream(steps, (chunk) => chunk.type, controller.signal)
    )

    expect(chunks).toEqual([])
  })

  it("stops encoding after the consumer cancels the stream", async () => {
    const encoded: string[] = []
    const stream = createTurnStream(
      [
        { kind: "chunk", chunk: { type: "start" } },
        { kind: "sleep", delayMs: 30 },
        { kind: "chunk", chunk: { type: "text-start", id: "text-1" } },
        { kind: "chunk", chunk: { type: "text-end", id: "text-1" } },
        { kind: "close" },
      ],
      (chunk) => {
        encoded.push(chunk.type)

        return chunk.type
      }
    )
    const reader = stream.getReader()

    expect((await reader.read()).value).toBe("start")

    await reader.cancel()
    await new Promise((resolve) => setTimeout(resolve, 60))

    expect(encoded).toEqual(["start"])
  })

  it("emits an abort chunk when aborted mid-stream", async () => {
    const steps = lowerEvents(
      [
        { kind: "sleep", delayMs: 500, phase: "after-start" },
        {
          kind: "text",
          id: "text-1",
          text: "Hi",
          options: { mode: "instant" },
        },
      ],
      { delayMs: 0 }
    )
    const controller = new AbortController()
    const startedAt = Date.now()
    const streamPromise = readStream(
      createTurnStream(steps, (chunk) => chunk.type, controller.signal)
    )

    setTimeout(() => controller.abort(), 10)

    expect(await streamPromise).toEqual(["start", "abort"])
    expect(Date.now() - startedAt).toBeLessThan(250)
  })
})
