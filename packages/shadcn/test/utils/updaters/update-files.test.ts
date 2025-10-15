import { existsSync, promises as fs } from "fs"
import path from "path"
import { afterAll, afterEach, describe, expect, test, vi } from "vitest"

import { getConfig } from "../../../src/utils/get-config"
import {
  findCommonRoot,
  resolveFilePath,
  resolveModuleByProbablePath,
  resolveNestedFilePath,
  toAliasedImport,
  updateFiles,
} from "../../../src/utils/updaters/update-files"

vi.mock("fs/promises", async () => {
  const actual = (await vi.importActual(
    "fs/promises"
  )) as typeof import("fs/promises")

  return {
    ...actual,
    writeFile: vi.fn().mockResolvedValue(undefined),
    readFile: vi.fn().mockImplementation(actual.readFile),
    mkdir: vi.fn().mockResolvedValue(undefined),
  }
})

vi.mock("fs", async () => {
  const actual = (await vi.importActual("fs")) as typeof import("fs")
  return {
    ...actual,
    existsSync: vi.fn().mockImplementation(actual.existsSync),
    promises: {
      ...actual.promises,
      writeFile: vi.fn().mockResolvedValue(undefined),
    },
  }
})

vi.mock("prompts")

afterEach(async () => {
  vi.clearAllMocks()
  // Restore the actual implementation of existsSync after clearing mocks
  const actual = (await vi.importActual("fs")) as typeof import("fs")
  vi.mocked(existsSync).mockImplementation(actual.existsSync)
})

afterAll(() => {
  vi.resetAllMocks()
})

