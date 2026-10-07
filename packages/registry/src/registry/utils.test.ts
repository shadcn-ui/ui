import * as fs from "fs/promises"
import { tmpdir } from "os"
import * as path from "path"
import { afterEach, beforeEach, describe, expect, it, test, vi } from "vitest"
import { z } from "zod"

import { Config } from "../utils/get-config"
import { ProjectInfo } from "../utils/get-project-info"
import { registryItemFileSchema } from "./schema"
import {
  canDeduplicateFiles,
  deduplicateFilesByTarget,
  getDependencyFromModuleSpecifier,
  isLocalFile,
  isUniversalRegistryItem,
  isUrl,
  recursivelyResolveFileImports,
} from "./utils"

describe("getDependencyFromModuleSpecifier", () => {
  it("should return the first part of a non-scoped package with path", () => {
    expect(getDependencyFromModuleSpecifier("foo/bar")).toBe("foo")
    expect(getDependencyFromModuleSpecifier("lodash/get")).toBe("lodash")
  })

  it("should return the full package name for scoped packages", () => {
    expect(getDependencyFromModuleSpecifier("@types/react")).toBe(
      "@types/react"
    )
    expect(getDependencyFromModuleSpecifier("@radix-ui/react-dialog")).toBe(
      "@radix-ui/react-dialog"
    )
  })

  it.each([
    // Core packages
    "react",
    "react/jsx-runtime",
    "react/dom",
    "react/experimental",
    "react-dom",
    "react-dom/client",
    "react-dom/server",
    "react-dom/test-utils",
    "next",
    "next/link",
    "next/image",
    "next/navigation",
  ])("should return null for core package %s", (moduleSpecifier) => {
    expect(getDependencyFromModuleSpecifier(moduleSpecifier)).toBe(null)
  })

  it.each([
    // Node.js modules
    "node:fs",
    "node:path",
    "node:http",
    "node:stream",
    // JSR modules
    "jsr:@std/fs",
    "jsr:@std/path",
    "jsr:@std/http",
    // NPM modules
    "npm:lodash",
    "npm:@types/react",
    "npm:express",
  ])("should return null for prefixed module %s", (moduleSpecifier) => {
    expect(getDependencyFromModuleSpecifier(moduleSpecifier)).toBe(null)
  })

  it.each([
    ["", ""],
    [" ", " "],
    ["/", ""],
  ])("should handle empty or invalid input %s", (input, expected) => {
    expect(getDependencyFromModuleSpecifier(input)).toBe(expected)
  })

  it.each([
    ["foo/bar/baz", "foo"],
    ["lodash/get/set", "lodash"],
  ])("should handle package %s with multiple slashes", (input, expected) => {
    expect(getDependencyFromModuleSpecifier(input)).toBe(expected)
  })

  it("should handle edge cases for scoped packages", () => {
    expect(getDependencyFromModuleSpecifier("@types/react/dom")).toBe(
      "@types/react"
    )
  })
})

describe("isUrl", () => {
  it("should return true for valid URLs", () => {
    expect(isUrl("https://example.com")).toBe(true)
    expect(isUrl("http://example.com")).toBe(true)
    expect(isUrl("https://example.com/path")).toBe(true)
    expect(isUrl("https://subdomain.example.com")).toBe(true)
    expect(isUrl("https://ui.shadcn.com/r/styles/new-york/button.json")).toBe(
      true
    )
  })

  it("should return false for non-URLs", () => {
    expect(isUrl("./local-file.json")).toBe(false)
    expect(isUrl("../relative/path.json")).toBe(false)
    expect(isUrl("/absolute/path.json")).toBe(false)
    expect(isUrl("component-name")).toBe(false)
    expect(isUrl("")).toBe(false)
    expect(isUrl("just-text")).toBe(false)
  })
})

describe("isLocalFile", () => {
  it("should return true for local JSON files", () => {
    expect(isLocalFile("./component.json")).toBe(true)
    expect(isLocalFile("../shared/button.json")).toBe(true)
    expect(isLocalFile("/absolute/path/card.json")).toBe(true)
    expect(isLocalFile("local-component.json")).toBe(true)
    expect(isLocalFile("nested/directory/dialog.json")).toBe(true)
    expect(isLocalFile("~/Desktop/component.json")).toBe(true)
    expect(isLocalFile("~/Documents/shared/button.json")).toBe(true)
  })

  it("should return false for URLs ending with .json", () => {
    expect(isLocalFile("https://example.com/component.json")).toBe(false)
    expect(isLocalFile("http://registry.com/button.json")).toBe(false)
    expect(
      isLocalFile("https://ui.shadcn.com/r/styles/new-york/button.json")
    ).toBe(false)
  })

  it("should return false for non-JSON files", () => {
    expect(isLocalFile("./component.tsx")).toBe(false)
    expect(isLocalFile("../shared/button.ts")).toBe(false)
    expect(isLocalFile("/absolute/path/card.js")).toBe(false)
    expect(isLocalFile("local-component.css")).toBe(false)
    expect(isLocalFile("component-name")).toBe(false)
    expect(isLocalFile("")).toBe(false)
  })

  it("should return false for directory paths", () => {
    expect(isLocalFile("./components/")).toBe(false)
    expect(isLocalFile("../shared")).toBe(false)
    expect(isLocalFile("/absolute/path")).toBe(false)
  })
})

