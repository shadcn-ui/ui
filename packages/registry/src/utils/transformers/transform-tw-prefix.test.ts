import { getFixturesDir } from "@/src/test-helpers"
import type { Config } from "@/src/utils/get-config"
import { describe, expect, it, test } from "vitest"

import { transform } from "."
import stone from "../../../test/fixtures/colors/stone.json"
import {
  applyPrefix,
  applyPrefixesCss,
  transformTwPrefixes,
} from "./transform-tw-prefix"

describe("apply tailwind prefix v3", () => {
  it.each([
    {
      input: "bg-slate-800 text-gray-500",
      output: "tw-bg-slate-800 tw-text-gray-500",
    },
    {
      input: "hover:dark:bg-background dark:text-foreground",
      output: "hover:dark:tw-bg-background dark:tw-text-foreground",
    },
    {
      input:
        "rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
      output:
        "tw-rounded-lg tw-border tw-border-slate-200 tw-bg-white tw-text-slate-950 tw-shadow-sm dark:tw-border-slate-800 dark:tw-bg-slate-950 dark:tw-text-slate-50",
    },
    {
      input:
        "text-red-500 border-red-500/50 dark:border-red-500 [&>svg]:text-red-500 text-red-500 dark:text-red-900 dark:border-red-900/50 dark:dark:border-red-900 dark:[&>svg]:text-red-900 dark:text-red-900",
      output:
        "tw-text-red-500 tw-border-red-500/50 dark:tw-border-red-500 [&>svg]:tw-text-red-500 tw-text-red-500 dark:tw-text-red-900 dark:tw-border-red-900/50 dark:dark:tw-border-red-900 dark:[&>svg]:tw-text-red-900 dark:tw-text-red-900",
    },
    {
      input:
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
      output:
        "tw-flex tw-h-full tw-w-full tw-items-center tw-justify-center tw-rounded-full tw-bg-muted",
    },
    {
      input:
        "absolute right-4 top-4 bg-primary rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
      output:
        "tw-absolute tw-right-4 tw-top-4 tw-bg-primary tw-rounded-sm tw-opacity-70 tw-ring-offset-background tw-transition-opacity hover:tw-opacity-100 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-ring focus:tw-ring-offset-2 disabled:tw-pointer-events-none data-[state=open]:tw-bg-secondary",
    },
  ])(`applyTwPrefix($input) -> $output`, ({ input, output }) => {
    expect(applyPrefix(input, "tw-", "v3")).toBe(output)
  })
})

describe("apply tailwind prefix v4", () => {
  it.each([
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
    expect(applyPrefix(input, "tw", "v4")).toBe(output)
  })
})

