import { promises as fs } from "fs"
import { tmpdir } from "os"
import path from "path"
import {
  installDependencies,
  removeDependencies,
} from "@/src/utils/updaters/update-dependencies"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { createCnTransformer } from "./cn/transform"
import { migrateCn, transformCnSource } from "./migrate-cn"

vi.mock("@/src/utils/spinner", () => ({
  spinner: vi.fn(() => ({
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn(),
    fail: vi.fn(),
    text: "",
  })),
}))

vi.mock("@/src/utils/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    break: vi.fn(),
  },
}))

vi.mock("@/src/utils/updaters/update-dependencies", () => ({
  installDependencies: vi.fn(),
  removeDependencies: vi.fn(),
}))

describe("transformCnSource", () => {
  it("replaces an exported shadcn helper with a direct re-export", () => {
    const result =
      transformCnSource(`import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`)

    expect(result.content.trim()).toBe('export { cn } from "cn";')
    expect(result.migratedPackages).toEqual(["clsx", "tailwind-merge"])
    expect(result.remainingPackages).toEqual([])
  })

  it("replaces a separately exported function declaration", () => {
    const result = transformCnSource(`import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export { cn }
`)

    expect(result.content.trim()).toBe('export { cn } from "cn";')
  })

  it("replaces a separately exported const declaration", () => {
    const result = transformCnSource(`import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const cn = (...inputs) => twMerge(clsx(inputs))

export { cn }
`)

    expect(result.content.trim()).toBe('export { cn } from "cn";')
  })

  it("preserves an aliased public export", () => {
    const result = transformCnSource(`import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const cx = (...inputs) => twMerge(clsx(inputs))

export { cx }
`)

    expect(result.content.trim()).toBe('export { cn as cx } from "cn";')
  })

  it("keeps a locally used helper and aliases the package import", () => {
    const result =
      transformCnSource(`import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const buttonClassName = cn("px-2", "px-4")

export { buttonClassName, cn }
`)

    expect(result.content).toContain(
      'import { cn as cnMerge, type ClassValue } from "cn"'
    )
    expect(result.content).toContain("return cnMerge(...inputs)")
    expect(result.content).toContain("export { buttonClassName, cn }")
    expect(result.content).not.toContain('from "clsx"')
    expect(result.content).not.toContain('from "tailwind-merge"')
  })

  it("preserves a default-exported helper", () => {
    const result = transformCnSource(`import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const cn = (...inputs) => twMerge(clsx(inputs))

export default cn
`)

    expect(result.content).toContain('import { cn as cnMerge } from "cn"')
    expect(result.content).toContain(
      "const cn = (...inputs) => cnMerge(...inputs)"
    )
    expect(result.content).toContain("export default cn")
  })

  it("preserves an inline default export when collapsing a helper", () => {
    const result = transformCnSource(`import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export default function cn(...inputs) {
  return twMerge(clsx(inputs))
}
`)

    expect(result.content.trim()).toBe('export { cn as default } from "cn";')
  })

  it("preserves named and default exports for the same helper", () => {
    const result = transformCnSource(`import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export default function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export { cn }
`)

    expect(result.content).toContain("cn as default")
    expect(result.content).toMatch(/export \{[^}]*\bcn\b[^}]*\} from "cn"/)
  })

  it("does not crash on an anonymous default-exported helper", () => {
    const result = transformCnSource(`import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export default function (...inputs) {
  return twMerge(clsx(inputs))
}
`)

    expect(result.content).toContain('import { cn } from "cn"')
    expect(result.content).toContain("export default function (...inputs)")
    expect(result.content).toContain("return cn(...inputs)")
  })

  it("collapses helpers that spread their rest parameter into clsx", () => {
    const result = transformCnSource(`import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(...inputs))
}
`)

    expect(result.content.trim()).toBe('export { cn } from "cn";')
  })

  it("rewrites a composed default clsx import", () => {
    const result = transformCnSource(`import cx from "clsx"
import { twMerge as merge } from "tailwind-merge"

const className = merge(cx("px-2", active && "px-4"))
`)

    expect(result.content).toContain('import { cn } from "cn"')
    expect(result.content).toContain(
      'const className = cn("px-2", active && "px-4")'
    )
    expect(result.content).not.toContain("clsx")
    expect(result.content).not.toContain("tailwind-merge")
  })

  it("flattens clsx calls mixed with other twMerge arguments", () => {
    const result = transformCnSource(`import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const className = twMerge("px-1", clsx(active && "px-2"), "px-4")
`)

    expect(result.content).toContain(
      'const className = cn("px-1", active && "px-2", "px-4")'
    )
  })

  it("keeps separate clsx and twMerge calls as separate APIs", () => {
    const result = transformCnSource(`import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const conditional = clsx("flex", enabled && "block")
const merged = twMerge("px-2 px-4")
`)

    expect(result.content).toContain('import { clsx, twMerge } from "cn"')
    expect(result.content).toContain(
      'const conditional = clsx("flex", enabled && "block")'
    )
    expect(result.content).toContain('const merged = twMerge("px-2 px-4")')
  })

  it("swaps cnfast module specifiers without changing its API", () => {
    const result =
      transformCnSource(`import { cn, clsx, twMerge, twJoin } from "cnfast"

export { cn as merge } from "cnfast"
export * from "cnfast"
export const loadCn = () => import("cnfast")
export const runtime = require("cnfast")
export const classes = cn(clsx("px-2"), twMerge("px-4"), twJoin("flex"))
`)

    expect(result.content).not.toContain('"cnfast"')
    expect(result.content).toContain(
      'import { cn, clsx, twMerge, twJoin } from "cn"'
    )
    expect(result.content).toContain('export { cn as merge } from "cn"')
    expect(result.content).toContain('export * from "cn"')
    expect(result.content).toContain('import("cn")')
    expect(result.content).toContain('require("cn")')
    expect(result.migratedPackages).toEqual(["cnfast"])
    expect(result.remainingPackages).toEqual([])
    expect(result.unsupported).toEqual([])
  })

  it("splits root and custom-config imports", () => {
    const result = transformCnSource(`import {
  twMerge,
  extendTailwindMerge,
  createTailwindMerge,
  getDefaultConfig,
  type ConfigExtension,
} from "tailwind-merge"

export { twMerge, extendTailwindMerge, createTailwindMerge, getDefaultConfig }
export type { ConfigExtension }
`)

    expect(result.content).toContain('import { twMerge } from "cn"')
    expect(result.content).toContain(
      'import { extendTailwindMerge, createTwMerge as createTailwindMerge, defaultConfig as getDefaultConfig, type ConfigExtension } from "cn/config"'
    )
    expect(result.remainingPackages).toEqual([])
  })

  it("moves clsx/lite runtime imports and root types separately", () => {
    const result =
      transformCnSource(`import clsx, { type ClassValue } from "clsx/lite"

export const classes = (...inputs: ClassValue[]) => clsx(inputs)
`)

    expect(result.content).toContain('import { clsx } from "cn/lite"')
    expect(result.content).toContain('import { type ClassValue } from "cn"')
  })

  it("maps a named default clsx import to the named cn export", () => {
    const result = transformCnSource(`import { default as cx } from "clsx/lite"

export const classes = cx("flex", active && "block")
`)

    expect(result.content).toContain('import { clsx as cx } from "cn/lite"')
    expect(result.content).not.toContain('from "clsx/lite"')
  })

  it("migrates clsx imports in JavaScript files", () => {
    const result = transformCnSource(
      `import { clsx } from "clsx"

export const classes = clsx("flex")
`,
      "classes.js"
    )

    expect(result.content).toContain('import { clsx } from "cn"')
    expect(result.content).toContain('export const classes = clsx("flex")')
  })

  it("migrates CommonJS requires in cjs files", () => {
    const result = transformCnSource(
      `const cx = require("clsx")

module.exports = cx("flex")
`,
      "classes.cjs"
    )

    expect(result.content).toContain('const cx = require("cn").clsx')
    expect(result.content).toContain('module.exports = cx("flex")')
  })

  it("migrates compositions in JSX files", () => {
    const result = transformCnSource(
      `import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const element = <div className={twMerge(clsx("px-2"))} />
`,
      "component.jsx"
    )

    expect(result.content).toContain('import { cn } from "cn"')
    expect(result.content).toContain('<div className={cn("px-2")} />')
  })

  it("leaves direct validator calls for manual review", () => {
    const result =
      transformCnSource(`import { validators } from "tailwind-merge"

export const valid = validators.isNumber("2")
`)

    expect(result.content).toContain('from "tailwind-merge"')
    expect(result.remainingPackages).toEqual(["tailwind-merge"])
    expect(result.unsupported).toContainEqual({
      packageName: "tailwind-merge",
      symbol: "validators",
      reason: "callable validators are not supported by cn",
    })
  })

  it("leaves destructured validators for manual review", () => {
    const result =
      transformCnSource(`import { validators } from "tailwind-merge"

const { isNumber } = validators
export const valid = isNumber("2")
`)

    expect(result.content).toContain('from "tailwind-merge"')
    expect(result.unsupported).toContainEqual({
      packageName: "tailwind-merge",
      symbol: "validators",
      reason: "callable validators are not supported by cn",
    })
  })

  it("migrates validators used as configuration markers", () => {
    const result = transformCnSource(`import {
  extendTailwindMerge,
  validators,
} from "tailwind-merge"

export const merge = extendTailwindMerge({
  extend: { classGroups: { tab: [validators.isNumber] } },
})
`)

    expect(result.content).toContain(
      'import { extendTailwindMerge, validators } from "cn/config"'
    )
    expect(result.remainingPackages).toEqual([])
  })

  it("leaves variadic createTailwindMerge calls for manual review", () => {
    const result =
      transformCnSource(`import { createTailwindMerge } from "tailwind-merge"

export const merge = createTailwindMerge(() => config, () => extension)
`)

    expect(result.content).toContain('from "tailwind-merge"')
    expect(result.unsupported).toContainEqual({
      packageName: "tailwind-merge",
      symbol: "createTailwindMerge",
      reason: "variadic createTailwindMerge calls are not supported by cn",
    })
  })

  it("leaves unsupported experimental imports for manual review", () => {
    const result = transformCnSource(`import {
  twMerge,
  type ExperimentalParseClassNameParam,
} from "tailwind-merge"

export { twMerge }
export type { ExperimentalParseClassNameParam }
`)

    expect(result.content).toContain('import { twMerge } from "cn"')
    expect(result.content).toContain("type ExperimentalParseClassNameParam")
    expect(result.content).toContain('from "tailwind-merge"')
    expect(result.remainingPackages).toEqual(["tailwind-merge"])
    expect(result.unsupported).toEqual([
      {
        packageName: "tailwind-merge",
        symbol: "ExperimentalParseClassNameParam",
        reason: "experimentalParseClassName is not supported by cn",
      },
    ])
  })

  it("reports dynamic imports without changing them", () => {
    const input = `export const loadMerge = () => import("tailwind-merge")
`
    const result = transformCnSource(input)

    expect(result.content).toBe(input)
    expect(result.remainingPackages).toEqual(["tailwind-merge"])
    expect(result.unsupported).toEqual([
      {
        packageName: "tailwind-merge",
        reason: "dynamic imports require manual migration",
      },
    ])
  })

  it("reports export-from declarations without changing them", () => {
    const input = `export { twMerge } from "tailwind-merge"
export * from "clsx"
`
    const result = transformCnSource(input)

    expect(result.content).toBe(input)
    expect(result.remainingPackages).toEqual(["clsx", "tailwind-merge"])
    expect(result.unsupported).toEqual([
      {
        packageName: "tailwind-merge",
        symbol: "twMerge",
        reason: "export-from declarations require manual migration",
      },
      {
        packageName: "clsx",
        reason: "export-from declarations require manual migration",
      },
    ])
  })

  it("migrates supported CommonJS requires", () => {
    const result = transformCnSource(`const cx = require("clsx")
const { twMerge } = require("tailwind-merge")

module.exports = (...inputs) => twMerge(cx(inputs))
`)

    expect(result.content).toContain('const { cn } = require("cn")')
    expect(result.content).toContain(
      "module.exports = (...inputs) => cn(...inputs)"
    )
    expect(result.content).not.toContain("const cx")
    expect(result.content).not.toContain("twMerge")
    expect(result.remainingPackages).toEqual([])
  })

  it("keeps referenced CommonJS clsx bindings on cn", () => {
    const result = transformCnSource(`const cx = require("clsx")
const { twMerge } = require("tailwind-merge")

const merged = twMerge(cx("px-2", "px-4"))
const joined = cx("flex", active && "block")

module.exports = { merged, joined }
`)

    expect(result.content).toContain('const cx = require("cn").clsx')
    expect(result.content).toContain('const { cn } = require("cn")')
    expect(result.content).toContain('const merged = cn("px-2", "px-4")')
    expect(result.content).toContain(
      'const joined = cx("flex", active && "block")'
    )
  })

  it("leaves unsafe CommonJS config calls for manual review", () => {
    const result =
      transformCnSource(`const { validators } = require("tailwind-merge")

module.exports = validators.isNumber("2")
`)

    expect(result.content).toContain('require("tailwind-merge")')
    expect(result.unsupported).toContainEqual({
      packageName: "tailwind-merge",
      symbol: "validators",
      reason: "callable validators are not supported by cn",
    })
  })

  it("reports CommonJS requires that span multiple cn entrypoints", () => {
    const result = transformCnSource(`const {
  twMerge,
  extendTailwindMerge,
} = require("tailwind-merge")

module.exports = { twMerge, extendTailwindMerge }
`)

    expect(result.content).toContain('require("tailwind-merge")')
    expect(result.unsupported).toContainEqual({
      packageName: "tailwind-merge",
      reason: "mixed or unsupported CommonJS exports require manual migration",
    })
  })

  it("transforms Vue script blocks without changing the template", () => {
    const result = transformCnSource(
      `<script setup lang="ts">
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const classes = twMerge(clsx("px-2", active && "px-4"))
</script>

<template><div :class="classes" /></template>
`,
      "component.vue"
    )

    expect(result.content).toContain('import { cn } from "cn"')
    expect(result.content).toContain(
      'const classes = cn("px-2", active && "px-4")'
    )
    expect(result.content).toContain(
      '<template><div :class="classes" /></template>'
    )
  })

  it("preserves Vue imports referenced only by the template", () => {
    const result = transformCnSource(
      `<script setup lang="ts">
import { clsx } from "clsx"
</script>

<template><div :class="clsx('flex', active && 'block')" /></template>
`,
      "component.vue"
    )

    expect(result.content).toContain('import { clsx } from "cn"')
    expect(result.content).toContain(
      `<template><div :class="clsx('flex', active && 'block')" /></template>`
    )
  })

  it("transforms browser-tolerated script closing tags", () => {
    const result = transformCnSource(
      `<script setup lang="ts">
import { clsx } from "clsx"

const classes = clsx("flex")
</script\t\n bar>

<template><div :class="classes" /></template>
`,
      "component.vue"
    )

    expect(result.content).toContain('import { clsx } from "cn"')
    expect(result.content).toContain('const classes = clsx("flex")')
    expect(result.content).toContain("</script\t\n bar>")
  })

  it("preserves Svelte imports referenced only by the markup", () => {
    const result = transformCnSource(
      `<script lang="ts">
import { clsx } from "clsx"
</script>

<div class={clsx("flex", active && "block")} />
`,
      "component.svelte"
    )

    expect(result.content).toContain('import { clsx } from "cn"')
    expect(result.content).toContain(
      '<div class={clsx("flex", active && "block")} />'
    )
  })

  it("transforms plain JavaScript Svelte script blocks", () => {
    const result = transformCnSource(
      `<script>
import { clsx } from "clsx"

const classes = clsx("flex", active && "block")
</script>

<div class={classes} />
`,
      "component.svelte"
    )

    expect(result.content).toContain('import { clsx } from "cn"')
    expect(result.content).toContain(
      'const classes = clsx("flex", active && "block")'
    )
  })

  it("transforms Astro frontmatter", () => {
    const result = transformCnSource(
      `---
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const classes = twMerge(clsx("px-2", Astro.props.className))
---

<div class={classes}><slot /></div>
`,
      "component.astro"
    )

    expect(result.content).toContain('import { cn } from "cn"')
    expect(result.content).toContain(
      'const classes = cn("px-2", Astro.props.className)'
    )
  })

  it("preserves Astro imports referenced only by the template", () => {
    const result = transformCnSource(
      `---
import { clsx } from "clsx"
---

<div class={clsx("flex", Astro.props.active && "block")} />
`,
      "component.astro"
    )

    expect(result.content).toContain('import { clsx } from "cn"')
    expect(result.content).toContain(
      '<div class={clsx("flex", Astro.props.active && "block")} />'
    )
  })

  it("parses legacy TypeScript assertions without treating them as JSX", () => {
    const result = transformCnSource(
      `import { clsx } from "clsx"

const element = <HTMLInputElement>document.getElementById("field")
export const classes = clsx("flex", element.disabled && "opacity-50")
`,
      "classes.ts"
    )

    expect(result.content).toContain('import { clsx } from "cn"')
    expect(result.content).toContain(
      'const element = <HTMLInputElement>document.getElementById("field")'
    )
    expect(result.content).toContain(
      'export const classes = clsx("flex", element.disabled && "opacity-50")'
    )
  })

  it("uses the script language when parsing embedded TypeScript", () => {
    const result = transformCnSource(
      `<script setup lang="ts">
import { clsx } from "clsx"

const element = <HTMLInputElement>document.getElementById("field")
const classes = clsx("flex", element.disabled && "opacity-50")
</script>

<template><div :class="classes" /></template>
`,
      "component.vue"
    )

    expect(result.content).toContain('import { clsx } from "cn"')
    expect(result.content).toContain(
      'const element = <HTMLInputElement>document.getElementById("field")'
    )
  })

  it("does not retain imports for shadowed ESM bindings", () => {
    const result = transformCnSource(`import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const merged = twMerge(clsx("px-2", "px-4"))

export function join(clsx) {
  return clsx("flex")
}
`)

    expect(result.content).toContain('import { cn } from "cn"')
    expect(result.content).not.toMatch(/import \{[^}]*clsx[^}]*\} from "cn"/)
    expect(result.content).toContain('return clsx("flex")')
  })

  it("does not retain references from earlier transformed files", () => {
    const transform = createCnTransformer()
    transform(
      `import { cn } from "./utils"

export const classes = cn("px-2")
`,
      "/repo/src/lib/button.tsx"
    )
    const utils = transform(
      `import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
`,
      "/repo/src/lib/utils.ts"
    )

    expect(utils.content.trim()).toBe('export { cn } from "cn";')
  })

  it("is idempotent", () => {
    const input = `import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const classes = twMerge(clsx("px-2", active && "px-4"))
`
    const first = transformCnSource(input)
    const second = transformCnSource(first.content)

    expect(second.content).toBe(first.content)
    expect(second.changes).toBe(0)
  })

  it("does not replace unrelated functions with the same names", () => {
    const input = `function clsx(value) {
  return value
}

function twMerge(value) {
  return value
}

export const cn = (value) => twMerge(clsx(value))
`

    expect(transformCnSource(input).content).toBe(input)
  })

  it("preserves leading comments in unchanged files", () => {
    const input = `/**
 * This component is adapted from an external example.
 */
"use client"

export const classes = "flex"
`
    const result = transformCnSource(input)

    expect(result.content).toBe(input)
    expect(result.changes).toBe(0)
  })

  it("preserves leading comments in migrated files", () => {
    const result =
      transformCnSource(`// Copyright Example Authors. Licensed under MIT.
// This file is generated.

import { clsx } from "clsx"

export const classes = clsx("flex")
`)

    expect(result.content)
      .toBe(`// Copyright Example Authors. Licensed under MIT.
// This file is generated.

import { clsx } from "cn";

export const classes = clsx("flex")
`)
  })
})

