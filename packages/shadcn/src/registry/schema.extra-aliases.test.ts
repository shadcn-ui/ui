import { rawConfigSchema } from "@/src/schema"
import { describe, expect, it } from "vitest"

describe("rawConfigSchema aliases supports extra keys", () => {
  it("accepts additional alias keys beyond the known ones", () => {
    const result = rawConfigSchema.safeParse({
      style: "new-york",
      tsx: true,
      rsc: false,
      tailwind: {
        css: "tailwind.css",
        baseColor: "slate",
        cssVariables: true,
        prefix: "",
      },
      aliases: {
        components: "@/components",
        utils: "@/lib/utils",
        payload: "@acme/payload",
      },
    })
    expect(result.success).toBe(true)
  })
})