describe("isUniversalRegistryItem", () => {
  it("should return true when all files have targets with registry:file type", () => {
    const registryItem = {
      type: "registry:item" as const,
      files: [
        {
          path: "file1.ts",
          target: "src/file1.ts",
          type: "registry:file" as const,
        },
        {
          path: "file2.ts",
          target: "src/utils/file2.ts",
          type: "registry:file" as const,
        },
      ],
    }
    expect(isUniversalRegistryItem(registryItem)).toBe(true)
  })

  it("should return true when registry item type is registry:file and all files have targets", () => {
    const registryItem = {
      type: "registry:file" as const,
      files: [
        {
          path: "file1.ts",
          target: "src/file1.ts",
          type: "registry:file" as const,
        },
        {
          path: "file2.ts",
          target: "src/utils/file2.ts",
          type: "registry:item" as const,
        },
      ],
    }
    expect(isUniversalRegistryItem(registryItem)).toBe(true)
  })

  it("should return false for any registry item type other than registry:item or registry:file", () => {
    const registryItem = {
      type: "registry:ui" as const,
      files: [
        {
          path: "cursor-rules.txt",
          target: "~/.cursor/rules/react.txt",
          type: "registry:file" as const,
        },
      ],
    }
    expect(isUniversalRegistryItem(registryItem)).toBe(false)
  })

  it("should return false when some files lack targets", () => {
    const registryItem = {
      type: "registry:item" as const,
      files: [
        {
          path: "file1.ts",
          target: "src/file1.ts",
          type: "registry:file" as const,
        },
        { path: "file2.ts", target: "", type: "registry:file" as const },
      ],
    }
    expect(isUniversalRegistryItem(registryItem)).toBe(false)
  })

  it("should return false when files have non-registry:file type", () => {
    const registryItem = {
      type: "registry:item" as const,
      files: [
        {
          path: "file1.ts",
          target: "src/file1.ts",
          type: "registry:file" as const,
        },
        {
          path: "file2.ts",
          target: "src/lib/file2.ts",
          type: "registry:lib" as const, // Not registry:file
        },
      ],
    }
    expect(isUniversalRegistryItem(registryItem)).toBe(false)
  })

  it("should return false when no files have targets", () => {
    const registryItem = {
      type: "registry:item" as const,
      files: [
        { path: "file1.ts", target: "", type: "registry:file" as const },
        { path: "file2.ts", target: "", type: "registry:file" as const },
      ],
    }
    expect(isUniversalRegistryItem(registryItem)).toBe(false)
  })

  it("should return true when files array is empty and type is registry:item", () => {
    const registryItem = {
      type: "registry:item" as const,
      files: [],
    }
    expect(isUniversalRegistryItem(registryItem)).toBe(true)
  })

  it("should return true when files is undefined and type is registry:item", () => {
    const registryItem = {
      type: "registry:item" as const,
    }
    expect(isUniversalRegistryItem(registryItem)).toBe(true)
  })

  it("should return false when type is registry:style", () => {
    const registryItem = {
      type: "registry:style" as const,
      files: [],
    }
    expect(isUniversalRegistryItem(registryItem)).toBe(false)
  })

  it("should return false when type is registry:ui", () => {
    const registryItem = {
      type: "registry:ui" as const,
      files: [],
    }
    expect(isUniversalRegistryItem(registryItem)).toBe(false)
  })

  it("should return false when files is undefined and type is not registry:item or registry:file", () => {
    const registryItem = {
      type: "registry:component" as const,
    }
    expect(isUniversalRegistryItem(registryItem)).toBe(false)
  })

  it("should return false when registryItem is null", () => {
    expect(isUniversalRegistryItem(null)).toBe(false)
  })

  it("should return false when registryItem is undefined", () => {
    expect(isUniversalRegistryItem(undefined)).toBe(false)
  })

  it("should return false when target is null", () => {
    const registryItem = {
      type: "registry:item" as const,
      files: [
        {
          path: "file1.ts",
          target: null as any,
          type: "registry:file" as const,
        },
      ],
    }
    expect(isUniversalRegistryItem(registryItem)).toBe(false)
  })

  it("should return false when target is undefined", () => {
    const registryItem = {
      type: "registry:item" as const,
      files: [
        {
          path: "file1.ts",
          type: "registry:file" as const,
          target: undefined as any,
        },
      ],
    }
    expect(isUniversalRegistryItem(registryItem)).toBe(false)
  })

  it("should return false when files have registry:component type even with targets", () => {
    const registryItem = {
      type: "registry:item" as const,
      files: [
        {
          path: "component.tsx",
          target: "components/ui/component.tsx",
          type: "registry:component" as const,
        },
      ],
    }
    expect(isUniversalRegistryItem(registryItem)).toBe(false)
  })

  it("should return false when files have registry:hook type even with targets", () => {
    const registryItem = {
      type: "registry:item" as const,
      files: [
        {
          path: "use-hook.ts",
          target: "hooks/use-hook.ts",
          type: "registry:hook" as const,
        },
      ],
    }
    expect(isUniversalRegistryItem(registryItem)).toBe(false)
  })

  it("should return false when files have registry:lib type even with targets", () => {
    const registryItem = {
      type: "registry:item" as const,
      files: [
        {
          path: "utils.ts",
          target: "lib/utils.ts",
          type: "registry:lib" as const,
        },
      ],
    }
    expect(isUniversalRegistryItem(registryItem)).toBe(false)
  })

  it("should return true when all targets are non-empty strings for registry:file", () => {
    const registryItem = {
      type: "registry:item" as const,
      files: [
        { path: "file1.ts", target: " ", type: "registry:file" as const }, // whitespace is truthy
        { path: "file2.ts", target: "0", type: "registry:file" as const }, // "0" is truthy
      ],
    }
    expect(isUniversalRegistryItem(registryItem)).toBe(true)
  })

  it("should handle real-world example with path traversal attempts for registry:file", () => {
    const registryItem = {
      type: "registry:item" as const,
      files: [
        {
          path: "malicious.ts",
          target: "../../../etc/passwd",
          type: "registry:file" as const,
        },
        {
          path: "normal.ts",
          target: "src/normal.ts",
          type: "registry:file" as const,
        },
      ],
    }
    // The function should still return true - path validation is handled elsewhere.
    expect(isUniversalRegistryItem(registryItem)).toBe(true)
  })

  it("should return false when registry item type is registry:ui", () => {
    const registryItem = {
      type: "registry:ui" as const,
      files: [
        {
          path: "button.tsx",
          target: "src/components/ui/button.tsx",
          type: "registry:file" as const,
        },
      ],
    }
    expect(isUniversalRegistryItem(registryItem)).toBe(false)
  })
})

