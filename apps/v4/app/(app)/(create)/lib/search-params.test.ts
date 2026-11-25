import { decodePreset } from "shadcn/preset"
import { describe, expect, it } from "vitest"

import { DEFAULT_CONFIG } from "@/registry/config"

import {
  buildPresetUrlUpdate,
  loadDesignSystemSearchParams,
  resolvePresetParams,
} from "./search-params"

function resolveUrl(query: string) {
  const searchParams = new URLSearchParams(query)
  return resolvePresetParams(
    loadDesignSystemSearchParams(searchParams),
    searchParams
  )
}

describe("buildPresetUrlUpdate", () => {
  it("encodes design system params into preset and clears individual keys", () => {
    const update = buildPresetUrlUpdate({
      ...DEFAULT_CONFIG,
      preset: "b0",
      template: "next",
      item: "preview-02",
      size: 100,
      custom: false,
      primary: null,
    })

    expect(update.preset).toBeTypeOf("string")
    expect(update.style).toBeNull()
    expect(update.theme).toBeNull()
    expect(update.baseColor).toBeNull()
  })

  it("preserves template when syncing preset from ?template=start", () => {
    const update = buildPresetUrlUpdate({
      ...DEFAULT_CONFIG,
      preset: "b0",
      template: "start",
      item: "preview-02",
      size: 100,
      custom: false,
      primary: null,
    })

    expect(update.template).toBe("start")
    expect(update.preset).toBeTypeOf("string")
  })

  it("applies non-design-system updates from resolvedUpdates", () => {
    const update = buildPresetUrlUpdate(
      {
        ...DEFAULT_CONFIG,
        preset: "b0",
        template: "next",
        item: "preview-02",
        size: 100,
        custom: false,
        primary: null,
      },
      { template: "vite" }
    )

    expect(update.template).toBe("vite")
  })

  it("keeps the custom primary when a design system param changes", () => {
    const update = buildPresetUrlUpdate(
      {
        ...DEFAULT_CONFIG,
        preset: "b0",
        template: "next",
        item: "preview-02",
        size: 100,
        custom: false,
        primary: "7c3aed",
      },
      { font: "geist" }
    )

    expect(decodePreset(update.preset as string)?.primary).toBe("7c3aed")
  })

  it("encodes the custom primary into a 'c' preset code", () => {
    const update = buildPresetUrlUpdate({
      ...DEFAULT_CONFIG,
      preset: "b0",
      template: "next",
      item: "preview-02",
      size: 100,
      custom: false,
      primary: "7c3aed",
    })

    expect(update.preset).toMatch(/^c/)
    expect(update.primary).toBeNull()
  })

  it("returns to a 'b' preset code when the custom primary is removed", () => {
    const update = buildPresetUrlUpdate({
      ...DEFAULT_CONFIG,
      preset: "c0Y9zJ0",
      template: "next",
      item: "preview-02",
      size: 100,
      custom: false,
      primary: null,
    })

    expect(update.preset).toMatch(/^b/)
  })
})

describe("resolvePresetParams", () => {
  it("reads the custom primary from a 'c' preset code", () => {
    expect(resolveUrl("preset=c0Y9zJ0").primary).toBe("7c3aed")
  })

  it("has no custom primary for a plain 'b' preset code", () => {
    expect(resolveUrl("preset=b0").primary).toBeNull()
  })
})
