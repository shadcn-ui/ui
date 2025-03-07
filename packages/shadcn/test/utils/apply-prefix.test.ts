import { describe, expect, test } from "vitest"

import { applyPrefix } from "../../src/utils/transformers/transform-tw-prefix"

describe("apply tailwind prefix", () => {
  test.each([
    {
      input: "bg-slate-800 text-gray-500",
      output: "tw:bg-slate-800 tw:text-gray-500",
    },
    {
      input: "hover:dark:bg-background dark:text-foreground",
      output: "tw:hover:dark:bg-background tw:dark:text-foreground",
    },
    {
      input:
        "rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
      output:
        "tw:rounded-lg tw:border tw:border-slate-200 tw:bg-white tw:text-slate-950 tw:shadow-sm tw:dark:border-slate-800 tw:dark:bg-slate-950 tw:dark:text-slate-50",
    },
    {
      input:
        "text-red-500 border-red-500/50 dark:border-red-500 [&>svg]:text-red-500 text-red-500 dark:text-red-900 dark:border-red-900/50 dark:dark:border-red-900 dark:[&>svg]:text-red-900 dark:text-red-900",
      output:
        "tw:text-red-500 tw:border-red-500/50 tw:dark:border-red-500 tw:[&>svg]:text-red-500 tw:text-red-500 tw:dark:text-red-900 tw:dark:border-red-900/50 tw:dark:dark:border-red-900 tw:dark:[&>svg]:text-red-900 tw:dark:text-red-900",
    },
    {
      input:
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
      output:
        "tw:flex tw:h-full tw:w-full tw:items-center tw:justify-center tw:rounded-full tw:bg-muted",
    },
    {
      input:
        "absolute right-4 top-4 bg-primary rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
      output:
        "tw:absolute tw:right-4 tw:top-4 tw:bg-primary tw:rounded-sm tw:opacity-70 tw:ring-offset-background tw:transition-opacity tw:hover:opacity-100 tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-ring tw:focus:ring-offset-2 tw:disabled:pointer-events-none tw:data-[state=open]:bg-secondary",
    },
  ])(`applyTwPrefix($input) -> $output`, ({ input, output }) => {
    expect(applyPrefix(input, "tw")).toBe(output)
  })
})
