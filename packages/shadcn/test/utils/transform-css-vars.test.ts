import { expect, test } from "vitest"

import { transform } from "../../src/utils/transformers"
import stone from "../fixtures/colors/stone.json"

test("transform css vars preserves non-className strings", async () => {
  const result = await transform({
    filename: "test.ts",
    raw: `import * as React from "react"
export function Foo({ items }: { items: string[] }) {
	return <div className="bg-background text-primary-foreground">{items.join(' ')}</div>
}`,
    config: {
      tsx: true,
      tailwind: {
        baseColor: "stone",
        cssVariables: false,
      },
      aliases: {
        components: "@/components",
        utils: "@/lib/utils",
      },
    },
    baseColor: stone,
  })
  // Non-className strings like join(' ') should be preserved.
  expect(result).toContain("join(' ')")
  // className strings should still be transformed.
  expect(result).not.toContain("bg-background")
  expect(result).toContain("bg-white")
})

test("transform css vars", async () => {
  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as React from "react"
export function Foo() {
	return <div className="bg-background hover:bg-muted text-primary-foreground sm:focus:text-accent-foreground">foo</div>
}"
    `,
      config: {
        tsx: true,
        tailwind: {
          baseColor: "stone",
          cssVariables: true,
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      },
      baseColor: stone,
    })
  ).toMatchSnapshot()

  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as React from "react"
export function Foo() {
	return <div className="bg-background hover:bg-muted text-primary-foreground sm:focus:text-accent-foreground">foo</div>
}"
    `,
      config: {
        tsx: true,
        tailwind: {
          baseColor: "stone",
          cssVariables: false,
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      },
      baseColor: stone,
    })
  ).toMatchSnapshot()

  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as React from "react"
export function Foo() {
	return <div className={cn("bg-background hover:bg-muted", true && "text-primary-foreground sm:focus:text-accent-foreground")}>foo</div>
}"
    `,
      config: {
        tsx: true,
        tailwind: {
          baseColor: "stone",
          cssVariables: false,
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      },
      baseColor: stone,
    })
  ).toMatchSnapshot()

  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as React from "react"
export function Foo() {
	return <div className={cn("bg-background border border-input")}>foo</div>
}"
    `,
      config: {
        tsx: true,
        tailwind: {
          baseColor: "stone",
          cssVariables: false,
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      },
      baseColor: stone,
    })
  ).toMatchSnapshot()
})
