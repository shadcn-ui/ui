import { promises as fs } from "fs"
import os from "os"
import path from "path"
import { afterEach, describe, expect, test } from "vitest"

import { transform } from "."
import { createConfig, type Config } from "../get-config"
import { transformFont } from "./transform-font"

const tempDirs: string[] = []

async function createTestConfig(cssContent: string) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "shadcn-font-"))
  tempDirs.push(tempDir)

  const tailwindCss = path.join(tempDir, "globals.css")
  await fs.writeFile(tailwindCss, cssContent, "utf8")

  return createConfig({
    tailwind: {
      baseColor: "neutral",
    },
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
    },
    resolvedPaths: {
      cwd: tempDir,
      tailwindCss,
    },
  })
}

// Each call gets its own CSS path, so the module-level support cache never
// leaks between tests.
function font(raw: string, config: Config, supportedFontMarkers?: string[]) {
  return transform(
    { filename: "test.tsx", raw, config, supportedFontMarkers },
    [transformFont]
  )
}

const SUPPORTED_CSS = `@theme inline {
  --font-heading: var(--font-sans);
}
`
const UNSUPPORTED_CSS = `@theme inline {
  --font-sans: var(--font-sans);
}
`

const ALL_SITES = `import { cva } from "class-variance-authority"
import { mergeProps } from "@base-ui/react/merge-props"

const titleVariants = cva(\`cn-font-heading  text-xl\`, {
  variants: {
    size: {
      sm: "cn-font-heading text-sm",
      lg: 'text-lg cn-font-heading',
      md: "text-base",
    },
  },
})
const other = cva(["cn-font-heading", "tracking-tight"])

function CardTitle({ className, ...props }) {
  return (
    <div
      data-slot="card-title"
      className={cn("cn-card-title cn-font-heading", className)}
      {...props}
    />
  )
}

function Title({ className, render, ...props }) {
  return useRender({
    props: mergeProps<"h2">(
      {
        className: cn("cn-font-heading", className),
        children: <span className="cn-font-heading  text-sm" />,
        label: \`cn-font-heading\`,
      },
      props
    ),
    render,
  })
}

export function Component({ heading }) {
  return (
    <>
      <h2 className='cn-font-heading   text-xl' />
      <h3 className={\`cn-font-heading text-lg\`} />
      <h4 className={\`cn-font-heading \${heading}\`} />
      <h5 className="text-sm" data-font="cn-font-heading" />
      <h6 classNames={{ title: "cn-font-heading text-xs", body: "text-xs" }} />
    </>
  )
}
`

afterEach(async () => {
  await Promise.all(
    tempDirs
      .splice(0)
      .map((dir) => fs.rm(dir, { recursive: true, force: true }))
  )
})

