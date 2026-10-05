import { describe, expect, test } from "vitest"

import { transform } from "."
import { createConfig } from "../get-config"
import { cleanupMarkers, transformCleanup } from "./transform-cleanup"

const testConfig = createConfig({
  tailwind: {
    baseColor: "neutral",
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
  },
})

function cleanup(raw: string) {
  return transform({ filename: "test.tsx", raw, config: testConfig }, [
    transformCleanup,
  ])
}

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

  test("preserves cn-font-heading for transformFont", async () => {
    const result = await transform(
      {
        filename: "test.tsx",
        raw: `import * as React from "react"
export function Component() {
  return <h2 className="cn-font-heading cn-rtl-flip text-xl" />
}`,
        config: testConfig,
      },
      [transformCleanup]
    )

    expect(result).toContain('className="cn-font-heading text-xl"')
    expect(result).not.toContain("cn-rtl-flip")
  })

  test("removes a multi-line className attribute and the whitespace before it", async () => {
    expect(
      await cleanup(`export function PaginationPrevious({ className, ...props }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn("cn-pagination-previous", className)}
      {...props}
    >
      <IconPlaceholder
        lucide="ChevronLeftIcon"
        data-icon="inline-start"
        className="cn-rtl-flip"
      />
      <span className="cn-pagination-previous-text hidden sm:block">
        {text}
      </span>
      <span
        className="cn-rtl-flip"
        data-slot="icon"
      />
      <span className="cn-rtl-flip" data-slot="icon" />
    </PaginationLink>
  )
}
`)
    ).toMatchInlineSnapshot(`
      "export function PaginationPrevious({ className, ...props }) {
        return (
          <PaginationLink
            aria-label="Go to previous page"
            className={cn("", className)}
            {...props}
          >
            <IconPlaceholder
              lucide="ChevronLeftIcon"
              data-icon="inline-start"
            />
            <span className="hidden sm:block">
              {text}
            </span>
            <span
              data-slot="icon"
            />
            <span data-slot="icon" />
          </PaginationLink>
        )
      }
      "
    `)
  })

  test("removes an empty className attribute next to comments", async () => {
    // Current behavior: the block comment before the attribute is dropped too.
    expect(
      await cleanup(`export function Component() {
  return (
    <div
      id="a" /* before */ className="cn-rtl-flip" // after
      data-slot="x"
    />
  )
}
`)
    ).toMatchInlineSnapshot(`
      "export function Component() {
        return (
          <div
            id="a" // after
            data-slot="x"
          />
        )
      }
      "
    `)
  })

  test("keeps quote kind and collapses whitespace in rewritten strings", async () => {
    expect(
      await cleanup(`export function Component({ className }) {
  return (
    <>
      <div className='cn-rtl-flip  size-4' />
      <div className="  flex   cn-rtl-flip   gap-2  " />
      <div className="  flex   gap-2  " />
      <div className={cn('cn-rtl-flip size-4', "it's", className)} />
      <div data-marker="cn-rtl-flip size-4" />
    </>
  )
}
`)
    ).toMatchInlineSnapshot(`
      "export function Component({ className }) {
        return (
          <>
            <div className='size-4' />
            <div className="flex gap-2" />
            <div className="  flex   gap-2  " />
            <div className={cn('size-4', "it's", className)} />
            <div data-marker="cn-rtl-flip size-4" />
          </>
        )
      }
      "
    `)
  })

  test("strips markers from template literals without substitutions", async () => {
    expect(
      await cleanup(`import { cva } from "class-variance-authority"

const iconVariants = cva(\`cn-rtl-flip size-4\`, {
  variants: {
    side: {
      left: \`cn-logical-sides rotate-180\`,
    },
  },
})

export function Component({ className }) {
  return (
    <>
      <div className={\`cn-rtl-flip size-4\`} />
      <div className={cn(\`cn-rtl-flip size-4\`, className)} />
      <div className={\`cn-rtl-flip \${className}\`} />
    </>
  )
}
`)
    ).toMatchInlineSnapshot(`
      "import { cva } from "class-variance-authority"

      const iconVariants = cva(\`size-4\`, {
        variants: {
          side: {
            left: \`rotate-180\`,
          },
        },
      })

      export function Component({ className }) {
        return (
          <>
            <div className={\`size-4\`} />
            <div className={cn(\`size-4\`, className)} />
            <div className={\`cn-rtl-flip \${className}\`} />
          </>
        )
      }
      "
    `)
  })

  test("leaves an empty string when a cn() argument is only a marker", async () => {
    expect(
      await cleanup(`export function Breadcrumb({ className, ...props }) {
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className={cn("cn-breadcrumb", className)}
      {...props}
    />
  )
}
`)
    ).toMatchInlineSnapshot(`
      "export function Breadcrumb({ className, ...props }) {
        return (
          <nav
            aria-label="breadcrumb"
            data-slot="breadcrumb"
            className={cn("", className)}
            {...props}
          />
        )
      }
      "
    `)
  })

  test("strips markers from every string literal inside className expressions", async () => {
    // Current behavior: object keys and comparison operands are rewritten too.
    expect(
      await cleanup(`export function Component({ side, isActive }) {
  return (
    <div
      className={cn({ "cn-rtl-flip size-4": isActive }, side === "cn-left" ? "a" : "b")}
      classNames={{ root: "cn-calendar-root w-fit", nav: cn("cn-calendar-nav", "flex") }}
    />
  )
}
`)
    ).toMatchInlineSnapshot(`
      "export function Component({ side, isActive }) {
        return (
          <div
            className={cn({ "size-4": isActive }, side === "" ? "a" : "b")}
            classNames={{ root: "w-fit", nav: cn("", "flex") }}
          />
        )
      }
      "
    `)
  })

  test("removes tokens that contain a marker anywhere", async () => {
    // Current behavior: the whole token goes, not just the cn-* part.
    expect(
      await cleanup(`export function Component() {
  return <div className="[&_.cn-icon]:size-4 rtl:cn-rtl-flip flex md:cn-font-heading cn-font-heading" />
}
`)
    ).toMatchInlineSnapshot(`
      "export function Component() {
        return <div className="flex cn-font-heading" />
      }
      "
    `)
  })

  test("strips markers from cva variants, compoundVariants and defaultVariants", async () => {
    expect(
      await cleanup(`import { cva } from "class-variance-authority"

const buttonVariants = cva(
  "cn-button inline-flex items-center",
  {
    variants: {
      variant: {
        default: "cn-button-variant-default bg-primary",
        ghost: "cn-button-variant-ghost",
      },
      size: {
        icon: 'cn-button-size-icon size-9',
      },
    },
    compoundVariants: [{ variant: "ghost", size: "icon", className: "cn-rtl-flip px-0" }],
    defaultVariants: {
      variant: "default",
    },
  }
)
`)
    ).toMatchInlineSnapshot(`
      "import { cva } from "class-variance-authority"

      const buttonVariants = cva(
        "inline-flex items-center",
        {
          variants: {
            variant: {
              default: "bg-primary",
              ghost: "",
            },
            size: {
              icon: 'size-9',
            },
          },
          compoundVariants: [{ variant: "ghost", size: "icon", className: "px-0" }],
          defaultVariants: {
            variant: "default",
          },
        }
      )
      "
    `)
  })

  test("visits JSX inside mergeProps() twice without changing the result", async () => {
    expect(
      await cleanup(`import { mergeProps } from "@base-ui/react/merge-props"

function BreadcrumbLink({ className, render, ...props }) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn("cn-breadcrumb-link hover:text-foreground", className),
        children: <span className={cn("cn-rtl-flip size-4")} />,
        icon: <span className="cn-rtl-flip" />,
        label: \`cn-breadcrumb-label text-sm\`,
      },
      props
    ),
    render,
  })
}
`)
    ).toMatchInlineSnapshot(`
      "import { mergeProps } from "@base-ui/react/merge-props"

      function BreadcrumbLink({ className, render, ...props }) {
        return useRender({
          defaultTagName: "a",
          props: mergeProps<"a">(
            {
              className: cn("hover:text-foreground", className),
              children: <span className={cn("size-4")} />,
              icon: <span />,
              label: \`text-sm\`,
            },
            props
          ),
          render,
        })
      }
      "
    `)
  })

  test("leaves strings outside className, cva and mergeProps alone", async () => {
    expect(
      await cleanup(`const classes = "cn-rtl-flip size-4"
const merged = merge({ className: "cn-rtl-flip size-4" })
const variants = notCva("cn-rtl-flip size-4")
export function Component() {
  return <div title="cn-rtl-flip" data-class="cn-rtl-flip size-4" />
}
`)
    ).toMatchInlineSnapshot(`
      "const classes = "cn-rtl-flip size-4"
      const merged = merge({ className: "cn-rtl-flip size-4" })
      const variants = notCva("cn-rtl-flip size-4")
      export function Component() {
        return <div title="cn-rtl-flip" data-class="cn-rtl-flip size-4" />
      }
      "
    `)
  })

  test("keeps CRLF line endings when removing an attribute", async () => {
    expect(
      await cleanup(
        'export function Component() {\r\n  return (\r\n    <div\r\n      id="a"\r\n      className="cn-rtl-flip"\r\n    >\r\n      <span className={cn("cn-rtl-flip size-4")} />\r\n    </div>\r\n  )\r\n}\r\n'
      )
    ).toBe(
      'export function Component() {\r\n  return (\r\n    <div\r\n      id="a"\r\n    >\r\n      <span className={cn("size-4")} />\r\n    </div>\r\n  )\r\n}\r\n'
    )
  })
})

