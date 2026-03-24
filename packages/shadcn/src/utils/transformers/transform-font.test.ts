import { promises as fs } from "fs"
import os from "os"
import path from "path"
import { afterEach, describe, expect, test } from "vitest"

import { transform } from "."
import { createConfig } from "../get-config"
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
})
