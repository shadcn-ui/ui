import type { Config } from "@/src/get-config"
import { describe, expect, test } from "vitest"

import { transform } from "."

const config = {
  style: "new-york",
  tsx: false,
  rsc: true,
  tailwind: {
    baseColor: "neutral",
    cssVariables: true,
    config: "",
    css: "app/globals.css",
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
  },
} as Config

// No transformers run, so the output is exactly what transformJsx produces.
async function toJs(raw: string, filename = "component.tsx") {
  return transform({ filename, raw, config, transformJsx: true }, [])
}

describe("transformJsx (tsx: false)", () => {
  test("forwardRef component with a props interface", async () => {
    expect(
      await toJs(`import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
`)
    ).toMatchInlineSnapshot(`
      "import * as React from "react"

      import { cn } from "@/lib/utils"

      const Input = React.forwardRef(({ className, type, ...props }, ref) => {
        return (
          <input
            type={type}
            className={cn("flex h-10 w-full rounded-md border border-input", className)}
            ref={ref}
            {...props} />
        );
      })
      Input.displayName = "Input"

      export { Input }
      "
    `)
  })

  test("function component with inline props type", async () => {
    expect(
      await toJs(`import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn("bg-card text-card-foreground", className)}
      {...props}
    />
  )
}

export { Card }
`)
    ).toMatchInlineSnapshot(`
      "import * as React from "react"

      import { cn } from "@/lib/utils"

      function Card({
        className,
        ...props
      }) {
        return (
          <div
            data-slot="card"
            className={cn("bg-card text-card-foreground", className)}
            {...props} />
        );
      }

      export { Card }
      "
    `)
  })

  test("type and interface exports", async () => {
    expect(
      await toJs(
        `export type Size = "sm" | "md" | "lg"

export interface Item {
  id: string
  size?: Size
}

type Internal = { value: number }

export const sizes: Size[] = ["sm", "md", "lg"]

export type { Internal }
`,
        "types.ts"
      )
    ).toMatchInlineSnapshot(`
      "export const sizes = ["sm", "md", "lg"]
      "
    `)
  })

  test("generics", async () => {
    expect(
      await toJs(`import * as React from "react"

function identity<T>(value: T): T {
  return value
}

export function useList<TItem extends { id: string }>(items: TItem[]) {
  return React.useMemo<TItem[]>(() => items.slice(), [items])
}

const first = <T,>(items: T[]): T | undefined => items[0]

export { identity, first }
`)
    ).toMatchInlineSnapshot(`
      "import * as React from "react"

      function identity(value) {
        return value
      }

      export function useList(items) {
        return React.useMemo(() => items.slice(), [items]);
      }

      const first = items => items[0]

      export { identity, first }
      "
    `)
  })

  test("a bare <T> arrow generic", async () => {
    expect(
      await toJs(
        `export const identity = <T>(value: T): T => value
`,
        "identity.ts"
      )
    ).toMatchInlineSnapshot(`
      "export const identity = value => value
      "
    `)
  })

  test("as casts, as const and non-null assertions", async () => {
    expect(
      await toJs(
        `const root = document.getElementById("root") as HTMLDivElement
const value = (event.target as HTMLInputElement).value
const sizes = ["sm", "lg"] as const
const el = ref.current!
`,
        "casts.ts"
      )
    ).toMatchInlineSnapshot(`
      "const root = document.getElementById("root")
      const value = (event.target).value
      const sizes = ["sm", "lg"]
      const el = ref.current
      "
    `)
  })

  test("angle-bracket type assertions throw", async () => {
    // Current behavior: the jsx parser plugin is always on, so `<T>x` is JSX.
    await expect(
      toJs(
        `const n = <number>value
`,
        "casts.ts"
      )
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[SyntaxError: Unterminated JSX contents. (1:18)]`
    )
  })

  test("satisfies", async () => {
    expect(
      await toJs(
        `const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
} satisfies ChartConfig

export default chartConfig
`,
        "chart.ts"
      )
    ).toMatchInlineSnapshot(`
      "const chartConfig = {
        desktop: { label: "Desktop", color: "var(--chart-1)" }
      }

      export default chartConfig
      "
    `)
  })

  test("enums", async () => {
    expect(
      await toJs(
        `export enum Direction {
  Up = "up",
  Down = "down",
}

const enum Flag {
  A = 1,
  B,
}

export const flags = [Flag.A, Flag.B]
`,
        "enums.ts"
      )
    ).toMatchInlineSnapshot(`
      "export let Direction = ((function(Direction) {
        Direction["Up"] = "up";
        Direction["Down"] = "down";
        return Direction;
      })({}));

      var Flag = ((function(Flag) {
        Flag[Flag["A"] = 1] = "A";
        Flag[Flag["B"] = 2] = "B";
        return Flag;
      })(Flag || {}));

      export const flags = [Flag.A, Flag.B]
      "
    `)
  })

  test("import type", async () => {
    // Current behavior: "use client" gains a semicolon and loses its blank line.
    expect(
      await toJs(`"use client"

import * as React from "react"
import type { VariantProps } from "class-variance-authority"
import type * as Types from "./types"

import { buttonVariants } from "@/components/ui/button"

export function Button(props: VariantProps<typeof buttonVariants> & Types.Props) {
  return <button className={buttonVariants(props)} />
}
`)
    ).toMatchInlineSnapshot(`
      ""use client";
      import * as React from "react"

      import { buttonVariants } from "@/components/ui/button"

      export function Button(props) {
        return <button className={buttonVariants(props)} />;
      }
      "
    `)
  })

  test("type-only import specifiers", async () => {
    expect(
      await toJs(`import { cva, type VariantProps } from "class-variance-authority"
