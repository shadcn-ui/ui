import type { Config } from "@/src/utils/get-config"
import { describe, expect, it } from "vitest"

import { transform } from "."
import baseColor from "../../../test/fixtures/colors/slate.json"
import stone from "../../../test/fixtures/colors/stone.json"
import { applyColorMapping, splitClassName } from "./transform-css-vars"

describe("split className", () => {
  it.each([
    {
      input: "bg-popover",
      output: [null, "bg-popover", null],
    },
    {
      input: "bg-popover/50",
      output: [null, "bg-popover", "50"],
    },
    {
      input: "hover:bg-popover/50",
      output: ["hover", "bg-popover", "50"],
    },
    {
      input: "hover:bg-popover",
      output: ["hover", "bg-popover", null],
    },
    {
      input: "[&_[cmdk-group-heading]]:px-2",
      output: ["[&_[cmdk-group-heading]]", "px-2", null],
    },
    {
      input: "[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0",
      output: ["[&_[cmdk-group]:not([hidden])_~[cmdk-group]]", "pt-0", null],
    },
    {
      input: "[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:bg-red-200",
      output: [
        "[&_[cmdk-group]:not([hidden])_~[cmdk-group]]",
        "bg-red-200",
        null,
      ],
    },
    {
      input: "sm:focus:text-accent-foreground/30",
      output: ["sm:focus", "text-accent-foreground", "30"],
    },
  ])(`splitClassName($input) -> $output`, ({ input, output }) => {
    expect(splitClassName(input)).toStrictEqual(output)
  })
})

describe("apply color mapping", async () => {
  it.each([
    {
      input: "bg-background text-foreground",
      output: "bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50",
    },
    {
      input: "rounded-lg border bg-card text-card-foreground shadow-sm",
      output:
        "rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
    },
    {
      input:
        "text-destructive border-destructive/50 dark:border-destructive [&>svg]:text-destructive text-destructive",
      output:
        "text-red-500 border-red-500/50 dark:border-red-500 [&>svg]:text-red-500 dark:text-red-900 dark:border-red-900/50 dark:dark:border-red-900 dark:[&>svg]:text-red-900",
    },
    {
      input:
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
      output:
        "flex h-full w-full items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800",
    },
    {
      input:
        "absolute right-4 top-4 bg-primary rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
      output:
        "absolute right-4 top-4 bg-slate-900 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 dark:bg-slate-50 dark:ring-offset-slate-950 dark:focus:ring-slate-800 dark:data-[state=open]:bg-slate-800",
    },
  ])(`applyColorMapping($input) -> $output`, ({ input, output }) => {
    expect(applyColorMapping(input, baseColor.inlineColors)).toBe(output)
  })
})

it("transform css vars", async () => {
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
      } as Config,
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
      } as Config,
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
      } as Config,
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
      } as Config,
      baseColor: stone,
    })
  ).toMatchSnapshot()
})
