import { describe, expect, it } from "vitest"

import { createChatIds } from "./ids"
import { createChatPayloads, createMetadataFactory } from "./payloads"

describe("createChatPayloads", () => {
  it("creates default file payloads with overrides", () => {
    const payloads = createChatPayloads(createChatIds())

    expect(payloads.file()).toMatchObject({
      mediaType: "image/png",
      filename: "receipt.png",
      url: "https://example.com/receipt.png",
    })
    expect(payloads.file({ filename: "report.pdf" })).toMatchObject({
      filename: "report.pdf",
      mediaType: "image/png",
    })
  })

  it("assigns sequential source ids", () => {
    const payloads = createChatPayloads(createChatIds())

    expect(payloads.sourceUrl().sourceId).toBe("source-1")
    expect(payloads.sourceDocument().sourceId).toBe("source-2")
    expect(payloads.sourceUrl({ sourceId: "fixed" }).sourceId).toBe("fixed")
  })

  it("reserves explicit source ids and detaches nested metadata", () => {
    const payloads = createChatPayloads(createChatIds())
    const providerMetadata = { nested: { source: "original" } }
    const source = payloads.sourceUrl({
      sourceId: "source-2",
      providerMetadata,
    })

    providerMetadata.nested.source = "mutated"

    expect(payloads.sourceUrl().sourceId).toBe("source-3")
    expect(source.providerMetadata).toEqual({
      nested: { source: "original" },
    })
  })

  it("creates custom payloads with a default kind", () => {
    const payloads = createChatPayloads(createChatIds())

    expect(payloads.custom()).toEqual({ kind: "test.output" })
    expect(payloads.custom("app.widget")).toEqual({ kind: "app.widget" })
  })
})

describe("createMetadataFactory", () => {
  it("stamps a deterministic createdAt", () => {
    const metadata = createMetadataFactory()

    expect(metadata()).toEqual({
      createdAt: "2026-01-01T00:00:00.000Z",
    })
  })

  it("accepts a custom now and overrides", () => {
    const metadata = createMetadataFactory<{
      createdAt: string
      model: string
    }>("2025-06-15T12:00:00.000Z")

    expect(metadata({ model: "gpt-5" })).toEqual({
      createdAt: "2025-06-15T12:00:00.000Z",
      model: "gpt-5",
    })
  })
})
