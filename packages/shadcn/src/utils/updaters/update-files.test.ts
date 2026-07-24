import { existsSync, promises as fs } from "fs"
import path from "path"
import { getFixturesDir } from "@/src/test-helpers"
import { getConfig, type Config } from "@/src/utils/get-config"
import prompts from "prompts"
import { Project } from "ts-morph"
import { afterAll, afterEach, describe, expect, it, vi } from "vitest"

import {
  findCommonRoot,
  resolveFilePath,
  resolveModuleByProbablePath,
  resolveNestedFilePath,
  rewriteResolvedImportsInContent,
  toAliasedImport,
  updateFiles,
} from "./update-files"

vi.mock("@/src/registry/api", () => ({
  getRegistryBaseColor: vi.fn().mockResolvedValue(undefined),
}))

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
  it.each([
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
        file as any,
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        } as Config,
        projectInfo
      )
    ).toBe(resolvedPath)
  })

  it.each([
    {
      description: "should resolve @components target aliases",
      target: "@components/charts/pie.tsx",
      resolvedPath: "/foo/bar/components/charts/pie.tsx",
    },
    {
      description: "should resolve @ui target aliases",
      target: "@ui/button.tsx",
      resolvedPath: "/foo/bar/components/ui/button.tsx",
    },
    {
      description: "should resolve @lib target aliases",
      target: "@lib/format.ts",
      resolvedPath: "/foo/bar/lib/format.ts",
    },
    {
      description: "should resolve @hooks target aliases",
      target: "@hooks/use-theme.ts",
      resolvedPath: "/foo/bar/hooks/use-theme.ts",
    },
  ])("$description", ({ target, resolvedPath }) => {
    expect(
      resolveFilePath(
        {
          path: "hello-world/ui/button.tsx",
          type: "registry:ui",
          target,
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        } as Config,
        {
          isSrcDir: true,
        }
      )
    ).toBe(resolvedPath)
  })

  it("should resolve target aliases with package import backed aliases", () => {
    expect(
      resolveFilePath(
        {
          path: "hello-world/ui/button.tsx",
          type: "registry:ui",
          target: "@ui/button.tsx",
        },
        {
          aliases: {
            components: "#components",
            ui: "#components/ui",
            lib: "#lib",
            hooks: "#hooks",
          },
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/src/components",
            ui: "/foo/bar/src/components/ui",
            lib: "/foo/bar/src/lib",
            hooks: "/foo/bar/src/hooks",
          },
        } as Config,
        {
          isSrcDir: false,
        }
      )
    ).toBe("/foo/bar/src/components/ui/button.tsx")
  })

  it("should fall back to normal target resolution for unknown aliases", () => {
    expect(
      resolveFilePath(
        {
          path: "hello-world/ui/button.tsx",
          type: "registry:ui",
          target: "@foo/bar.ts",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        } as Config,
        {
          isSrcDir: true,
        }
      )
    ).toBe("/foo/bar/src/foo/bar.ts")
  })

  it("should not resolve embedded alias-like path segments", () => {
    expect(
      resolveFilePath(
        {
          path: "hello-world/ui/button.tsx",
          type: "registry:ui",
          target: "components/@ui/button.tsx",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        } as Config,
        {
          isSrcDir: false,
        }
      )
    ).toBe("/foo/bar/components/@ui/button.tsx")
  })

  it("should bypass page target mapping for target aliases", () => {
    expect(
      resolveFilePath(
        {
          path: "hello-world/app/login/page.tsx",
          type: "registry:page",
          target: "@ui/page.tsx",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/src/components",
            ui: "/foo/bar/src/primitives",
            lib: "/foo/bar/src/lib",
            hooks: "/foo/bar/src/hooks",
          },
        } as Config,
        {
          isSrcDir: true,
          framework: "next-pages",
        }
      )
    ).toBe("/foo/bar/src/primitives/page.tsx")
  })

  it("should reject target aliases that escape the alias root", () => {
    expect(() =>
      resolveFilePath(
        {
          path: "hello-world/ui/button.tsx",
          type: "registry:ui",
          target: "@ui/../../page.tsx",
        },
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/components",
            ui: "/foo/bar/components/ui",
            lib: "/foo/bar/lib",
            hooks: "/foo/bar/hooks",
          },
        } as Config,
        {
          isSrcDir: false,
        }
      )
    ).toThrow('Invalid target path "@ui/../../page.tsx".')
  })

  it.each([
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
        file as any,
        {
          resolvedPaths: {
            cwd: "/foo/bar",
            components: "/foo/bar/src/components",
            ui: "/foo/bar/src/primitives",
            lib: "/foo/bar/src/lib",
            hooks: "/foo/bar/src/hooks",
          },
        } as Config,
        projectInfo
      )
    ).toBe(resolvedPath)
  })

  it("should resolve registry:ui file types", () => {
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
        } as Config,
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
        } as Config,
        {
          isSrcDir: true,
        }
      )
    ).toBe("/foo/bar/src/primitives/button.tsx")
  })

  it("should resolve registry:component and registry:block file types", () => {
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
        } as Config,
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
        } as Config,
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
        } as Config,
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
        } as Config,
        {
          isSrcDir: true,
        }
      )
    ).toBe("/foo/bar/src/components/example-card.tsx")
  })

  it("should resolve registry:lib file types", () => {
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
        } as Config,
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
        } as Config,
        {
          isSrcDir: true,
        }
      )
    ).toBe("/foo/bar/src/lib/foo.ts")
  })

  it("should resolve registry:hook file types", () => {
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
        } as Config,
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
        } as Config,
        {
          isSrcDir: true,
        }
      )
    ).toBe("/foo/bar/src/hooks/use-foo.ts")
  })

  it("should resolve registry:file file types", () => {
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
        } as Config,
        {
          isSrcDir: false,
        }
      )
    ).toBe("/foo/bar/baz/.env")
  })

  it("should resolve nested files", () => {
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
        } as Config,
        {
          isSrcDir: false,
        }
      )
    ).toBe("/foo/bar/components/path/to/example-card.tsx")

    expect(
      resolveFilePath(
        {
          path: "hello-world/create-system/primitives/button.tsx",
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
        } as Config,
        {
          isSrcDir: false,
        }
      )
    ).toBe("/foo/bar/components/ui/button.tsx")
  })
})

