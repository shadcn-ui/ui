import { runInit } from "@/src/commands/init"
import { REGISTRY_URL, SHADCN_URL } from "@/src/registry/constants"
import { getFixturesDir, withTempDir } from "@/src/test-helpers"
import { addComponents } from "@/src/utils/add-components"
import { createProject } from "@/src/utils/create-project"
import { dryRunComponents } from "@/src/utils/dry-run"
import { updateAppIndex } from "@/src/utils/update-app-index"
import fs from "fs-extra"
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import prompts from "prompts"
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

import { add } from "./add"

// --- Mocked seams (the collaborators add.ts delegates to). ---

vi.mock("@/src/utils/add-components", () => ({
  addComponents: vi.fn(),
}))

vi.mock("@/src/commands/init", () => ({
  runInit: vi.fn(),
}))

vi.mock("@/src/utils/create-project", () => ({
  createProject: vi.fn(),
}))

vi.mock("@/src/utils/update-app-index", () => ({
  updateAppIndex: vi.fn(),
}))

vi.mock("@/src/utils/dry-run", () => ({
  dryRunComponents: vi.fn(),
}))

vi.mock("prompts", () => ({
  default: vi.fn(),
}))

vi.mock("@/src/utils/spinner", () => ({
  spinner: vi.fn(() => ({
    start: vi.fn().mockReturnThis(),
    stop: vi.fn(),
    succeed: vi.fn(),
    fail: vi.fn(),
    info: vi.fn(),
  })),
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

vi.mock("@/src/utils/handle-error", () => ({
  handleError: vi.fn((error) => {
    throw error
  }),
}))

// --- MSW registry server. ---
//
// Serves a minimal registry:ui item for most component names, plus
// dedicated handlers for the registry:style, registry:theme and
// universal (registry:item) branches, the /init endpoint hit by
// resolveRegistryBaseConfig, and a direct-URL v0 "chat" item for the
// updateAppIndex branch.

function uiItem(name: string) {
  return {
    name,
    type: "registry:ui",
    files: [
      {
        path: `registry/new-york/ui/${name}.tsx`,
        type: "registry:ui",
        content: `export function ${name}() {}`,
      },
    ],
  }
}

const CHAT_ITEM_URL = "https://v0.dev/chat/b/xyz"

// Registered under both "new-york" (used by fixtures with a non-empty
// tailwind.config, e.g. config-full) and "new-york-v4" (the fallback style
// resolved by configWithDefaults whenever tailwind.config is "", which is
// both createConfig's default and the vite-with-tailwind fixture's value).
const STYLES = ["new-york", "new-york-v4"]

function registerItem(name: string, body: Record<string, unknown>) {
  return STYLES.map((style) =>
    http.get(`${REGISTRY_URL}/styles/${style}/${name}.json`, () =>
      HttpResponse.json(body)
    )
  )
}

const server = setupServer(
  ...registerItem("button", uiItem("button")),
  ...registerItem("card", uiItem("card")),
  ...registerItem("toast", uiItem("toast")),
  ...registerItem("style-item", {
    name: "style-item",
    type: "registry:style",
  }),
  ...registerItem("theme-item", {
    name: "theme-item",
    type: "registry:theme",
  }),
  ...registerItem("universal-item", {
    name: "universal-item",
    type: "registry:item",
  }),
  http.get(`${SHADCN_URL}/init`, () =>
    HttpResponse.json({
      name: "base",
      type: "registry:base",
      extends: "none",
    })
  ),
  // resolveRegistryUrl appends "/json" for /chat/b/ URLs (the v0 registry
  // convention), so the handler must match the rewritten address.
  http.get(`${CHAT_ITEM_URL}/json`, () =>
    HttpResponse.json({
      name: "chat-item",
      type: "registry:ui",
      files: [],
    })
  )
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// --- Test helpers. ---

async function withFixtureCopy<T>(
  fixtureName: string,
  fn: (dir: string) => Promise<T>
) {
  return withTempDir(async (dir) => {
    await fs.copy(getFixturesDir(fixtureName), dir)
    return fn(dir)
  })
}

async function runAdd(args: string[], cwd: string) {
  return add.parseAsync(["node", "shadcn", ...args, "--cwd", cwd], {
    from: "node",
  })
}

function mockProcessExit() {
  return vi.spyOn(process, "exit").mockImplementation((code) => {
    throw new Error(`process.exit:${code}`)
  }) as any
}

function mockPrompts(answers: Record<string, unknown>) {
  vi.mocked(prompts).mockImplementation(async (opts: any) => {
    const name = Array.isArray(opts) ? opts[0]?.name : opts?.name
    if (name && name in answers) {
      return { [name]: answers[name] }
    }
    return {}
  })
}

function baseConfig(cwd: string) {
  return {
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: false,
    tsx: true,
    tailwind: {
      config: "",
      css: "",
      baseColor: "neutral",
      cssVariables: true,
      prefix: "",
    },
    iconLibrary: "lucide",
    aliases: {
      components: "@/components",
      ui: "@/components/ui",
      hooks: "@/hooks",
      lib: "@/lib",
      utils: "@/lib/utils",
    },
    registries: {},
    resolvedPaths: {
      cwd,
      tailwindConfig: "",
      tailwindCss: "",
      utils: "",
      components: "",
      lib: "",
      hooks: "",
      ui: "",
    },
  } as any
}

describe("add command", () => {
  let exit: ReturnType<typeof mockProcessExit>

  beforeEach(() => {
    vi.clearAllMocks()
    exit = mockProcessExit()
    mockPrompts({})
  })

  afterEach(() => {
    exit.mockRestore()
  })

  describe("happy path", () => {
    it("installs components via addComponents when a valid project exists", async () => {
      await withFixtureCopy("config-full", async (cwd) => {
        await runAdd(["button"], cwd)

        expect(addComponents).toHaveBeenCalledTimes(1)
        expect(addComponents).toHaveBeenCalledWith(
          ["button"],
          expect.any(Object),
          expect.any(Object)
        )
        expect(runInit).not.toHaveBeenCalled()
        expect(createProject).not.toHaveBeenCalled()
      })
    })
  })

  describe("dry run", () => {
    beforeEach(() => {
      vi.mocked(dryRunComponents).mockResolvedValue({
        files: [],
        dependencies: [],
        devDependencies: [],
        css: null,
        envVars: null,
        fonts: [],
        docs: null,
      })
    })

    it("previews with --dry-run and never calls addComponents", async () => {
      await withFixtureCopy("config-full", async (cwd) => {
        await runAdd(["button", "--dry-run"], cwd)

        expect(dryRunComponents).toHaveBeenCalledTimes(1)
        expect(addComponents).not.toHaveBeenCalled()
      })
    })

    it("implies dry-run with --diff", async () => {
      await withFixtureCopy("config-full", async (cwd) => {
        await runAdd(["button", "--diff"], cwd)

        expect(dryRunComponents).toHaveBeenCalledTimes(1)
        expect(addComponents).not.toHaveBeenCalled()
      })
    })

    it("implies dry-run with --view", async () => {
      await withFixtureCopy("config-full", async (cwd) => {
        await runAdd(["button", "--view"], cwd)

        expect(dryRunComponents).toHaveBeenCalledTimes(1)
        expect(addComponents).not.toHaveBeenCalled()
      })
    })
  })

  describe("missing components.json (init flow)", () => {
    it("runs init with the documented flags when the user proceeds", async () => {
      await withTempDir(async (cwd) => {
        await fs.writeJson(cwd + "/package.json", {
          name: "no-config-project",
          version: "1.0.0",
        })

        mockPrompts({
          proceed: true,
          base: "radix",
          selectedPreset: "nova",
        })
        vi.mocked(runInit).mockResolvedValue(baseConfig(cwd))

        await runAdd(["button"], cwd)

        expect(runInit).toHaveBeenCalledTimes(1)
        const callArgs = vi.mocked(runInit).mock.calls[0][0]
        expect(callArgs.cwd).toBe(cwd)
        expect(callArgs.yes).toBe(true)
        expect(callArgs.force).toBe(true)
        expect(callArgs.isNewProject).toBe(false)
        expect(callArgs.skipPreflight).toBe(false)
        // initHasRun guard: addComponents must NOT run again after init.
        expect(addComponents).not.toHaveBeenCalled()
      })
    })

    it("exits 1 without running init when the user declines", async () => {
      await withTempDir(async (cwd) => {
        await fs.writeJson(cwd + "/package.json", {
          name: "no-config-project",
          version: "1.0.0",
        })

        mockPrompts({ proceed: false })

        await expect(runAdd(["button"], cwd)).rejects.toThrow("process.exit:1")

        expect(runInit).not.toHaveBeenCalled()
      })
    })
  })

  describe("empty/missing project (create-project flow)", () => {
    it("runs init with isNewProject/skipPreflight after scaffolding a project", async () => {
      await withTempDir(async (emptyDir) => {
        await withTempDir(async (projectPath) => {
          mockPrompts({
            base: "radix",
            selectedPreset: "nova",
          })
          vi.mocked(createProject).mockResolvedValue({
            projectPath,
            projectName: "app",
            template: "next",
          } as any)
          vi.mocked(runInit).mockResolvedValue(baseConfig(projectPath))

          await runAdd(["button"], emptyDir)

          expect(createProject).toHaveBeenCalledTimes(1)
          expect(runInit).toHaveBeenCalledTimes(1)
          const callArgs = vi.mocked(runInit).mock.calls[0][0]
          expect(callArgs.cwd).toBe(projectPath)
          expect(callArgs.yes).toBe(true)
          expect(callArgs.force).toBe(true)
          expect(callArgs.isNewProject).toBe(true)
          expect(callArgs.skipPreflight).toBe(true)
          expect(addComponents).not.toHaveBeenCalled()
        })
      })
    })

    it("exits 1 when createProject cannot resolve a project path", async () => {
      await withTempDir(async (emptyDir) => {
        vi.mocked(createProject).mockResolvedValue({
          projectPath: null,
          projectName: null,
          template: "next",
        } as any)

        await expect(runAdd(["button"], emptyDir)).rejects.toThrow(
          "process.exit:1"
        )

        expect(runInit).not.toHaveBeenCalled()
      })
    })

    it("updates the app index for a single v0 chat component", async () => {
      await withTempDir(async (emptyDir) => {
        await withTempDir(async (projectPath) => {
          mockPrompts({
            base: "radix",
            selectedPreset: "nova",
          })
          vi.mocked(createProject).mockResolvedValue({
            projectPath,
            projectName: "app",
            template: "next",
          } as any)
          vi.mocked(runInit).mockResolvedValue(baseConfig(projectPath))

          await runAdd([CHAT_ITEM_URL], emptyDir)

          expect(updateAppIndex).toHaveBeenCalledTimes(1)
          expect(updateAppIndex).toHaveBeenCalledWith(
            CHAT_ITEM_URL,
            expect.any(Object)
          )
        })
      })
    })

    it("does not update the app index for multiple components", async () => {
      await withTempDir(async (emptyDir) => {
        await withTempDir(async (projectPath) => {
          mockPrompts({
            base: "radix",
            selectedPreset: "nova",
          })
          vi.mocked(createProject).mockResolvedValue({
            projectPath,
            projectName: "app",
            template: "next",
          } as any)
          vi.mocked(runInit).mockResolvedValue(baseConfig(projectPath))

          await runAdd(["button", "card"], emptyDir)

          expect(updateAppIndex).not.toHaveBeenCalled()
        })
      })
    })

    it("does not update the app index for a non-matching single component", async () => {
      await withTempDir(async (emptyDir) => {
        await withTempDir(async (projectPath) => {
          mockPrompts({
            base: "radix",
            selectedPreset: "nova",
          })
          vi.mocked(createProject).mockResolvedValue({
            projectPath,
            projectName: "app",
            template: "next",
          } as any)
          vi.mocked(runInit).mockResolvedValue(baseConfig(projectPath))

          await runAdd(["button"], emptyDir)

          expect(updateAppIndex).not.toHaveBeenCalled()
        })
      })
    })
  })

  describe("registry:style / registry:theme overwrite confirm", () => {
    it("exits 1 when the user declines the overwrite confirm", async () => {
      await withTempDir(async (cwd) => {
        mockPrompts({ confirm: false })

        await expect(runAdd(["style-item"], cwd)).rejects.toThrow(
          "process.exit:1"
        )

        expect(addComponents).not.toHaveBeenCalled()
      })
    })

    it("proceeds when the user confirms the overwrite", async () => {
      await withFixtureCopy("config-full", async (cwd) => {
        mockPrompts({ confirm: true })

        await runAdd(["style-item"], cwd)

        expect(addComponents).toHaveBeenCalledTimes(1)
        expect(addComponents).toHaveBeenCalledWith(
          ["style-item"],
          expect.any(Object),
          expect.any(Object)
        )
      })
    })

    it("skips the confirm prompt entirely with --yes", async () => {
      await withFixtureCopy("config-full", async (cwd) => {
        await runAdd(["style-item", "--yes"], cwd)

        expect(prompts).not.toHaveBeenCalled()
        expect(addComponents).toHaveBeenCalledTimes(1)
      })
    })

    it("also prompts for registry:theme items", async () => {
      await withTempDir(async (cwd) => {
        mockPrompts({ confirm: false })

        await expect(runAdd(["theme-item"], cwd)).rejects.toThrow(
          "process.exit:1"
        )

        expect(addComponents).not.toHaveBeenCalled()
      })
    })
  })

  describe("universal registry item short-circuit", () => {
    it("calls addComponents directly without running preflight/init", async () => {
      await withTempDir(async (cwd) => {
        await runAdd(["universal-item"], cwd)

        expect(addComponents).toHaveBeenCalledTimes(1)
        expect(addComponents).toHaveBeenCalledWith(
          ["universal-item"],
          expect.any(Object),
          expect.any(Object)
        )
        expect(runInit).not.toHaveBeenCalled()
        expect(prompts).not.toHaveBeenCalled()
      })
    })
  })

  describe("deprecated components guard (Tailwind v4)", () => {
    it("exits 1 and warns when adding a deprecated component", async () => {
      await withFixtureCopy("vite-with-tailwind", async (cwd) => {
        const { logger } = await import("@/src/utils/logger")

        await expect(runAdd(["toast"], cwd)).rejects.toThrow("process.exit:1")

        expect(logger.warn).toHaveBeenCalledWith(
          expect.stringContaining("toast component is deprecated")
        )
        expect(addComponents).not.toHaveBeenCalled()
      })
    })
  })
})
