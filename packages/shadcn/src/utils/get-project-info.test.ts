import { promises as fs } from "fs"
import { tmpdir } from "os"
import path from "path"
import { getShadcnRegistryIndex } from "@/src/registry/api"
import { getFixturesDir } from "@/src/test-helpers"
import { FRAMEWORKS } from "@/src/utils/frameworks"
import { getConfig, resolveConfigPaths } from "@/src/utils/get-config"
import fsExtra from "fs-extra"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  getFrameworkVersion,
  getProjectComponents,
  getProjectInfo,
  getTailwindCssFile,
  getTsConfigAliasPrefix,
  isTypeScriptProject,
} from "./get-project-info"

vi.mock("@/src/utils/get-config", () => ({
  getConfig: vi.fn(),
  resolveConfigPaths: vi.fn(),
}))

vi.mock("@/src/registry/api", () => ({
  getShadcnRegistryIndex: vi.fn(),
}))

describe("get project info", async () => {
  it.each([
    {
      name: "next-app",
      type: {
        framework: FRAMEWORKS["next-app"],
        isSrcDir: false,
        isRSC: true,
        isTsx: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "app/globals.css",
        tailwindVersion: "v3",
        frameworkVersion: null,
        aliasPrefix: "@",
      },
    },
    {
      name: "next-app-src",
      type: {
        framework: FRAMEWORKS["next-app"],
        isSrcDir: true,
        isRSC: true,
        isTsx: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "src/app/styles.css",
        tailwindVersion: "v3",
        frameworkVersion: null,
        aliasPrefix: "#",
      },
    },
    {
      name: "next-app-imports",
      type: {
        framework: FRAMEWORKS["next-app"],
        isSrcDir: true,
        isRSC: true,
        isTsx: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "src/app/styles.css",
        tailwindVersion: "v3",
        frameworkVersion: null,
        aliasPrefix: "#",
      },
    },
    {
      name: "vite-app-imports",
      type: {
        framework: FRAMEWORKS["vite"],
        isSrcDir: true,
        isRSC: false,
        isTsx: true,
        tailwindConfigFile: null,
        tailwindCssFile: "src/index.css",
        tailwindVersion: "v4",
        frameworkVersion: null,
        aliasPrefix: "#custom",
      },
    },
    {
      name: "vite-root-imports",
      type: {
        framework: FRAMEWORKS["vite"],
        isSrcDir: true,
        isRSC: false,
        isTsx: true,
        tailwindConfigFile: null,
        tailwindCssFile: "src/index.css",
        tailwindVersion: "v4",
        frameworkVersion: null,
        aliasPrefix: "#",
      },
    },
    {
      name: "vite-partial-imports",
      type: {
        framework: FRAMEWORKS["vite"],
        isSrcDir: true,
        isRSC: false,
        isTsx: true,
        tailwindConfigFile: null,
        tailwindCssFile: "src/index.css",
        tailwindVersion: "v4",
        frameworkVersion: null,
        aliasPrefix: "#",
      },
    },
    {
      name: "next-pages",
      type: {
        framework: FRAMEWORKS["next-pages"],
        isSrcDir: false,
        isRSC: false,
        isTsx: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "styles/globals.css",
        tailwindVersion: "v4",
        frameworkVersion: null,
        aliasPrefix: "~",
      },
    },
    {
      name: "next-pages-src",
      type: {
        framework: FRAMEWORKS["next-pages"],
        isSrcDir: true,
        isRSC: false,
        isTsx: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "src/styles/globals.css",
        tailwindVersion: "v4",
        frameworkVersion: null,
        aliasPrefix: "@",
      },
    },
    {
      name: "t3-app",
      type: {
        framework: FRAMEWORKS["next-app"],
        isSrcDir: true,
        isRSC: true,
        isTsx: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "src/styles/globals.css",
        tailwindVersion: "v3",
        frameworkVersion: "14.2.35",
        aliasPrefix: "~",
      },
    },
    {
      name: "t3-pages",
      type: {
        framework: FRAMEWORKS["next-pages"],
        isSrcDir: true,
        isRSC: false,
        isTsx: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "src/styles/globals.css",
        tailwindVersion: "v3",
        frameworkVersion: "14.2.35",
        aliasPrefix: "~",
      },
    },
    {
      name: "remix",
      type: {
        framework: FRAMEWORKS["remix"],
        isSrcDir: false,
        isRSC: false,
        isTsx: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "app/tailwind.css",
        tailwindVersion: "v3",
        frameworkVersion: null,
        aliasPrefix: "~",
      },
    },
    {
      name: "remix-indie-stack",
      type: {
        framework: FRAMEWORKS["remix"],
        isSrcDir: false,
        isRSC: false,
        isTsx: true,
        tailwindConfigFile: "tailwind.config.ts",
        tailwindCssFile: "app/tailwind.css",
        tailwindVersion: "v3",
        frameworkVersion: null,
        aliasPrefix: "~",
      },
    },
    {
      name: "vite",
      type: {
        framework: FRAMEWORKS["vite"],
        isSrcDir: true,
        isRSC: false,
        isTsx: true,
        tailwindConfigFile: "tailwind.config.js",
        tailwindCssFile: "src/index.css",
        tailwindVersion: "v3",
        frameworkVersion: null,
        aliasPrefix: null,
      },
    },
  ])(`getProjectType($name) -> $type`, async ({ name, type }) => {
    expect(
      await getProjectInfo(getFixturesDir("frameworks", name))
    ).toStrictEqual(type)
  })
})