describe("cleanupMarkers", () => {
  test("strips markers from a source string", async () => {
    expect(
      await cleanupMarkers(`"use client"

import * as React from "react"
import { cva } from "class-variance-authority"

const itemVariants = cva("cn-item flex items-center", {
  variants: {
    size: { sm: "cn-item-size-sm h-8" },
  },
})

export function Item({ className }: { className?: string }) {
  return (
    <div
      data-slot="item"
      className={cn(itemVariants(), "cn-rtl-flip", className)}
    >
      <span className="cn-rtl-flip" />
      <h2 className="cn-font-heading cn-item-title text-sm" />
    </div>
  )
}
`)
    ).toMatchInlineSnapshot(`
      ""use client"

      import * as React from "react"
      import { cva } from "class-variance-authority"

      const itemVariants = cva("flex items-center", {
        variants: {
          size: { sm: "h-8" },
        },
      })

      export function Item({ className }: { className?: string }) {
        return (
          <div
            data-slot="item"
            className={cn(itemVariants(), "", className)}
          >
            <span />
            <h2 className="cn-font-heading text-sm" />
          </div>
        )
      }
      "
    `)
  })

  test("drops leading comments", async () => {
    // Current behavior: SourceFile.getText() skips leading trivia.
    expect(
      await cleanupMarkers(`// Copyright header.
/* eslint-disable */
"use client"

export const a = <div className="cn-rtl-flip size-4" />
`)
    ).toMatchInlineSnapshot(`
      ""use client"

      export const a = <div className="size-4" />
      "
    `)
    expect(
      await cleanupMarkers(`// No markers here.
export const b = 1
`)
    ).toBe(`export const b = 1
`)
    expect(await cleanupMarkers("\uFEFF  export const c = 1\n")).toBe(
      "export const c = 1\n"
    )
  })

  test("returns input without markers unchanged", async () => {
    const source = `export function Component() {\r\n  return <div className="flex" />\r\n}\r\n`
    expect(await cleanupMarkers(source)).toBe(source)
  })

  test("returns an empty string for empty input", async () => {
    expect(await cleanupMarkers("")).toBe("")
  })
})