describe("migrateCn", () => {
  let cwd: string

  beforeEach(async () => {
    cwd = await fs.mkdtemp(path.join(tmpdir(), "shadcn-cn-migrate-"))
    await fs.mkdir(path.join(cwd, "src"), { recursive: true })
    vi.mocked(installDependencies).mockReset().mockResolvedValue(undefined)
    vi.mocked(removeDependencies).mockReset().mockResolvedValue(undefined)
  })

  afterEach(async () => {
    await fs.rm(cwd, { recursive: true, force: true })
  })

  async function setupProject({
    source,
    dependencies,
  }: {
    source: string
    dependencies: Record<string, string>
  }) {
    await fs.writeFile(
      path.join(cwd, "package.json"),
      JSON.stringify({ name: "fixture", dependencies }, null, 2)
    )
    await fs.writeFile(path.join(cwd, "src/classes.ts"), source)
  }

  it("requires package.json without requiring components.json", async () => {
    await expect(migrateCn({ cwd, yes: true })).rejects.toThrow(
      "No `package.json` file found"
    )
    expect(installDependencies).not.toHaveBeenCalled()
  })

  it("migrates a package project without components.json", async () => {
    await setupProject({
      source: `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`,
      dependencies: {
        clsx: "^2.1.1",
        "tailwind-merge": "^3.3.1",
        tailwindcss: "^4.1.0",
      },
    })
    await migrateCn({ cwd, yes: true })

    expect(
      (await fs.readFile(path.join(cwd, "src/classes.ts"), "utf-8")).trim()
    ).toBe('export { cn } from "cn";')
    expect(installDependencies).toHaveBeenCalledWith(cwd, ["cn"])
    expect(removeDependencies).toHaveBeenCalledWith(cwd, [
      "clsx",
      "tailwind-merge",
    ])
  })

  it("retains old dependencies for a scoped migration", async () => {
    await setupProject({
      source: `import { clsx } from "clsx"

export const classes = clsx("flex")
`,
      dependencies: { clsx: "^2.1.1" },
    })
    await migrateCn({ cwd, path: "src/classes.ts", yes: true })

    expect(installDependencies).toHaveBeenCalledWith(cwd, ["cn"])
    expect(removeDependencies).not.toHaveBeenCalled()
  })

  it("does not write source files when installing cn fails", async () => {
    const source = `import { clsx } from "clsx"

export const classes = clsx("flex")
`
    await setupProject({
      source,
      dependencies: { clsx: "^2.1.1" },
    })

    vi.mocked(installDependencies).mockRejectedValue(
      new Error("install failed")
    )

    await expect(migrateCn({ cwd, yes: true })).rejects.toThrow(
      "install failed"
    )
    expect(await fs.readFile(path.join(cwd, "src/classes.ts"), "utf-8")).toBe(
      source
    )
  })

  it("refuses to migrate tailwind-merge v2 projects", async () => {
    const source = `import { twMerge } from "tailwind-merge"

export const classes = twMerge("px-2 px-4")
`
    await setupProject({
      source,
      dependencies: {
        "tailwind-merge": "^2.6.0",
        tailwindcss: "^3.4.0",
      },
    })
    await expect(migrateCn({ cwd, yes: true })).rejects.toThrow(
      "requires Tailwind CSS v4"
    )
    expect(installDependencies).not.toHaveBeenCalled()
    expect(await fs.readFile(path.join(cwd, "src/classes.ts"), "utf-8")).toBe(
      source
    )
  })

  it("refuses versions older than the supported Tailwind pair", async () => {
    const source = `import { twMerge } from "tailwind-merge"

export const classes = twMerge("px-2 px-4")
`
    await setupProject({
      source,
      dependencies: {
        "tailwind-merge": "^1.14.0",
        tailwindcss: "^2.2.19",
      },
    })
    await expect(migrateCn({ cwd, yes: true })).rejects.toThrow(
      "requires Tailwind CSS v4"
    )
    expect(installDependencies).not.toHaveBeenCalled()
  })

  it("allows a clsx-only migration in a Tailwind CSS v3 project", async () => {
    await setupProject({
      source: `import clsx from "clsx"

export const classes = clsx("flex")
`,
      dependencies: {
        clsx: "^2.1.1",
        tailwindcss: "^3.4.0",
      },
    })
    await migrateCn({ cwd, yes: true })

    expect(installDependencies).toHaveBeenCalledWith(cwd, ["cn"])
    expect(removeDependencies).toHaveBeenCalledWith(cwd, ["clsx"])
  })

  it("migrates cnfast and removes its dependency", async () => {
    await setupProject({
      source: `export { cn } from "cnfast"
`,
      dependencies: { cnfast: "^0.1.0" },
    })
    await migrateCn({ cwd, yes: true })

    expect(
      (await fs.readFile(path.join(cwd, "src/classes.ts"), "utf-8")).trim()
    ).toBe('export { cn } from "cn"')
    expect(installDependencies).toHaveBeenCalledWith(cwd, ["cn"])
    expect(removeDependencies).toHaveBeenCalledWith(cwd, ["cnfast"])
  })

  it("scans dot directories before removing old dependencies", async () => {
    await setupProject({
      source: `import { clsx } from "clsx"

export const classes = clsx("flex")
`,
      dependencies: { clsx: "^2.1.1" },
    })
    await fs.mkdir(path.join(cwd, ".storybook"), { recursive: true })
    await fs.writeFile(
      path.join(cwd, ".storybook/preview.ts"),
      'export * from "clsx"\n'
    )
    await migrateCn({ cwd, yes: true })

    expect(removeDependencies).not.toHaveBeenCalled()
  })

  it("does not migrate files ignored by .gitignore", async () => {
    const source = `import { clsx } from "clsx"

export const classes = clsx("flex")
`
    await setupProject({
      source,
      dependencies: { clsx: "^2.1.1" },
    })
    await fs.mkdir(path.join(cwd, "ignored"), { recursive: true })
    await fs.writeFile(path.join(cwd, ".gitignore"), "ignored/\n")
    await fs.writeFile(path.join(cwd, "ignored/classes.ts"), source)

    await migrateCn({ cwd, yes: true })

    expect(
      (await fs.readFile(path.join(cwd, "src/classes.ts"), "utf-8")).trim()
    ).toBe('import { clsx } from "cn";\n\nexport const classes = clsx("flex")')
    expect(
      await fs.readFile(path.join(cwd, "ignored/classes.ts"), "utf-8")
    ).toBe(source)
  })

  it("throws when an explicit glob matches no files", async () => {
    await setupProject({
      source: `export const classes = "flex"
`,
      dependencies: {},
    })

    await expect(
      migrateCn({ cwd, path: "missing/**/*.ts", yes: true })
    ).rejects.toThrow("No files found matching")
  })
})