import { type ClassValue } from "clsx"
import { Slot, type SlotProps } from "@radix-ui/react-slot"

export const badgeVariants = cva("inline-flex")

export function Badge(props: SlotProps & VariantProps<typeof badgeVariants>) {
  return <Slot {...props} />
}

export type { ClassValue }
`)
    ).toMatchInlineSnapshot(`
      "import { cva } from "class-variance-authority";
      import { Slot } from "@radix-ui/react-slot";

      export const badgeVariants = cva("inline-flex")

      export function Badge(props) {
        return <Slot {...props} />;
      }
      "
    `)
  })

  test("imports used only as types are removed", async () => {
    // Current behavior: Babel elides value imports that are only used in types.
    expect(
      await toJs(
        `import * as React from "react"
import { ButtonProps } from "@/components/ui/button"
import { useState } from "react"

export function useToggle(initial: ButtonProps["disabled"]): React.ReactNode {
  return useState(initial)
}
`,
        "use-toggle.ts"
      )
    ).toMatchInlineSnapshot(`
      "import { useState } from "react"

      export function useToggle(initial) {
        return useState(initial);
      }
      "
    `)
  })

  test("a file whose only import is unused becomes export {}", async () => {
    // Current behavior: the unused import is elided and Babel adds `export {}`.
    expect(
      await toJs(`import * as React from "react"
`)
    ).toBe(`export {};
`)
  })

  test("class without decorators", async () => {
    expect(
      await toJs(
        `export class Store<T> implements Iterable<T> {
  private items: T[] = []
  public readonly name: string
  static count: number = 0

  constructor(name: string, private readonly limit: number = 10) {
    this.name = name
  }

  add(item: T): void {
    if (this.items.length < this.limit) this.items.push(item)
  }

  *[Symbol.iterator](): Iterator<T> {
    yield* this.items
  }
}
`,
        "store.ts"
      )
    ).toMatchInlineSnapshot(`
      "export class Store {
        items = [];
        static count = 0;

        constructor(name, limit = 10) {
          this.limit = limit;
          this.name = name
        }

        add(item) {
          if (this.items.length < this.limit) this.items.push(item)
        }

        *[Symbol.iterator]() {
          yield* this.items
        }
      }
      "
    `)
  })

  test("declare class fields throw", async () => {
    // Current behavior: allowDeclareFields is not enabled for the TS plugin.
    // (Only the first line is pinned: the code frame is colored when CI is set.)
    await expect(
      toJs(
        `export class Store {
  declare meta: unknown
}
`,
        "store.ts"
      )
    ).rejects.toThrow(
      "unknown file: The 'declare' modifier is only allowed when the 'allowDeclareFields' option of @babel/plugin-transform-typescript or @babel/preset-typescript is enabled.\n"
    )
  })

  test("optional chaining and nullish coalescing", async () => {
    expect(
      await toJs(
        `export function getName(user?: { profile?: { name?: string } }): string {
  return user?.profile?.name ?? "anonymous"
}

export function notify(onChange?: (value: string) => void) {
  onChange?.("changed")
}
`,
        "utils.ts"
      )
    ).toMatchInlineSnapshot(`
      "export function getName(user) {
        return user?.profile?.name ?? "anonymous"
      }

      export function notify(onChange) {
        onChange?.("changed")
      }
      "
    `)
  })

  test("JSX fragments", async () => {
    expect(
      await toJs(`import * as React from "react"

export function List({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item) => (
        <React.Fragment key={item}>
          <dt>{item}</dt>
          <dd />
        </React.Fragment>
      ))}
    </>
  )
}
`)
    ).toMatchInlineSnapshot(`
      "import * as React from "react"

      export function List({
        items
      }) {
        return (
          <>
            {items.map((item) => (
              <React.Fragment key={item}>
                <dt>{item}</dt>
                <dd />
              </React.Fragment>
            ))}
          </>
        );
      }
      "
    `)
  })

  test("leading comment and use client directive are kept", async () => {
    expect(
      await toJs(`// Copyright (c) shadcn
/* eslint-disable react/display-name */
"use client"

import * as React from "react"

export function Toggle({ pressed }: { pressed: boolean }) {
  return <button aria-pressed={pressed} />
}
`)
    ).toMatchInlineSnapshot(`
      "// Copyright (c) shadcn
      /* eslint-disable react/display-name */
      "use client"

      import * as React from "react"

      export function Toggle({
        pressed
      }) {
        return <button aria-pressed={pressed} />;
      }
      "
    `)
  })

  test("CRLF input", async () => {
    expect(
      await toJs(
        `"use client"\r\n\r\nimport * as React from "react"\r\n\r\nexport function A({ a }: { a: string }) {\r\n  return <span>{a}</span>\r\n}\r\n`
      )
    ).toBe(
      `"use client"\n\nimport * as React from "react"\n\nexport function A({\n  a\n}) {\n  return <span>{a}</span>;\n}\n`
    )
  })
})

describe("transformJsx (tsx: true)", () => {
  test("returns the full text unchanged", async () => {
    const raw = `// @ts-nocheck
"use client"

import * as React from "react"

export interface Props {
  label: string
}

export function Label({ label }: Props) {
  return <label>{label}</label>
}
`
    expect(
      await transform(
        {
          filename: "label.tsx",
          raw,
          config: { ...config, tsx: true },
          transformJsx: true,
        },
        []
      )
    ).toBe(raw)
  })
})