describe("resolveFilePath", () => {
  test.each([
    {
      description: "should use target when provided",
      file: {
        path: "hello-world/ui/button.tsx",
        type: "registry:ui",
        target: "ui/button.tsx",
      },
      resolvedPath: "/foo/bar/ui/button.tsx",
      projectInfo: {
        isSrcDir: false,
      },
    },
    {
      description: "should use nested target when provided",
      file: {
        path: "hello-world/components/example-card.tsx",
        type: "registry:component",
        target: "components/cards/example-card.tsx",
      },
      resolvedPath: "/foo/bar/components/cards/example-card.tsx",
      projectInfo: {
        isSrcDir: false,
      },
    },
    {
      description: "should use home target (~) when provided",
      file: {
        path: "hello-world/foo.json",
        type: "registry:lib",
        target: "~/foo.json",
      },
      resolvedPath: "/foo/bar/foo.json",
      projectInfo: {
        isSrcDir: false,
      },
    },
  ])("$description", ({ file, resolvedPath, projectInfo }) => {
    expect(
      resolveFilePath(
        file,
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        },
        projectInfo
      )
    ).toBe(resolvedPath)
  })

  test.each([
    {
      description: "should use src directory when provided",
      file: {
        path: "hello-world/ui/button.tsx",
        type: "registry:ui",
        target: "design-system/ui/button.tsx",
      },
      resolvedPath: "/foo/bar/src/design-system/ui/button.tsx",
      projectInfo: {
        isSrcDir: true,
      },
    },
    {
      description: "should NOT use src directory for root files",
      file: {
        path: "hello-world/.env",
        type: "registry:file",
        target: "~/.env",
      },
      resolvedPath: "/foo/bar/.env",
      projectInfo: {
        isSrcDir: true,
      },
    },
    {
      description: "should use src directory when isSrcDir is true",
      file: {
        path: "hello-world/lib/foo.ts",
        type: "registry:lib",
        target: "lib/foo.ts",
      },
      resolvedPath: "/foo/bar/src/lib/foo.ts",
      projectInfo: {
        isSrcDir: true,
      },
    },
    {
      description: "should strip src directory when isSrcDir is false",
      file: {
        path: "hello-world/path/to/bar/baz.ts",
        type: "registry:lib",
        target: "src/path/to/bar/baz.ts",
      },
      resolvedPath: "/foo/bar/path/to/bar/baz.ts",
      projectInfo: {
        isSrcDir: false,
      },
    },
  ])("$description", ({ file, resolvedPath, projectInfo }) => {
    expect(
      resolveFilePath(
        file,
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/src/components",
            ui: "/foo/bar/src/primitives",
            lib: "/foo/bar/src/lib",
            hooks: "/foo/bar/src/hooks",
          },
        },
        projectInfo
      )
    ).toBe(resolvedPath)
  })

  test("should resolve registry:ui file types", () => {
    expect(
      resolveFilePath(
        {
          path: "hello-world/ui/button.tsx",
          type: "registry:ui",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        },
        {
          isSrcDir: false,
        }
      )
    ).toBe("/foo/bar/components/ui/button.tsx")

    expect(
      resolveFilePath(
        {
          path: "hello-world/ui/button.tsx",
          type: "registry:ui",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/src/components",
            ui: "/foo/bar/src/primitives",
            lib: "/foo/bar/src/lib",
            hooks: "/foo/bar/src/hooks",
          },
        },
        {
          isSrcDir: true,
        }
      )
    ).toBe("/foo/bar/src/primitives/button.tsx")
  })

  test("should resolve registry:component and registry:block file types", () => {
    expect(
      resolveFilePath(
        {
          path: "hello-world/components/example-card.tsx",
          type: "registry:component",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        },
        {
          isSrcDir: false,
        }
      )
    ).toBe("/foo/bar/components/example-card.tsx")

    expect(
      resolveFilePath(
        {
          path: "hello-world/components/example-card.tsx",
          type: "registry:block",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        },
        {
          isSrcDir: false,
        }
      )
    ).toBe("/foo/bar/components/example-card.tsx")

    expect(
      resolveFilePath(
        {
          path: "hello-world/components/example-card.tsx",
          type: "registry:component",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/src/components",
            ui: "/foo/bar/src/primitives",
            lib: "/foo/bar/src/lib",
            hooks: "/foo/bar/src/hooks",
          },
        },
        {
          isSrcDir: true,
        }
      )
    ).toBe("/foo/bar/src/components/example-card.tsx")

    expect(
      resolveFilePath(
        {
          path: "hello-world/components/example-card.tsx",
          type: "registry:block",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/src/components",
            ui: "/foo/bar/src/primitives",
            lib: "/foo/bar/src/lib",
            hooks: "/foo/bar/src/hooks",
          },
        },
        {
          isSrcDir: true,
        }
      )
    ).toBe("/foo/bar/src/components/example-card.tsx")
  })

  test("should resolve registry:lib file types", () => {
    expect(
      resolveFilePath(
        {
          path: "hello-world/lib/foo.ts",
          type: "registry:lib",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        },
        {
          isSrcDir: false,
        }
      )
    ).toBe("/foo/bar/lib/foo.ts")

    expect(
      resolveFilePath(
        {
          path: "hello-world/lib/foo.ts",
          type: "registry:lib",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/src/components",
            ui: "/foo/bar/src/primitives",
            lib: "/foo/bar/src/lib",
            hooks: "/foo/bar/src/hooks",
          },
        },
        {
          isSrcDir: true,
        }
      )
    ).toBe("/foo/bar/src/lib/foo.ts")
  })

  test("should resolve registry:hook file types", () => {
    expect(
      resolveFilePath(
        {
          path: "hello-world/hooks/use-foo.ts",
          type: "registry:hook",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        },
        {
          isSrcDir: false,
        }
      )
    ).toBe("/foo/bar/hooks/use-foo.ts")

    expect(
      resolveFilePath(
        {
          path: "hello-world/hooks/use-foo.ts",
          type: "registry:hook",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/src/components",
            ui: "/foo/bar/src/primitives",
            lib: "/foo/bar/src/lib",
            hooks: "/foo/bar/src/hooks",
          },
        },
        {
          isSrcDir: true,
        }
      )
    ).toBe("/foo/bar/src/hooks/use-foo.ts")
  })

  test("should resolve registry:file file types", () => {
    expect(
      resolveFilePath(
        {
          path: "hello-world/.env",
          type: "registry:file",
          target: "~/baz/.env",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
          },
        },
        {
          isSrcDir: false,
        }
      )
    ).toBe("/foo/bar/baz/.env")
  })

  test("should resolve nested files", () => {
    expect(
      resolveFilePath(
        {
          path: "hello-world/components/path/to/example-card.tsx",
          type: "registry:component",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        },
        {
          isSrcDir: false,
        }
      )
    ).toBe("/foo/bar/components/path/to/example-card.tsx")

    expect(
      resolveFilePath(
        {
          path: "hello-world/design-system/primitives/button.tsx",
          type: "registry:ui",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        },
        {
          isSrcDir: false,
        }
      )
    ).toBe("/foo/bar/components/ui/button.tsx")
  })
})