describe("resolveFilePath with custom path", () => {
  it("should use custom file path for exact file target", () => {
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
        } as Config,
        {
          isSrcDir: false,
          path: "/foo/bar/custom/my-button.tsx",
          fileIndex: 0,
        }
      )
    ).toBe("/foo/bar/custom/my-button.tsx")
  })

  it("should use custom directory path and strip type prefix", () => {
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
        } as Config,
        {
          isSrcDir: false,
          path: "/foo/bar/custom",
          fileIndex: 0,
        }
      )
    ).toBe("/foo/bar/custom/button.tsx")
  })

  it("should strip nested paths when using custom directory", () => {
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
        } as Config,
        {
          isSrcDir: false,
          path: "/foo/bar/custom",
          fileIndex: 0,
        }
      )
    ).toBe("/foo/bar/custom/card.tsx")
  })

  it("should handle lib files with custom directory", () => {
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
        } as Config,
        {
          isSrcDir: false,
          path: "/foo/bar/custom",
          fileIndex: 0,
        }
      )
    ).toBe("/foo/bar/custom/utils.ts")
  })

  it("should handle hooks with custom directory", () => {
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
        } as Config,
        {
          isSrcDir: false,
          path: "/foo/bar/custom",
          fileIndex: 0,
        }
      )
    ).toBe("/foo/bar/custom/use-toast.ts")
  })

  it("should use custom file path with different extension", () => {
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
        } as Config,
        {
          isSrcDir: false,
          path: "/foo/bar/my-components/custom-card.jsx",
          fileIndex: 0,
        }
      )
    ).toBe("/foo/bar/my-components/custom-card.jsx")
  })

  it("should not use custom path when not provided", () => {
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
        } as Config,
        {
          isSrcDir: false,
        }
      )
    ).toBe("/foo/bar/components/ui/button.tsx")
  })

  it("should support any file extension for file paths", () => {
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
        } as Config,
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
        } as Config,
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
        } as Config,
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
  it("should not resolve for unknown or unsupported framework", () => {
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
        } as Config,
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
        } as Config,
        {
          isSrcDir: false,
          framework: "vite",
        }
      )
    ).toBe("")
  })

  it("should resolve for next-app", () => {
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
        } as Config,
        {
          isSrcDir: false,
          framework: "next-app",
        }
      )
    ).toBe("/foo/bar/app/login/page.tsx")
  })

  it("should resolve for next-pages", () => {
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
        } as Config,
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
        } as Config,
        {
          isSrcDir: false,
          framework: "next-pages",
        }
      )
    ).toBe("/foo/bar/pages/blog/[slug].tsx")
  })

  it("should resolve for react-router", () => {
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
        } as Config,
        {
          isSrcDir: false,
          framework: "react-router",
        }
      )
    ).toBe("/foo/bar/app/routes/login.tsx")
  })

  it("should resolve for laravel", () => {
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
        } as Config,
        {
          isSrcDir: false,
          framework: "laravel",
        }
      )
    ).toBe("/foo/bar/resources/js/pages/login.tsx")
  })
})

