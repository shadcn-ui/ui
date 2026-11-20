import { describe, expect, it } from "vitest"

import { resolveButtonFeedback } from "./button-feedback"

describe("resolveButtonFeedback", () => {
  it("returns a configured feedback value", () => {
    expect(resolveButtonFeedback({ buttonFeedback: "soft-ripple" })).toBe(
      "soft-ripple"
    )
  })

  it("returns undefined when feedback is not configured", () => {
    expect(resolveButtonFeedback({})).toBeUndefined()
    expect(resolveButtonFeedback({ buttonFeedback: "invalid" })).toBeUndefined()
  })
})
