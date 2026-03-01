import { type Config } from "@/src/utils/get-config"
import { transformAsChild } from "@/src/utils/transformers/transform-aschild"
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

describe("transformAsChild", () => {
  describe("DialogTrigger with Button child", () => {
    test("transforms asChild to render prop without nativeButton", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <DialogTrigger asChild>
      <Button variant="outline">Edit Profile</Button>
    </DialogTrigger>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <DialogTrigger render={<Button variant="outline" />}>Edit Profile</DialogTrigger>
          )
        }"
      `)
    })
  })

  describe("DialogTrigger with non-Button child", () => {
    test("transforms asChild to render prop with nativeButton={false}", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <DialogTrigger asChild>
      <a href="#">Open Dialog</a>
    </DialogTrigger>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <DialogTrigger render={<a href="#" />} nativeButton={false}>Open Dialog</DialogTrigger>
          )
        }"
      `)
    })
  })

  describe("Button with anchor child", () => {
    test("transforms asChild to render prop with nativeButton={false}", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <Button asChild>
      <a href="#">Create project</a>
    </Button>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <Button render={<a href="#" />} nativeButton={false}>Create project</Button>
          )
        }"
      `)
    })
  })

  describe("Button with span child", () => {
    test("transforms asChild to render prop with nativeButton={false}", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <Button variant="outline" asChild size="icon" className="w-12">
      <span>1.2K</span>
    </Button>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <Button variant="outline" size="icon" className="w-12" render={<span />} nativeButton={false}>1.2K</Button>
          )
        }"
      `)
    })
  })

  describe("PopoverTrigger with custom component child", () => {
    test("transforms asChild to render prop without nativeButton", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <PopoverTrigger asChild>
      <InputGroupAddon>Click me</InputGroupAddon>
    </PopoverTrigger>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <PopoverTrigger render={<InputGroupAddon />}>Click me</PopoverTrigger>
          )
        }"
      `)
    })
  })

  describe("component with Link child", () => {
    test("transforms asChild to render prop with nativeButton={false}", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <Button asChild>
      <Link href="/">Home</Link>
    </Button>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <Button render={<Link href="/" />} nativeButton={false}>Home</Button>
          )
        }"
      `)
    })
  })

  describe("preserves child props", () => {
    test("preserves className and other attributes on child", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <Button variant="link" asChild className="text-muted-foreground">
      <a href="#" className="font-bold" data-test="link">
        Learn more
      </a>
    </Button>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <Button variant="link" className="text-muted-foreground" render={<a href="#" className="font-bold" data-test="link" />} nativeButton={false}>Learn more
                    </Button>
          )
        }"
      `)
    })
  })

  describe("handles nested children", () => {
    test("preserves complex children content", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <Button asChild>
      <a href="#">
        Learn more <Icon />
      </a>
    </Button>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <Button render={<a href="#" />} nativeButton={false}>Learn more <Icon /></Button>
          )
        }"
      `)
    })
  })

  describe("self-closing child element", () => {
    test("handles self-closing child with no children", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <TooltipTrigger asChild>
      <InputGroupButton size="icon-xs" />
    </TooltipTrigger>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <TooltipTrigger render={<InputGroupButton size="icon-xs" />}></TooltipTrigger>
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
    <DialogTrigger asChild>
      <Button>Open</Button>
    </DialogTrigger>
  )
}`,
            config: {
              ...testConfig,
              style: "new-york",
            },
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <DialogTrigger asChild>
              <Button>Open</Button>
            </DialogTrigger>
          )
        }"
      `)
    })
  })

  describe("multiple asChild elements", () => {
    test("transforms multiple asChild elements in same file", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <div>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
    </div>
  )
}`,
            config: testConfig,
          },
          [transformAsChild]
        )
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <div>
              <DialogTrigger render={<Button variant="outline" />}>Edit Profile</DialogTrigger>
              <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
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
    <DialogTrigger asChild>
      <Button variant="outline">Edit Profile</Button>
    </DialogTrigger>
  )
}`

      const firstRun = await transform(
        {
          filename: "test.tsx",
          raw: input,
          config: testConfig,
        },
        [transformAsChild]
      )

      const secondRun = await transform(
        {
          filename: "test.tsx",
          raw: firstRun,
          config: testConfig,
        },
        [transformAsChild]
      )

      expect(secondRun).toBe(firstRun)
    })
  })
})
