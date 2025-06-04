import { existsSync } from "fs"
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
    writeFile: vi.fn(),
  }
})

vi.mock("fs", async () => {
  const actual = (await vi.importActual("fs")) as typeof import("fs")
  return {
    ...actual,
    promises: {
      ...actual.promises,
      writeFile: vi.fn(),
    },
  }
})

afterEach(() => {
  vi.resetAllMocks()
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