describe("resolveFilePath with custom path", () => {
  test("should use custom file path for exact file target", () => {
    expect(
      resolveFilePath(
        {
          path: "hello-world/ui/button.tsx",
          type: "registry:ui",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        },
        {
          isSrcDir: false,
          path: "/foo/bar/custom/my-button.tsx",
          fileIndex: 0,
        }
      )
    ).toBe("/foo/bar/custom/my-button.tsx")
  })

  test("should use custom directory path and strip type prefix", () => {
    expect(
      resolveFilePath(
        {
          path: "hello-world/ui/button.tsx",
          type: "registry:ui",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        },
        {
          isSrcDir: false,
          path: "/foo/bar/custom",
          fileIndex: 0,
        }
      )
    ).toBe("/foo/bar/custom/button.tsx")
  })

  test("should strip nested paths when using custom directory", () => {
    expect(
      resolveFilePath(
        {
          path: "hello-world/components/nested/path/card.tsx",
          type: "registry:component",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        },
        {
          isSrcDir: false,
          path: "/foo/bar/custom",
          fileIndex: 0,
        }
      )
    ).toBe("/foo/bar/custom/card.tsx")
  })

  test("should handle lib files with custom directory", () => {
    expect(
      resolveFilePath(
        {
          path: "hello-world/lib/utils.ts",
          type: "registry:lib",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        },
        {
          isSrcDir: false,
          path: "/foo/bar/custom",
          fileIndex: 0,
        }
      )
    ).toBe("/foo/bar/custom/utils.ts")
  })

  test("should handle hooks with custom directory", () => {
    expect(
      resolveFilePath(
        {
          path: "hello-world/hooks/use-toast.ts",
          type: "registry:hook",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        },
        {
          isSrcDir: false,
          path: "/foo/bar/custom",
          fileIndex: 0,
        }
      )
    ).toBe("/foo/bar/custom/use-toast.ts")
  })

  test("should use custom file path with different extension", () => {
    expect(
      resolveFilePath(
        {
          path: "hello-world/ui/card.tsx",
          type: "registry:ui",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        },
        {
          isSrcDir: false,
          path: "/foo/bar/my-components/custom-card.jsx",
          fileIndex: 0,
        }
      )
    ).toBe("/foo/bar/my-components/custom-card.jsx")
  })

  test("should not use custom path when not provided", () => {
    expect(
      resolveFilePath(
        {
          path: "hello-world/ui/button.tsx",
          type: "registry:ui",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        },
        {
          isSrcDir: false,
        }
      )
    ).toBe("/foo/bar/components/ui/button.tsx")
  })

  test("should support any file extension for file paths", () => {
    // Test with .json
    expect(
      resolveFilePath(
        {
          path: "hello-world/config.json",
          type: "registry:file",
          target: "~/config.json",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        },
        {
          isSrcDir: false,
          path: "/foo/bar/custom/my-config.json",
          fileIndex: 0,
        }
      )
    ).toBe("/foo/bar/custom/my-config.json")

    // Test with .css
    expect(
      resolveFilePath(
        {
          path: "hello-world/styles.css",
          type: "registry:file",
          target: "~/styles.css",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        },
        {
          isSrcDir: false,
          path: "/foo/bar/custom/theme.css",
          fileIndex: 0,
        }
      )
    ).toBe("/foo/bar/custom/theme.css")

    // Test with .md
    expect(
      resolveFilePath(
        {
          path: "hello-world/README.md",
          type: "registry:file",
          target: "~/README.md",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        },
        {
          isSrcDir: false,
          path: "/foo/bar/docs/guide.md",
          fileIndex: 0,
        }
      )
    ).toBe("/foo/bar/docs/guide.md")
  })
})

describe("resolveFilePath with framework", () => {
  test("should not resolve for unknown or unsupported framework", () => {
    expect(
      resolveFilePath(
        {
          path: "hello-world/app/login/page.tsx",
          type: "registry:page",
          target: "app/login/page.tsx",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        },
        {
          isSrcDir: false,
        }
      )
    ).toBe("")

    expect(
      resolveFilePath(
        {
          path: "hello-world/app/login/page.tsx",
          type: "registry:page",
          target: "app/login/page.tsx",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        },
        {
          isSrcDir: false,
          framework: "vite",
        }
      )
    ).toBe("")
  })

  test("should resolve for next-app", () => {
    expect(
      resolveFilePath(
        {
          path: "hello-world/app/login/page.tsx",
          type: "registry:page",
          target: "app/login/page.tsx",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        },
        {
          isSrcDir: false,
          framework: "next-app",
        }
      )
    ).toBe("/foo/bar/app/login/page.tsx")
  })

  test("should resolve for next-pages", () => {
    expect(
      resolveFilePath(
        {
          path: "hello-world/app/login/page.tsx",
          type: "registry:page",
          target: "app/login/page.tsx",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/src/components",
            ui: "/foo/bar/src/primitives",
            lib: "/foo/bar/src/lib",
            hooks: "/foo/bar/src/hooks",
          },
        },
        {
          isSrcDir: true,
          framework: "next-pages",
        }
      )
    ).toBe("/foo/bar/src/pages/login.tsx")

    expect(
      resolveFilePath(
        {
          path: "hello-world/app/blog/[slug]/page.tsx",
          type: "registry:page",
          target: "app/blog/[slug]/page.tsx",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/primitives",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        },
        {
          isSrcDir: false,
          framework: "next-pages",
        }
      )
    ).toBe("/foo/bar/pages/blog/[slug].tsx")
  })

  test("should resolve for react-router", () => {
    expect(
      resolveFilePath(
        {
          path: "hello-world/app/login/page.tsx",
          type: "registry:page",
          target: "app/login/page.tsx",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/app/components",
            ui: "/foo/bar/app/components/ui",
            lib: "/foo/bar/app/lib",
            hooks: "/foo/bar/app/hooks",
          },
        },
        {
          isSrcDir: false,
          framework: "react-router",
        }
      )
    ).toBe("/foo/bar/app/routes/login.tsx")
  })

  test("should resolve for laravel", () => {
    expect(
      resolveFilePath(
        {
          path: "hello-world/app/login/page.tsx",
          type: "registry:page",
          target: "app/login/page.tsx",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/resources/js/components",
            ui: "/foo/bar/resources/js/components/ui",
            lib: "/foo/bar/resources/js/lib",
            hooks: "/foo/bar/resources/js/hooks",
          },
        },
        {
          isSrcDir: false,
          framework: "laravel",
        }
      )
    ).toBe("/foo/bar/resources/js/pages/login.tsx")
  })
})

