import { describe, expect, test } from "vitest"

import { transform } from "."
import { createConfig } from "../get-config"
import { transformImport } from "./transform-import"

describe("transformImport", () => {
  describe("subpath imports in source files", () => {
    const testConfig = createConfig({
      aliases: {
        components: "@/components",
        ui: "@/components/ui",
        utils: "@/lib/utils",
        lib: "@/lib",
        hooks: "@/hooks",
      },
    })

    test.each([
      ["#/registry/new-york/ui/button", "@/components/ui/button"],
      ["#registry/new-york/ui/button", "@/components/ui/button"],
      ["#/registry/new-york/hooks/use-hook", "@/hooks/use-hook"],
      ["#/registry/new-york/lib/helper", "@/lib/helper"],
      ["#/registry/new-york/components/card", "@/components/card"],
      ["#/lib/foo", "@/lib/foo"],
      ["#/lib/utils", "@/lib/utils"],
      ["#lib/utils", "@/lib/utils"],
      ["#lib/foo", "@/lib/foo"],
      ["#hooks/use-hook", "@/hooks/use-hook"],
      ["react", "react"],
    ])("%s → %s", async (input, expected) => {
      const result = await transform(
        {
          filename: "test.tsx",
          raw: `import x from "${input}"`,
          config: testConfig,
        },
        [transformImport]
      )

      expect(result).toContain(`"${expected}"`)
    })
  })

  describe("user config with # aliases", () => {
    const hashConfig = createConfig({
      aliases: {
        components: "#/src/components",
        ui: "#/src/components/ui",
        utils: "#/src/utils",
        lib: "#/src/lib",
        hooks: "#/src/hooks",
      },
    })

    test.each([
      ["@/registry/new-york/ui/button", "#/src/components/ui/button"],
      ["@/registry/new-york/hooks/use-hook", "#/src/hooks/use-hook"],
      ["@/registry/new-york/components/card", "#/src/components/card"],
      ["@/config/foo", "#/config/foo"],
      ["#/registry/new-york/ui/button", "#/src/components/ui/button"],
      ["#registry/new-york/ui/button", "#/src/components/ui/button"],
    ])("%s → %s", async (input, expected) => {
      const result = await transform(
        {
          filename: "test.tsx",
          raw: `import x from "${input}"`,
          config: hashConfig,
        },
        [transformImport]
      )

      expect(result).toContain(`"${expected}"`)
    })

    // cn import requires named import to trigger utils alias rewrite.
    test("@/lib/utils (cn) → #/src/utils", async () => {
      const result = await transform(
        {
          filename: "test.tsx",
          raw: `import { cn } from "@/lib/utils"`,
          config: hashConfig,
        },
        [transformImport]
      )

      expect(result).toContain(`"#/src/utils"`)
    })
  })
})
