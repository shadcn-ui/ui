import { type Config } from "@/src/utils/get-config"
import { transformRender } from "@/src/utils/transformers/transform-render"
import { describe, expect, test } from "vitest"

import { transform } from "."

const testConfig: Config = {
  style: "base-default",
  tsx: true,
  rsc: true,
  tailwind: {
    baseColor: "neutral",
    cssVariables: true,
    config: "tailwind.config.ts",
    css: "tailwind.css",
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
  },
  resolvedPaths: {
    cwd: "/",
    components: "/components",
    utils: "/lib/utils",
    ui: "/ui",
    lib: "/lib",
    hooks: "/hooks",
    tailwindConfig: "tailwind.config.ts",
    tailwindCss: "tailwind.css",
  },
}

describe("transformRender", () => {
  describe("DropdownMenuTrigger with Button render and text children", () => {
    test("moves children into render prop component", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <DropdownMenuTrigger render={<Button className="w-fit" />}>Open</DropdownMenuTrigger>
  )
}`,
            config: testConfig,
          },
          [transformRender]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <DropdownMenuTrigger render={<Button className="w-fit">Open</Button>} />
          )
        }"
      `)
    })
  })

  describe("render prop with multiple props", () => {
    test("preserves all props on render component", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <DialogTrigger render={<Button variant="outline" size="sm" />}>Edit Profile</DialogTrigger>
  )
}`,
            config: testConfig,
          },
          [transformRender]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <DialogTrigger render={<Button variant="outline" size="sm">Edit Profile</Button>} />
          )
        }"
      `)
    })
  })

  describe("render prop with no props on component", () => {
    test("handles render component without props", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <PopoverTrigger render={<Button />}>Click me</PopoverTrigger>
  )
}`,
            config: testConfig,
          },
          [transformRender]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <PopoverTrigger render={<Button>Click me</Button>} />
          )
        }"
      `)
    })
  })

  describe("complex children content", () => {
    test("preserves complex children including JSX", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <TooltipTrigger render={<Button variant="ghost" />}>
      <Icon /> Settings
    </TooltipTrigger>
  )
}`,
            config: testConfig,
          },
          [transformRender]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <TooltipTrigger render={<Button variant="ghost"><Icon />Settings</Button>} />
          )
        }"
      `)
    })
  })

  describe("parent with additional attributes", () => {
    test("preserves parent attributes", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <MenuTrigger className="my-class" disabled render={<Button />}>Open Menu</MenuTrigger>
  )
}`,
            config: testConfig,
          },
          [transformRender]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <MenuTrigger className="my-class" disabled render={<Button>Open Menu</Button>} />
          )
        }"
      `)
    })
  })

  describe("no children", () => {
    test("does not transform when there are no children", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <DropdownMenuTrigger render={<Button className="w-fit" />}></DropdownMenuTrigger>
  )
}`,
            config: testConfig,
          },
          [transformRender]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <DropdownMenuTrigger render={<Button className="w-fit" />}></DropdownMenuTrigger>
          )
        }"
      `)
    })
  })

  describe("render prop already has children", () => {
    test("does not transform when render component already has children", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <DropdownMenuTrigger render={<Button>Existing</Button>}>Ignored</DropdownMenuTrigger>
  )
}`,
            config: testConfig,
          },
          [transformRender]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <DropdownMenuTrigger render={<Button>Existing</Button>}>Ignored</DropdownMenuTrigger>
          )
        }"
      `)
    })
  })

  describe("non-base style", () => {
    test("does not transform when style is not base-*", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <DropdownMenuTrigger render={<Button />}>Open</DropdownMenuTrigger>
  )
}`,
            config: {
              ...testConfig,
              style: "new-york",
            },
          },
          [transformRender]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <DropdownMenuTrigger render={<Button />}>Open</DropdownMenuTrigger>
          )
        }"
      `)
    })
  })

  describe("multiple render elements", () => {
    test("transforms multiple render elements in same file", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <div>
      <DialogTrigger render={<Button variant="outline" />}>Edit</DialogTrigger>
      <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
    </div>
  )
}`,
            config: testConfig,
          },
          [transformRender]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <div>
              <DialogTrigger render={<Button variant="outline">Edit</Button>} />
              <DialogClose render={<Button variant="ghost">Cancel</Button>} />
            </div>
          )
        }"
      `)
    })
  })

  describe("idempotency", () => {
    test("running twice produces same output", async () => {
      const input = `import * as React from "react"

export function Component() {
  return (
    <DropdownMenuTrigger render={<Button className="w-fit" />}>Open</DropdownMenuTrigger>
  )
}`

      const firstRun = await transform(
        {
          filename: "test.tsx",
          raw: input,
          config: testConfig,
        },
        [transformRender]
      )

      const secondRun = await transform(
        {
          filename: "test.tsx",
          raw: firstRun,
          config: testConfig,
        },
        [transformRender]
      )

      expect(secondRun).toBe(firstRun)
    })
  })

  describe("expression children", () => {
    test("handles expression children", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <DropdownMenuTrigger render={<Button />}>{label}</DropdownMenuTrigger>
  )
}`,
            config: testConfig,
          },
          [transformRender]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <DropdownMenuTrigger render={<Button>{label}</Button>} />
          )
        }"
      `)
    })
  })

  describe("anchor render element", () => {
    test("handles anchor tag as render element", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <Button render={<a href="/home" />}>Go Home</Button>
  )
}`,
            config: testConfig,
          },
          [transformRender]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <Button render={<a href="/home">Go Home</a>} />
          )
        }"
      `)
    })
  })
})