describe("getFrameworkVersion", () => {
  describe("Next.js version detection", () => {
    it.each([
      {
        name: "exact semver",
        input: "16.0.0",
        framework: "next-app",
        expected: "16.0.0",
      },
      {
        name: "caret prefix",
        input: "^16.1.2",
        framework: "next-app",
        expected: "16.1.2",
      },
      {
        name: "tilde prefix",
        input: "~15.0.3",
        framework: "next-app",
        expected: "15.0.3",
      },
      {
        name: "version range",
        input: ">=15.0.0 <16.0.0",
        framework: "next-app",
        expected: "15.0.0",
      },
      {
        name: "latest tag",
        input: "latest",
        framework: "next-app",
        expected: "latest",
      },
      {
        name: "canary tag",
        input: "canary",
        framework: "next-app",
        expected: "canary",
      },
      {
        name: "rc tag",
        input: "rc",
        framework: "next-app",
        expected: "rc",
      },
    ])(
      `should extract $name ($input) -> $expected`,
      async ({ input, framework, expected }) => {
        const packageJson = {
          dependencies: {
            next: input,
          },
        }
        const version = await getFrameworkVersion(
          FRAMEWORKS[framework as keyof typeof FRAMEWORKS],
          packageJson
        )
        expect(version).toBe(expected)
      }
    )

    it("should handle version in devDependencies", async () => {
      const packageJson = {
        devDependencies: {
          next: "16.0.0",
        },
      }
      const version = await getFrameworkVersion(
        FRAMEWORKS["next-pages"],
        packageJson
      )
      expect(version).toBe("16.0.0")
    })

    it("should return null when next is not in dependencies", async () => {
      const packageJson = {
        dependencies: {
          react: "^18.0.0",
        },
      }
      const version = await getFrameworkVersion(
        FRAMEWORKS["next-app"],
        packageJson
      )
      expect(version).toBe(null)
    })

    it("should return null when packageJson is null", async () => {
      const version = await getFrameworkVersion(FRAMEWORKS["next-app"], null)
      expect(version).toBe(null)
    })
  })

  describe("Other frameworks", () => {
    it.each([
      {
        name: "Vite",
        framework: "vite",
        package: "vite",
        version: "^5.0.0",
      },
      {
        name: "Remix",
        framework: "remix",
        package: "@remix-run/react",
        version: "^2.0.0",
      },
      {
        name: "Astro",
        framework: "astro",
        package: "astro",
        version: "^4.0.0",
      },
    ])(
      `should return null for $name`,
      async ({ framework, package: pkg, version: ver }) => {
        const packageJson = {
          dependencies: {
            [pkg]: ver,
          },
        }
        const version = await getFrameworkVersion(
          FRAMEWORKS[framework as keyof typeof FRAMEWORKS],
          packageJson
        )
        expect(version).toBe(null)
      }
    )
  })
})