vi.mock("../utils/get-project-info", () => ({
  getProjectInfo: vi.fn().mockResolvedValue({
    isSrcDir: false,
    framework: { name: "next-app" },
  }),
}))

vi.mock("../utils/resolve-file-path", () => ({
  findCommonRoot: vi.fn().mockImplementation(() => ""),
  resolveFilePath: vi.fn().mockImplementation((file) => {
    const typeMap: Record<string, string> = {
      "registry:ui": "components/ui",
      "registry:lib": "lib",
      "registry:hook": "hooks",
    }
    const baseDir = typeMap[file.type] || "components"

    if (file.target) {
      return file.target
    }

    const filename = file.path.split("/").pop()
    return `${baseDir}/${filename}`
  }),
}))

describe("deduplicateFilesByTarget", () => {
  const createMockConfig = (overrides = {}): Config =>
    ({
      style: "default",
      tailwind: { baseColor: "neutral" },
      resolvedPaths: {
        cwd: "/test/project",
        tailwindConfig: "/test/project/tailwind.config.js",
        tailwindCss: "/test/project/globals.css",
        utils: "/test/project/lib/utils",
        components: "/test/project/components",
        lib: "/test/project/lib",
        hooks: "/test/project/hooks",
        ui: "/test/project/components/ui",
      },
      ...overrides,
    }) as Config

  test("should deduplicate files with same resolved path", async () => {
    const config = createMockConfig()
    const filesArrays = [
      z.array(registryItemFileSchema).parse([
        {
          path: "ui/button.tsx",
          content: "Button A",
          type: "registry:ui",
        },
      ]),
      z.array(registryItemFileSchema).parse([
        {
          path: "ui/button.tsx",
          content: "Button B",
          type: "registry:ui",
        },
      ]),
    ]

    const result = await deduplicateFilesByTarget(filesArrays, config)

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchInlineSnapshot(`
      {
        "content": "Button B",
        "path": "ui/button.tsx",
        "type": "registry:ui",
      }
    `)
  })

  test("should preserve files with different resolved paths", async () => {
    const config = createMockConfig()
    const filesArrays = [
      z.array(registryItemFileSchema).parse([
        {
          path: "ui/button.tsx",
          content: "Button",
          type: "registry:ui",
        },
        {
          path: "lib/utils.ts",
          content: "Utils",
          type: "registry:lib",
        },
      ]),
    ]

    const result = await deduplicateFilesByTarget(filesArrays, config)

    expect(result).toHaveLength(2)
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "ui/button.tsx" }),
        expect.objectContaining({ path: "lib/utils.ts" }),
      ])
    )
  })

  test("should handle explicit targets", async () => {
    const config = createMockConfig()
    const filesArrays = [
      z.array(registryItemFileSchema).parse([
        {
          path: "custom/component.tsx",
          content: "Component A",
          type: "registry:ui",
        },
      ]),
      z.array(registryItemFileSchema).parse([
        {
          path: "different/path.tsx",
          content: "Component B",
          type: "registry:ui",
          target: "components/ui/button.tsx",
        },
      ]),
    ]

    const result = await deduplicateFilesByTarget(filesArrays, config)
    expect(result).toHaveLength(2)
  })

  test("should handle undefined file arrays", async () => {
    const config = createMockConfig()
    const filesArrays = [
      undefined,
      z.array(registryItemFileSchema).parse([
        {
          path: "ui/button.tsx",
          content: "Button",
          type: "registry:ui",
        },
      ]),
      undefined,
    ]

    const result = await deduplicateFilesByTarget(filesArrays, config)

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({ path: "ui/button.tsx" })
  })

  test("should fallback to concatenation when config is incomplete", async () => {
    const incompleteConfig = {
      style: "default",
      resolvedPaths: {
        cwd: "/test/project",
      },
    } as Config

    const filesArrays = [
      z.array(registryItemFileSchema).parse([
        {
          path: "ui/button.tsx",
          content: "Button A",
          type: "registry:ui",
        },
      ]),
      z.array(registryItemFileSchema).parse([
        {
          path: "ui/button.tsx",
          content: "Button B",
          type: "registry:ui",
        },
      ]),
    ]

    const result = await deduplicateFilesByTarget(filesArrays, incompleteConfig)

    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({ content: "Button A" })
    expect(result[1]).toMatchObject({ content: "Button B" })
  })

  test("should maintain last-wins behavior for conflicting files", async () => {
    const config = createMockConfig()
    const filesArrays = [
      z.array(registryItemFileSchema).parse([
        {
          path: "ui/button.tsx",
          content: "First",
          type: "registry:ui",
        },
      ]),
      z.array(registryItemFileSchema).parse([
        {
          path: "ui/button.tsx",
          content: "Second",
          type: "registry:ui",
        },
      ]),
      z.array(registryItemFileSchema).parse([
        {
          path: "ui/button.tsx",
          content: "Third",
          type: "registry:ui",
        },
      ]),
    ]

    const result = await deduplicateFilesByTarget(filesArrays, config)

    expect(result).toHaveLength(1)
    expect(result[0].content).toBe("Third")
  })
})

