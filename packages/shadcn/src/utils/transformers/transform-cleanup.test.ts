import { describe, expect, test } from "vitest"

import { transform } from "."
import { createConfig } from "../get-config"
import { transformCleanup } from "./transform-cleanup"

const testConfig = createConfig({
  tailwind: {
    baseColor: "neutral",
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
  },
})

describe("transformCleanup", () => {
  test("removes cn-rtl-flip marker from className string", async () => {
    const result = await transform(
      {
        filename: "test.tsx",
        raw: `import * as React from "react"
export function Component() {
  return <div className="cn-rtl-flip size-4" />
}`,
        config: testConfig,
      },
      [transformCleanup]
    )

    expect(result).toContain('className="size-4"')
    expect(result).not.toContain("cn-rtl-flip")
  })

  test("removes cn-rtl-flip marker from cn() call", async () => {
    const result = await transform(
      {
        filename: "test.tsx",
        raw: `import * as React from "react"
export function Component({ className }) {
  return <div className={cn("cn-rtl-flip size-4", className)} />
}`,
        config: testConfig,
      },
      [transformCleanup]
    )

    expect(result).toContain('cn("size-4", className)')
    expect(result).not.toContain("cn-rtl-flip")
  })

  test("removes multiple cn-* markers", async () => {
    const result = await transform(
      {
        filename: "test.tsx",
        raw: `import * as React from "react"
export function Component() {
  return <div className="cn-rtl-flip cn-logical-sides size-4" />
}`,
        config: testConfig,
      },
      [transformCleanup]
    )

    expect(result).toContain('className="size-4"')
    expect(result).not.toContain("cn-rtl-flip")
    expect(result).not.toContain("cn-logical-sides")
  })

  test("removes cn-* markers from cva base classes", async () => {
    const result = await transform(
      {
        filename: "test.tsx",
        raw: `import { cva } from "class-variance-authority"
const buttonVariants = cva("cn-rtl-flip size-4", {})`,
        config: testConfig,
      },
      [transformCleanup]
    )

    expect(result).toContain('cva("size-4"')
    expect(result).not.toContain("cn-rtl-flip")
  })

  test("removes cn-* markers from cva variants", async () => {
    const result = await transform(
      {
        filename: "test.tsx",
        raw: `import { cva } from "class-variance-authority"
const buttonVariants = cva("base", {
  variants: {
    direction: {
      left: "cn-rtl-flip rotate-180",
      right: "cn-rtl-flip",
    },
  },
})`,
        config: testConfig,
      },
      [transformCleanup]
    )

    expect(result).toContain('"rotate-180"')
    expect(result).not.toContain("cn-rtl-flip")
  })

  test("removes cn-* markers from mergeProps className", async () => {
    const result = await transform(
      {
        filename: "test.tsx",
        raw: `import * as React from "react"
export function Component() {
  return mergeProps(
    {
      className: cn("cn-rtl-flip size-4"),
    },
    props
  )
}`,
        config: testConfig,
      },
      [transformCleanup]
    )

    expect(result).toContain('cn("size-4")')
    expect(result).not.toContain("cn-rtl-flip")
  })

  test("removes className attribute when only cn-* marker", async () => {
    const result = await transform(
      {
        filename: "test.tsx",
        raw: `import * as React from "react"
export function Component() {
  return <div className="cn-rtl-flip" />
}`,
        config: testConfig,
      },
      [transformCleanup]
    )

    // The className attribute should be removed entirely, not left empty.
    expect(result).not.toContain("className")
    expect(result).not.toContain("cn-rtl-flip")
    expect(result).toContain("<div />")
  })

  test("preserves non-marker classes", async () => {
    const result = await transform(
      {
        filename: "test.tsx",
        raw: `import * as React from "react"
export function Component() {
  return <div className="flex items-center gap-2 cn-rtl-flip text-sm" />
}`,
        config: testConfig,
      },
      [transformCleanup]
    )

    expect(result).toContain("flex")
    expect(result).toContain("items-center")
    expect(result).toContain("gap-2")
    expect(result).toContain("text-sm")
    expect(result).not.toContain("cn-rtl-flip")
  })

  test("does not affect classes that contain cn but are not markers", async () => {
    const result = await transform(
      {
        filename: "test.tsx",
        raw: `import * as React from "react"
export function Component() {
  return <div className="icon-placeholder size-4" />
}`,
        config: testConfig,
      },
      [transformCleanup]
    )

    expect(result).toContain("icon-placeholder")
    expect(result).toContain("size-4")
  })
})