describe("getProjectComponents", () => {
  let tmpDir: string

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(process.env.TMPDIR || "/tmp", "test-"))
  })

  afterEach(async () => {
    vi.resetAllMocks()
    await fs.rm(tmpDir, { recursive: true, force: true })
  })

  it("should return empty array when no config exists", async () => {
    vi.mocked(getConfig).mockResolvedValue(null)

    const result = await getProjectComponents(tmpDir)

    expect(result).toEqual([])
  })

  it("should return empty array when ui directory does not exist", async () => {
    vi.mocked(getConfig).mockResolvedValue({} as any)
    vi.mocked(resolveConfigPaths).mockResolvedValue({
      resolvedPaths: { ui: path.join(tmpDir, "ui") },
    } as any)

    const result = await getProjectComponents(tmpDir)

    expect(result).toEqual([])
  })

  it("should return only components that exist in the registry", async () => {
    const uiDir = path.join(tmpDir, "ui")
    await fs.mkdir(uiDir, { recursive: true })
    await fs.writeFile(path.join(uiDir, "button.tsx"), "")
    await fs.writeFile(path.join(uiDir, "card.tsx"), "")
    await fs.writeFile(path.join(uiDir, "my-custom-component.tsx"), "")

    vi.mocked(getConfig).mockResolvedValue({} as any)
    vi.mocked(resolveConfigPaths).mockResolvedValue({
      resolvedPaths: { ui: uiDir },
    } as any)
    vi.mocked(getShadcnRegistryIndex).mockResolvedValue([
      { name: "button" },
      { name: "card" },
      { name: "dialog" },
    ] as any)

    const result = await getProjectComponents(tmpDir)

    expect(result).toEqual(["button", "card"])
  })

  it("should handle jsx files", async () => {
    const uiDir = path.join(tmpDir, "ui")
    await fs.mkdir(uiDir, { recursive: true })
    await fs.writeFile(path.join(uiDir, "button.jsx"), "")

    vi.mocked(getConfig).mockResolvedValue({} as any)
    vi.mocked(resolveConfigPaths).mockResolvedValue({
      resolvedPaths: { ui: uiDir },
    } as any)
    vi.mocked(getShadcnRegistryIndex).mockResolvedValue([
      { name: "button" },
    ] as any)

    const result = await getProjectComponents(tmpDir)

    expect(result).toEqual(["button"])
  })

  it("should ignore non-tsx/jsx files", async () => {
    const uiDir = path.join(tmpDir, "ui")
    await fs.mkdir(uiDir, { recursive: true })
    await fs.writeFile(path.join(uiDir, "button.tsx"), "")
    await fs.writeFile(path.join(uiDir, "utils.ts"), "")
    await fs.writeFile(path.join(uiDir, "styles.css"), "")
    await fs.writeFile(path.join(uiDir, "README.md"), "")

    vi.mocked(getConfig).mockResolvedValue({} as any)
    vi.mocked(resolveConfigPaths).mockResolvedValue({
      resolvedPaths: { ui: uiDir },
    } as any)
    vi.mocked(getShadcnRegistryIndex).mockResolvedValue([
      { name: "button" },
    ] as any)

    const result = await getProjectComponents(tmpDir)

    expect(result).toEqual(["button"])
  })

  it("should return empty array when registry index returns undefined", async () => {
    const uiDir = path.join(tmpDir, "ui")
    await fs.mkdir(uiDir, { recursive: true })
    await fs.writeFile(path.join(uiDir, "button.tsx"), "")

    vi.mocked(getConfig).mockResolvedValue({} as any)
    vi.mocked(resolveConfigPaths).mockResolvedValue({
      resolvedPaths: { ui: uiDir },
    } as any)
    vi.mocked(getShadcnRegistryIndex).mockResolvedValue(undefined)

    const result = await getProjectComponents(tmpDir)

    expect(result).toEqual([])
  })

  it("should return empty array when ui directory is empty", async () => {
    const uiDir = path.join(tmpDir, "ui")
    await fs.mkdir(uiDir, { recursive: true })

    vi.mocked(getConfig).mockResolvedValue({} as any)
    vi.mocked(resolveConfigPaths).mockResolvedValue({
      resolvedPaths: { ui: uiDir },
    } as any)
    vi.mocked(getShadcnRegistryIndex).mockResolvedValue([
      { name: "button" },
    ] as any)

    const result = await getProjectComponents(tmpDir)

    expect(result).toEqual([])
  })
})

