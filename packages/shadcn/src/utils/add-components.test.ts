import { beforeEach, describe, expect, it, vi } from "vitest"

import { addComponents, validateFilesTarget } from "./add-components"

const {
  mockResolveRegistryTree,
  mockUpdateDependencies,
  mockUpdateTailwindConfig,
  mockUpdateEnvVars,
  mockUpdateFonts,
  mockUpdateFiles,
  mockUpdateCss,
  mockGetWorkspaceConfig,
  mockGetProjectTailwindVersionFromConfig,
  mockMassageTreeForFonts,
  spinnerInstance,
} = vi.hoisted(() => {
  const spinner = {
    start: vi.fn(),
    succeed: vi.fn(),
    fail: vi.fn(),
    stop: vi.fn(),
    info: vi.fn(),
  }
  spinner.start.mockReturnValue(spinner)

  return {
    mockResolveRegistryTree: vi.fn(),
    mockUpdateDependencies: vi.fn(),
    mockUpdateTailwindConfig: vi.fn(),
    mockUpdateEnvVars: vi.fn(),
    mockUpdateFonts: vi.fn(),
    mockUpdateFiles: vi.fn(),
    mockUpdateCss: vi.fn(),
    mockGetWorkspaceConfig: vi.fn(),
    mockGetProjectTailwindVersionFromConfig: vi.fn(),
    mockMassageTreeForFonts: vi.fn(),
    spinnerInstance: spinner,
  }
})

vi.mock("@/src/registry/api", () => ({
  getRegistryItems: vi.fn(),
}))

vi.mock("@/src/registry/config", () => ({
  configWithDefaults: vi.fn((config) => config),
}))

vi.mock("@/src/registry/resolver", () => ({
  resolveRegistryTree: mockResolveRegistryTree,
}))

vi.mock("@/src/utils/get-config", async () => {
  const actual = await vi.importActual<typeof import("@/src/utils/get-config")>(
    "@/src/utils/get-config"
  )

  return {
    ...actual,
    getWorkspaceConfig: mockGetWorkspaceConfig,
  }
})

vi.mock("@/src/utils/get-project-info", () => ({
  getProjectTailwindVersionFromConfig: mockGetProjectTailwindVersionFromConfig,
}))

vi.mock("@/src/utils/updaters/update-dependencies", () => ({
  updateDependencies: mockUpdateDependencies,
}))

vi.mock("@/src/utils/updaters/update-tailwind-config", () => ({
  updateTailwindConfig: mockUpdateTailwindConfig,
}))

vi.mock("@/src/utils/updaters/update-env-vars", () => ({
  updateEnvVars: mockUpdateEnvVars,
}))

vi.mock("@/src/utils/updaters/update-fonts", () => ({
  massageTreeForFonts: mockMassageTreeForFonts,
  updateFonts: mockUpdateFonts,
}))

vi.mock("@/src/utils/updaters/update-files", () => ({
  updateFiles: mockUpdateFiles,
}))

vi.mock("@/src/utils/updaters/update-css", () => ({
  updateCss: mockUpdateCss,
}))

vi.mock("@/src/utils/spinner", () => ({
  spinner: vi.fn(() => spinnerInstance),
}))

vi.mock("@/src/utils/handle-error", () => ({
  handleError: vi.fn(),
}))

vi.mock("@/src/utils/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    log: vi.fn(),
  },
}))

describe("addComponents", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    spinnerInstance.start.mockReturnValue(spinnerInstance)
    mockGetWorkspaceConfig.mockResolvedValue(null)
    mockGetProjectTailwindVersionFromConfig.mockResolvedValue("v4")
    mockMassageTreeForFonts.mockImplementation(async (tree) => tree)
    mockUpdateDependencies.mockResolvedValue(undefined)
    mockUpdateTailwindConfig.mockResolvedValue(undefined)
    mockUpdateEnvVars.mockResolvedValue(undefined)
    mockUpdateFonts.mockResolvedValue(undefined)
    mockUpdateFiles.mockResolvedValue({
      filesCreated: [],
      filesUpdated: [],
      filesSkipped: [],
    })
    mockUpdateCss.mockResolvedValue(undefined)
  })

  it("passes pending heading font markers into updateFiles before CSS is written", async () => {
    mockResolveRegistryTree.mockResolvedValue({
      dependencies: [],
      devDependencies: [],
      files: [
        {
          path: "registry/base-nova/ui/card.tsx",
          target: "components/ui/card.tsx",
          type: "registry:ui",
          content: `export function CardTitle() { return <div className="cn-font-heading" /> }`,
        },
      ],
      fonts: [
        {
          name: "font-heading-inter",
          type: "registry:font",
          font: {
            family: "'Inter Variable', sans-serif",
            provider: "google",
            import: "Inter",
            variable: "--font-heading",
            subsets: ["latin"],
            dependency: "@fontsource-variable/inter",
          },
        },
      ],
      cssVars: {
        theme: {
          "--font-heading": "var(--font-heading)",
        },
      },
    })

    await addComponents(
      ["card"],
      {
        style: "base-nova",
        rsc: true,
        tsx: true,
        tailwind: {
          baseColor: "neutral",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
          ui: "@/components/ui",
          lib: "@/lib",
          hooks: "@/hooks",
        },
        resolvedPaths: {
          cwd: "/test/project",
          tailwindCss: "/test/project/app/globals.css",
          tailwindConfig: "/test/project/tailwind.config.js",
          utils: "/test/project/lib/utils.ts",
          components: "/test/project/components",
          lib: "/test/project/lib",
          hooks: "/test/project/hooks",
          ui: "/test/project/components/ui",
        },
      } as any,
      {
        silent: true,
        overwriteCssVars: false,
      }
    )

    expect(mockUpdateFiles).toHaveBeenCalledOnce()
    expect(mockUpdateFiles.mock.calls[0]?.[2]?.supportedFontMarkers).toEqual([
      "cn-font-heading",
    ])
    expect(mockUpdateFiles.mock.invocationCallOrder[0]).toBeLessThan(
      mockUpdateCss.mock.invocationCallOrder[0]
    )
  })
})

describe("validateFilesTarget", () => {
  type File = Parameters<typeof validateFilesTarget>[0][number]
  const cwd = "/project"

  const rejectedCases = [
    [
      "rejects target-less file whose path escapes root",
      { type: "registry:ui", path: "ui/../../../../etc/evil.tsx" },
    ],
    [
      "rejects target-less file with absolute escaping path",
      { type: "registry:lib", path: "/etc/evil.ts" },
    ],
    [
      "still rejects unsafe target",
      { type: "registry:file", path: "x", target: "../../etc/evil" },
    ],
  ] satisfies Array<[string, File]>

  it.each(rejectedCases)("%s", (_name, file) => {
    expect(() => validateFilesTarget([file], cwd)).toThrow(/unsafe file path/)
  })

  const allowedCases = [
    [
      "allows normal target-less file",
      { type: "registry:ui", path: "ui/button.tsx" },
    ],
    [
      "allows normal nested target-less path",
      { type: "registry:ui", path: "registry/new-york-v4/ui/button.tsx" },
    ],
    [
      "allows safe target",
      { type: "registry:file", path: "x", target: "components/ui/x.tsx" },
    ],
  ] satisfies Array<[string, File]>

  it.each(allowedCases)("%s", (_name, file) => {
    expect(() => validateFilesTarget([file], cwd)).not.toThrow()
  })
})