describe("transformFont", () => {
  test("does not rewrite cn-font-heading unless transformFont is explicitly included", async () => {
    const result = await transform({
      filename: "test.tsx",
      raw: `import * as React from "react"
export function Component() {
  return <h2 className="cn-font-heading text-xl" />
}`,
      config: await createTestConfig(
        `@theme inline { --font-heading: var(--font-heading); }`
      ),
    })

    expect(result).toContain('className="cn-font-heading text-xl"')
  })

  test("rewrites cn-font-heading to font-heading when the project supports it", async () => {
    const result = await transform(
      {
        filename: "test.tsx",
        raw: `import * as React from "react"
export function Component() {
  return <h2 className="cn-font-heading text-xl" />
}`,
        config: await createTestConfig(
          `@theme inline { --font-heading: var(--font-heading); }`
        ),
      },
      [transformFont]
    )

    expect(result).toContain('className="font-heading text-xl"')
    expect(result).not.toContain("cn-font-heading")
  })

  test("removes cn-font-heading when the project does not support it", async () => {
    const result = await transform(
      {
        filename: "test.tsx",
        raw: `import * as React from "react"
export function Component() {
  return <h2 className="cn-font-heading text-xl" />
}`,
        config: await createTestConfig(
          `@theme inline { --font-sans: var(--font-sans); }`
        ),
      },
      [transformFont]
    )

    expect(result).toContain('className="text-xl"')
    expect(result).not.toContain("font-heading")
    expect(result).not.toContain("cn-font-heading")
  })

  test("rewrites cn-font-heading inside cva and mergeProps calls", async () => {
    const result = await transform(
      {
        filename: "test.tsx",
        raw: `import { cva } from "class-variance-authority"
const title = cva("cn-font-heading text-xl", {
  variants: {
    size: {
      sm: "cn-font-heading text-sm",
    },
  },
})

export function Component(props) {
  return mergeProps({ className: "cn-font-heading" }, props)
}`,
        config: await createTestConfig(
          `@theme inline { --font-heading: var(--font-heading); }`
        ),
      },
      [transformFont]
    )

    expect(result).toContain('cva("font-heading text-xl"')
    expect(result).toContain('"font-heading text-sm"')
    expect(result).toContain('{ className: "font-heading" }')
  })

  test("rewrites cn-font-heading when the current install adds heading font support", async () => {
    const result = await transform(
      {
        filename: "test.tsx",
        raw: `import * as React from "react"
export function Component() {
  return <h2 className="cn-font-heading text-xl" />
}`,
        config: await createTestConfig(
          `@theme inline { --font-sans: var(--font-sans); }`
        ),
        supportedFontMarkers: ["cn-font-heading"],
      },
      [transformFont]
    )

    expect(result).toContain('className="font-heading text-xl"')
    expect(result).not.toContain("cn-font-heading")
  })

  test("removes an empty className attribute when it only contains cn-font-heading", async () => {
    const result = await transform(
      {
        filename: "test.tsx",
        raw: `import * as React from "react"
export function Component() {
  return <h2 className="cn-font-heading" />
}`,
        config: await createTestConfig(
          `@theme inline { --font-sans: var(--font-sans); }`
        ),
      },
      [transformFont]
    )

    expect(result).toContain("<h2 />")
    expect(result).not.toContain("className")
  })

  test("rewrites every class string site when supported", async () => {
    expect(await font(ALL_SITES, await createTestConfig(SUPPORTED_CSS)))
      .toMatchInlineSnapshot(`
      "import { cva } from "class-variance-authority"
      import { mergeProps } from "@base-ui/react/merge-props"

      const titleVariants = cva(\`font-heading text-xl\`, {
        variants: {
          size: {
            sm: "font-heading text-sm",
            lg: 'text-lg font-heading',
            md: "text-base",
          },
        },
      })
      const other = cva(["font-heading", "tracking-tight"])

      function CardTitle({ className, ...props }) {
        return (
          <div
            data-slot="card-title"
            className={cn("cn-card-title font-heading", className)}
            {...props}
          />
        )
      }

      function Title({ className, render, ...props }) {
        return useRender({
          props: mergeProps<"h2">(
            {
              className: cn("font-heading", className),
              children: <span className="font-heading text-sm" />,
              label: \`font-heading\`,
            },
            props
          ),
          render,
        })
      }

      export function Component({ heading }) {
        return (
          <>
            <h2 className='font-heading text-xl' />
            <h3 className={\`font-heading text-lg\`} />
            <h4 className={\`cn-font-heading \${heading}\`} />
            <h5 className="text-sm" data-font="cn-font-heading" />
            <h6 classNames={{ title: "font-heading text-xs", body: "text-xs" }} />
          </>
        )
      }
      "
    `)
  })

  test("removes the marker from every class string site when unsupported", async () => {
    expect(await font(ALL_SITES, await createTestConfig(UNSUPPORTED_CSS)))
      .toMatchInlineSnapshot(`
      "import { cva } from "class-variance-authority"
      import { mergeProps } from "@base-ui/react/merge-props"

      const titleVariants = cva(\`text-xl\`, {
        variants: {
          size: {
            sm: "text-sm",
            lg: 'text-lg',
            md: "text-base",
          },
        },
      })
      const other = cva(["", "tracking-tight"])

      function CardTitle({ className, ...props }) {
        return (
          <div
            data-slot="card-title"
            className={cn("cn-card-title", className)}
            {...props}
          />
        )
      }

      function Title({ className, render, ...props }) {
        return useRender({
          props: mergeProps<"h2">(
            {
              className: cn("", className),
              children: <span className="text-sm" />,
              label: \`\`,
            },
            props
          ),
          render,
        })
      }

      export function Component({ heading }) {
        return (
          <>
            <h2 className='text-xl' />
            <h3 className={\`text-lg\`} />
            <h4 className={\`cn-font-heading \${heading}\`} />
            <h5 className="text-sm" data-font="cn-font-heading" />
            <h6 classNames={{ title: "text-xs", body: "text-xs" }} />
          </>
        )
      }
      "
    `)
  })

  test("removes className and classNames attributes that become empty", async () => {
    expect(
      await font(
        `export function Component() {
  return (
    <>
      <h2
        id="title"
        className="cn-font-heading"
      >
        Title
      </h2>
      <h3 className="cn-font-heading" id="sub" />
      <h4 classNames="  cn-font-heading  " />
    </>
  )
}
`,
        await createTestConfig(UNSUPPORTED_CSS)
      )
    ).toMatchInlineSnapshot(`
      "export function Component() {
        return (
          <>
            <h2
              id="title"
            >
              Title
            </h2>
            <h3 id="sub" />
            <h4 />
          </>
        )
      }
      "
    `)
  })

  test("uses supportedFontMarkers without a tailwind CSS file", async () => {
    const config = createConfig({
      tailwind: { baseColor: "neutral" },
      aliases: { components: "@/components", utils: "@/lib/utils" },
    })
    const raw = `export const a = <h2 className="cn-font-heading text-xl" />
`
    expect(await font(raw, config)).toBe(
      `export const a = <h2 className="text-xl" />
`
    )
    expect(await font(raw, config, ["cn-font-heading"])).toBe(
      `export const a = <h2 className="font-heading text-xl" />
`
    )
    expect(await font(raw, config, ["cn-font-sans"])).toBe(
      `export const a = <h2 className="text-xl" />
`
    )
  })

  test("treats a missing tailwind CSS file as unsupported", async () => {
    const config = await createTestConfig(SUPPORTED_CSS)
    config.resolvedPaths.tailwindCss = path.join(
      config.resolvedPaths.cwd,
      "missing.css"
    )
    expect(
      await font(
        `export const a = <h2 className="cn-font-heading text-xl" />
`,
        config
      )
    ).toBe(`export const a = <h2 className="text-xl" />
`)
  })

  test("requires the --font-heading: declaration, not just a reference", async () => {
    expect(
      await font(
        `export const a = <h2 className="cn-font-heading text-xl" />
`,
        await createTestConfig(`h1 {
  font-family: var(--font-heading);
}
`)
      )
    ).toBe(`export const a = <h2 className="text-xl" />
`)
  })

  test("caches support per CSS path", async () => {
    // The first read decides support for this path for the rest of the process.
    const config = await createTestConfig(UNSUPPORTED_CSS)
    const raw = `export const a = <h2 className="cn-font-heading text-xl" />
`
    expect(await font(raw, config)).toBe(
      `export const a = <h2 className="text-xl" />
`
    )
    await fs.writeFile(config.resolvedPaths.tailwindCss, SUPPORTED_CSS, "utf8")
    expect(await font(raw, config)).toBe(
      `export const a = <h2 className="text-xl" />
`
    )
  })

  test("matches the marker on word boundaries inside larger tokens", async () => {
    // Current behavior: variant-prefixed or suffixed tokens are rewritten in
    // place, which leaves "md:" and "-xl" behind when unsupported.
    const raw = `export const a = <h2 className="md:cn-font-heading cn-font-heading-xl text-xl" />
`
    expect(await font(raw, await createTestConfig(SUPPORTED_CSS))).toBe(
      `export const a = <h2 className="md:font-heading font-heading-xl text-xl" />
`
    )
    expect(await font(raw, await createTestConfig(UNSUPPORTED_CSS))).toBe(
      `export const a = <h2 className="md: -xl text-xl" />
`
    )
  })

  test("keeps CRLF line endings when removing an attribute", async () => {
    expect(
      await font(
        'export function Component() {\r\n  return (\r\n    <h2\r\n      id="a"\r\n      className="cn-font-heading"\r\n    >\r\n      <span className={cn("cn-font-heading  text-sm")} />\r\n    </h2>\r\n  )\r\n}\r\n',
        await createTestConfig(UNSUPPORTED_CSS)
      )
    ).toBe(
      'export function Component() {\r\n  return (\r\n    <h2\r\n      id="a"\r\n    >\r\n      <span className={cn("text-sm")} />\r\n    </h2>\r\n  )\r\n}\r\n'
    )
  })
})
