import { describe, expect, test } from "vitest"

import {
  findCommonRoot,
  resolveFilePath,
  resolveNestedFilePath,
} from "../../../src/utils/updaters/update-files"

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
        type: "registry:lib",
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
