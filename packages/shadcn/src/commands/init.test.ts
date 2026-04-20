import { mkdir, mkdtemp, rm } from "fs/promises"
import os from "os"
import path from "path"
import { preFlightInit } from "@/src/preflights/preflight-init"
import { templates } from "@/src/templates"
import { addComponents } from "@/src/utils/add-components"
import { createProject } from "@/src/utils/create-project"
import { MISSING_DIR_OR_EMPTY_PROJECT } from "@/src/utils/errors"
import {
  getProjectConfig,
  getProjectInfo,
  getProjectTailwindVersionFromConfig,
} from "@/src/utils/get-project-info"
import { ensureRegistriesInConfig } from "@/src/utils/registries"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { runInit } from "./init"

vi.mock("@/src/preflights/preflight-init", () => ({
  preFlightInit: vi.fn(),
}))

vi.mock("@/src/utils/create-project", () => ({
  createProject: vi.fn(),
}))

vi.mock("@/src/utils/add-components", () => ({
  addComponents: vi.fn(),
}))

vi.mock("@/src/utils/registries", () => ({
  ensureRegistriesInConfig: vi.fn(),
}))

vi.mock("@/src/registry/api", () => ({
  getRegistryBaseColors: vi.fn().mockResolvedValue([
    {
      label: "Zinc",
      name: "zinc",
    },
  ]),
  getRegistryStyles: vi.fn().mockResolvedValue([
    {
      label: "New York",
      name: "new-york",
    },
  ]),
}))

vi.mock("@/src/utils/get-config", () => ({
  DEFAULT_COMPONENTS: "@/components",
  DEFAULT_TAILWIND_CONFIG: "tailwind.config.js",
  DEFAULT_TAILWIND_CSS: "app/globals.css",
  DEFAULT_UTILS: "@/lib/utils",
  explorer: {
    clearCaches: vi.fn(),
  },
  getConfig: vi.fn(),
  getWorkspaceConfig: vi.fn().mockResolvedValue(null),
  resolveConfigPaths: vi.fn(
    async (cwd: string, config: Record<string, unknown>) => ({
      ...config,
      resolvedPaths: {
        cwd,
        tailwindConfig: path.resolve(cwd, "tailwind.config.js"),
        tailwindCss: path.resolve(cwd, "src/index.css"),
        utils: path.resolve(cwd, "src/lib/utils.ts"),
        components: path.resolve(cwd, "src/components"),
        lib: path.resolve(cwd, "src/lib"),
        hooks: path.resolve(cwd, "src/hooks"),
        ui: path.resolve(cwd, "src/components/ui"),
      },
    })
  ),
}))

vi.mock("@/src/utils/get-project-info", () => ({
  getProjectComponents: vi.fn().mockResolvedValue([]),
  getProjectConfig: vi.fn(),
  getProjectInfo: vi.fn(),
  getProjectTailwindVersionFromConfig: vi.fn(),
}))

vi.mock("@/src/utils/logger", () => ({
  logger: {
    break: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    log: vi.fn(),
    warn: vi.fn(),
  },
}))

vi.mock("@/src/utils/spinner", () => ({
  spinner: vi.fn(() => ({
    fail: vi.fn(),
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn(),
  })),
}))

vi.mock("@/src/utils/highlighter", () => ({
  highlighter: {
    error: (value: string) => value,
    info: (value: string) => value,
    success: (value: string) => value,
    warn: (value: string) => value,
  },
}))

vi.mock("prompts", () => ({
  default: vi.fn(),
}))

const projectInfo = {
  framework: {
    label: "Vite",
    links: {},
    name: "vite",
  },
  frameworkVersion: null,
  isRSC: false,
  isSrcDir: true,
  isTsx: true,
  tailwindConfigFile: null,
  tailwindCssFile: "src/index.css",
  tailwindVersion: "v4",
  aliasPrefix: "@",
}

function createProjectConfig(cwd: string) {
  return {
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: false,
    tsx: true,
    tailwind: {
      config: "",
      css: "src/index.css",
      baseColor: "zinc",
      cssVariables: true,
      prefix: "",
    },
    iconLibrary: "lucide",
    rtl: false,
    aliases: {
      components: "@/components",
      ui: "@/components/ui",
      hooks: "@/hooks",
      lib: "@/lib",
      utils: "@/lib/utils",
    },
    resolvedPaths: {
      cwd,
      tailwindConfig: "",
      tailwindCss: path.resolve(cwd, "src/index.css"),
      utils: path.resolve(cwd, "src/lib/utils.ts"),
      components: path.resolve(cwd, "src/components"),
      lib: path.resolve(cwd, "src/lib"),
      hooks: path.resolve(cwd, "src/hooks"),
      ui: path.resolve(cwd, "src/components/ui"),
    },
  }
}

function createInitOptions(cwd: string) {
  return {
    cwd,
    yes: true,
    defaults: true,
    force: false,
    reinstall: false,
    silent: true,
    isNewProject: false,
    cssVariables: true,
    installStyleIndex: true,
    template: "vite",
  } as Parameters<typeof runInit>[0]
}

describe("runInit", () => {
  let cwd: string
  let originalPostInit: typeof templates.vite.postInit

  beforeEach(async () => {
    cwd = await mkdtemp(path.join(os.tmpdir(), "shadcn-init-test-"))
    originalPostInit = templates.vite.postInit

    vi.mocked(getProjectInfo).mockResolvedValue(projectInfo as any)
    vi.mocked(getProjectTailwindVersionFromConfig).mockResolvedValue("v4")
    vi.mocked(getProjectConfig).mockImplementation(async (projectCwd) =>
      createProjectConfig(projectCwd)
    )
    vi.mocked(ensureRegistriesInConfig).mockImplementation(
      async (_components, config) => ({ config, newRegistries: [] })
    )
    vi.mocked(addComponents).mockResolvedValue(undefined)
  })

  afterEach(async () => {
    templates.vite.postInit = originalPostInit
    vi.clearAllMocks()
    await rm(cwd, { recursive: true, force: true })
  })

  it("does not run template postInit for existing projects with an explicit template", async () => {
    const postInit = vi.fn()
    templates.vite.postInit = postInit
    vi.mocked(preFlightInit).mockResolvedValue({
      errors: {},
      projectInfo: projectInfo as any,
    })

    await runInit(createInitOptions(cwd))

    expect(postInit).not.toHaveBeenCalled()
  })

  it("runs template postInit after creating a new project", async () => {
    const projectPath = path.join(cwd, "vite-app")
    await mkdir(projectPath)
    const postInit = vi.fn()
    templates.vite.postInit = postInit
    vi.mocked(preFlightInit).mockResolvedValue({
      errors: {
        [MISSING_DIR_OR_EMPTY_PROJECT]: true,
      },
      projectInfo: null,
    })
    vi.mocked(createProject).mockResolvedValue({
      projectPath,
      projectName: "vite-app",
      template: "vite",
    })

    await runInit(createInitOptions(cwd))

    expect(postInit).toHaveBeenCalledWith({ projectPath })
  })

  it("does not run template postInit when isNewProject is true but createProject was skipped", async () => {
    const postInit = vi.fn()
    templates.vite.postInit = postInit

    await runInit({
      ...createInitOptions(cwd),
      skipPreflight: true,
      isNewProject: true,
    })

    expect(createProject).not.toHaveBeenCalled()
    expect(postInit).not.toHaveBeenCalled()
  })
})
