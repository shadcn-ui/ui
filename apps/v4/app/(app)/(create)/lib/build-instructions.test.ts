import { describe, expect, it } from "vitest"

import { DEFAULT_CONFIG } from "@/registry/config"

import { buildInstructions } from "./build-instructions"

describe("buildInstructions Base Ripple setup", () => {
  it("includes the dependency, stylesheet, and persisted config when enabled", () => {
    const instructions = buildInstructions({
      ...DEFAULT_CONFIG,
      buttonFeedback: "ripple",
    })

    expect(instructions).toContain("- @base-ripple/react")
    expect(instructions).toContain('@import "@base-ripple/react/styles.css";')
    expect(instructions).toContain('"buttonFeedback": "ripple"')
  })

  it("leaves the standard setup unchanged when disabled", () => {
    const instructions = buildInstructions({
      ...DEFAULT_CONFIG,
      buttonFeedback: "press",
    })

    expect(instructions).not.toContain("@base-ripple/react")
    expect(instructions).toContain('"buttonFeedback": "press"')
  })
})