describe("findCommonRoot", () => {
  it.each([
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
  it.each([
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
  it("should create missing files", async () => {
    const config = (await getConfig(getFixturesDir("vite-with-tailwind")))!
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

  it("should skip existing files if same content", async () => {
    const config = (await getConfig(getFixturesDir("vite-with-tailwind")))!
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

  it("should update file if different content", async () => {
    const config = (await getConfig(getFixturesDir("vite-with-tailwind")))!
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

  it("should rewrite exact package-import subpaths to valid relative imports", async () => {
    const tempDir = getFixturesDir("temp-package-import-exact-hook")
    const fsActual = (await vi.importActual(
      "fs/promises"
    )) as typeof import("fs/promises")
    const fsModuleActual = (await vi.importActual("fs")) as typeof import("fs")
    const writeFileMock = fs.writeFile as any

    try {
      writeFileMock.mockImplementation(fsModuleActual.promises.writeFile as any)

      await fsActual.rm(tempDir, { recursive: true, force: true })
      await fsActual.mkdir(path.join(tempDir, "src", "app"), {
        recursive: true,
      })
      await fsActual.mkdir(path.join(tempDir, "src", "hooks"), {
        recursive: true,
      })
      await fsActual.mkdir(path.join(tempDir, "src", "lib"), {
        recursive: true,
      })

      await fsActual.writeFile(
        path.join(tempDir, "package.json"),
        JSON.stringify(
          {
            name: "temp-package-import-exact-hook",
            type: "module",
            imports: {
              "#components/*": "./src/components/*",
              "#hooks": "./src/hooks/index.ts",
              "#utils": "./src/lib/utils.ts",
            },
          },
          null,
          2
        ),
        "utf-8"
      )

      await fsActual.writeFile(
        path.join(tempDir, "tsconfig.json"),
        JSON.stringify(
          {
            compilerOptions: {
              module: "esnext",
              moduleResolution: "bundler",
              resolvePackageJsonImports: true,
            },
          },
          null,
          2
        ),
        "utf-8"
      )

      await fsActual.writeFile(
        path.join(tempDir, "components.json"),
        JSON.stringify(
          {
            $schema: "https://ui.shadcn.com/schema.json",
            style: "new-york",
            rsc: true,
            tsx: true,
            tailwind: {
              config: "",
              css: "src/app/globals.css",
              baseColor: "zinc",
              cssVariables: true,
            },
            aliases: {
              components: "#components",
              hooks: "#hooks",
              utils: "#utils",
            },
          },
          null,
          2
        ),
        "utf-8"
      )

      await fsActual.writeFile(
        path.join(tempDir, "src", "app", "globals.css"),
        '@import "tailwindcss";\n',
        "utf-8"
      )
      await fsActual.writeFile(
        path.join(tempDir, "src", "hooks", "index.ts"),
        'export * from "./use-thing"\n',
        "utf-8"
      )
      await fsActual.writeFile(
        path.join(tempDir, "src", "lib", "utils.ts"),
        "export function cn() {}\n",
        "utf-8"
      )

      const config = await getConfig(tempDir)
      if (!config) {
        throw new Error("Failed to get config")
      }

      await updateFiles(
        [
          {
            path: "components/example-card.tsx",
            type: "registry:component",
            content: `import { useThing } from "@/hooks/use-thing"

export function ExampleCard() {
  useThing()
  return null
}
`,
          },
          {
            path: "hooks/use-thing.ts",
            type: "registry:hook",
            content: `export function useThing() {
  return true
}
`,
          },
        ],
        config,
        {
          overwrite: true,
          silent: true,
        }
      )

      const componentContents = await fsActual.readFile(
        path.join(tempDir, "src", "components", "example-card.tsx"),
        "utf-8"
      )

      expect(componentContents).toContain(`from "../hooks/use-thing"`)
      expect(componentContents).not.toContain(`from "#hooks/use-thing"`)
    } finally {
      writeFileMock.mockResolvedValue(undefined)
      await fsActual
        .rm(tempDir, { recursive: true, force: true })
        .catch(() => {})
    }
  })

  it("should skip existing package-import files when final content is identical", async () => {
    const tempDir = getFixturesDir("temp-package-import-same-content")
    const fsActual = (await vi.importActual(
      "fs/promises"
    )) as typeof import("fs/promises")
    const fsModuleActual = (await vi.importActual("fs")) as typeof import("fs")
    const writeFileMock = fs.writeFile as any

    try {
      writeFileMock.mockImplementation(fsModuleActual.promises.writeFile as any)

      await fsActual.rm(tempDir, { recursive: true, force: true })
      await fsActual.mkdir(path.join(tempDir, "src", "components", "ui"), {
        recursive: true,
      })
      await fsActual.mkdir(path.join(tempDir, "src", "lib"), {
        recursive: true,
      })

      await fsActual.writeFile(
        path.join(tempDir, "package.json"),
        JSON.stringify(
          {
            name: "temp-package-import-same-content",
            type: "module",
            imports: {
              "#components/*": "./src/components/*",
              "#lib/*": "./src/lib/*",
            },
          },
          null,
          2
        ),
        "utf-8"
      )

      await fsActual.writeFile(
        path.join(tempDir, "tsconfig.json"),
        JSON.stringify(
          {
            files: [],
            references: [{ path: "./tsconfig.app.json" }],
          },
          null,
          2
        ),
        "utf-8"
      )

      await fsActual.writeFile(
        path.join(tempDir, "tsconfig.app.json"),
        JSON.stringify(
          {
            compilerOptions: {
              module: "esnext",
              moduleResolution: "bundler",
              baseUrl: ".",
              paths: {
                "#components/*": ["./src/components/*"],
                "#lib/*": ["./src/lib/*"],
              },
            },
          },
          null,
          2
        ),
        "utf-8"
      )

      await fsActual.writeFile(
        path.join(tempDir, "components.json"),
        JSON.stringify(
          {
            $schema: "https://ui.shadcn.com/schema.json",
            style: "new-york",
            rsc: false,
            tsx: true,
            tailwind: {
              config: "",
              css: "src/index.css",
              baseColor: "zinc",
              cssVariables: true,
            },
            aliases: {
              components: "#components",
              ui: "#components/ui",
              lib: "#lib",
              utils: "#lib/utils",
            },
          },
          null,
          2
        ),
        "utf-8"
      )

      await fsActual.writeFile(
        path.join(tempDir, "src", "index.css"),
        '@import "tailwindcss";\n',
        "utf-8"
      )

      await fsActual.writeFile(
        path.join(tempDir, "src", "lib", "utils.ts"),
        "export function cn(...inputs: unknown[]) {\n  return inputs\n}\n",
        "utf-8"
      )

      const config = await getConfig(tempDir)
      if (!config) {
        throw new Error("Failed to get config")
      }

      const buttonFile = {
        path: "registry/default/ui/button.tsx",
        type: "registry:ui" as const,
        content: `import { cn } from "@/lib/utils"

export function Button() {
  return <button>{cn("button")}</button>
}
`,
      }

      await updateFiles([buttonFile], config, {
        overwrite: true,
        silent: true,
      })

      vi.mocked(prompts).mockClear()

      const result = await updateFiles([buttonFile], config, {
        overwrite: false,
        silent: true,
      })

      expect(result.filesSkipped).toEqual(["src/components/ui/button.tsx"])
      expect(result.filesUpdated).toEqual([])
      expect(vi.mocked(prompts)).not.toHaveBeenCalled()
    } finally {
      writeFileMock.mockResolvedValue(undefined)
      await fsActual
        .rm(tempDir, { recursive: true, force: true })
        .catch(() => {})
    }
  })

  it("should remove temporary source files after rewriting content", async () => {
    const project = new Project({
      compilerOptions: {},
    })
    const content = "export const value = 1\n"

    await expect(
      rewriteResolvedImportsInContent({
        content,
        resolvedPath: "/tmp/example.ts",
        filePaths: [],
        config: {
          aliases: {},
          resolvedPaths: {
            cwd: "/tmp",
          },
        } as any,
        projectInfo: {
          aliasPrefix: "#",
        } as any,
        tsConfig: {
          resultType: "success",
          absoluteBaseUrl: "/tmp",
          paths: {},
        } as any,
        project,
      })
    ).resolves.toBe(content)

    expect(project.getSourceFiles()).toHaveLength(0)
  })

  it("should mark .env file as created when it doesn't exist", async () => {
    const config = (await getConfig(getFixturesDir("vite-with-tailwind")))!

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

  it("should rewrite app-local files to workspace utils aliases in monorepos without tsconfig paths", async () => {
    const config = await getConfig(
      getFixturesDir("frameworks/vite-monorepo-imports/apps/web")
    )

    if (!config) {
      throw new Error("Failed to get monorepo app config")
    }

    const result = await updateFiles(
      [
        {
          path: "registry/components/login-form.tsx",
          type: "registry:component",
          content: `import { cn } from "@/lib/utils"

export function LoginForm() {
  return <div>{cn("login")}</div>
}
`,
        },
      ],
      config,
      {
        overwrite: true,
        silent: true,
      }
    )

    expect(result.filesCreated).toContain("src/components/login-form.tsx")

    const writtenContent = (fs.writeFile as any).mock.calls.find((call: any) =>
      call[0].endsWith("src/components/login-form.tsx")
    )?.[1]

    expect(writtenContent).toContain(`from "@workspace/ui/lib/utils"`)
    expect(writtenContent).not.toContain(`from "#lib/utils"`)
  })

  it("should mark .env file as updated when merging content", async () => {
    const tempDir = getFixturesDir("temp-env-test")
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

      const config = (await getConfig(tempDir))!
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

  it("should use .env.local when .env doesn't exist", async () => {
    const tempDir = getFixturesDir("temp-env-alternative-test")
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

  it("should use existing .env when target is .env.local but doesn't exist", async () => {
    const tempDir = getFixturesDir("temp-env-target-local-test")
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

  it("should create .env when no env variants exist", async () => {
    const tempDir = getFixturesDir("temp-env-create-test")
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

  it("should place first file at custom file path", async () => {
    const config = (await getConfig(getFixturesDir("vite-with-tailwind")))!
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

  it("should place all files in custom directory", async () => {
    const config = (await getConfig(getFixturesDir("vite-with-tailwind")))!
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

  it("should only apply file path to first file", async () => {
    const config = (await getConfig(getFixturesDir("vite-with-tailwind")))!
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

  it("should preserve 'use client' directive for universal item files (registry:file)", async () => {
    const config = (await getConfig(getFixturesDir("vite-with-tailwind")))!
    const result = await updateFiles(
      [
        {
          path: "custom-component.tsx",
          type: "registry:file",
          target: "~/custom-component.tsx",
          content: `"use client"

export function CustomComponent() {
  return <div>Custom Component</div>
}`,
        },
      ],
      config,
      {
        overwrite: true,
        silent: true,
      }
    )

    // Verify that the file was created
    expect(result.filesCreated).toContain("custom-component.tsx")

    // Read the written file and check if 'use client' is preserved
    const writtenContent = (fs.writeFile as any).mock.calls.find((call: any) =>
      call[0].endsWith("custom-component.tsx")
    )?.[1]

    expect(writtenContent).toContain('"use client"')
  })

  it("should preserve 'use client' directive for universal item files (registry:item)", async () => {
    const config = (await getConfig(getFixturesDir("vite-with-tailwind")))!
    const result = await updateFiles(
      [
        {
          path: "universal-widget.tsx",
          type: "registry:item",
          target: "~/universal-widget.tsx",
          content: `'use client'

export function UniversalWidget() {
  return <div>Universal Widget</div>
}`,
        },
      ],
      config,
      {
        overwrite: true,
        silent: true,
      }
    )

    // Verify that the file was created
    expect(result.filesCreated).toContain("universal-widget.tsx")

    // Read the written file and check if 'use client' is preserved
    const writtenContent = (fs.writeFile as any).mock.calls.find((call: any) =>
      call[0].endsWith("universal-widget.tsx")
    )?.[1]

    expect(writtenContent).toContain("'use client'")
  })

  it("should remove 'use client' directive for non-universal item files when rsc is false", async () => {
    const config = (await getConfig(getFixturesDir("vite-with-tailwind")))!
    const result = await updateFiles(
      [
        {
          path: "registry/default/ui/regular-component.tsx",
          type: "registry:ui",
          content: `"use client"

export function RegularComponent() {
  return <div>Regular Component</div>
}`,
        },
      ],
      config,
      {
        overwrite: true,
        silent: true,
      }
    )

    // Verify that the file was created (filesCreated contains relative paths)
    expect(result.filesCreated.length).toBeGreaterThan(0)

    // Read the written file and check if 'use client' was removed
    const writtenContent = (fs.writeFile as any).mock.calls.find((call: any) =>
      call[0].endsWith("regular-component.tsx")
    )?.[1]

    // The 'use client' should be removed by the RSC transformer
    expect(writtenContent).not.toContain('"use client"')
  })
})

describe("resolveModuleByProbablePath", () => {
  it("should resolve exact file match in provided files list", () => {
    const files = [
      "components/button.tsx",
      "components/card.tsx",
      "lib/utils.ts",
    ]
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
      },
    } as Config
    expect(
      resolveModuleByProbablePath("/foo/bar/components/button", files, config)
    ).toBe("components/button.tsx")
  })

  it("should resolve index file", () => {
    const files = ["components/button/index.tsx", "components/card.tsx"]
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
      },
    } as Config
    expect(
      resolveModuleByProbablePath("/foo/bar/components/button", files, config)
    ).toBe("components/button/index.tsx")
  })

  it("should try different extensions", () => {
    const files = ["components/button.jsx", "components/card.tsx"]
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
      },
    } as Config
    expect(
      resolveModuleByProbablePath("/foo/bar/components/button", files, config)
    ).toBe("components/button.jsx")
  })

  it("should fallback to basename matching", () => {
    const files = ["components/ui/button.tsx", "components/card.tsx"]
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
      },
    } as Config
    expect(
      resolveModuleByProbablePath("/foo/bar/components/button", files, config)
    ).toBe("components/ui/button.tsx")
  })

  it("should return null when file not found", () => {
    const files = ["components/card.tsx", "lib/utils.ts"]
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
      },
    } as Config
    expect(
      resolveModuleByProbablePath("/foo/bar/components/button", files, config)
    ).toBeNull()
  })

  it("should sort by extension priority", () => {
    const files = [
      "components/button.jsx",
      "components/button.tsx",
      "components/button.js",
    ]
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
      },
    } as Config
    expect(
      resolveModuleByProbablePath("/foo/bar/components/button", files, config, [
        ".tsx",
        ".jsx",
        ".js",
      ])
    ).toBe("components/button.tsx")
  })

  it("should preserve extension if specified in path", () => {
    const files = ["components/button.tsx", "components/button.css"]
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
      },
    } as Config
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
  it("should convert components path to aliased import", () => {
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
    } as Config
    const projectInfo = {
      aliasPrefix: "@",
    } as any
    expect(toAliasedImport(filePath, config, projectInfo)).toBe(
      "@/components/button"
    )
  })

  it("should convert ui path to aliased import", () => {
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
    } as Config
    const projectInfo = {
      aliasPrefix: "@",
    } as any
    expect(toAliasedImport(filePath, config, projectInfo)).toBe(
      "@/components/ui/button"
    )
  })

  it("should collapse index files", () => {
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
    } as Config
    const projectInfo = {
      aliasPrefix: "@",
    } as any
    expect(toAliasedImport(filePath, config, projectInfo)).toBe(
      "@/components/ui/button"
    )
  })

  it("should return null when no matching alias found", () => {
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
    } as Config
    const projectInfo = {
      aliasPrefix: "@",
    } as any
    expect(toAliasedImport(filePath, config, projectInfo)).toBe("@/pages")
  })

  it("should handle nested directories", () => {
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
    } as Config
    const projectInfo = {
      aliasPrefix: "@",
    } as any
    expect(toAliasedImport(filePath, config, projectInfo)).toBe(
      "@/components/forms/inputs/text-input"
    )
  })

  it("should keep non-code file extensions", () => {
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
    } as Config
    const projectInfo = {
      aliasPrefix: "@",
    } as any
    expect(toAliasedImport(filePath, config, projectInfo)).toBe(
      "@/components/styles/theme.css"
    )
  })

  it("should prefer longer matching paths", () => {
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
    } as Config
    const projectInfo = {
      aliasPrefix: "@",
    } as any
    expect(toAliasedImport(filePath, config, projectInfo)).toBe("@/ui/button")
  })

  it("should support tilde (~) alias prefix", () => {
    const filePath = "components/button.tsx"
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
        components: "/foo/bar/components",
      },
      aliases: {
        components: "~components",
      },
    } as Config
    const projectInfo = {
      aliasPrefix: "~",
    } as any
    expect(toAliasedImport(filePath, config, projectInfo)).toBe(
      "~components/button"
    )
  })

  it("should support @shadcn alias prefix", () => {
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
    } as Config
    const projectInfo = {
      aliasPrefix: "@shadcn",
    } as any
    expect(toAliasedImport(filePath, config, projectInfo)).toBe(
      "@shadcn/ui/button"
    )
  })

  it("should support ~cn alias prefix", () => {
    const filePath = "lib/utils/index.tsx"
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
        lib: "/foo/bar/lib",
      },
      aliases: {
        lib: "~cn/lib",
      },
    } as Config
    const projectInfo = {
      aliasPrefix: "~cn",
    } as any
    expect(toAliasedImport(filePath, config, projectInfo)).toBe("~cn/lib/utils")
  })

  it("should use project alias prefix when aliasKey is cwd", () => {
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
    } as Config
    const projectInfo = {
      aliasPrefix: "@",
    } as any
    expect(toAliasedImport(filePath, config, projectInfo)).toBe("@/pages/home")
  })

  it("should preserve extensions for package imports that target bare wildcards", () => {
    const filePath = "src/components/ui/button.tsx"
    const config = {
      resolvedPaths: {
        cwd: getFixturesDir("config-imports"),
        components: getFixturesDir("config-imports/src/components"),
        ui: getFixturesDir("config-imports/src/components/ui"),
      },
      aliases: {
        components: "#components",
        ui: "#components/ui",
      },
    } as Config
    const projectInfo = {
      aliasPrefix: "#",
    } as any

    expect(toAliasedImport(filePath, config, projectInfo)).toBe(
      "#components/ui/button.tsx"
    )
  })

  it("should strip extensions for package imports whose target already includes them", () => {
    const filePath = "src/components/button.tsx"
    const config = {
      resolvedPaths: {
        cwd: getFixturesDir("with-package-imports"),
        components: getFixturesDir("with-package-imports/src/components"),
      },
      aliases: {
        components: "#components-ext",
      },
    } as Config
    const projectInfo = {
      aliasPrefix: "#",
    } as any

    expect(toAliasedImport(filePath, config, projectInfo)).toBe(
      "#components-ext/button"
    )
  })

  it("should keep exact package import aliases for index files", () => {
    const filePath = "src/hooks/index.ts"
    const config = {
      resolvedPaths: {
        cwd: getFixturesDir("config-imports"),
        hooks: getFixturesDir("config-imports/src/hooks"),
      },
      aliases: {
        hooks: "#hooks",
      },
    } as Config
    const projectInfo = {
      aliasPrefix: "#",
    } as any

    expect(toAliasedImport(filePath, config, projectInfo)).toBe("#hooks")
  })

  it("should prefer exact package import aliases over parent directory aliases", () => {
    const filePath = "src/lib/utils.ts"
    const config = {
      resolvedPaths: {
        cwd: getFixturesDir("config-imports"),
        lib: getFixturesDir("config-imports/src/lib"),
        utils: getFixturesDir("config-imports/src/lib/utils.ts"),
      },
      aliases: {
        lib: "#lib",
        utils: "#utils",
      },
    } as Config
    const projectInfo = {
      aliasPrefix: "#",
    } as any

    expect(toAliasedImport(filePath, config, projectInfo)).toBe("#utils")
  })
})