describe("canDeduplicateFiles", () => {
  test("should return true when all required paths are present", () => {
    const config = {
      resolvedPaths: {
        cwd: "/test/project",
        ui: "/test/project/components/ui",
        lib: "/test/project/lib",
        components: "/test/project/components",
        hooks: "/test/project/hooks",
      },
    } as Config

    expect(canDeduplicateFiles(config)).toBe(true)
  })

  test("should return true when cwd and at least one component path is present", () => {
    const config = {
      resolvedPaths: {
        cwd: "/test/project",
        ui: "/test/project/components/ui",
      },
    } as Config

    expect(canDeduplicateFiles(config)).toBe(true)
  })

  test("should return false when cwd is missing", () => {
    const config = {
      resolvedPaths: {
        ui: "/test/project/components/ui",
      },
    } as Config

    expect(canDeduplicateFiles(config)).toBe(false)
  })

  test("should return false when no component paths are present", () => {
    const config = {
      resolvedPaths: {
        cwd: "/test/project",
      },
    } as Config

    expect(canDeduplicateFiles(config)).toBe(false)
  })

  test("should return false when config is undefined", () => {
    expect(canDeduplicateFiles(undefined as any)).toBe(false)
  })
})

describe("isUrl", () => {
  it("should return true for valid URLs", () => {
    expect(isUrl("https://example.com")).toBe(true)
    expect(isUrl("http://localhost:3000")).toBe(true)
    expect(isUrl("https://example.com/path/to/file.json")).toBe(true)
  })

  it("should return false for non-URLs", () => {
    expect(isUrl("not-a-url")).toBe(false)
    expect(isUrl("/path/to/file")).toBe(false)
    expect(isUrl("./relative/path")).toBe(false)
    expect(isUrl("~/home/path")).toBe(false)
  })
})

