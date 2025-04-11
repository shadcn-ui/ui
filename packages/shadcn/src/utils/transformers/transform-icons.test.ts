import { type Config } from "@/src/utils/get-config"
import { transformIcons } from "@/src/utils/transformers/transform-icons"
import { describe, expect, test, vi } from "vitest"

import { transform } from "../transformers"

const testConfig: Config = {
  style: "new-york",
  tsx: true,
  rsc: true,
  tailwind: {
    baseColor: "neutral",
    cssVariables: true,
    config: "tailwind.config.ts",
    css: "tailwind.css",
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
  },
  resolvedPaths: {
    cwd: "/",
    components: "/components",
    utils: "/lib/utils",
    ui: "/ui",
    lib: "/lib",
    hooks: "/hooks",
    tailwindConfig: "tailwind.config.ts",
    tailwindCss: "tailwind.css",
  },
}

vi.mock("@/src/registry/api", () => ({
  getRegistryIcons: () => ({
    Check: {
      lucide: "Check",
      radix: "CheckIcon",
    },
    ChevronDown: {
      lucide: "ChevronDown",
      radix: "ChevronDownIcon",
    },
    ChevronLeft: {
      lucide: "ChevronLeft",
      radix: "ChevronLeftIcon",
    },
  }),
}))

describe("transformIcons", () => {
  test("transforms radix icons", async () => {
    expect(
      await transform(
        {
          filename: "test.ts",
          raw: `import * as React from "react"
import { Check } from "lucide-react"

export function Component() {
return <div><Check /></div>
}
  `,
          config: {
            ...testConfig,
            iconLibrary: "radix",
          },
        },
        [transformIcons]
      )
    ).toMatchInlineSnapshot(`
      "import * as React from "react"
      import { CheckIcon } from "@radix-ui/react-icons"

      export function Component() {
      return <div><CheckIcon /></div>
      }
        "
    `)
  })

  test("does not transform lucide icons", async () => {
    expect(
      await transform(
        {
          filename: "test.ts",
          raw: `import * as React from "react"
import { Check } from "lucide-react"

export function Component() {
  return <div><Check /></div>
}
    `,
          config: {
            ...testConfig,
            iconLibrary: "lucide",
          },
        },
        [transformIcons]
      )
    ).toMatchInlineSnapshot(`
    "import * as React from "react"
    import { Check } from "lucide-react"

    export function Component() {
      return <div><Check /></div>
    }
        "
    `)
  })

  test("preserves semicolon", async () => {
    expect(
      await transform(
        {
          filename: "test.ts",
          raw: `import * as React from "react";
import { ChevronDown } from "lucide-react";

export function Component() {
  return <div><ChevronDown /></div>
}
    `,
          config: {
            ...testConfig,
            iconLibrary: "radix",
          },
        },
        [transformIcons]
      )
    ).toMatchInlineSnapshot(`
      "import * as React from "react";
      import { ChevronDownIcon } from "@radix-ui/react-icons";

      export function Component() {
        return <div><ChevronDownIcon /></div>
      }
          "
    `)
  })
})
