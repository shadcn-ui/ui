import { describe, expect, it } from "vitest"

import {
  createDesignSystemRawParamsUpdate,
  loadDesignSystemSearchParams,
} from "./search-params"

describe("createDesignSystemRawParamsUpdate", () => {
  it("preserves template params when encoding design system updates", () => {
    const params = loadDesignSystemSearchParams(
      new URLSearchParams("template=start")
    )

    const update = createDesignSystemRawParamsUpdate(params, {
      theme: "neutral",
    })

    expect(update).toMatchObject({
      preset: expect.any(String),
      template: "start",
    })
  })

  it("lets explicit template updates override the current template", () => {
    const params = loadDesignSystemSearchParams(
      new URLSearchParams("template=start")
    )

    const update = createDesignSystemRawParamsUpdate(params, {
      theme: "neutral",
      template: "vite",
    })

    expect(update.template).toBe("vite")
  })
})
