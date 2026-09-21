import { existsSync, promises as fs } from "fs"
import path from "path"
import { getFixturesDir } from "@/src/test-helpers"
import { getConfig, type Config } from "@/src/utils/get-config"
import { getProjectInfo } from "@/src/utils/get-project-info"
import prompts from "prompts"
import { afterAll, afterEach, describe, expect, it, vi } from "vitest"

import { updateFiles } from "./update-files"

vi.mock("@/src/registry/api", () => ({
  getRegistryBaseColor: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("@/src/utils/get-project-info", () => ({
  getProjectInfo: vi.fn(),
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

const REGISTRY_UTILS = `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`

const CUSTOM_UTILS = `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Custom user helper that must survive \`shadcn init\`.
export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}
`

// Sets up a minimal Vite-style project with a src/lib directory and returns
// the config plus the real fs handles needed to verify writes on disk.
async function setupProject(framework: string) {
  const tempDir = getFixturesDir("temp-utils-overwrite-guard")
  const fsActual = (await vi.importActual(
    "fs/promises"
  )) as typeof import("fs/promises")
  const fsModuleActual = (await vi.importActual("fs")) as typeof import("fs")
  const writeFileMock = fs.writeFile as any

  // Use the real fs implementation so writes can be verified on disk.
  writeFileMock.mockImplementation(fsModuleActual.promises.writeFile as any)

  await fsActual.rm(tempDir, { recursive: true, force: true })
  await fsActual.mkdir(path.join(tempDir, "src", "lib"), {
    recursive: true,
  })
  await fsActual.mkdir(path.join(tempDir, "src", "components", "ui"), {
    recursive: true,
  })

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
          baseColor: "neutral",
          cssVariables: true,
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
          ui: "@/components/ui",
          lib: "@/lib",
          hooks: "@/hooks",
        },
        iconLibrary: "lucide",
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
          baseUrl: ".",
          paths: {
            "@/*": ["./src/*"],
          },
        },
      },
      null,
      2
    ),
    "utf-8"
  )

  const config = (await getConfig(tempDir))!
  if (!config) {
    throw new Error("Failed to get config")
  }

  vi.mocked(getProjectInfo).mockResolvedValue({
    framework: { name: framework },
    isSrcDir: true,
    isRSC: false,
    isTsx: true,
    tailwindConfigFile: null,
    tailwindCssFile: "src/index.css",
    tailwindVersion: "v4",
    frameworkVersion: null,
    aliasPrefix: null,
  } as any)

  return { tempDir, config: config as Config, fsActual, writeFileMock }
}

describe("updateFiles utils guard", () => {
  it("does not replace an existing custom lib/utils.ts even when overwrite is true", async () => {
    const { tempDir, config, fsActual, writeFileMock } =
      await setupProject("vite")
    const utilsPath = path.join(tempDir, "src", "lib", "utils.ts")
    await fsActual.writeFile(utilsPath, CUSTOM_UTILS, "utf-8")

    try {
      const result = await updateFiles(
        [
          {
            path: "lib/utils.ts",
            type: "registry:lib",
            content: REGISTRY_UTILS,
          },
        ],
        config,
        {
          // init always passes overwrite: true.
          overwrite: true,
          silent: true,
        }
      )

      expect(result.filesCreated).toEqual([])
      expect(result.filesUpdated).toEqual([])
      expect(result.filesSkipped).toContain(path.join("src", "lib", "utils.ts"))
      expect(prompts).not.toHaveBeenCalled()

      // The custom helper must still be present on disk.
      const contents = await fsActual.readFile(utilsPath, "utf-8")
      expect(contents).toBe(CUSTOM_UTILS)
    } finally {
      writeFileMock.mockResolvedValue(undefined)
      await fsActual
        .rm(tempDir, { recursive: true, force: true })
        .catch(() => {})
    }
  })

  it("still skips an existing lib/utils.ts for laravel projects", async () => {
    const { tempDir, config, fsActual, writeFileMock } =
      await setupProject("laravel")
    const utilsPath = path.join(tempDir, "src", "lib", "utils.ts")
    await fsActual.writeFile(utilsPath, CUSTOM_UTILS, "utf-8")

    try {
      const result = await updateFiles(
        [
          {
            path: "lib/utils.ts",
            type: "registry:lib",
            content: REGISTRY_UTILS,
          },
        ],
        config,
        {
          overwrite: true,
          silent: true,
        }
      )

      expect(result.filesSkipped).toContain(path.join("src", "lib", "utils.ts"))
      const contents = await fsActual.readFile(utilsPath, "utf-8")
      expect(contents).toBe(CUSTOM_UTILS)
    } finally {
      writeFileMock.mockResolvedValue(undefined)
      await fsActual
        .rm(tempDir, { recursive: true, force: true })
        .catch(() => {})
    }
  })

  it("still creates lib/utils.ts when it does not exist", async () => {
    const { tempDir, config, fsActual, writeFileMock } =
      await setupProject("vite")
    const utilsPath = path.join(tempDir, "src", "lib", "utils.ts")

    try {
      const result = await updateFiles(
        [
          {
            path: "lib/utils.ts",
            type: "registry:lib",
            content: REGISTRY_UTILS,
          },
        ],
        config,
        {
          overwrite: true,
          silent: true,
        }
      )

      expect(result.filesCreated).toContain(path.join("src", "lib", "utils.ts"))
      const contents = await fsActual.readFile(utilsPath, "utf-8")
      expect(contents).toContain("export function cn(")
    } finally {
      writeFileMock.mockResolvedValue(undefined)
      await fsActual
        .rm(tempDir, { recursive: true, force: true })
        .catch(() => {})
    }
  })

  it("still overwrites non-lib registry files when overwrite is true", async () => {
    const { tempDir, config, fsActual, writeFileMock } =
      await setupProject("vite")
    const buttonPath = path.join(
      tempDir,
      "src",
      "components",
      "ui",
      "button.tsx"
    )
    await fsActual.writeFile(buttonPath, "export function Button() {}", "utf-8")

    try {
      const result = await updateFiles(
        [
          {
            path: "registry/default/ui/button.tsx",
            type: "registry:ui",
            content: `export function Button() {
  return <button>Click me</button>
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

      expect(result.filesUpdated).toContain(
        path.join("src", "components", "ui", "button.tsx")
      )
      const contents = await fsActual.readFile(buttonPath, "utf-8")
      expect(contents).toContain("Click me")
    } finally {
      writeFileMock.mockResolvedValue(undefined)
      await fsActual
        .rm(tempDir, { recursive: true, force: true })
        .catch(() => {})
    }
  })
})