describe("findCommonRoot", () => {
  test.each([
    {
      description: "should find the common root of sibling files",
      paths: ["/foo/bar/baz/qux", "/foo/bar/baz/quux"],
      needle: "/foo/bar/baz/qux",
      expected: "/foo/bar/baz",
    },
    {
      description: "should find common root with nested structures",
      paths: [
        "/app/components/header/nav.tsx",
        "/app/components/header/logo.tsx",
        "/app/components/header/menu/item.tsx",
      ],
      needle: "/app/components/header/nav.tsx",
      expected: "/app/components/header",
    },
    {
      description: "should handle single file in paths",
      paths: ["/foo/bar/baz/single.tsx"],
      needle: "/foo/bar/baz/single.tsx",
      expected: "/foo/bar/baz",
    },
    {
      description: "should handle root level files",
      paths: ["root.tsx", "config.ts", "package.json"],
      needle: "root.tsx",
      expected: "",
    },
    {
      description: "should handle unrelated paths",
      paths: ["/foo/bar/baz", "/completely/different/path"],
      needle: "/foo/bar/baz",
      expected: "/foo/bar",
    },
  ])("$description", ({ paths, needle, expected }) => {
    expect(findCommonRoot(paths, needle)).toBe(expected)
  })
})

describe("resolveNestedFilePath", () => {
  test.each([
    {
      description: "should resolve path after common components directory",
      filePath: "hello-world/components/path/to/example-card.tsx",
      targetDir: "/foo/bar/components",
      expected: "path/to/example-card.tsx",
    },
    {
      description: "should handle different directory depths",
      filePath: "/foo-bar/components/ui/button.tsx",
      targetDir: "/src/ui",
      expected: "button.tsx",
    },
    {
      description: "should handle nested component paths",
      filePath: "blocks/sidebar/components/nav/item.tsx",
      targetDir: "/app/components",
      expected: "nav/item.tsx",
    },
    {
      description: "should return the file path if no common directory",
      filePath: "something/else/file.tsx",
      targetDir: "/foo/bar/components",
      expected: "file.tsx",
    },
    {
      description: "should handle paths with multiple common directories",
      filePath: "ui/shared/components/utils/button.tsx",
      targetDir: "/src/components/utils",
      expected: "button.tsx",
    },
  ])("$description", ({ filePath, targetDir, expected }) => {
    expect(resolveNestedFilePath(filePath, targetDir)).toBe(expected)
  })
})

