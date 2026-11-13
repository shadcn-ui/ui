import { mergeConfig } from "@/src/merge-config"
import { describe, expect, it } from "vitest"

describe("mergeConfig", () => {
  it("merges nested settings and concatenates arrays in input order", () => {
    const base = {
      theme: {
        colors: { primary: "blue", secondary: "gray" },
        fontFamily: { sans: ["Inter", "sans-serif"] },
      },
    }
    const override = {
      theme: {
        colors: { primary: "green" },
        fontFamily: { sans: ["Inter", "system-ui"] },
      },
    }

    const merged = mergeConfig(base, override)

    expect(merged).toEqual({
      theme: {
        colors: { primary: "green", secondary: "gray" },
        fontFamily: { sans: ["Inter", "sans-serif", "Inter", "system-ui"] },
      },
    })
    expect(merged.theme.colors).not.toBe(base.theme.colors)
    expect(merged.theme.fontFamily.sans).not.toBe(
      override.theme.fontFamily.sans
    )
  })

  it("replaces arrays when requested and keeps sibling settings", () => {
    const base = {
      servers: { app: { command: "node", args: ["old"], enabled: true } },
    }
    const override = {
      servers: { app: { args: [], enabled: false } },
    }

    expect(mergeConfig(base, override, { replaceArrays: true })).toEqual({
      servers: { app: { command: "node", args: [], enabled: false } },
    })
  })

  it("takes the override when a setting changes value type", () => {
    expect(
      mergeConfig(
        { fontFamily: ["Inter"], content: { files: ["./src/**/*.tsx"] } },
        { fontFamily: { sans: ["Geist"] }, content: ["./app/**/*.tsx"] }
      )
    ).toEqual({
      fontFamily: { sans: ["Geist"] },
      content: ["./app/**/*.tsx"],
    })
  })
})
