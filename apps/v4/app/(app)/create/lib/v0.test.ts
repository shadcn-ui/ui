import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { DEFAULT_CONFIG } from "@/registry/config"
import { buildV0Payload } from "@/app/(app)/create/lib/v0"

vi.mock("shadcn/schema", async () => {
  return await vi.importActual("shadcn/schema")
})

vi.mock("shadcn/utils", async () => {
  const actual = (await vi.importActual("shadcn/utils")) as {
    transformFont: unknown
  }

  return {
    transformFont: actual.transformFont,
    transformIcons: async ({ sourceFile }: { sourceFile: unknown }) =>
      sourceFile,
    transformMenu: async ({ sourceFile }: { sourceFile: unknown }) =>
      sourceFile,
    transformRender: async ({ sourceFile }: { sourceFile: unknown }) =>
      sourceFile,
  }
})

vi.mock("@/registry/bases/__index__", () => ({
  Index: {
    base: {
      card: {
        name: "card",
        type: "registry:ui",
      },
    },
    radix: {
      card: {
        name: "card",
        type: "registry:ui",
      },
    },
  },
}))

describe("buildV0Payload", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = "http://example.test"

    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string | URL | Request) => {
        const url =
          typeof input === "string"
            ? input
            : input instanceof URL
              ? input.toString()
              : input.url
        const name = url.split("/").pop()?.replace(".json", "") ?? "component"

        return new Response(
          JSON.stringify({
            name,
            type: "registry:ui",
            files: [
              {
                path: `registry/base-force-ui/ui/${name}.tsx`,
                type: "registry:ui",
                content: `import * as React from "react"\n\nexport function Component() {\n  return <div className="cn-font-heading text-xl" />\n}\n`,
              },
            ],
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      })
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    delete process.env.NEXT_PUBLIC_APP_URL
  })

  it("rewrites cn-font-heading to font-heading when heading inherits the body font", async () => {
    const payload = await buildV0Payload({
      ...DEFAULT_CONFIG,
      item: undefined,
      fontHeading: "inherit",
    })

    const cardFile = payload.files?.find(
      (file) => file.target === "components/ui/card.tsx"
    )

    expect(cardFile?.content).toContain("font-heading")
    expect(cardFile?.content).not.toContain("cn-font-heading")
  })

  it("rewrites cn-font-heading to font-heading when a distinct heading font is selected", async () => {
    const payload = await buildV0Payload({
      ...DEFAULT_CONFIG,
      item: undefined,
      fontHeading: "playfair-display",
    })

    const cardFile = payload.files?.find(
      (file) => file.target === "components/ui/card.tsx"
    )

    expect(cardFile?.content).toContain("font-heading")
    expect(cardFile?.content).not.toContain("cn-font-heading")
  })
})