describe("get tailwindcss file", async () => {
  it.each([
    {
      name: "next-app",
      file: "app/globals.css",
    },
    {
      name: "next-app-src",
      file: "src/app/styles.css",
    },
    {
      name: "next-pages",
      file: "styles/globals.css",
    },
    {
      name: "next-pages-src",
      file: "src/styles/globals.css",
    },
    {
      name: "t3-app",
      file: "src/styles/globals.css",
    },
    {
      name: "t3-pages",
      file: "src/styles/globals.css",
    },
    {
      name: "remix",
      file: "app/tailwind.css",
    },
    {
      name: "vite",
      file: "src/index.css",
    },
  ])(`getTailwindCssFile($name) -> $file`, async ({ name, file }) => {
    expect(await getTailwindCssFile(getFixturesDir("frameworks", name))).toBe(
      file
    )
  })

  it("should use configCssFile when provided and file exists", async () => {
    const cwd = getFixturesDir("frameworks", "next-monorepo")
    expect(await getTailwindCssFile(cwd, "packages/ui/src/globals.css")).toBe(
      "packages/ui/src/globals.css"
    )
  })

  it("should fall back to glob when configCssFile does not exist", async () => {
    const cwd = getFixturesDir("frameworks", "next-app")
    expect(await getTailwindCssFile(cwd, "nonexistent/styles.css")).toBe(
      "app/globals.css"
    )
  })

  it("should return null when no css file found and no configCssFile", async () => {
    const cwd = getFixturesDir("frameworks", "next-monorepo")
    // The CSS file is nested under packages/ which the glob finds.
    // Without configCssFile, it should still find it via glob.
    expect(await getTailwindCssFile(cwd)).toBe("packages/ui/src/globals.css")
  })
})

describe("get ts config alias prefix", async () => {
  it.each([
    {
      name: "next-app",
      prefix: "@",
    },
    {
      name: "next-app-src",
      prefix: "#",
    },
    {
      name: "next-pages",
      prefix: "~",
    },
    {
      name: "next-pages-src",
      prefix: "@",
    },
    {
      name: "t3-app",
      prefix: "~",
    },
    {
      name: "next-app-custom-alias",
      prefix: "@custom-alias",
    },
    {
      name: "vite-partial-imports",
      prefix: "#components",
    },
    {
      name: "vite-root-paths",
      prefix: "@",
    },
  ])(`getTsConfigAliasPrefix($name) -> $prefix`, async ({ name, prefix }) => {
    expect(
      await getTsConfigAliasPrefix(getFixturesDir("frameworks", name))
    ).toBe(prefix)
  })

  it("parses JSONC tsconfig files with trailing commas", async () => {
    const cwd = await fsExtra.mkdtemp(
      path.join(tmpdir(), "shadcn-jsonc-tsconfig-")
    )

    try {
      await fsExtra.writeFile(
        path.join(cwd, "tsconfig.json"),
        `{
          // This mirrors the JSONC shape emitted by common TS templates.
          "compilerOptions": {
            "baseUrl": ".",
            "paths": {
              "@/*": ["./src/*"], // trailing comments are valid JSONC.
            },
          },
        }
        `,
        "utf8"
      )

      expect(await getTsConfigAliasPrefix(cwd)).toBe("@")
    } finally {
      await fsExtra.remove(cwd)
    }
  })
})

describe("is TypeScript project", async () => {
  it.each([
    {
      name: "next-app",
      result: true,
    },
    {
      name: "next-app-src",
      result: true,
    },
    {
      name: "next-pages",
      result: true,
    },
    {
      name: "next-pages-src",
      result: true,
    },
    {
      name: "t3-app",
      result: true,
    },
    {
      name: "next-app-js",
      result: false,
    },
  ])(`isTypeScriptProject($name) -> $result`, async ({ name, result }) => {
    expect(await isTypeScriptProject(getFixturesDir("frameworks", name))).toBe(
      result
    )
  })
})