it("transform tailwind prefix", async () => {
  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as React from "react"
            export function Foo() {
                return <div className="bg-background hover:bg-muted text-primary-foreground sm:focus:text-accent-foreground">foo</div>
            }
        `,
      config: {
        tailwind: {
          baseColor: "stone",
          prefix: "tw:",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      } as Config,
      baseColor: "stone" as any,
    })
  ).toMatchSnapshot()

  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as React from "react"
export function Foo() {
	return <div className="bg-background hover:bg-muted text-primary-foreground sm:focus:text-accent-foreground">foo</div>
}
    `,
      config: {
        tailwind: {
          baseColor: "stone",
          cssVariables: false,
          prefix: "tw:",
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
}
    `,
      config: {
        tailwind: {
          baseColor: "stone",
          cssVariables: false,
          prefix: "tw:",
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
	return <div className={cn('bg-background hover:bg-muted', true && 'text-primary-foreground sm:focus:text-accent-foreground')}>foo</div>
}
    `,
      config: {
        tailwind: {
          baseColor: "stone",
          cssVariables: false,
          prefix: "tw:",
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
    applyPrefixesCss(
      "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n \n@layer base {\n  :root {\n    --background: 0 0% 100%;\n    --foreground: 224 71.4% 4.1%;\n \n    --muted: 220 14.3% 95.9%;\n    --muted-foreground: 220 8.9% 46.1%;\n \n    --popover: 0 0% 100%;\n    --popover-foreground: 224 71.4% 4.1%;\n \n    --card: 0 0% 100%;\n    --card-foreground: 224 71.4% 4.1%;\n \n    --border: 220 13% 91%;\n    --input: 220 13% 91%;\n \n    --primary: 220.9 39.3% 11%;\n    --primary-foreground: 210 20% 98%;\n \n    --secondary: 220 14.3% 95.9%;\n    --secondary-foreground: 220.9 39.3% 11%;\n \n    --accent: 220 14.3% 95.9%;\n    --accent-foreground: 220.9 39.3% 11%;\n \n    --destructive: 0 84.2% 60.2%;\n    --destructive-foreground: 210 20% 98%;\n \n    --ring: 217.9 10.6% 64.9%;\n \n    --radius: 0.5rem;\n  }\n \n  .dark {\n    --background: 224 71.4% 4.1%;\n    --foreground: 210 20% 98%;\n \n    --muted: 215 27.9% 16.9%;\n    --muted-foreground: 217.9 10.6% 64.9%;\n \n    --popover: 224 71.4% 4.1%;\n    --popover-foreground: 210 20% 98%;\n \n    --card: 224 71.4% 4.1%;\n    --card-foreground: 210 20% 98%;\n \n    --border: 215 27.9% 16.9%;\n    --input: 215 27.9% 16.9%;\n \n    --primary: 210 20% 98%;\n    --primary-foreground: 220.9 39.3% 11%;\n \n    --secondary: 215 27.9% 16.9%;\n    --secondary-foreground: 210 20% 98%;\n \n    --accent: 215 27.9% 16.9%;\n    --accent-foreground: 210 20% 98%;\n \n    --destructive: 0 62.8% 30.6%;\n    --destructive-foreground: 0 85.7% 97.3%;\n \n    --ring: 215 27.9% 16.9%;\n  }\n}\n \n@layer base {\n  * {\n    @apply border-border;\n  }\n  body {\n    @apply bg-background text-foreground;\n  }\n}",
      "tw:",
      "v4"
    )
  ).toMatchSnapshot()
})

const v3Config = {
  tailwind: {
    baseColor: "neutral",
    prefix: "tw-",
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
  },
} as Config

// vite-with-tailwind depends on tailwindcss ^4, so it resolves to "v4".
const v4Config = {
  tailwind: {
    baseColor: "neutral",
    prefix: "tw",
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
  },
  resolvedPaths: {
    cwd: getFixturesDir("vite-with-tailwind"),
  },
} as Config

function prefix(raw: string, config: Config) {
  return transform({ filename: "test.tsx", raw, config }, [transformTwPrefixes])
}

describe("transformTwPrefixes", () => {
  test("returns the file untouched without a prefix", async () => {
    expect(
      await prefix(
        `const buttonVariants = cva("inline-flex", { variants: { size: { sm: "h-8" } } })
export function Foo() {
  return <div className="flex" classNames={{ root: "p-2" }} />
}
`,
        {
          ...v3Config,
          tailwind: { ...v3Config.tailwind, prefix: "" },
        } as Config
      )
    ).toMatchInlineSnapshot(`
      "const buttonVariants = cva("inline-flex", { variants: { size: { sm: "h-8" } } })
      export function Foo() {
        return <div className="flex" classNames={{ root: "p-2" }} />
      }
      "
    `)
  })

  test("prefixes cva base and variants (v3)", async () => {
    expect(
      await prefix(
        `import { cva } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium focus-visible:ring-ring/50 [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 dark:bg-destructive/60",
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        icon: "size-9",
      },
    },
    compoundVariants: [
      {
        variant: "link",
        size: "icon",
        className: "px-0 underline",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
`,
        v3Config
      )
    ).toMatchInlineSnapshot(`
      "import { cva } from "class-variance-authority"

      const buttonVariants = cva(
        "tw-inline-flex tw-items-center tw-justify-center tw-gap-2 tw-rounded-md tw-text-sm tw-font-medium focus-visible:tw-ring-ring/50 [&_svg]:tw-pointer-events-none",
        {
          variants: {
            variant: {
              default: "tw-bg-primary tw-text-primary-foreground hover:tw-bg-primary/90",
              destructive:
                "tw-bg-destructive tw-text-white hover:tw-bg-destructive/90 dark:tw-bg-destructive/60",
              link: "tw-text-primary tw-underline-offset-4 hover:tw-underline",
            },
            size: {
              default: "tw-h-9 tw-px-4 tw-py-2 has-[>svg]:tw-px-3",
              icon: "tw-size-9",
            },
          },
          compoundVariants: [
            {
              variant: "link",
              size: "icon",
              className: "px-0 underline",
            },
          ],
          defaultVariants: {
            variant: "default",
            size: "default",
          },
        }
      )
      "
    `)
  })

  test("prefixes cva base and variants (v4)", async () => {
    expect(
      await prefix(
        `const badgeVariants = cva("inline-flex hover:bg-muted tw:rounded-md", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
      outline: "tw:border text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})
`,
        v4Config
      )
    ).toMatchInlineSnapshot(`
      "const badgeVariants = cva("tw:inline-flex tw:hover:bg-muted tw:rounded-md", {
        variants: {
          variant: {
            default: "tw:bg-primary tw:text-primary-foreground tw:[a&]:hover:bg-primary/90",
            outline: "tw:border tw:text-foreground",
          },
        },
        defaultVariants: {
          variant: "default",
        },
      })
      "
    `)
  })

  test("prefixes nested variant objects twice", async () => {
    // Current behavior: strings two levels below a variant are prefixed twice.
    expect(
      await prefix(
        `const v = cva("base", {
  variants: {
    size: {
      sm: "h-8",
      responsive: {
        md: "h-10",
        lg: {
          xl: "h-12",
        },
      },
    },
    flat: "not-a-variant-object",
  },
})
`,
        v3Config
      )
    ).toMatchInlineSnapshot(`
      "const v = cva("tw-base", {
        variants: {
          size: {
            sm: "tw-h-8",
            responsive: {
              md: "tw-tw-h-10",
              lg: {
                xl: "tw-tw-tw-h-12",
              },
            },
          },
          flat: "not-a-variant-object",
        },
      })
      "
    `)
  })

  test("leaves non-string cva arguments untouched", async () => {
    expect(
      await prefix(
        `const a = cva(\`inline-flex gap-2\`, {
  variants: {
    size: {
      sm: \`h-8\`,
      md: ["h-10", "px-4"],
    },
  },
})
const b = cva(["inline-flex", "gap-2"])
const c = cva("inline-flex", options)
const d = cva()
const e = notCva("inline-flex", { variants: { size: { sm: "h-8" } } })
`,
        v3Config
      )
    ).toMatchInlineSnapshot(`
      "const a = cva(\`inline-flex gap-2\`, {
        variants: {
          size: {
            sm: \`h-8\`,
            md: ["h-10", "px-4"],
          },
        },
      })
      const b = cva(["inline-flex", "gap-2"])
      const c = cva("tw-inline-flex", options)
      const d = cva()
      const e = notCva("inline-flex", { variants: { size: { sm: "h-8" } } })
      "
    `)
  })

  test("rewrites single-quoted strings to double quotes and strips inner quotes", async () => {
    // Current behavior: quotes inside class strings are stripped, which breaks
    // arbitrary values such as content-['x'].
    expect(
      await prefix(
        `const v = cva('before:content-["*"] flex', {
  variants: { size: { sm: 'h-8' } },
})
export function Foo() {
  return (
    <div
      className='flex items-center'
      title='flex'
    >
      <span className="before:content-['a'] block" />
      <span className={cn('px-2', isActive ? 'font-bold' : "font-normal", isOpen && 'block')} />
    </div>
  )
}
`,
        v3Config
      )
    ).toMatchInlineSnapshot(`
      "const v = cva("before:tw-content-[*] tw-flex", {
        variants: { size: { sm: "tw-h-8" } },
      })
      export function Foo() {
        return (
          <div
            className="tw-flex tw-items-center"
            title='flex'
          >
            <span className="before:tw-content-[a] tw-block" />
            <span className={cn("tw-px-2", isActive ? "tw-font-bold" : "tw-font-normal", isOpen && "tw-block")} />
          </div>
        )
      }
      "
    `)
  })

  test("leaves a stray backslash when stripping escaped quotes", async () => {
    // Current behavior: the output "\x\]" is an invalid escape sequence.
    expect(
      await prefix(
        `const v = cva("flex", {
  variants: { size: { sm: 'after:content-[\\'x\\'] h-8' } },
})
`,
        v3Config
      )
    ).toBe(`const v = cva("tw-flex", {
  variants: { size: { sm: "after:tw-content-[\\x\\] tw-h-8" } },
})
`)
  })

  test("prefixes className strings and cn() arguments (v3)", async () => {
    expect(
      await prefix(
        `import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, isActive, size, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        isActive ? "ring-2 ring-ring/50" : "ring-0",
        size === "sm" && "gap-4 py-4",
        isActive || "opacity-50",
        { "border-dashed": isActive },
        \`px-6\`,
        className
      )}
      {...props}
    >
      <div className="flex-1 hover:bg-muted/50" />
    </div>
  )
}
`,
        v3Config
      )
    ).toMatchInlineSnapshot(`
      "import * as React from "react"

      import { cn } from "@/lib/utils"

      function Card({ className, isActive, size, ...props }: React.ComponentProps<"div">) {
        return (
          <div
            data-slot="card"
            className={cn(
              "tw-bg-card tw-text-card-foreground tw-flex tw-flex-col tw-gap-6 tw-rounded-xl tw-border tw-py-6 tw-shadow-sm",
              isActive ? "tw-ring-2 tw-ring-ring/50" : "tw-ring-0",
              size === "sm" && "tw-gap-4 tw-py-4",
              isActive || "tw-opacity-50",
              { "border-dashed": isActive },
              \`px-6\`,
              className
            )}
            {...props}
          >
            <div className="tw-flex-1 hover:tw-bg-muted/50" />
          </div>
        )
      }
      "
    `)
  })

  test("turns an empty className into a bare prefix", async () => {
    // Current behavior: className="" becomes className="tw-".
    expect(
      await prefix(
        `export function Foo() {
  return <p className="">Empty</p>
}
`,
        v3Config
      )
    ).toMatchInlineSnapshot(`
      "export function Foo() {
        return <p className="tw-">Empty</p>
      }
      "
    `)
  })

  test("prefixes className strings and cn() arguments (v4)", async () => {
    expect(
      await prefix(
        `export function Foo({ className, isActive }) {
  return (
    <div className="flex tw:items-center hover:bg-muted">
      <span
        className={cn(
          "inline-flex data-[state=open]:bg-accent",
          isActive ? "font-bold" : "tw:font-normal",
          isActive && "underline",
          className
        )}
      />
    </div>
  )
}
`,
        v4Config
      )
    ).toMatchInlineSnapshot(`
      "export function Foo({ className, isActive }) {
        return (
          <div className="tw:flex tw:items-center tw:hover:bg-muted">
            <span
              className={cn(
                "tw:inline-flex tw:data-[state=open]:bg-accent",
                isActive ? "tw:font-bold" : "tw:font-normal",
                isActive && "tw:underline",
                className
              )}
            />
          </div>
        )
      }
      "
    `)
  })

  test("only rewrites direct string arguments of the first cn() call", async () => {
    // Current behavior: nested conditionals, nested calls and non-cn
    // expressions are not prefixed.
    expect(
      await prefix(
        `export function Foo({ a, b, className }) {
  return (
    <>
      <div className={cn("flex", a ? "block" : b ? "inline" : "hidden", cn("gap-2"), clsx("p-2"))} />
      <div className={clsx("flex", a && "block")} />
      <div className={"flex items-center"} />
      <div className={a ? "flex" : "hidden"} />
      <div className={\`flex \${className}\`} />
      <div className={(a && "flex") || "hidden"} />
      <div className={a ? cn("flex", b && "gap-2") : "hidden"} />
      <div className />
      <div class="flex" />
    </>
  )
}
`,
        v3Config
      )
    ).toMatchInlineSnapshot(`
      "export function Foo({ a, b, className }) {
        return (
          <>
            <div className={cn("tw-flex", a ? "tw-block" : b ? "inline" : "hidden", cn("gap-2"), clsx("p-2"))} />
            <div className={clsx("flex", a && "block")} />
            <div className={"flex items-center"} />
            <div className={a ? "flex" : "hidden"} />
            <div className={\`flex \${className}\`} />
            <div className={(a && "flex") || "hidden"} />
            <div className={a ? cn("tw-flex", b && "tw-gap-2") : "hidden"} />
            <div className />
            <div class="flex" />
          </>
        )
      }
      "
    `)
  })

  test("prefixes classNames object values (v3)", async () => {
    expect(
      await prefix(
        `export function Calendar({ className, classNames, isRange, showOutside, ...props }) {
  return (
    <DayPicker
      className={cn("bg-background p-3", className)}
      classNames={{
        root: "w-fit",
        months: cn("relative flex flex-col gap-4 md:flex-row", classNames?.months),
        month: cn("flex w-full flex-col", isRange ? "gap-4" : 'gap-2'),
        variant: "outline",
        nav: {
          button: "size-7",
        },
        caption: \`flex justify-center\`,
        weekday: clsx("text-muted-foreground"),
        ...classNames,
      }}
      {...props}
    />
  )
}
`,
        v3Config
      )
    ).toMatchInlineSnapshot(`
      "export function Calendar({ className, classNames, isRange, showOutside, ...props }) {
        return (
          <DayPicker
            className={cn("tw-bg-background tw-p-3", className)}
            classNames={{
              root: "tw-w-fit",
              months: cn("tw-relative tw-flex tw-flex-col tw-gap-4 md:tw-flex-row", classNames?.months),
              month: cn("tw-flex tw-w-full tw-flex-col", isRange ? "tw-gap-4" : "tw-gap-2"),
              variant: "outline",
              nav: {
                button: "tw-size-7",
              },
              caption: \`flex justify-center\`,
              weekday: clsx("tw-text-muted-foreground"),
              ...classNames,
            }}
            {...props}
          />
        )
      }
      "
    `)
  })

  test("does not prefix && operands inside classNames calls", async () => {
    // Current behavior: unlike className cn(), classNames only handles ternaries.
    expect(
      await prefix(
        `export function Calendar({ showOutside }) {
  return <DayPicker classNames={{ day: cn("size-8", showOutside && "opacity-50") }} />
}
`,
        v3Config
      )
    ).toMatchInlineSnapshot(`
      "export function Calendar({ showOutside }) {
        return <DayPicker classNames={{ day: cn("tw-size-8", showOutside && "opacity-50") }} />
      }
      "
    `)
  })

  test("prefixes a quoted variant key in classNames", async () => {
    // Current behavior: only the bare variant key is skipped; "variant" is not.
    expect(
      await prefix(
        `export function Foo() {
  return <Toggle classNames={{ variant: "outline", "variant": "ghost" }} />
}
`,
        v3Config
      )
    ).toMatchInlineSnapshot(`
      "export function Foo() {
        return <Toggle classNames={{ variant: "outline", "variant": "tw-ghost" }} />
      }
      "
    `)
  })

  test("prefixes classNames object values (v4)", async () => {
    expect(
      await prefix(
        `export function Calendar({ isRange }) {
  return (
    <DayPicker
      classNames={{
        root: "w-fit tw:p-3",
        month: cn("flex w-full", isRange ? "gap-4" : "tw:gap-2"),
        variant: "outline",
      }}
    />
  )
}
`,
        v4Config
      )
    ).toMatchInlineSnapshot(`
      "export function Calendar({ isRange }) {
        return (
          <DayPicker
            classNames={{
              root: "tw:w-fit tw:p-3",
              month: cn("tw:flex tw:w-full", isRange ? "tw:gap-4" : "tw:gap-2"),
              variant: "outline",
            }}
          />
        )
      }
      "
    `)
  })

  test("ignores a classNames attribute that is not an expression", async () => {
    expect(
      await prefix(
        `export function Foo() {
  return <Calendar classNames="flex" />
}
`,
        v3Config
      )
    ).toMatchInlineSnapshot(`
      "export function Foo() {
        return <Calendar classNames="flex" />
      }
      "
    `)
  })

  test("prefixes a cva base again inside a classNames call", async () => {
    // Current behavior: the cva() pass and the classNames pass both visit it.
    expect(
      await prefix(
        `const a = <div classNames={{ root: cva("flex") }} />
`,
        v3Config
      )
    ).toBe(`const a = <div classNames={{ root: cva("tw-tw-flex") }} />
`)
  })

  test("skips a quoted variants key and reads an optional cn call", async () => {
    expect(
      await prefix(
        `const b = cva("flex", { "variants": { size: { sm: "h-8" } } })
const c = <div className={cn?.("px-2", a ? "py-1" : "py-2")} />
`,
        v3Config
      )
    ).toBe(`const b = cva("tw-flex", { "variants": { size: { sm: "h-8" } } })
const c = <div className={cn?.("tw-px-2", a ? "tw-py-1" : "tw-py-2")} />
`)
  })

  test("adds the prefix again to already-prefixed classes in v3", async () => {
    // Current behavior: v3 has no already-prefixed check, so tw-flex becomes
    // tw-tw-flex.
    expect(
      await prefix(
        `export function Foo() {
  return <div className="tw-flex hover:tw-bg-muted items-center" />
}
`,
        v3Config
      )
    ).toMatchInlineSnapshot(`
      "export function Foo() {
        return <div className="tw-tw-flex hover:tw-tw-bg-muted tw-items-center" />
      }
      "
    `)
  })

  test("keeps CRLF line endings", async () => {
    expect(
      await prefix(
        'const v = cva("flex", {\r\n  variants: {\r\n    size: {\r\n      sm: "h-8",\r\n    },\r\n  },\r\n})\r\nexport function Foo() {\r\n  return <div className={cn("flex",\r\n    "gap-2")} />\r\n}\r\n',
        v3Config
      )
    ).toBe(
      'const v = cva("tw-flex", {\r\n  variants: {\r\n    size: {\r\n      sm: "tw-h-8",\r\n    },\r\n  },\r\n})\r\nexport function Foo() {\r\n  return <div className={cn("tw-flex",\r\n    "tw-gap-2")} />\r\n}\r\n'
    )
  })

  test("treats a project without tailwindcss as v4", async () => {
    // Current behavior: an unknown tailwind version (null) uses the v4 format.
    expect(
      await prefix(
        `export function Foo() {
  return <div className="flex hover:bg-muted" />
}
`,
        {
          ...v3Config,
          resolvedPaths: { cwd: getFixturesDir("config-none") },
        } as Config
      )
    ).toMatchInlineSnapshot(`
      "export function Foo() {
        return <div className="tw-:flex tw-:hover:bg-muted" />
      }
      "
    `)
  })
})

describe("applyPrefix edge cases", () => {
  test("v3", () => {
    expect([
      applyPrefix("flex  items-center", "tw-", "v3"),
      applyPrefix(" flex ", "tw-", "v3"),
      applyPrefix(
        "-mt-2 !p-2 bg-primary/50 hover:bg-primary/[0.5]",
        "tw-",
        "v3"
      ),
      applyPrefix("group-data-[size=sm]/card:px-4 [&>svg]:size-4", "tw-", "v3"),
      applyPrefix("", "tw-", "v3"),
      applyPrefix("flex hover:bg-muted", undefined, "v3"),
    ]).toMatchInlineSnapshot(`
      [
        "tw-flex tw- tw-items-center",
        "tw- tw-flex tw-",
        "tw--mt-2 tw-!p-2 tw-bg-primary/50 hover:tw-bg-primary/[0.5]",
        "group-data-[size=sm]/card:tw-px-4 [&>svg]:tw-size-4",
        "tw-",
        "flex hover:bg-muted",
      ]
    `)
  })

  test("v4", () => {
    expect([
      applyPrefix("flex  items-center", "tw", "v4"),
      applyPrefix(" flex ", "tw", "v4"),
      applyPrefix("-mt-2 !p-2 tw:flex tw:hover:bg-muted", "tw", "v4"),
      applyPrefix("", "tw", "v4"),
      applyPrefix("flex hover:bg-muted", undefined, "v4"),
      applyPrefix("flex", "tw", null),
    ]).toMatchInlineSnapshot(`
      [
        "tw:flex tw: tw:items-center",
        "tw: tw:flex tw:",
        "tw:-mt-2 tw:!p-2 tw:flex tw:hover:bg-muted",
        "tw:",
        ":flex :hover:bg-muted",
        "tw:flex",
      ]
    `)
  })
})

describe("applyPrefixesCss", () => {
  test("prefixes @apply lines (v3)", () => {
    expect(
      applyPrefixesCss(
        `@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  .card {
    @apply border-border;
  }
}
`,
        "tw-",
        "v3"
      )
    ).toMatchInlineSnapshot(`
      "@layer base {
        * {
          @apply tw-border-border tw-outline-ring/50;
        }
        body {
          @apply tw-bg-background tw-text-foreground;
        }
        .card {
          @apply tw-border-border;
        }
      }
      "
    `)
  })

  test("prefixes the first match again for a repeated @apply value", () => {
    // Current behavior: css.replace() hits the first occurrence, so the first
    // rule is prefixed twice and the second one is left alone.
    expect(
      applyPrefixesCss(
        `.a {
  @apply border-border;
}
.b {
  @apply border-border;
}
.c {
  @apply flex gap-2;
}
.d {
  @apply flex gap-2;
}
`,
        "tw",
        "v4"
      )
    ).toMatchInlineSnapshot(`
      ".a {
        @apply tw:tw:border-border;
      }
      .b {
        @apply border-border;
      }
      .c {
        @apply tw:flex tw:gap-2;
      }
      .d {
        @apply tw:flex tw:gap-2;
      }
      "
    `)
  })

  test("prefixes @apply lines with CRLF (v4)", () => {
    expect(
      applyPrefixesCss(
        "@layer base {\r\n  body {\r\n    @apply bg-background text-foreground;\r\n  }\r\n}\r\n",
        "tw",
        "v4"
      )
    ).toBe(
      "@layer base {\r\n  body {\r\n    @apply tw:bg-background tw:text-foreground;\r\n  }\r\n}\r\n"
    )
  })
})
