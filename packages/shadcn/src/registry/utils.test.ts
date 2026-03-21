import { describe, expect, it, test, vi } from "vitest"
import { z } from "zod"

import { Config } from "../utils/get-config"
import { registryItemFileSchema } from "./schema"
import {
  canDeduplicateFiles,
  deduplicateFilesByTarget,
  getDependencyFromModuleSpecifier,
  isLocalFile,
  isUniversalRegistryItem,
  isUrl,
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

vi.mock("../utils/updaters/update-files", () => ({
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
    } as Config)

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
