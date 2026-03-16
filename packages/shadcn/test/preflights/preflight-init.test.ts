import { afterEach, describe, expect, test, vi } from "vitest"
import { z } from "zod"

const {
  mockedGetProjectInfo,
  mockedGetProjectConfig,
  mockedExistsSync,
  mockedLogger,
} = vi.hoisted(
  () => ({
    mockedGetProjectInfo: vi.fn(),
    mockedGetProjectConfig: vi.fn(),
    mockedExistsSync: vi.fn(),
    mockedLogger: {
      break: vi.fn(),
      error: vi.fn(),
    },
  })
)

vi.mock("../../src/commands/init", () => ({
  initOptionsSchema: z.object({
    cwd: z.string(),
    force: z.boolean(),
    monorepo: z.boolean().optional(),
    silent: z.boolean().optional(),
    existingConfig: z.record(z.unknown()).optional(),
  }),
}))

vi.mock("../../src/utils/get-project-info", () => ({
  getProjectInfo: mockedGetProjectInfo,
  getProjectConfig: mockedGetProjectConfig,
}))

vi.mock("../../src/utils/get-monorepo-info", () => ({
  formatMonorepoMessage: vi.fn(),
  getMonorepoTargets: vi.fn().mockResolvedValue([]),
  isMonorepoRoot: vi.fn().mockResolvedValue(false),
}))

vi.mock("../../src/utils/highlighter", () => ({
  highlighter: {
    info: (value: string) => value,
  },
}))

vi.mock("../../src/utils/logger", () => ({
  logger: mockedLogger,
}))

vi.mock("../../src/utils/spinner", () => ({
  spinner: vi.fn().mockReturnValue({
    start: vi.fn().mockReturnValue({
      succeed: vi.fn(),
      fail: vi.fn(),
      stop: vi.fn(),
    }),
  }),
}))

vi.mock("fs-extra", () => ({
  default: {
    existsSync: mockedExistsSync,
  },
}))

import { preFlightInit } from "../../src/preflights/preflight-init"

const baseProjectInfo = {
  framework: {
    name: "next-app",
    label: "Next.js",
    links: {
      installation: "https://ui.shadcn.com/docs/installation",
      tailwind: "https://tailwindcss.com/docs/installation",
    },
  },
  isSrcDir: false,
  isRSC: true,
  isTsx: true,
  tailwindConfigFile: null,
  tailwindCssFile: "app/globals.css",
  tailwindVersion: "v4" as const,
  frameworkVersion: null,
  aliasPrefix: "#",
}

const baseOptions = {
  cwd: "/tmp/project",
  force: false,
  monorepo: false,
  silent: true,
}

const baseConfig = {
  aliases: {
    components: "#components",
    ui: "#components/ui",
    lib: "#lib",
    hooks: "#hooks",
    utils: "#utils",
  },
}

afterEach(() => {
  vi.clearAllMocks()
})

describe("preFlightInit", () => {
  test("accepts package import aliases detected from package.json#imports", async () => {
    mockedExistsSync.mockImplementation((filePath: string) => {
      return !filePath.endsWith("components.json")
    })
    mockedGetProjectInfo.mockResolvedValue(baseProjectInfo)
    mockedGetProjectConfig.mockResolvedValue(baseConfig)

    const result = await preFlightInit(baseOptions)

    expect(result.errors).toEqual({})
    expect(result.projectInfo?.aliasPrefix).toBe("#")
    expect(result.projectConfig).toEqual(baseConfig)
    expect(mockedLogger.error).not.toHaveBeenCalled()
  })

  test("reports missing aliases for tsconfig paths and package imports", async () => {
    mockedExistsSync.mockImplementation((filePath: string) => {
      return !filePath.endsWith("components.json")
    })
    mockedGetProjectInfo.mockResolvedValue({
      ...baseProjectInfo,
      aliasPrefix: null,
    })
    mockedGetProjectConfig.mockResolvedValue(null)

    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(((code?: string | number | null) => {
        throw new Error(`process.exit:${code ?? ""}`)
      }) as never)

    await expect(preFlightInit(baseOptions)).rejects.toThrow("process.exit:1")

    expect(mockedLogger.error).toHaveBeenCalledWith(
      "No import alias found in your tsconfig.json or package.json#imports configuration."
    )
    expect(mockedLogger.error).toHaveBeenCalledWith(
      'Add an alias in compilerOptions.paths or "imports" and try again.'
    )

    exitSpy.mockRestore()
  })

  test("reports incomplete alias configuration when project config cannot be derived", async () => {
    mockedExistsSync.mockImplementation((filePath: string) => {
      return !filePath.endsWith("components.json")
    })
    mockedGetProjectInfo.mockResolvedValue(baseProjectInfo)
    mockedGetProjectConfig.mockResolvedValue(null)

    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(((code?: string | number | null) => {
        throw new Error(`process.exit:${code ?? ""}`)
      }) as never)

    await expect(preFlightInit(baseOptions)).rejects.toThrow("process.exit:1")

    expect(mockedLogger.error).toHaveBeenCalledWith(
      "Could not determine a complete configuration from your tsconfig.json or package.json#imports aliases."
    )
    expect(mockedLogger.error).toHaveBeenCalledWith(
      "Configure the required components, ui, lib, hooks, and utils aliases, or create components.json manually and try again."
    )

    exitSpy.mockRestore()
  })
})