describe("updateFiles", () => {
  test("should create missing files", async () => {
    const config = await getConfig(
      path.resolve(__dirname, "../../fixtures/vite-with-tailwind")
    )
    expect(
      await updateFiles(
        [
          {
            path: "src/components/hello-world.tsx",
            type: "registry:component",
            content: `export function HelloWorld() {
  return <div>Hello World</div>
}`,
          },
        ],
        config,
        {
          overwrite: false,
          silent: true,
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "filesCreated": [
          "src/components/hello-world.tsx",
        ],
        "filesSkipped": [],
        "filesUpdated": [],
      }
    `)
  })

  test("should skip existing files if same content", async () => {
    const config = await getConfig(
      path.resolve(__dirname, "../../fixtures/vite-with-tailwind")
    )
    expect(
      await updateFiles(
        [
          {
            path: "src/components/hello-world.tsx",
            type: "registry:component",
            content: `export function HelloWorld() {
return <div>Hello World</div>
}`,
          },
          {
            path: "registry/default/ui/button.tsx",
            type: "registry:ui",
            content: `export function Button() {
  return <button>Click me</button>
}`,
          },
        ],
        config,
        {
          overwrite: false,
          silent: true,
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "filesCreated": [
          "src/components/hello-world.tsx",
        ],
        "filesSkipped": [
          "src/components/ui/button.tsx",
        ],
        "filesUpdated": [],
      }
    `)
  })

  test("should update file if different content", async () => {
    const config = await getConfig(
      path.resolve(__dirname, "../../fixtures/vite-with-tailwind")
    )
    expect(
      await updateFiles(
        [
          {
            path: "src/components/hello-world.tsx",
            type: "registry:component",
            content: `export function HelloWorld() {
return <div>Hello World</div>
}`,
          },
          {
            path: "registry/default/ui/button.tsx",
            type: "registry:ui",
            content: `export function Button() {
  return <button>Click this button</button>
}`,
          },
        ],
        config,
        {
          overwrite: true,
          silent: true,
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "filesCreated": [
          "src/components/hello-world.tsx",
        ],
        "filesSkipped": [],
        "filesUpdated": [
          "src/components/ui/button.tsx",
        ],
      }
    `)
  })

  test("should mark .env file as created when it doesn't exist", async () => {
    const config = await getConfig(
      path.resolve(__dirname, "../../fixtures/vite-with-tailwind")
    )

    const result = await updateFiles(
      [
        {
          path: ".env",
          type: "registry:file",
          target: "~/.env",
          content: `NEW_API_KEY=new_api_key_value
ANOTHER_NEW_KEY=another_value`,
        },
      ],
      config,
      {
        overwrite: true,
        silent: true,
      }
    )

    expect(result.filesCreated).toContain(".env")
    expect(result.filesUpdated).not.toContain(".env")
  })

  test("should mark .env file as updated when merging content", async () => {
    const tempDir = path.join(
      path.resolve(__dirname, "../../fixtures"),
      "temp-env-test"
    )
    const fsActual = (await vi.importActual(
      "fs/promises"
    )) as typeof import("fs/promises")
    const writeFileMock = fs.writeFile as any

    try {
      await fsActual.mkdir(tempDir, { recursive: true })
      await fsActual.writeFile(
        path.join(tempDir, "components.json"),
        JSON.stringify({
          $schema: "https://ui.shadcn.com/schema.json",
          style: "default",
          tailwind: {
            config: "tailwind.config.js",
            css: "src/index.css",
            baseColor: "slate",
          },
          aliases: {
            components: "@/components",
            utils: "@/lib/utils",
          },
        }),
        "utf-8"
      )

      const config = await getConfig(tempDir)
      const envPath = path.join(config?.resolvedPaths.cwd!, ".env")

      await fsActual.writeFile(
        envPath,
        `EXISTING_KEY=existing_value
DATABASE_URL=postgres://localhost:5432/mydb`,
        "utf-8"
      )

      const result = await updateFiles(
        [
          {
            path: ".env",
            type: "registry:file",
            target: "~/.env",
            content: `DATABASE_URL=should_not_override
NEW_API_KEY=new_api_key_value
ANOTHER_NEW_KEY=another_value`,
          },
        ],
        config,
        {
          overwrite: true,
          silent: true,
        }
      )

      expect(result.filesUpdated).toContain(".env")
      expect(result.filesCreated).not.toContain(".env")

      // Verify writeFile was called with the correct merged content.
      expect(writeFileMock).toHaveBeenCalledWith(
        envPath,
        `EXISTING_KEY=existing_value
DATABASE_URL=postgres://localhost:5432/mydb

NEW_API_KEY=new_api_key_value
ANOTHER_NEW_KEY=another_value
`,
        "utf-8"
      )
    } finally {
      await fsActual.rm(tempDir, { recursive: true }).catch(() => {})
    }
  })

  test("should use .env.local when .env doesn't exist", async () => {
    const tempDir = path.join(
      path.resolve(__dirname, "../../fixtures"),
      "temp-env-alternative-test"
    )
    const fsActual = (await vi.importActual(
      "fs/promises"
    )) as typeof import("fs/promises")

    const writeFileMock = fs.writeFile as any

    try {
      await fsActual.mkdir(tempDir, { recursive: true })

      await fsActual.writeFile(
        path.join(tempDir, "components.json"),
        JSON.stringify({
          $schema: "https://ui.shadcn.com/schema.json",
          style: "default",
          tailwind: {
            config: "tailwind.config.js",
            css: "src/index.css",
            baseColor: "slate",
          },
          aliases: {
            components: "@/components",
            utils: "@/lib/utils",
          },
        }),
        "utf-8"
      )

      const config = await getConfig(tempDir)
      if (!config) {
        throw new Error("Failed to get config")
      }
      const envLocalPath = path.join(config.resolvedPaths.cwd, ".env.local")

      // Create .env.local instead of .env
      await fsActual.writeFile(
        envLocalPath,
        `EXISTING_KEY=existing_value
DATABASE_URL=postgres://localhost:5432/mydb`,
        "utf-8"
      )

      const result = await updateFiles(
        [
          {
            path: ".env",
            type: "registry:file",
            target: "~/.env",
            content: `DATABASE_URL=should_not_override
NEW_API_KEY=new_api_key_value`,
          },
        ],
        config,
        {
          overwrite: true,
          silent: true,
        }
      )

      expect(result.filesUpdated).toContain(".env.local")
      expect(result.filesCreated).not.toContain(".env")
      expect(result.filesCreated).not.toContain(".env.local")

      expect(writeFileMock).toHaveBeenCalledWith(
        envLocalPath,
        `EXISTING_KEY=existing_value
DATABASE_URL=postgres://localhost:5432/mydb

NEW_API_KEY=new_api_key_value
`,
        "utf-8"
      )
    } finally {
      await fsActual.rm(tempDir, { recursive: true }).catch(() => {})
    }
  })

  test("should use existing .env when target is .env.local but doesn't exist", async () => {
    const tempDir = path.join(
      path.resolve(__dirname, "../../fixtures"),
      "temp-env-target-local-test"
    )
    const fsActual = (await vi.importActual(
      "fs/promises"
    )) as typeof import("fs/promises")

    const writeFileMock = fs.writeFile as any

    try {
      await fsActual.mkdir(tempDir, { recursive: true })

      await fsActual.writeFile(
        path.join(tempDir, "components.json"),
        JSON.stringify({
          $schema: "https://ui.shadcn.com/schema.json",
          style: "default",
          tailwind: {
            config: "tailwind.config.js",
            css: "src/index.css",
            baseColor: "slate",
          },
          aliases: {
            components: "@/components",
            utils: "@/lib/utils",
          },
        }),
        "utf-8"
      )

      const config = await getConfig(tempDir)
      if (!config) {
        throw new Error("Failed to get config")
      }
      const envPath = path.join(config.resolvedPaths.cwd, ".env")

      // Create .env file (not .env.local)
      await fsActual.writeFile(envPath, `EXISTING_KEY=existing_value`, "utf-8")

      const result = await updateFiles(
        [
          {
            path: ".env.local",
            type: "registry:file",
            target: "~/.env.local",
            content: `NEW_KEY=new_value`,
          },
        ],
        config,
        {
          overwrite: true,
          silent: true,
        }
      )

      // Should update .env instead of creating .env.local
      expect(result.filesUpdated).toContain(".env")
      expect(result.filesCreated).not.toContain(".env.local")

      expect(writeFileMock).toHaveBeenCalledWith(
        envPath,
        `EXISTING_KEY=existing_value

NEW_KEY=new_value
`,
        "utf-8"
      )
    } finally {
      await fsActual.rm(tempDir, { recursive: true }).catch(() => {})
    }
  })

  test("should create .env when no env variants exist", async () => {
    const tempDir = path.join(
      path.resolve(__dirname, "../../fixtures"),
      "temp-env-create-test"
    )
    const fsActual = (await vi.importActual(
      "fs/promises"
    )) as typeof import("fs/promises")

    const writeFileMock = fs.writeFile as any

    try {
      await fsActual.mkdir(tempDir, { recursive: true })

      await fsActual.writeFile(
        path.join(tempDir, "components.json"),
        JSON.stringify({
          $schema: "https://ui.shadcn.com/schema.json",
          style: "default",
          tailwind: {
            config: "tailwind.config.js",
            css: "src/index.css",
            baseColor: "slate",
          },
          aliases: {
            components: "@/components",
            utils: "@/lib/utils",
          },
        }),
        "utf-8"
      )

      const config = await getConfig(tempDir)
      if (!config) {
        throw new Error("Failed to get config")
      }
      const envPath = path.join(config.resolvedPaths.cwd, ".env")

      // Ensure no env files exist
      const envVariants = [
        ".env",
        ".env.local",
        ".env.development.local",
        ".env.development",
      ]
      for (const variant of envVariants) {
        const variantPath = path.join(config.resolvedPaths.cwd, variant)
        await fsActual.unlink(variantPath).catch(() => {})
      }

      const result = await updateFiles(
        [
          {
            path: ".env",
            type: "registry:file",
            target: "~/.env",
            content: `NEW_API_KEY=new_api_key_value
DATABASE_URL=postgres://localhost:5432/mydb`,
          },
        ],
        config,
        {
          overwrite: true,
          silent: true,
        }
      )

      expect(result.filesCreated).toContain(".env")
      expect(result.filesUpdated).not.toContain(".env")
      expect(result.filesUpdated).not.toContain(".env.local")

      expect(writeFileMock).toHaveBeenCalledWith(
        envPath,
        `NEW_API_KEY=new_api_key_value
DATABASE_URL=postgres://localhost:5432/mydb`,
        "utf-8"
      )
    } finally {
      await fsActual.rm(tempDir, { recursive: true }).catch(() => {})
    }
  })

  test("should place first file at custom file path", async () => {
    const config = await getConfig(
      path.resolve(__dirname, "../../fixtures/vite-with-tailwind")
    )
    expect(
      await updateFiles(
        [
          {
            path: "registry/default/ui/button.tsx",
            type: "registry:ui",
            content: `export function Button() {
  return <button>Custom Button</button>
}`,
          },
        ],
        config,
        {
          overwrite: true,
          silent: true,
          path: "custom/my-button.tsx",
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "filesCreated": [
          "custom/my-button.tsx",
        ],
        "filesSkipped": [],
        "filesUpdated": [],
      }
    `)
  })

  test("should place all files in custom directory", async () => {
    const config = await getConfig(
      path.resolve(__dirname, "../../fixtures/vite-with-tailwind")
    )
    expect(
      await updateFiles(
        [
          {
            path: "registry/default/ui/button.tsx",
            type: "registry:ui",
            content: `export function Button() {
  return <button>Button</button>
}`,
          },
          {
            path: "registry/default/ui/card.tsx",
            type: "registry:ui",
            content: `export function Card() {
  return <div>Card</div>
}`,
          },
        ],
        config,
        {
          overwrite: true,
          silent: true,
          path: "custom/components",
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "filesCreated": [
          "custom/components/button.tsx",
          "custom/components/card.tsx",
        ],
        "filesSkipped": [],
        "filesUpdated": [],
      }
    `)
  })

  test("should only apply file path to first file", async () => {
    const config = await getConfig(
      path.resolve(__dirname, "../../fixtures/vite-with-tailwind")
    )
    expect(
      await updateFiles(
        [
          {
            path: "registry/default/ui/button.tsx",
            type: "registry:ui",
            content: `export function Button() {
  return <button>Button</button>
}`,
          },
          {
            path: "registry/default/lib/utils.ts",
            type: "registry:lib",
            content: `export function cn() {}`,
          },
        ],
        config,
        {
          overwrite: true,
          silent: true,
          path: "custom/my-button.tsx",
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "filesCreated": [
          "custom/my-button.tsx",
        ],
        "filesSkipped": [],
        "filesUpdated": [
          "src/lib/utils.ts",
        ],
      }
    `)
  })
})

describe("resolveModuleByProbablePath", () => {
  test("should resolve exact file match in provided files list", () => {
    const files = [
      "components/button.tsx",
      "components/card.tsx",
      "lib/utils.ts",
    ]
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
      },
    }
    expect(
      resolveModuleByProbablePath("/foo/bar/components/button", files, config)
    ).toBe("components/button.tsx")
  })

  test("should resolve index file", () => {
    const files = ["components/button/index.tsx", "components/card.tsx"]
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
      },
    }
    expect(
      resolveModuleByProbablePath("/foo/bar/components/button", files, config)
    ).toBe("components/button/index.tsx")
  })

  test("should try different extensions", () => {
    const files = ["components/button.jsx", "components/card.tsx"]
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
      },
    }
    expect(
      resolveModuleByProbablePath("/foo/bar/components/button", files, config)
    ).toBe("components/button.jsx")
  })

  test("should fallback to basename matching", () => {
    const files = ["components/ui/button.tsx", "components/card.tsx"]
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
      },
    }
    expect(
      resolveModuleByProbablePath("/foo/bar/components/button", files, config)
    ).toBe("components/ui/button.tsx")
  })

  test("should return null when file not found", () => {
    const files = ["components/card.tsx", "lib/utils.ts"]
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
      },
    }
    expect(
      resolveModuleByProbablePath("/foo/bar/components/button", files, config)
    ).toBeNull()
  })

  test("should sort by extension priority", () => {
    const files = [
      "components/button.jsx",
      "components/button.tsx",
      "components/button.js",
    ]
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
      },
    }
    expect(
      resolveModuleByProbablePath("/foo/bar/components/button", files, config, [
        ".tsx",
        ".jsx",
        ".js",
      ])
    ).toBe("components/button.tsx")
  })

  test("should preserve extension if specified in path", () => {
    const files = ["components/button.tsx", "components/button.css"]
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
      },
    }
    expect(
      resolveModuleByProbablePath(
        "/foo/bar/components/button.css",
        files,
        config
      )
    ).toBe("components/button.css")
  })
})

describe("toAliasedImport", () => {
  test("should convert components path to aliased import", () => {
    const filePath = "components/button.tsx"
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
        components: "/foo/bar/components",
        ui: "/foo/bar/components/ui",
        lib: "/foo/bar/lib",
      },
      aliases: {
        components: "@/components",
        ui: "@/components/ui",
        lib: "@/lib",
      },
    }
    const projectInfo = {
      aliasPrefix: "@",
    }
    expect(toAliasedImport(filePath, config, projectInfo)).toBe(
      "@/components/button"
    )
  })

  test("should convert ui path to aliased import", () => {
    const filePath = "components/ui/button.tsx"
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
        components: "/foo/bar/components",
        ui: "/foo/bar/components/ui",
        lib: "/foo/bar/lib",
      },
      aliases: {
        components: "@/components",
        ui: "@/components/ui",
        lib: "@/lib",
      },
    }
    const projectInfo = {
      aliasPrefix: "@",
    }
    expect(toAliasedImport(filePath, config, projectInfo)).toBe(
      "@/components/ui/button"
    )
  })

  test("should collapse index files", () => {
    const filePath = "components/ui/button/index.tsx"
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
        components: "/foo/bar/components",
        ui: "/foo/bar/components/ui",
        lib: "/foo/bar/lib",
      },
      aliases: {
        components: "@/components",
        ui: "@/components/ui",
        lib: "@/lib",
      },
    }
    const projectInfo = {
      aliasPrefix: "@",
    }
    expect(toAliasedImport(filePath, config, projectInfo)).toBe(
      "@/components/ui/button"
    )
  })

  test("should return null when no matching alias found", () => {
    const filePath = "src/pages/index.tsx"
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
        components: "/foo/bar/components",
        ui: "/foo/bar/components/ui",
        lib: "/foo/bar/lib",
      },
      aliases: {
        components: "@/components",
        ui: "@/components/ui",
        lib: "@/lib",
      },
    }
    const projectInfo = {
      aliasPrefix: "@",
    }
    expect(toAliasedImport(filePath, config, projectInfo)).toBe("@/pages")
  })

  test("should handle nested directories", () => {
    const filePath = "components/forms/inputs/text-input.tsx"
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
        components: "/foo/bar/components",
        ui: "/foo/bar/components/ui",
        lib: "/foo/bar/lib",
      },
      aliases: {
        components: "@/components",
        ui: "@/components/ui",
        lib: "@/lib",
      },
    }
    const projectInfo = {
      aliasPrefix: "@",
    }
    expect(toAliasedImport(filePath, config, projectInfo)).toBe(
      "@/components/forms/inputs/text-input"
    )
  })

  test("should keep non-code file extensions", () => {
    const filePath = "components/styles/theme.css"
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
        components: "/foo/bar/components",
        ui: "/foo/bar/components/ui",
        lib: "/foo/bar/lib",
      },
      aliases: {
        components: "@/components",
        ui: "@/components/ui",
        lib: "@/lib",
      },
    }
    const projectInfo = {
      aliasPrefix: "@",
    }
    expect(toAliasedImport(filePath, config, projectInfo)).toBe(
      "@/components/styles/theme.css"
    )
  })

  test("should prefer longer matching paths", () => {
    const filePath = "components/ui/button.tsx"
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
        components: "/foo/bar/components",
        ui: "/foo/bar/components/ui",
      },
      aliases: {
        components: "@/components",
        ui: "@/ui",
      },
    }
    const projectInfo = {
      aliasPrefix: "@",
    }
    expect(toAliasedImport(filePath, config, projectInfo)).toBe("@/ui/button")
  })

  test("should support tilde (~) alias prefix", () => {
    const filePath = "components/button.tsx"
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
        components: "/foo/bar/components",
      },
      aliases: {
        components: "~components",
      },
    }
    const projectInfo = {
      aliasPrefix: "~",
    }
    expect(toAliasedImport(filePath, config, projectInfo)).toBe(
      "~components/button"
    )
  })

  test("should support @shadcn alias prefix", () => {
    const filePath = "components/ui/button.tsx"
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
        components: "/foo/bar/components",
        ui: "/foo/bar/components/ui",
      },
      aliases: {
        components: "@shadcn/components",
        ui: "@shadcn/ui",
      },
    }
    const projectInfo = {
      aliasPrefix: "@shadcn",
    }
    expect(toAliasedImport(filePath, config, projectInfo)).toBe(
      "@shadcn/ui/button"
    )
  })

  test("should support ~cn alias prefix", () => {
    const filePath = "lib/utils/index.tsx"
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
        lib: "/foo/bar/lib",
      },
      aliases: {
        lib: "~cn/lib",
      },
    }
    const projectInfo = {
      aliasPrefix: "~cn",
    }
    expect(toAliasedImport(filePath, config, projectInfo)).toBe("~cn/lib/utils")
  })

  test("should use project alias prefix when aliasKey is cwd", () => {
    const filePath = "src/pages/home.tsx"
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
        components: "/foo/bar/components",
        ui: "/foo/bar/components/ui",
        lib: "/foo/bar/lib",
      },
      aliases: {
        components: "@/components",
        ui: "@/components/ui",
        lib: "@/lib",
      },
    }
    const projectInfo = {
      aliasPrefix: "@",
    }
    expect(toAliasedImport(filePath, config, projectInfo)).toBe("@/pages/home")
  })
})
