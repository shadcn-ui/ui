import { existsSync, promises as fs } from "fs"
import { tmpdir } from "os"
import path from "path"
import { stripVTControlCharacters } from "util"
import { getFixturesDir } from "@/src/test-helpers"
import { getConfig, type Config } from "@/src/utils/get-config"
import { type ProjectInfo } from "@/src/utils/get-project-info"
import { logger } from "@/src/utils/logger"
import prompts from "prompts"
import { Project } from "ts-morph"
import { loadConfig, type ConfigLoaderSuccessResult } from "tsconfig-paths"
import { afterAll, afterEach, describe, expect, it, vi } from "vitest"

import {
  findCommonRoot,
  getPlannedFilePaths,
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

// Creates a throwaway project under the OS temp dir (outside any workspace)
// using the real fs, since `fs.promises.writeFile` is mocked in this file.
async function createTempProject(files: Record<string, string>) {
  const fsActual = (await vi.importActual(
    "fs/promises"
  )) as typeof import("fs/promises")
  const dir = await fsActual.mkdtemp(
    path.join(tmpdir(), "shadcn-update-files-")
  )

  for (const [filePath, content] of Object.entries(files)) {
    const absolutePath = path.join(dir, filePath)
    await fsActual.mkdir(path.dirname(absolutePath), { recursive: true })
    await fsActual.writeFile(absolutePath, content, "utf-8")
  }

  return dir
}

async function removeTempProject(dir: string) {
  const fsActual = (await vi.importActual(
    "fs/promises"
  )) as typeof import("fs/promises")
  await fsActual.rm(dir, { recursive: true, force: true }).catch(() => {})
}

async function readActualFile(filePath: string) {
  const fsActual = (await vi.importActual(
    "fs/promises"
  )) as typeof import("fs/promises")
  return fsActual.readFile(filePath, "utf-8")
}

async function withRealWrites<T>(callback: () => Promise<T>) {
  const fsModuleActual = (await vi.importActual("fs")) as typeof import("fs")
  const writeFileMock = fs.writeFile as any

  writeFileMock.mockImplementation(fsModuleActual.promises.writeFile as any)
  try {
    return await callback()
  } finally {
    writeFileMock.mockResolvedValue(undefined)
  }
}

function getWrittenContent(filePath: string) {
  return (fs.writeFile as any).mock.calls.find(
    (call: any) => call[0] === filePath
  )?.[1]
}

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

  it.each([
    {
      type: "registry:example",
      path: "registry/new-york/examples/button-demo.tsx",
      resolvedPath: "/foo/bar/components/button-demo.tsx",
    },
    {
      type: "registry:page",
      path: "registry/new-york/blocks/login/page.tsx",
      resolvedPath: "/foo/bar/components/page.tsx",
    },
    {
      type: "registry:file",
      path: "registry/new-york/components/data/config.json",
      resolvedPath: "/foo/bar/components/data/config.json",
    },
  ])(
    "should fall back to the components directory for $type without a target",
    ({ type, path: filePath, resolvedPath }) => {
      expect(
        resolveFilePath(
          { path: filePath, type } as any,
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
      ).toBe(resolvedPath)
    }
  )
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

  it("should skip existing files without prompting when non-interactive", async () => {
    const config = (await getConfig(getFixturesDir("vite-with-tailwind")))!
    const result = await updateFiles(
      [
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
        overwrite: false,
        interactive: false,
        silent: true,
      }
    )

    expect(result).toEqual({
      filesCreated: [],
      filesSkipped: ["src/components/ui/button.tsx"],
      filesUpdated: [],
    })
    expect(prompts).not.toHaveBeenCalled()
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

  it("should preserve skipped package-import files in non-interactive mode", async () => {
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

      const buttonPath = path.join(
        tempDir,
        "src",
        "components",
        "ui",
        "button.tsx"
      )
      const existingContent = `import { cn } from "@/lib/utils"

export function Button() {
  return <button>{cn("existing")}</button>
}
`
      await fsActual.writeFile(buttonPath, existingContent, "utf-8")

      const nonInteractiveResult = await updateFiles(
        [
          {
            ...buttonFile,
            content: `import { cn } from "@/lib/utils"

export function Button() {
  return <button>{cn("incoming")}</button>
}
`,
          },
        ],
        config,
        {
          overwrite: false,
          interactive: false,
          silent: true,
        }
      )

      expect(nonInteractiveResult.filesSkipped).toEqual([
        "src/components/ui/button.tsx",
      ])
      expect(nonInteractiveResult.filesUpdated).toEqual([])
      expect(await fsActual.readFile(buttonPath, "utf-8")).toBe(existingContent)
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

  it("should return each call's own content when reusing one project", async () => {
    // Same scenario as above, pinned through output only: repeated calls on a
    // shared project must not see each other's content.
    const project = new Project({
      compilerOptions: {},
    })
    const options = {
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
    }
    const first = "export const value = 1\n"
    const second =
      'import { value } from "./value"\n\nexport const other = value\n'

    await expect(
      rewriteResolvedImportsInContent({ ...options, content: first })
    ).resolves.toBe(first)
    await expect(
      rewriteResolvedImportsInContent({ ...options, content: second })
    ).resolves.toBe(second)
    await expect(
      rewriteResolvedImportsInContent({ ...options, content: first })
    ).resolves.toBe(first)
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

  it("should return empty results when there are no files", async () => {
    const config = (await getConfig(getFixturesDir("vite-with-tailwind")))!
    const empty = { filesCreated: [], filesUpdated: [], filesSkipped: [] }

    expect(await updateFiles([], config, { silent: true })).toEqual(empty)
    expect(await updateFiles(undefined, config, { silent: true })).toEqual(
      empty
    )
  })

  it("should ignore files without content", async () => {
    const config = (await getConfig(getFixturesDir("vite-with-tailwind")))!

    expect(
      await updateFiles(
        [
          {
            path: "registry/default/ui/empty.tsx",
            type: "registry:ui",
          },
          {
            path: "registry/default/ui/blank.tsx",
            type: "registry:ui",
            content: "",
          },
        ],
        config,
        { overwrite: true, silent: true }
      )
    ).toEqual({ filesCreated: [], filesUpdated: [], filesSkipped: [] })
    expect(fs.writeFile).not.toHaveBeenCalled()
  })

  it("should silently drop pages for frameworks without page support", async () => {
    const config = (await getConfig(getFixturesDir("vite-with-tailwind")))!

    expect(
      await updateFiles(
        [
          {
            path: "registry/new-york/blocks/login/page.tsx",
            type: "registry:page",
            target: "app/login/page.tsx",
            content: `export default function Page() {
  return null
}
`,
          },
          {
            path: "registry/new-york/blocks/login/components/login-form.tsx",
            type: "registry:component",
            content: `export function LoginForm() {
  return null
}
`,
          },
        ],
        config,
        { overwrite: true, silent: true }
      )
    ).toEqual({
      filesCreated: ["src/components/login-form.tsx"],
      filesUpdated: [],
      filesSkipped: [],
    })
  })

  it("should write .jsx and .js files when tsx is disabled", async () => {
    const config = (await getConfig(getFixturesDir("vite-with-tailwind")))!
    const cwd = config.resolvedPaths.cwd

    expect(
      await updateFiles(
        [
          {
            path: "registry/default/ui/toggle.tsx",
            type: "registry:ui",
            content: `export function Toggle() {
  return <button>Toggle</button>
}
`,
          },
          {
            path: "registry/default/lib/format.ts",
            type: "registry:lib",
            content: `export function format(value: string) {
  return value
}
`,
          },
        ],
        { ...config, tsx: false },
        { overwrite: true, silent: true }
      )
    ).toEqual({
      filesCreated: ["src/components/ui/toggle.jsx", "src/lib/format.js"],
      filesUpdated: [],
      filesSkipped: [],
    })
    expect(
      (fs.writeFile as any).mock.calls.map((call: any) =>
        path.relative(cwd, call[0])
      )
    ).toEqual(["src/components/ui/toggle.jsx", "src/lib/format.js"])
  })

  it("should throw when the target path is an existing directory", async () => {
    const config = (await getConfig(getFixturesDir("vite-with-tailwind")))!
    const directoryPath = path.join(
      config.resolvedPaths.cwd,
      "src",
      "components"
    )

    await expect(
      updateFiles(
        [
          {
            path: "components",
            type: "registry:file",
            target: "~/src/components",
            content: "export {}\n",
          },
        ],
        config,
        { overwrite: true, silent: true }
      )
    ).rejects.toThrow(
      new Error(
        `Cannot write to ${directoryPath}: path exists and is a directory. Please provide a file path instead.`
      )
    )
  })

  it("should skip existing files when the overwrite prompt is declined", async () => {
    const config = (await getConfig(getFixturesDir("vite-with-tailwind")))!
    const rootSpinner = { stop: vi.fn(), start: vi.fn() }
    vi.mocked(prompts).mockResolvedValueOnce({ overwrite: false })

    const result = await updateFiles(
      [
        {
          path: "registry/default/ui/button.tsx",
          type: "registry:ui",
          content: `export function Button() {
  return <button>Prompted</button>
}
`,
        },
      ],
      config,
      { silent: true, rootSpinner: rootSpinner as any }
    )

    expect(result).toEqual({
      filesCreated: [],
      filesUpdated: [],
      filesSkipped: ["src/components/ui/button.tsx"],
    })
    expect(prompts).toHaveBeenCalledTimes(1)
    expect(rootSpinner.stop).toHaveBeenCalledTimes(1)
    expect(rootSpinner.start).toHaveBeenCalledTimes(1)
    expect(fs.writeFile).not.toHaveBeenCalled()
  })

  it("should overwrite existing files when the overwrite prompt is accepted", async () => {
    const config = (await getConfig(getFixturesDir("vite-with-tailwind")))!
    const rootSpinner = { stop: vi.fn(), start: vi.fn() }
    const content = `export function Button() {
  return <button>Prompted</button>
}
`
    vi.mocked(prompts).mockResolvedValueOnce({ overwrite: true })

    const result = await updateFiles(
      [
        {
          path: "registry/default/ui/button.tsx",
          type: "registry:ui",
          content,
        },
      ],
      config,
      { silent: true, rootSpinner: rootSpinner as any }
    )

    expect(result).toEqual({
      filesCreated: [],
      filesUpdated: ["src/components/ui/button.tsx"],
      filesSkipped: [],
    })
    expect(rootSpinner.stop).toHaveBeenCalledTimes(1)
    expect(rootSpinner.start).toHaveBeenCalledTimes(1)
    expect(
      getWrittenContent(
        path.join(config.resolvedPaths.cwd, "src/components/ui/button.tsx")
      )
    ).toBe(content)
  })

  it("should prompt without a root spinner", async () => {
    const config = (await getConfig(getFixturesDir("vite-with-tailwind")))!
    vi.mocked(prompts).mockResolvedValueOnce({ overwrite: false })

    expect(
      await updateFiles(
        [
          {
            path: "registry/default/ui/button.tsx",
            type: "registry:ui",
            content: `export function Button() {
  return <button>Prompted</button>
}
`,
          },
        ],
        config,
        { silent: true }
      )
    ).toEqual({
      filesCreated: [],
      filesUpdated: [],
      filesSkipped: ["src/components/ui/button.tsx"],
    })
    expect(prompts).toHaveBeenCalledTimes(1)
  })

  it("should log created, updated, skipped files and added env vars when not silent", async () => {
    const config = (await getConfig(getFixturesDir("vite-with-tailwind")))!
    const logSpy = vi.spyOn(logger, "log").mockImplementation(() => {})

    try {
      const result = await updateFiles(
        [
          {
            path: "src/components/hello.tsx",
            type: "registry:component",
            content: `export function Hello() {
  return <div>Hello</div>
}
`,
          },
          {
            path: "registry/default/ui/button.tsx",
            type: "registry:ui",
            content: `export function Button() {
  return <button>Click me</button>
}`,
          },
          {
            path: "App.tsx",
            type: "registry:file",
            target: "~/src/App.tsx",
            content: `export default function App() {
  return <div>Hello World</div>
}
`,
          },
          {
            path: "registry/default/lib/utils.ts",
            type: "registry:lib",
            content: `export function cn() {}
`,
          },
          {
            path: "main.tsx",
            type: "registry:file",
            target: "~/src/main.tsx",
            content: `export {}
`,
          },
          {
            path: ".env",
            type: "registry:file",
            target: "~/.env",
            content: `NEW_API_KEY=value
OTHER_KEY=value`,
          },
        ],
        config,
        { overwrite: true, silent: false }
      )

      expect(result).toEqual({
        filesCreated: ["src/components/hello.tsx", ".env"],
        filesUpdated: ["src/lib/utils.ts", "src/main.tsx"],
        filesSkipped: ["src/components/ui/button.tsx", "src/App.tsx"],
      })
      expect(
        logSpy.mock.calls.map((call) =>
          stripVTControlCharacters(call.join(" "))
        )
      ).toEqual([
        "  - src/components/hello.tsx",
        "  - .env",
        "  - src/lib/utils.ts",
        "  - src/main.tsx",
        "  - src/components/ui/button.tsx",
        "  - src/App.tsx",
        "  + NEW_API_KEY",
        "  + OTHER_KEY",
      ])
    } finally {
      logSpy.mockRestore()
    }
  })

  it("should skip existing .env files when no new keys are added", async () => {
    const tempDir = await createTempProject({
      "package.json": JSON.stringify({ name: "env-no-new-keys" }),
      "tsconfig.json": JSON.stringify({
        compilerOptions: { baseUrl: ".", paths: { "@/*": ["./*"] } },
      }),
      "components.json": JSON.stringify({
        style: "new-york",
        tsx: true,
        rsc: false,
        tailwind: { config: "", css: "app/globals.css", baseColor: "neutral" },
        aliases: { components: "@/components", utils: "@/lib/utils" },
      }),
      ".env": "EXISTING_KEY=existing_value\n",
    })

    try {
      const config = (await getConfig(tempDir))!

      expect(
        await updateFiles(
          [
            {
              path: ".env",
              type: "registry:file",
              target: "~/.env",
              content: "EXISTING_KEY=should_not_override\n",
            },
          ],
          config,
          { overwrite: true, silent: true }
        )
      ).toEqual({ filesCreated: [], filesUpdated: [], filesSkipped: [".env"] })
      expect(fs.writeFile).not.toHaveBeenCalled()
      expect(await readActualFile(path.join(tempDir, ".env"))).toBe(
        "EXISTING_KEY=existing_value\n"
      )
    } finally {
      await removeTempProject(tempDir)
    }
  })

  it("should skip an existing lib/utils.ts in laravel projects", async () => {
    const existingUtils = `export function cn(...inputs: string[]) {
  return inputs.join(" ")
}
`
    const tempDir = await createTempProject({
      "composer.json": "{}\n",
      "package.json": JSON.stringify({ name: "laravel-app" }),
      "tsconfig.json": JSON.stringify({
        compilerOptions: {
          baseUrl: ".",
          paths: { "@/*": ["./resources/js/*"] },
        },
      }),
      "components.json": JSON.stringify({
        style: "new-york",
        tsx: true,
        rsc: false,
        tailwind: {
          config: "",
          css: "resources/css/app.css",
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
          ui: "@/components/ui",
          lib: "@/lib",
          hooks: "@/hooks",
        },
      }),
      "resources/css/app.css": '@import "tailwindcss";\n',
      "resources/js/lib/utils.ts": existingUtils,
    })

    try {
      const config = (await getConfig(tempDir))!

      expect(
        await withRealWrites(() =>
          updateFiles(
            [
              {
                path: "registry/new-york/lib/utils.ts",
                type: "registry:lib",
                content: `export function cn() {}
`,
              },
            ],
            config,
            { overwrite: true, silent: true }
          )
        )
      ).toEqual({
        filesCreated: [],
        filesUpdated: [],
        filesSkipped: ["resources/js/lib/utils.ts"],
      })
      expect(
        await readActualFile(path.join(tempDir, "resources/js/lib/utils.ts"))
      ).toBe(existingUtils)
    } finally {
      await removeTempProject(tempDir)
    }
  })

  it.each([
    {
      nextVersion: "^16.0.0",
      fileName: "proxy.ts",
      content: `import { NextResponse } from "next/server"

export function proxy() {
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
`,
    },
    {
      nextVersion: "15.2.0",
      fileName: "middleware.ts",
      content: `import { NextResponse } from "next/server"

export function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
`,
    },
  ])(
    "should write root middleware as $fileName for next $nextVersion",
    async ({ nextVersion, fileName, content }) => {
      const tempDir = await createTempProject({
        "package.json": JSON.stringify({
          name: "next-middleware",
          dependencies: { next: nextVersion },
        }),
        "next.config.mjs": "export default {}\n",
        "tsconfig.json": JSON.stringify({
          compilerOptions: { baseUrl: ".", paths: { "@/*": ["./*"] } },
        }),
        "components.json": JSON.stringify({
          style: "new-york",
          tsx: true,
          rsc: true,
          tailwind: {
            config: "",
            css: "app/globals.css",
            baseColor: "neutral",
          },
          aliases: {
            components: "@/components",
            utils: "@/lib/utils",
            ui: "@/components/ui",
            lib: "@/lib",
            hooks: "@/hooks",
          },
        }),
        "app/globals.css": '@import "tailwindcss";\n',
      })

      try {
        const config = (await getConfig(tempDir))!

        expect(
          await withRealWrites(() =>
            updateFiles(
              [
                {
                  path: "registry/new-york/lib/middleware.ts",
                  type: "registry:lib",
                  target: "~/middleware.ts",
                  content: `import { NextResponse } from "next/server"

export function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
`,
                },
              ],
              config,
              { overwrite: true, silent: true }
            )
          )
        ).toEqual({
          filesCreated: [fileName],
          filesUpdated: [],
          filesSkipped: [],
        })
        expect(await readActualFile(path.join(tempDir, fileName))).toBe(content)
      } finally {
        await removeTempProject(tempDir)
      }
    }
  )

  it("should rewrite written files on disk and skip .d.ts files", async () => {
    const tempDir = await createTempProject({
      "package.json": JSON.stringify({
        name: "rewrite-written-files",
        type: "module",
        imports: {
          "#components/*": "./src/components/*",
          "#hooks": "./src/hooks/index.ts",
          "#utils": "./src/lib/utils.ts",
        },
      }),
      "tsconfig.json": JSON.stringify({
        compilerOptions: {
          module: "esnext",
          moduleResolution: "bundler",
          resolvePackageJsonImports: true,
        },
      }),
      "components.json": JSON.stringify({
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
      }),
      "src/app/globals.css": '@import "tailwindcss";\n',
      "src/hooks/index.ts": 'export * from "./use-thing"\n',
      "src/lib/utils.ts": "export function cn() {}\n",
    })

    try {
      const config = (await getConfig(tempDir))!
      const typesContent = `import type { useThing } from "#hooks/use-thing"

export type Thing = ReturnType<typeof useThing>
`

      const result = await withRealWrites(() =>
        updateFiles(
          [
            {
              path: "components/example-card.tsx",
              type: "registry:component",
              content: [
                `"use client"`,
                ``,
                `import { useThing } from '@/hooks/use-thing'`,
                `import { cn } from "@/lib/utils"`,
                ``,
                `export function ExampleCard() {`,
                `  useThing()`,
                `  return <div className={cn("card")} />`,
                `}`,
                ``,
              ].join("\r\n"),
            },
            {
              path: "hooks/use-thing.ts",
              type: "registry:hook",
              content: `export function useThing() {
  return true
}
`,
            },
            {
              path: "lib/legacy.js",
              type: "registry:lib",
              content: `import { useThing } from "#hooks/use-thing"

export const legacy = useThing
`,
            },
            {
              path: "lib/legacy-alias.js",
              type: "registry:lib",
              content: `import { useThing } from "@/hooks/use-thing"

export const legacy = useThing
`,
            },
            {
              path: "lib/types.ts",
              type: "registry:lib",
              content: typesContent,
            },
            {
              path: "lib/types.d.ts",
              type: "registry:lib",
              content: typesContent,
            },
          ],
          config,
          { overwrite: true, silent: true }
        )
      )

      expect(result).toEqual({
        filesCreated: [
          "src/components/example-card.tsx",
          "src/hooks/use-thing.ts",
          "src/lib/legacy.js",
          "src/lib/legacy-alias.js",
          "src/lib/types.ts",
          "src/lib/types.d.ts",
        ],
        filesUpdated: [],
        filesSkipped: [],
      })
      expect(
        await readActualFile(
          path.join(tempDir, "src/components/example-card.tsx")
        )
      ).toBe(
        [
          `"use client"`,
          ``,
          `import { useThing } from '../hooks/use-thing'`,
          `import { cn } from "#utils"`,
          ``,
          `export function ExampleCard() {`,
          `  useThing()`,
          `  return <div className={cn("card")} />`,
          `}`,
          ``,
        ].join("\r\n")
      )
      expect(await readActualFile(path.join(tempDir, "src/lib/legacy.js")))
        .toBe(`import { useThing } from "../hooks/use-thing"

export const legacy = useThing
`)
      // Current behavior: transformImport does not see imports in `.js` files,
      // so `@/hooks` is never mapped to `#hooks` and is left as is.
      expect(
        await readActualFile(path.join(tempDir, "src/lib/legacy-alias.js"))
      ).toBe(`import { useThing } from "@/hooks/use-thing"

export const legacy = useThing
`)
      expect(await readActualFile(path.join(tempDir, "src/lib/types.ts")))
        .toBe(`import type { useThing } from "../hooks/use-thing"

export type Thing = ReturnType<typeof useThing>
`)
      // `.d.ts` files are not read back and rewritten after writing.
      expect(
        await readActualFile(path.join(tempDir, "src/lib/types.d.ts"))
      ).toBe(typesContent)
    } finally {
      await removeTempProject(tempDir)
    }
  })

  it("should write the exact relative import for exact package-import subpaths", async () => {
    const tempDir = await createTempProject({
      "package.json": JSON.stringify({
        name: "exact-package-import",
        type: "module",
        imports: {
          "#components/*": "./src/components/*",
          "#hooks": "./src/hooks/index.ts",
          "#utils": "./src/lib/utils.ts",
        },
      }),
      "tsconfig.json": JSON.stringify({
        compilerOptions: {
          module: "esnext",
          moduleResolution: "bundler",
          resolvePackageJsonImports: true,
        },
      }),
      "components.json": JSON.stringify({
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
      }),
      "src/app/globals.css": '@import "tailwindcss";\n',
      "src/hooks/index.ts": 'export * from "./use-thing"\n',
      "src/lib/utils.ts": "export function cn() {}\n",
    })

    try {
      const config = (await getConfig(tempDir))!

      await withRealWrites(() =>
        updateFiles(
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
          { overwrite: true, silent: true }
        )
      )

      expect(
        await readActualFile(
          path.join(tempDir, "src/components/example-card.tsx")
        )
      ).toBe(`import { useThing } from "../hooks/use-thing"

export function ExampleCard() {
  useThing()
  return null
}
`)
    } finally {
      await removeTempProject(tempDir)
    }
  })

  it("should not rewrite written files when tsconfig cannot be loaded", async () => {
    const tempDir = await createTempProject({
      "package.json": JSON.stringify({ name: "no-tsconfig" }),
    })

    try {
      const config = {
        style: "new-york",
        rsc: false,
        tsx: true,
        tailwind: {
          config: "",
          css: "app/globals.css",
          baseColor: "",
          cssVariables: true,
        },
        aliases: {
          components: "@/components",
          ui: "@/components/ui",
          lib: "@/lib",
          hooks: "@/hooks",
          utils: "@/lib/utils",
        },
        resolvedPaths: {
          cwd: tempDir,
          tailwindConfig: "",
          tailwindCss: path.join(tempDir, "app/globals.css"),
          components: path.join(tempDir, "components"),
          ui: path.join(tempDir, "components/ui"),
          lib: path.join(tempDir, "lib"),
          hooks: path.join(tempDir, "hooks"),
          utils: path.join(tempDir, "lib/utils"),
        },
      } as Config
      const content = `import { Button } from "@/components/button"

export function LoginForm() {
  return <Button />
}
`

      expect(
        await withRealWrites(() =>
          updateFiles(
            [
              {
                path: "registry/new-york/blocks/login/components/login-form.tsx",
                type: "registry:component",
                content,
              },
              {
                path: "registry/new-york/ui/button.tsx",
                type: "registry:ui",
                content: `export function Button() {
  return <button />
}
`,
              },
            ],
            config,
            { overwrite: true, silent: true }
          )
        )
      ).toEqual({
        filesCreated: ["components/login-form.tsx", "components/ui/button.tsx"],
        filesUpdated: [],
        filesSkipped: [],
      })
      expect(
        await readActualFile(path.join(tempDir, "components/login-form.tsx"))
      ).toBe(content)
    } finally {
      await removeTempProject(tempDir)
    }
  })

  it("should write the exact workspace utils import in monorepos without tsconfig paths", async () => {
    const config = await getConfig(
      getFixturesDir("frameworks/vite-monorepo-imports/apps/web")
    )

    if (!config) {
      throw new Error("Failed to get monorepo app config")
    }

    await updateFiles(
      [
        {
          path: "registry/components/login-form.tsx",
          type: "registry:component",
          content: `import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function LoginForm() {
  return <Button className={cn("login")} />
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

    expect(
      getWrittenContent(
        path.join(config.resolvedPaths.cwd, "src/components/login-form.tsx")
      )
    ).toBe(`import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"

export function LoginForm() {
  return <Button className={cn("login")} />
}
`)
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

  it("should prefer the candidate under the probable path when extensions tie", () => {
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
      },
    } as Config
    expect(
      resolveModuleByProbablePath(
        "/foo/bar/components/button",
        ["components/ui/button.tsx", "components/button.tsx"],
        config
      )
    ).toBe("components/button.tsx")

    // Both candidates come from the basename scan here.
    expect(
      resolveModuleByProbablePath(
        "/foo/bar/components/button",
        ["components/ui/button.tsx", "components/button/button.tsx"],
        config
      )
    ).toBe("components/button/button.tsx")
  })

  it("should keep candidate order when the probable path is the cwd", () => {
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
      },
    } as Config
    expect(
      resolveModuleByProbablePath(
        "/foo/bar",
        ["src/bar.tsx", "index.tsx"],
        config
      )
    ).toBe("index.tsx")
  })
})

describe("getPlannedFilePaths", () => {
  it("should return no paths without files", () => {
    expect(
      getPlannedFilePaths(
        undefined,
        { resolvedPaths: { cwd: "/foo/bar" } } as Config,
        {}
      )
    ).toEqual([])
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

  it("should match a non-package alias root exactly", () => {
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
        lib: "/foo/bar/lib",
        utils: "/foo/bar/lib/utils",
      },
      aliases: {
        lib: "@/lib",
        utils: "@/lib/utils",
      },
    } as Config

    expect(
      toAliasedImport("lib/utils", config, { aliasPrefix: "@" } as any)
    ).toBe("@/lib/utils")
  })

  it("should return null when the file is outside every alias root", () => {
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
        components: "/foo/bar/components",
      },
      aliases: {
        components: "@/components",
      },
    } as Config

    expect(
      toAliasedImport("../shared/button.tsx", config, {
        aliasPrefix: "@",
      } as any)
    ).toBeNull()
  })

  it("should return null when the matching alias is not configured", () => {
    const config = {
      resolvedPaths: {
        cwd: "/foo/bar",
        hooks: "/foo/bar/hooks",
      },
      aliases: {},
    } as Config

    expect(
      toAliasedImport("hooks/use-mobile.ts", config, {
        aliasPrefix: "@",
      } as any)
    ).toBeNull()
    expect(
      toAliasedImport("app/page.tsx", config, { aliasPrefix: null } as any)
    ).toBeNull()
  })

  it.each([
    {
      importerPath: "src/components/example-card.tsx",
      filePath: "src/hooks/use-thing.ts",
      expected: "../hooks/use-thing",
    },
    {
      importerPath: "src/hooks/use-other.ts",
      filePath: "src/hooks/use-thing.ts",
      expected: "./use-thing",
    },
    {
      importerPath: "src/components/example-card.tsx",
      filePath: "src/hooks/nested/index.ts",
      expected: "../hooks/nested",
    },
    {
      importerPath: "src/components/example-card.tsx",
      filePath: "src/hooks/data.json",
      expected: "../hooks/data.json",
    },
  ])(
    "should fall back to $expected for exact package-import subpaths",
    ({ importerPath, filePath, expected }) => {
      const cwd = getFixturesDir("config-imports")
      const config = {
        resolvedPaths: {
          cwd,
          hooks: path.join(cwd, "src/hooks"),
        },
        aliases: {
          hooks: "#hooks",
        },
      } as Config

      expect(
        toAliasedImport(
          filePath,
          config,
          { aliasPrefix: "#" } as any,
          path.join(cwd, importerPath)
        )
      ).toBe(expected)
      // Without an importer there is nothing to be relative to.
      expect(
        toAliasedImport(filePath, config, { aliasPrefix: "#" } as any)
      ).toBeNull()
    }
  )

  it("should return the bare root wildcard alias for the project root", () => {
    const cwd = getFixturesDir("frameworks/vite-monorepo-imports/apps/web")
    const config = {
      resolvedPaths: {
        cwd,
      },
      aliases: {},
    } as unknown as Config

    expect(toAliasedImport("", config, { aliasPrefix: "#" } as any)).toBe("#")
  })
})

describe("rewriteResolvedImportsInContent", () => {
  // A cwd that does not exist on disk, so only `filePaths` can match.
  const cwd = "/virtual/app"
  const config = {
    aliases: {
      components: "@/components",
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
      utils: "@/lib/utils",
    },
    resolvedPaths: {
      cwd,
      tailwindConfig: "",
      tailwindCss: `${cwd}/app/globals.css`,
      components: `${cwd}/components`,
      ui: `${cwd}/components/ui`,
      lib: `${cwd}/lib`,
      hooks: `${cwd}/hooks`,
      utils: `${cwd}/lib/utils`,
    },
  } as Config
  const tsConfig = {
    resultType: "success",
    configFileAbsolutePath: `${cwd}/tsconfig.json`,
    baseUrl: ".",
    absoluteBaseUrl: cwd,
    paths: { "@/*": ["./*"] },
  } as ConfigLoaderSuccessResult
  // Planned files live under `ui/` and `hooks/`, so `@/components/<name>`
  // imports are relocated by basename.
  const filePaths = [
    "components/login-form.tsx",
    "components/ui/button.tsx",
    "components/ui/card.tsx",
    "components/ui/data.json",
    "components/ui/it's-fine.tsx",
    "hooks/use-mobile.ts",
    "lib/utils.ts",
  ]

  function rewrite(
    content: string,
    overrides: Partial<
      Parameters<typeof rewriteResolvedImportsInContent>[0]
    > = {}
  ) {
    return rewriteResolvedImportsInContent({
      content,
      resolvedPath: `${cwd}/components/login-form.tsx`,
      filePaths,
      config,
      projectInfo: { aliasPrefix: "@" } as ProjectInfo,
      tsConfig,
      // The current signature requires a ts-morph project.
      project: new Project({ compilerOptions: {} }),
      ...overrides,
    })
  }

  it("rewrites a relocated alias import and keeps double quotes", async () => {
    expect(
      await rewrite(`import { Button } from "@/components/button"

export function LoginForm() {
  return <Button />
}
`)
    ).toBe(`import { Button } from "@/components/ui/button"

export function LoginForm() {
  return <Button />
}
`)
  })

  it("keeps single quotes", async () => {
    expect(
      await rewrite(`import { Button } from '@/components/button'
import { useMobile } from '@/components/use-mobile'
`)
    ).toBe(`import { Button } from '@/components/ui/button'
import { useMobile } from '@/hooks/use-mobile'
`)
  })

  it("keeps CRLF line endings", async () => {
    const input = [
      `"use client"`,
      ``,
      `import { Button } from "@/components/button"`,
      `import { useMobile } from '@/components/use-mobile'`,
      ``,
      `export function LoginForm() {`,
      `  return <Button />`,
      `}`,
      ``,
    ].join("\r\n")

    expect(await rewrite(input)).toBe(
      [
        `"use client"`,
        ``,
        `import { Button } from "@/components/ui/button"`,
        `import { useMobile } from '@/hooks/use-mobile'`,
        ``,
        `export function LoginForm() {`,
        `  return <Button />`,
        `}`,
        ``,
      ].join("\r\n")
    )
  })

  it("rewrites every matching import and leaves everything else untouched", async () => {
    expect(
      await rewrite(`"use client";

// Leading comment stays.
import * as React from "react";
import { Button } from "@/components/button"; // trailing comment
import type { CardProps } from "@/components/card";
import { type ButtonProps, buttonVariants } from '@/components/button';
/* block comment */ import "@/components/side-effect";
import data from "@/components/data.json" with { type: "json" };
import { cn } from "@/lib/utils";
import { helper } from "./helper";
import { Missing } from "@/components/missing";

export function LoginForm(props: CardProps & ButtonProps) {
  return <Button className={cn(buttonVariants(), helper)} data={data} />;
}
`)
    ).toBe(`"use client";

// Leading comment stays.
import * as React from "react";
import { Button } from "@/components/ui/button"; // trailing comment
import type { CardProps } from "@/components/ui/card";
import { type ButtonProps, buttonVariants } from '@/components/ui/button';
/* block comment */ import "@/components/side-effect";
import data from "@/components/ui/data.json" with { type: "json" };
import { cn } from "@/lib/utils";
import { helper } from "./helper";
import { Missing } from "@/components/missing";

export function LoginForm(props: CardProps & ButtonProps) {
  return <Button className={cn(buttonVariants(), helper)} data={data} />;
}
`)
  })

  it("does not rewrite export-from, dynamic import() or require()", async () => {
    expect(
      await rewrite(`import * as React from "react"
import { Button } from "@/components/button"

export { Card } from "@/components/card"
export * from "@/components/button"

const LazyCard = React.lazy(() => import("@/components/card"))
const legacy = require("@/components/button")
`)
    ).toBe(`import * as React from "react"
import { Button } from "@/components/ui/button"

export { Card } from "@/components/card"
export * from "@/components/button"

const LazyCard = React.lazy(() => import("@/components/card"))
const legacy = require("@/components/button")
`)
  })

  it("escapes the literal's own quote character in rewritten specifiers", async () => {
    expect(
      await rewrite(`import ItsFine from '@/components/it\\'s-fine'
import AlsoFine from "@/components/it's-fine"
`)
    ).toBe(`import ItsFine from '@/components/ui/it\\'s-fine'
import AlsoFine from "@/components/ui/it's-fine"
`)
  })

  it("rewrites .d.ts files", async () => {
    expect(
      await rewrite(
        `import type { ButtonProps } from "@/components/button"

export type Props = ButtonProps
`,
        { resolvedPath: `${cwd}/types/button.d.ts` }
      )
    ).toBe(`import type { ButtonProps } from "@/components/ui/button"

export type Props = ButtonProps
`)
  })

  it("returns the content unchanged when nothing can be rewritten", async () => {
    const content = `import { Button } from "@/components/button"\n`

    expect(
      await rewrite(content, { resolvedPath: `${cwd}/app/globals.css` })
    ).toBe(content)
    expect(await rewrite(content, { projectInfo: null })).toBe(content)
    // Without an alias prefix only `#` imports count as local aliases.
    expect(
      await rewrite(content, {
        projectInfo: { aliasPrefix: null } as unknown as ProjectInfo,
      })
    ).toBe(content)
    expect(
      await rewrite(content, {
        tsConfig: { resultType: "failed", message: "Missing tsconfig" },
      })
    ).toBe(content)

    const unchanged = `import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
`
    expect(await rewrite(unchanged)).toBe(unchanged)
  })

  it("rewrites package-import aliases", async () => {
    const importsCwd = getFixturesDir("config-imports")
    const importsConfig = (await getConfig(importsCwd))!

    expect(
      await rewrite(
        `import { Button } from "#components/button"
import { useThing } from "#hooks/use-thing"
import { useHooks } from '#hooks'
import { cn } from "#utils"
import { format } from "#lib/format"
`,
        {
          resolvedPath: path.join(
            importsCwd,
            "src/components/example-card.tsx"
          ),
          filePaths: [
            "src/components/example-card.tsx",
            "src/components/ui/button.tsx",
            "src/hooks/index.ts",
            "src/hooks/use-thing.ts",
            "src/lib/format.ts",
            "src/lib/utils.ts",
          ],
          config: importsConfig,
          projectInfo: { aliasPrefix: "#" } as ProjectInfo,
          tsConfig: loadConfig(importsCwd),
        }
      )
    ).toMatchInlineSnapshot(`
      "import { Button } from "#components/ui/button.tsx"
      import { useThing } from "../hooks/use-thing"
      import { useHooks } from '#hooks'
      import { cn } from "#utils"
      import { format } from "#lib/format.ts"
      "
    `)
  })

  it("falls back to configured aliases that tsconfig paths cannot resolve", async () => {
    const acmeConfig = {
      aliases: {
        components: "@acme/components",
        ui: "@acme/ui",
        lib: "@acme/lib",
        hooks: "@acme/hooks",
        utils: "@acme/utils",
      },
      resolvedPaths: {
        cwd,
        tailwindConfig: "",
        tailwindCss: `${cwd}/src/app/globals.css`,
        components: `${cwd}/src/components`,
        ui: `${cwd}/src/components/ui`,
        lib: `${cwd}/src/lib`,
        hooks: `${cwd}/src/hooks`,
        utils: `${cwd}/src/lib/utils`,
      },
    } as Config

    // Current behavior: the bare `@acme/ui` barrel resolves to
    // `ui/index.tsx` and is rewritten to `@acme/ui/index`, and `@acme/utils`
    // becomes `@acme/lib/utils` because the extensionless utils root never
    // matches a planned file in toAliasedImport.
    expect(
      await rewrite(
        `import { Button } from "@acme/ui/button"
import { useMobile } from "@acme/components/use-mobile"
import { Card } from "@acme/ui"
import { cn } from "@acme/utils"
import { cnLib } from "@acme/lib/utils"
import { thing } from "@acme/unknown/thing"
import { Slot } from "@radix-ui/react-slot"
`,
        {
          resolvedPath: `${cwd}/src/components/login-form.tsx`,
          filePaths: [
            "src/components/login-form.tsx",
            "src/components/ui/button.tsx",
            "src/components/ui/index.tsx",
            "src/hooks/use-mobile.ts",
            "src/lib/utils.ts",
          ],
          config: acmeConfig,
          projectInfo: { aliasPrefix: "@acme" } as ProjectInfo,
          tsConfig: { ...tsConfig, paths: {} },
        }
      )
    ).toBe(`import { Button } from "@acme/ui/button"
import { useMobile } from "@acme/hooks/use-mobile"
import { Card } from "@acme/ui/index"
import { cn } from "@acme/lib/utils"
import { cnLib } from "@acme/lib/utils"
import { thing } from "@acme/unknown/thing"
import { Slot } from "@radix-ui/react-slot"
`)
  })
})
