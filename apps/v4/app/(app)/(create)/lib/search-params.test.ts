import { describe, expect, it } from "vitest"

import { DEFAULT_CONFIG } from "@/registry/config"

import { buildPresetUrlUpdate } from "./search-params"

describe("buildPresetUrlUpdate", () => {
  it("encodes design system params into preset and clears individual keys", () => {
    const update = buildPresetUrlUpdate({
      ...DEFAULT_CONFIG,
      preset: "b0",
      template: "next",
      item: "preview-02",
      size: 100,
      custom: false,
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
      buttonFeedback: "soft-ripple",
      item: "preview-02",
      size: 100,
      custom: false,
    })

    expect(update.template).toBe("start")
    expect(update.buttonFeedback).toBe("soft-ripple")
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
      },
      { template: "vite", buttonFeedback: "ripple" }
    )

    expect(update.template).toBe("vite")
    expect(update.buttonFeedback).toBe("ripple")
  })
})
