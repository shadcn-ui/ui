import { type Config } from "@/src/get-config"
import { transformAsChild } from "@/src/transformers/transform-aschild"
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
    test("transforms asChild to render prop without nativeButton", async () => {
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
            <DialogTrigger render={<a href="#" />}>Open Dialog</DialogTrigger>
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

  describe("Button with Link child", () => {
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

  describe("nested asChild", () => {
    test("transforms inner asChild first, then outer", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <Collapsible asChild>
      <SidebarMenuButton asChild>
        <a href="#">Home</a>
      </SidebarMenuButton>
    </Collapsible>
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
            <Collapsible render={<SidebarMenuButton render={<a href="#" />} />}>Home</Collapsible>
          )
        }"
      `)
    })

    test("adds nativeButton={false} only on nested Button", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <DialogTrigger asChild>
      <Button asChild>
        <a href="#">Open</a>
      </Button>
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
            <DialogTrigger render={<Button render={<a href="#" />} nativeButton={false} />}>Open</DialogTrigger>
          )
        }"
      `)
    })

    test("transforms nested with sibling asChild elements", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <div>
      <Collapsible asChild>
        <SidebarMenuButton asChild>
          <a href="#">Home</a>
        </SidebarMenuButton>
      </Collapsible>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
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
              <Collapsible render={<SidebarMenuButton render={<a href="#" />} />}>Home</Collapsible>
              <DialogTrigger render={<Button variant="outline" />}>Edit</DialogTrigger>
            </div>
          )
        }"
      `)
    })

    test("transforms nested with self-closing inner child", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <Collapsible asChild>
      <SidebarMenuButton asChild>
        <Icon className="size-4" />
      </SidebarMenuButton>
    </Collapsible>
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
            <Collapsible render={<SidebarMenuButton render={<Icon className="size-4" />} />}></Collapsible>
          )
        }"
      `)
    })

    test("transforms triple-nested asChild", async () => {
      expect(
        await transform(
          {
            filename: "test.tsx",
            raw: `import * as React from "react"

export function Component() {
  return (
    <TooltipTrigger asChild>
      <Collapsible asChild>
        <SidebarMenuButton asChild>
          <a href="#">Home</a>
        </SidebarMenuButton>
      </Collapsible>
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
            <TooltipTrigger render={<Collapsible render={<SidebarMenuButton render={<a href="#" />} />} />}>Home</TooltipTrigger>
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

async function transformAsChildIn(raw: string, style = testConfig.style) {
  return transform(
    {
      filename: "test.tsx",
      raw,
      config: { ...testConfig, style },
    },
    [transformAsChild]
  )
}

// Builds `depth` nested asChild elements around a single anchor.
function nestedAsChildSource(depth: number) {
  const lines: string[] = []
  for (let i = 0; i < depth; i++) {
    lines.push(`${"  ".repeat(i + 2)}<Level${i} asChild>`)
  }
  lines.push(`${"  ".repeat(depth + 2)}<a href="#">Home</a>`)
  for (let i = depth - 1; i >= 0; i--) {
    lines.push(`${"  ".repeat(i + 2)}</Level${i}>`)
  }
  return `export function Component() {
  return (
${lines.join("\n")}
  )
}`
}

describe("transformAsChild characterization", () => {
  describe("multi-line input", () => {
    test("joins element children and drops whitespace-only text between them", async () => {
      // Current behavior: whitespace-only JsxText between child elements is dropped.
      expect(
        await transformAsChildIn(`import * as React from "react"

export function Component() {
  return (
    <div>
      <Button variant="ghost" asChild>
        <a href="/docs">
          <BookIcon />
          <span>Docs</span>
        </a>
      </Button>
    </div>
  )
}`)
      ).toMatchInlineSnapshot(`
        "import * as React from "react"

        export function Component() {
          return (
            <div>
              <Button variant="ghost" render={<a href="/docs" />} nativeButton={false}><BookIcon /><span>Docs</span></Button>
            </div>
          )
        }"
      `)
    })

    test("re-indents multi-line text children", async () => {
      // Current behavior: lines after the first get extra indentation from ts-morph.
      expect(
        await transformAsChildIn(`export function Component() {
  return (
    <div>
      <Button variant="link" asChild>
        <a href="/docs">
          Read the
          <strong>docs</strong>
          for more.
        </a>
      </Button>
    </div>
  )
}`)
      ).toMatchInlineSnapshot(`
        "export function Component() {
          return (
            <div>
              <Button variant="link" render={<a href="/docs" />} nativeButton={false}>Read the
                            <strong>docs</strong>for more.
                          </Button>
            </div>
          )
        }"
      `)
    })

    test("collapses multi-line child props onto one line", async () => {
      expect(
        await transformAsChildIn(`export function Component() {
  return (
    <Button asChild>
      <a
        href="#"
        className="font-bold"
        data-test="link"
      >
        Docs
      </a>
    </Button>
  )
}`)
      ).toMatchInlineSnapshot(`
        "export function Component() {
          return (
            <Button render={<a href="#" className="font-bold" data-test="link" />} nativeButton={false}>Docs
                    </Button>
          )
        }"
      `)
    })

    test("re-indents a multi-line child prop value", async () => {
      // Current behavior: lines after the first get extra indentation from ts-morph.
      expect(
        await transformAsChildIn(`export function Component() {
  return (
    <SidebarMenuButton asChild>
      <Link
        href="/"
        className={cn(
          "flex items-center",
          active && "font-medium"
        )}
      >
        Home
      </Link>
    </SidebarMenuButton>
  )
}`)
      ).toMatchInlineSnapshot(`
        "export function Component() {
          return (
            <SidebarMenuButton render={<Link href="/" className={cn(
                        "flex items-center",
                        active && "font-medium"
                      )} />}>Home
                    </SidebarMenuButton>
          )
        }"
      `)
    })

    test("collapses multi-line parent props onto one line", async () => {
      expect(
        await transformAsChildIn(`export function Component() {
  return (
    <Button
      variant="outline"
      size="sm"
      asChild
      className="w-full"
    >
      <a href="#">Docs</a>
    </Button>
  )
}`)
      ).toMatchInlineSnapshot(`
        "export function Component() {
          return (
            <Button variant="outline" size="sm" className="w-full" render={<a href="#" />} nativeButton={false}>Docs</Button>
          )
        }"
      `)
    })
  })

  describe("children text", () => {
    test("drops leading whitespace including NBSP but keeps &nbsp; entities", async () => {
      // Current behavior: JsxText#getText() drops leading whitespace, including NBSP.
      const output = await transformAsChildIn(`export function Component() {
  return (
    <div>
      <Button asChild>
        <a href="#">&nbsp;Next</a>
      </Button>
      <Button asChild>
        <a href="#">\u00a0Next</a>
      </Button>
      <Button asChild>
        <a href="#">   Next   </a>
      </Button>
      <Button asChild>
        <a href="#">Next{" "}<ArrowIcon /></a>
      </Button>
    </div>
  )
}`)
      expect(output.replace(/\u00a0/g, "{NBSP}")).toMatchInlineSnapshot(`
        "export function Component() {
          return (
            <div>
              <Button render={<a href="#" />} nativeButton={false}>&nbsp;Next</Button>
              <Button render={<a href="#" />} nativeButton={false}>Next</Button>
              <Button render={<a href="#" />} nativeButton={false}>Next   </Button>
              <Button render={<a href="#" />} nativeButton={false}>Next{" "}<ArrowIcon /></Button>
            </div>
          )
        }"
      `)
    })

    test("keeps comments inside the child and drops siblings of the child", async () => {
      // Current behavior: text, comments and elements next to the first child element are dropped.
      expect(
        await transformAsChildIn(`export function Component() {
  return (
    <div>
      <Button asChild>
        {/* Link to the docs. */}
        <a href="#">
          {/* Label. */}
          Docs
        </a>
        <span>dropped</span>
      </Button>
      <Button asChild>Go to <a href="#">docs</a></Button>
    </div>
  )
}`)
      ).toMatchInlineSnapshot(`
        "export function Component() {
          return (
            <div>
              <Button render={<a href="#" />} nativeButton={false}>{/* Label. */}Docs
                          </Button>
              <Button render={<a href="#" />} nativeButton={false}>docs</Button>
            </div>
          )
        }"
      `)
    })

    test("keeps expression children", async () => {
      expect(
        await transformAsChildIn(`export function Component({ label }: { label: string }) {
  return (
    <Button asChild>
      <a href="#">{label}</a>
    </Button>
  )
}`)
      ).toMatchInlineSnapshot(`
        "export function Component({ label }: { label: string }) {
          return (
            <Button render={<a href="#" />} nativeButton={false}>{label}</Button>
          )
        }"
      `)
    })
  })

  describe("attributes", () => {
    test("keeps spread props on parent and child", async () => {
      expect(
        await transformAsChildIn(`export function Component(props: ButtonProps) {
  return (
    <Button {...props} asChild>
      <Link {...linkProps} href="/">Home</Link>
    </Button>
  )
}`)
      ).toMatchInlineSnapshot(`
        "export function Component(props: ButtonProps) {
          return (
            <Button {...props} render={<Link {...linkProps} href="/" />} nativeButton={false}>Home</Button>
          )
        }"
      `)
    })

    test("treats asChild={true} and asChild={false} like asChild", async () => {
      // Current behavior: the attribute value is ignored, so asChild={false} is transformed too.
      expect(
        await transformAsChildIn(`export function Component() {
  return (
    <div>
      <Button asChild={true}>
        <a href="#">Yes</a>
      </Button>
      <Button asChild={false}>
        <a href="#">No</a>
      </Button>
    </div>
  )
}`)
      ).toMatchInlineSnapshot(`
        "export function Component() {
          return (
            <div>
              <Button render={<a href="#" />} nativeButton={false}>Yes</Button>
              <Button render={<a href="#" />} nativeButton={false}>No</Button>
            </div>
          )
        }"
      `)
    })

    test("ignores self-closing elements with asChild", async () => {
      const raw = `export function Component() {
  return <Button asChild />
}`
      expect(await transformAsChildIn(raw)).toBe(raw)
    })

    test("removes asChild and its preceding whitespace when there is no child element", async () => {
      expect(
        await transformAsChildIn(`export function Component({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Button asChild>Text only</Button>
      <Slot asChild>{children}</Slot>
      <Button
        variant="outline"
        asChild
      >
        {children}
      </Button>
    </div>
  )
}`)
      ).toMatchInlineSnapshot(`
        "export function Component({ children }: { children: React.ReactNode }) {
          return (
            <div>
              <Button>Text only</Button>
              <Slot>{children}</Slot>
              <Button
                variant="outline"
              >
                {children}
              </Button>
            </div>
          )
        }"
      `)
    })

    test("removes asChild without a child element between replaced siblings", async () => {
      expect(
        await transformAsChildIn(`export const x = (
  <div>
    <Tooltip asChild>
      text
    </Tooltip>
    <Button
      asChild
      size="sm"
    >
      <a
        href="/"
        className="x"
      >
        Home
      </a>
    </Button>
    <Label asChild>{label}</Label>
  </div>
)
`)
      ).toMatchInlineSnapshot(`
        "export const x = (
          <div>
            <Tooltip>
              text
            </Tooltip>
            <Button size="sm" render={<a href="/" className="x" />} nativeButton={false}>Home
                      </Button>
            <Label>{label}</Label>
          </div>
        )
        "
      `)
    })
  })

  describe("nativeButton", () => {
    test("adds nativeButton={false} only for Button with a listed element child", async () => {
      expect(
        await transformAsChildIn(`export function Component() {
  return (
    <div>
      <Button asChild><a href="#">a</a></Button>
      <Button asChild><span>span</span></Button>
      <Button asChild><div>div</div></Button>
      <Button asChild><Link href="/">Link</Link></Button>
      <Button asChild><label htmlFor="x">label</label></Button>
      <Button asChild><Label htmlFor="x">Label</Label></Button>
      <Button asChild><button type="button">button</button></Button>
      <Button asChild><NavLink to="/">NavLink</NavLink></Button>
      <Button asChild><Link.Root href="/">Link.Root</Link.Root></Button>
      <SidebarMenuButton asChild><a href="#">sidebar</a></SidebarMenuButton>
    </div>
  )
}`)
      ).toMatchInlineSnapshot(`
        "export function Component() {
          return (
            <div>
              <Button render={<a href="#" />} nativeButton={false}>a</Button>
              <Button render={<span />} nativeButton={false}>span</Button>
              <Button render={<div />} nativeButton={false}>div</Button>
              <Button render={<Link href="/" />} nativeButton={false}>Link</Button>
              <Button render={<label htmlFor="x" />} nativeButton={false}>label</Button>
              <Button render={<Label htmlFor="x" />} nativeButton={false}>Label</Button>
              <Button render={<button type="button" />}>button</Button>
              <Button render={<NavLink to="/" />}>NavLink</Button>
              <Button render={<Link.Root href="/" />}>Link.Root</Button>
              <SidebarMenuButton render={<a href="#" />}>sidebar</SidebarMenuButton>
            </div>
          )
        }"
      `)
    })
  })

  describe("nesting", () => {
    test("transforms 10 nested levels", async () => {
      expect(await transformAsChildIn(nestedAsChildSource(10)))
        .toMatchInlineSnapshot(`
        "export function Component() {
          return (
            <Level0 render={<Level1 render={<Level2 render={<Level3 render={<Level4 render={<Level5 render={<Level6 render={<Level7 render={<Level8 render={<Level9 render={<a href="#" />} />} />} />} />} />} />} />} />} />}>Home</Level0>
          )
        }"
      `)
    })

    test("leaves the outermost of 11 nested levels untransformed", async () => {
      // Current behavior: MAX_ITERATIONS = 10 stops before the outermost element.
      expect(await transformAsChildIn(nestedAsChildSource(11)))
        .toMatchInlineSnapshot(`
        "export function Component() {
          return (
            <Level0 asChild>
              <Level1 render={<Level2 render={<Level3 render={<Level4 render={<Level5 render={<Level6 render={<Level7 render={<Level8 render={<Level9 render={<Level10 render={<a href="#" />} />} />} />} />} />} />} />} />} />}>Home</Level1>
            </Level0>
          )
        }"
      `)
    })

    test("a second run finishes 11 nested levels", async () => {
      const firstRun = await transformAsChildIn(nestedAsChildSource(11))
      const secondRun = await transformAsChildIn(firstRun)
      expect(secondRun).not.toBe(firstRun)
      expect(secondRun).toMatchInlineSnapshot(`
        "export function Component() {
          return (
            <Level0 render={<Level1 render={<Level2 render={<Level3 render={<Level4 render={<Level5 render={<Level6 render={<Level7 render={<Level8 render={<Level9 render={<Level10 render={<a href="#" />} />} />} />} />} />} />} />} />} />} />}>Home</Level0>
          )
        }"
      `)
    })

    test("running twice on re-indented output is a no-op", async () => {
      const firstRun = await transformAsChildIn(`export function Component() {
  return (
    <Button asChild>
      <a href="#">
        <BookIcon />
        <span>Docs</span>
      </a>
    </Button>
  )
}`)
      expect(await transformAsChildIn(firstRun)).toBe(firstRun)
    })
  })

  describe("styles", () => {
    test("is a no-op for radix styles", async () => {
      const raw = `export function Component() {
  return (
    <Button asChild>
      <a href="#">Docs</a>
    </Button>
  )
}`
      expect(await transformAsChildIn(raw, "radix-nova")).toBe(raw)
    })

    test("runs for any base- style", async () => {
      expect(
        await transformAsChildIn(
          `export function Component() {
  return (
    <Button asChild>
      <a href="#">Docs</a>
    </Button>
  )
}`,
          "base-nova"
        )
      ).toMatchInlineSnapshot(`
        "export function Component() {
          return (
            <Button render={<a href="#" />} nativeButton={false}>Docs</Button>
          )
        }"
      `)
    })
  })

  describe("line endings", () => {
    test("CRLF input", async () => {
      // Current behavior: the replaced element uses LF while the rest keeps CRLF.
      expect(
        JSON.stringify(
          await transformAsChildIn(
            [
              `export function Component() {`,
              `  return (`,
              `    <Button asChild>`,
              `      <a href="#">`,
              `        <BookIcon />`,
              `        Docs`,
              `      </a>`,
              `    </Button>`,
              `  )`,
              `}`,
            ].join("\r\n")
          )
        )
      ).toMatchInlineSnapshot(
        `""export function Component() {\\r\\n  return (\\r\\n    <Button render={<a href=\\"#\\" />} nativeButton={false}><BookIcon />Docs\\n            </Button>\\r\\n  )\\r\\n}""`
      )
    })
  })
})
