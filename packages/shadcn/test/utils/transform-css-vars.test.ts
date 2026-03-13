import { expect, test } from "vitest"

import { transform } from "../../src/utils/transformers"
import stone from "../fixtures/colors/stone.json"

test("should not transform non-class string literals", async () => {
  const result = await transform({
    filename: "test.ts",
    raw: `import * as React from "react"
export function SpaceBug() {
  const parts = ["a", "b"];
  const value = parts.join(" ");
  return <div className="bg-background">{value}</div>;
}
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

  // The join(" ") should be preserved — not corrupted to join("")
  expect(result).toContain('join(" ")')
  // But className should still be transformed
  expect(result).toContain("bg-white")
})

test("should not transform template literals or non-class strings", async () => {
  const result = await transform({
    filename: "test.ts",
    raw: `import * as React from "react"
export function Foo() {
  const sep = " | ";
  const msg = "Hello World";
  const id = "bg-primary";
  return <div className="bg-background text-foreground" data-testid="my-component">{msg}</div>;
}
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

  // Non-class strings should be preserved
  expect(result).toContain('" | "')
  expect(result).toContain('"Hello World"')
  // Strings in variables that look like class names should NOT be transformed
  // because they're not in a className attribute or class utility call
  expect(result).toContain('"bg-primary"')
  // data-testid should not be transformed
  expect(result).toContain('"my-component"')
  // But className should be transformed
  expect(result).toContain("bg-white")
})

test("should transform clsx() and cva() calls", async () => {
  const result = await transform({
    filename: "test.ts",
    raw: `import * as React from "react"
import { clsx } from "clsx"
import { cva } from "class-variance-authority"

const buttonVariants = cva("bg-primary text-primary-foreground", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      outline: "border border-input bg-background",
    },
  },
});

export function Foo() {
  return <div className={clsx("bg-background", true && "text-foreground")}>foo</div>;
}
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

  // cva base should be transformed
  expect(result).toContain("bg-stone-900")
  // cva variants should be transformed
  expect(result).toContain("bg-stone-50")
  // clsx args inside className should be transformed
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