describe("recursivelyResolveFileImports", () => {
  let fixtureDir: string

  beforeEach(async () => {
    fixtureDir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-registry-"))
    await fs.writeFile(
      path.join(fixtureDir, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          paths: { "@/*": ["./*"] },
        },
      })
    )
    await fs.mkdir(path.join(fixtureDir, "components", "ui"), {
      recursive: true,
    })
    await fs.writeFile(
      path.join(fixtureDir, "components", "ui", "button.tsx"),
      `import { cn } from "cn"\n\nexport function Button() {\n  return <div className={cn("flex")} />\n}\n`
    )
  })

  afterEach(async () => {
    await fs.rm(fixtureDir, { recursive: true, force: true })
  })

  it("resolves cn as a dependency for a component importing it", async () => {
    const config = {
      style: "new-york",
      rsc: true,
      tsx: true,
      tailwind: {
        css: "app/globals.css",
        baseColor: "neutral",
        cssVariables: true,
      },
      aliases: {
        components: "@/components",
        utils: "@/lib/utils",
      },
      resolvedPaths: {
        cwd: fixtureDir,
        tailwindConfig: "",
        tailwindCss: path.join(fixtureDir, "app/globals.css"),
        utils: path.join(fixtureDir, "lib/utils.ts"),
        components: path.join(fixtureDir, "components"),
        lib: path.join(fixtureDir, "lib"),
        hooks: path.join(fixtureDir, "hooks"),
        ui: path.join(fixtureDir, "components/ui"),
      },
    } as Config

    const projectInfo: ProjectInfo = {
      framework: {
        name: "next-app",
        label: "Next.js",
      } as ProjectInfo["framework"],
      isSrcDir: false,
      isRSC: true,
      isTsx: true,
      tailwindConfigFile: null,
      tailwindCssFile: "app/globals.css",
      tailwindVersion: "v4",
      frameworkVersion: null,
      aliasPrefix: "@",
    }

    const result = await recursivelyResolveFileImports(
      "components/ui/button.tsx",
      config,
      projectInfo
    )

    expect(result.dependencies).toContain("cn")
  })

  // The crawler only reads `config.resolvedPaths.cwd` and
  // `projectInfo.aliasPrefix`.
  function crawl(
    filePath: string,
    options: { aliasPrefix?: string; processedFiles?: Set<string> } = {}
  ) {
    return recursivelyResolveFileImports(
      filePath,
      { resolvedPaths: { cwd: fixtureDir } } as Config,
      { aliasPrefix: options.aliasPrefix ?? "@" } as ProjectInfo,
      options.processedFiles
    )
  }

  async function writeFiles(files: Record<string, string>) {
    for (const [filePath, content] of Object.entries(files)) {
      const absolutePath = path.join(fixtureDir, filePath)
      await fs.mkdir(path.dirname(absolutePath), { recursive: true })
      await fs.writeFile(absolutePath, content)
    }
  }

  it("crawls relative imports and collects bare packages as dependencies", async () => {
    await writeFiles({
      "components/login-form.tsx": `"use client"

import * as React from "react"
import { createRoot } from "react-dom/client"
import Link from "next/link"
import fs from "node:fs"
import { Slot } from "@radix-ui/react-slot"
import { cva } from 'class-variance-authority'
import get from "lodash/get"
import { Primitive } from "@scope/pkg/sub/path"
import { helper } from "./login-helpers"
import { Field } from "../components/field"

export function LoginForm() {
  return <Field />
}
`,
      "components/login-helpers.ts": `export const helper = 1\n`,
      "components/field.tsx": `export function Field() {\n  return null\n}\n`,
    })

    expect(await crawl("components/login-form.tsx")).toMatchInlineSnapshot(`
      {
        "dependencies": [
          "@radix-ui/react-slot",
          "class-variance-authority",
          "lodash",
          "@scope/pkg",
        ],
        "files": [
          {
            "path": "components/login-form.tsx",
            "target": "",
            "type": "registry:component",
          },
          {
            "path": "components/login-helpers.ts",
            "target": "",
            "type": "registry:component",
          },
          {
            "path": "components/field.tsx",
            "target": "",
            "type": "registry:component",
          },
        ],
      }
    `)
  })

  it("crawls alias imports through tsconfig paths and types files by specifier", async () => {
    await writeFiles({
      "components/dashboard.tsx": `import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"
import { Chart } from "@/components/chart"
import { config } from "@/config/site"
`,
      "hooks/use-mobile.ts": `import { useSyncExternalStore } from "react"\n`,
      "lib/format.ts": `import { format } from "date-fns"\n`,
      "lib/utils.ts": `import { clsx } from "clsx"\n`,
      "components/chart.tsx": `import * as Recharts from "recharts"\n`,
      "config/site.ts": `export const config = {}\n`,
    })

    // `@/lib/utils` is in the file skip list, so `clsx` is never collected.
    expect(await crawl("components/dashboard.tsx")).toMatchInlineSnapshot(`
      {
        "dependencies": [
          "cn",
          "date-fns",
          "recharts",
        ],
        "files": [
          {
            "path": "components/dashboard.tsx",
            "target": "",
            "type": "registry:component",
          },
          {
            "path": "components/ui/button.tsx",
            "target": "",
            "type": "registry:ui",
          },
          {
            "path": "hooks/use-mobile.ts",
            "target": "",
            "type": "registry:hook",
          },
          {
            "path": "lib/format.ts",
            "target": "",
            "type": "registry:lib",
          },
          {
            "path": "components/chart.tsx",
            "target": "",
            "type": "registry:component",
          },
          {
            "path": "config/site.ts",
            "target": "",
            "type": "registry:component",
          },
        ],
      }
    `)
  })

  it("types the root file and relative imports by path substring", async () => {
    await writeFiles({
      "components/ui/dialog.tsx": `import { Button } from "./button"\n`,
      "hooks/use-mobile.ts": `export const useMobile = () => true\n`,
      "src/lib/format.ts": `export const format = () => ""\n`,
    })

    // Current behavior: a relative import is always `registry:component`,
    // even when it points into `ui/`.
    expect(await crawl("components/ui/dialog.tsx")).toMatchInlineSnapshot(`
      {
        "dependencies": [
          "cn",
        ],
        "files": [
          {
            "path": "components/ui/dialog.tsx",
            "target": "",
            "type": "registry:ui",
          },
          {
            "path": "components/ui/button.tsx",
            "target": "",
            "type": "registry:component",
          },
        ],
      }
    `)
    // Current behavior: the root path has no leading slash, so `hooks/...`
    // does not match "/hooks/" and falls back to `registry:component`.
    expect(await crawl("hooks/use-mobile.ts")).toMatchInlineSnapshot(`
      {
        "dependencies": [],
        "files": [
          {
            "path": "hooks/use-mobile.ts",
            "target": "",
            "type": "registry:component",
          },
        ],
      }
    `)
    expect(await crawl("src/lib/format.ts")).toMatchInlineSnapshot(`
      {
        "dependencies": [],
        "files": [
          {
            "path": "src/lib/format.ts",
            "target": "",
            "type": "registry:lib",
          },
        ],
      }
    `)
  })

  it("keeps dependencies but drops files more than one import deep", async () => {
    await writeFiles({
      "components/root.tsx": `import { A } from "./a"\n`,
      "components/a.tsx": `import { B } from "./b"\nimport { z } from "zod"\nimport data from "./a-data.json"\n`,
      "components/b.tsx": `import { C } from "@/hooks/use-c"\nimport get from "lodash/get"\n`,
      "hooks/use-c.ts": `import { motion } from "motion/react"\n`,
      "components/a-data.json": `{}\n`,
    })

    // Current behavior: nested files are marked as processed by their own
    // recursive call, so the parent skips them and only direct imports of the
    // root (plus never-crawled files like `.json`) end up in `files`.
    expect(await crawl("components/root.tsx")).toMatchInlineSnapshot(`
      {
        "dependencies": [
          "motion",
          "lodash",
          "zod",
        ],
        "files": [
          {
            "path": "components/root.tsx",
            "target": "",
            "type": "registry:component",
          },
          {
            "path": "components/a.tsx",
            "target": "",
            "type": "registry:component",
          },
          {
            "path": "components/a-data.json",
            "target": "",
            "type": "registry:component",
          },
        ],
      }
    `)
  })

  it("counts type-only imports as dependencies and crawls type-only files", async () => {
    await writeFiles({
      "components/typed.tsx": `import type { ClassValue } from "clsx"
import { type VariantProps, cva } from "class-variance-authority"
import type { Props } from "./types"

export type TypedProps = Props & VariantProps<typeof cva> & { value: ClassValue }
`,
      "components/types.ts": `export type Props = { id: string }\n`,
    })

    expect(await crawl("components/typed.tsx")).toMatchInlineSnapshot(`
      {
        "dependencies": [
          "clsx",
          "class-variance-authority",
        ],
        "files": [
          {
            "path": "components/typed.tsx",
            "target": "",
            "type": "registry:component",
          },
          {
            "path": "components/types.ts",
            "target": "",
            "type": "registry:component",
          },
        ],
      }
    `)
  })

  it("reads quoted @import rules in css files as imports", async () => {
    await writeFiles({
      "styles/globals.css": `@import "tailwindcss";
@import "tw-animate-css";
@import "./theme.css";
@import url("./url-theme.css");
@import 'shadcn/tailwind.css';

@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.625rem;
}

@import "late-package";
`,
      "styles/theme.css": `@import "./nested-theme.css";\n\n@theme inline {\n  --color-primary: red;\n}\n`,
      "styles/nested-theme.css": `:root {\n  --nested: 1;\n}\n`,
      "styles/url-theme.css": `:root {\n  --url: 1;\n}\n`,
      "components/styled.tsx": `import "./styled.css"\nimport "@/styles/globals.css"\n`,
      "components/styled.css": `.styled {\n  color: red;\n}\n`,
    })

    // Current behavior: css is parsed as TSX. Every quoted `@import` becomes an
    // import declaration (even after other rules), `url(...)` is ignored, and
    // `nested-theme.css` is dropped because it is two imports deep.
    expect(await crawl("styles/globals.css")).toMatchInlineSnapshot(`
      {
        "dependencies": [
          "tailwindcss",
          "tw-animate-css",
          "shadcn",
          "late-package",
        ],
        "files": [
          {
            "path": "styles/globals.css",
            "target": "",
            "type": "registry:component",
          },
          {
            "path": "styles/theme.css",
            "target": "",
            "type": "registry:component",
          },
        ],
      }
    `)
    expect(await crawl("components/styled.tsx")).toMatchInlineSnapshot(`
      {
        "dependencies": [
          "tailwindcss",
          "tw-animate-css",
          "shadcn",
          "late-package",
        ],
        "files": [
          {
            "path": "components/styled.tsx",
            "target": "",
            "type": "registry:component",
          },
          {
            "path": "components/styled.css",
            "target": "",
            "type": "registry:component",
          },
          {
            "path": "styles/globals.css",
            "target": "",
            "type": "registry:component",
          },
        ],
      }
    `)
  })

  it("does not follow export-from, dynamic import(), require() or import-equals", async () => {
    await writeFiles({
      "components/barrel.tsx": `import * as React from "react"

export * from "./reexported"
export { named } from "./named"
export * as ns from "export-only-package"

const Lazy = React.lazy(() => import("./lazy"))
const required = require("./required")
import fsExtra = require("fs-extra")

export { Lazy, required, fsExtra }
`,
      "components/reexported.tsx": `import "reexported-dependency"\n`,
      "components/named.tsx": `export const named = 1\n`,
      "components/lazy.tsx": `export default function Lazy() {\n  return null\n}\n`,
      "components/required.ts": `module.exports = {}\n`,
    })

    expect(await crawl("components/barrel.tsx")).toMatchInlineSnapshot(`
      {
        "dependencies": [],
        "files": [
          {
            "path": "components/barrel.tsx",
            "target": "",
            "type": "registry:component",
          },
        ],
      }
    `)
  })

  it("reads the imports around a line it cannot parse", async () => {
    await writeFiles({
      "components/broken.tsx": `import { Slot } from "@radix-ui/react-slot"\n# Not code\nimport { helper } from "./helper"\n`,
      "components/helper.ts": `export const helper = 1\n`,
    })

    expect(await crawl("components/broken.tsx")).toMatchInlineSnapshot(`
      {
        "dependencies": [
          "@radix-ui/react-slot",
        ],
        "files": [
          {
            "path": "components/broken.tsx",
            "target": "",
            "type": "registry:component",
          },
          {
            "path": "components/helper.ts",
            "target": "",
            "type": "registry:component",
          },
        ],
      }
    `)
  })

  it("handles import cycles and self imports", async () => {
    await writeFiles({
      "components/cycle-a.tsx": `import { B } from "./cycle-b"\nimport { A } from "./cycle-a"\nimport "a-dependency"\n`,
      "components/cycle-b.tsx": `import { A } from "./cycle-a"\nimport { B } from "@/components/cycle-b"\nimport "b-dependency"\n`,
    })

    expect(await crawl("components/cycle-a.tsx")).toMatchInlineSnapshot(`
      {
        "dependencies": [
          "b-dependency",
          "a-dependency",
        ],
        "files": [
          {
            "path": "components/cycle-a.tsx",
            "target": "",
            "type": "registry:component",
          },
          {
            "path": "components/cycle-b.tsx",
            "target": "",
            "type": "registry:component",
          },
        ],
      }
    `)
  })

  it("tries lookup extensions in order for extensionless imports", async () => {
    await writeFiles({
      "components/entry.tsx": `import { Widget } from "./widget"
import { legacy } from "./legacy"
import "./theme"
import data from "./data.json"
import again from "./data.json"
`,
      "components/widget.tsx": `export const Widget = "tsx"\n`,
      "components/widget.ts": `export const Widget = "ts"\n`,
      "components/legacy.js": `export const legacy = 1\n`,
      "components/theme.css": `.theme {\n}\n`,
      "components/data.json": `{}\n`,
    })

    // `.json` imports are listed but never crawled; the duplicate import is
    // collapsed into one entry.
    expect(await crawl("components/entry.tsx")).toMatchInlineSnapshot(`
      {
        "dependencies": [],
        "files": [
          {
            "path": "components/entry.tsx",
            "target": "",
            "type": "registry:component",
          },
          {
            "path": "components/widget.tsx",
            "target": "",
            "type": "registry:component",
          },
          {
            "path": "components/legacy.js",
            "target": "",
            "type": "registry:component",
          },
          {
            "path": "components/theme.css",
            "target": "",
            "type": "registry:component",
          },
          {
            "path": "components/data.json",
            "target": "",
            "type": "registry:component",
          },
        ],
      }
    `)
  })

  it("lists unresolved extensionless imports without crawling them", async () => {
    await writeFiles({
      "components/missing.tsx": `import { Missing } from "./does-not-exist"
import { Nope } from "@/components/nope"
import { Folder } from "./folder"
import { Hash } from "#unmapped/thing"
`,
      "components/folder/index.tsx": `import "folder-dependency"\n`,
    })

    // Current behavior: directory imports do not resolve `index` files,
    // unresolved paths are still listed (without an extension), and an
    // unmapped `#` import falls through tsconfig's match-all to `<cwd>/#...`.
    expect(await crawl("components/missing.tsx")).toMatchInlineSnapshot(`
      {
        "dependencies": [],
        "files": [
          {
            "path": "components/missing.tsx",
            "target": "",
            "type": "registry:component",
          },
          {
            "path": "components/does-not-exist",
            "target": "",
            "type": "registry:component",
          },
          {
            "path": "components/nope",
            "target": "",
            "type": "registry:component",
          },
          {
            "path": "components/folder",
            "target": "",
            "type": "registry:component",
          },
          {
            "path": "#unmapped/thing",
            "target": "",
            "type": "registry:component",
          },
        ],
      }
    `)
  })

  it("skips alias imports that tsconfig paths cannot resolve", async () => {
    await writeFiles({
      "components/scoped.tsx": `import { Button } from "@acme/ui/button"
import { Slot } from "@radix-ui/react-slot"
`,
    })

    // `@acme/ui/button` looks like a scoped package and no tsconfig path
    // matches it, so it is neither a file nor a dependency.
    expect(await crawl("components/scoped.tsx", { aliasPrefix: "@acme" }))
      .toMatchInlineSnapshot(`
      {
        "dependencies": [
          "@radix-ui/react-slot",
        ],
        "files": [
          {
            "path": "components/scoped.tsx",
            "target": "",
            "type": "registry:component",
          },
        ],
      }
    `)
  })

  it("rejects when an import with an extension points to a missing file", async () => {
    await writeFiles({
      "components/gone.tsx": `import { Gone } from "./gone-file.tsx"\n`,
      "components/esm.tsx": `import { format } from "./format.js"\n`,
      "components/format.ts": `export const format = 1\n`,
    })

    await expect(crawl("components/gone.tsx")).rejects.toThrow(/^ENOENT/)
    // Current behavior: an ESM-style `.js` specifier for a `.ts` file is not
    // mapped back to the source file.
    await expect(crawl("components/esm.tsx")).rejects.toThrow(/^ENOENT/)
  })

  it("rejects when the root file does not exist", async () => {
    await expect(crawl("components/not-there.tsx")).rejects.toThrow(/^ENOENT/)
  })

  it("returns empty results for skipped, unsupported, processed and non-file paths", async () => {
    await writeFiles({
      "lib/utils.ts": `import { clsx } from "clsx"\n`,
      "README.md": `# Readme\n`,
      "components/processed.tsx": `import "processed-dependency"\n`,
    })
    await fs.mkdir(path.join(fixtureDir, "components", "directory.tsx"), {
      recursive: true,
    })

    const empty = { dependencies: [], files: [] }
    expect(await crawl("lib/utils.ts")).toEqual(empty)
    expect(await crawl("README.md")).toEqual(empty)
    expect(
      await crawl("components/processed.tsx", {
        processedFiles: new Set(["components/processed.tsx"]),
      })
    ).toEqual(empty)
    expect(await crawl("components/directory.tsx")).toEqual(empty)
  })

  it("adds the crawled path to processedFiles", async () => {
    await writeFiles({
      "components/tracked.tsx": `import { Helper } from "./tracked-helper"\n`,
      "components/tracked-helper.tsx": `export const Helper = 1\n`,
    })

    const processedFiles = new Set<string>()
    await crawl("components/tracked.tsx", { processedFiles })

    expect(Array.from(processedFiles)).toEqual([
      "components/tracked.tsx",
      "components/tracked-helper.tsx",
    ])
  })

  it("returns empty results when tsconfig cannot be loaded", async () => {
    const noTsConfigDir = await fs.mkdtemp(
      path.join(tmpdir(), "shadcn-registry-no-tsconfig-")
    )

    try {
      await fs.mkdir(path.join(noTsConfigDir, "components"))
      await fs.writeFile(
        path.join(noTsConfigDir, "components", "card.tsx"),
        `import { Slot } from "@radix-ui/react-slot"\n`
      )

      expect(
        await recursivelyResolveFileImports(
          "components/card.tsx",
          { resolvedPaths: { cwd: noTsConfigDir } } as Config,
          { aliasPrefix: "@" } as ProjectInfo
        )
      ).toEqual({ dependencies: [], files: [] })
    } finally {
      await fs.rm(noTsConfigDir, { recursive: true, force: true })
    }
  })
})
