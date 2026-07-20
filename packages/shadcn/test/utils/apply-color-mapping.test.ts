import { describe, expect, test } from "vitest"

import {
  applyColorMapping,
  splitClassName,
} from "../../src/utils/transformers/transform-css-vars"
import baseColor from "../fixtures/colors/slate.json"

describe("split className", () => {
  test.each([
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
  test.each([
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

// Ensure base colors that use raw CSS color values (oklch, rgb, hsl, hex) are
// emitted as Tailwind arbitrary values instead of being concatenated directly
// after the utility prefix. See: https://github.com/shadcn-ui/ui/issues/10429
describe("apply color mapping with raw CSS color values", async () => {
  const oklchColors = {
    light: {
      background: "oklch(1 0 0)",
      foreground: "oklch(0.145 0 0)",
      primary: "oklch(0.205 0 0)",
      "primary-foreground": "oklch(0.985 0 0)",
      muted: "oklch(0.97 0 0)",
      "accent-foreground": "oklch(0.205 0 0)",
      border: "oklch(0.922 0 0)",
      ring: "oklch(0.708 0 0)",
      destructive: "oklch(0.577 0.245 27.325)",
    },
    dark: {
      background: "oklch(0.145 0 0)",
      foreground: "oklch(0.985 0 0)",
      primary: "oklch(0.922 0 0)",
      "primary-foreground": "oklch(0.205 0 0)",
      muted: "oklch(0.269 0 0)",
      "accent-foreground": "oklch(0.985 0 0)",
      border: "oklch(1 0 0 / 10%)",
      ring: "oklch(0.556 0 0)",
      destructive: "oklch(0.704 0.191 22.216)",
    },
  }

  test.each([
    {
      input: "bg-primary text-primary-foreground",
      output:
        "bg-[oklch(0.205_0_0)] text-[oklch(0.985_0_0)] dark:bg-[oklch(0.922_0_0)] dark:text-[oklch(0.205_0_0)]",
    },
    {
      input: "bg-background text-foreground",
      output:
        "bg-[oklch(1_0_0)] text-[oklch(0.145_0_0)] dark:bg-[oklch(0.145_0_0)] dark:text-[oklch(0.985_0_0)]",
    },
    {
      input: "hover:bg-muted sm:focus:text-accent-foreground",
      output:
        "hover:bg-[oklch(0.97_0_0)] sm:focus:text-[oklch(0.205_0_0)] dark:hover:bg-[oklch(0.269_0_0)] dark:sm:focus:text-[oklch(0.985_0_0)]",
    },
    {
      input: "bg-primary/80",
      output: "bg-[oklch(0.205_0_0)]/80 dark:bg-[oklch(0.922_0_0)]/80",
    },
    {
      input: "ring-ring border-border",
      output:
        "ring-[oklch(0.708_0_0)] border-[oklch(0.922_0_0)] dark:ring-[oklch(0.556_0_0)] dark:border-[oklch(1_0_0_/_10%)]",
    },
    {
      input: "text-destructive",
      output:
        "text-[oklch(0.577_0.245_27.325)] dark:text-[oklch(0.704_0.191_22.216)]",
    },
  ])(
    `applyColorMapping($input) -> $output`,
    ({ input, output }) => {
      expect(applyColorMapping(input, oklchColors)).toBe(output)
    }
  )
})
