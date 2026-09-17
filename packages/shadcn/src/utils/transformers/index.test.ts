import { describe, expect, test } from "vitest"

import { transform } from "."
import { createConfig } from "../get-config"

const testConfig = createConfig({
  tailwind: {
    baseColor: "neutral",
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
  },
})

describe("transform", () => {
  test("preserves leading comments", async () => {
    const result = await transform({
      filename: "test.ts",
      raw: `/**
 * Important documentation
 */
export const example = true
`,
      config: testConfig,
    })

    expect(result).toContain(`/**
 * Important documentation
 */`)
    expect(result).toContain("export const example = true")
  })
})
