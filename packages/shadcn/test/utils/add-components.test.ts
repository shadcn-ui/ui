import { afterEach, describe, expect, test, vi } from "vitest"

import type { Config } from "../../src/utils/get-config"

// Mock all external dependencies.
vi.mock("../../src/registry/resolver", () => ({
  resolveRegistryTree: vi.fn(),
}))

vi.mock("../../src/utils/get-config", async () => {
  const actual = (await vi.importActual(
    "../../src/utils/get-config"
  )) as typeof import("../../src/utils/get-config")
  return {
    ...actual,
    getWorkspaceConfig: vi.fn(),
    findPackageRoot: vi.fn(),
  }
})

vi.mock("../../src/utils/updaters/update-files", () => ({
  updateFiles: vi.fn().mockResolvedValue({
    filesCreated: [],
    filesUpdated: [],
    filesSkipped: [],
  }),
}))

vi.mock("../../src/utils/updaters/update-dependencies", () => ({
  updateDependencies: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("../../src/utils/updaters/update-tailwind-config", () => ({
  updateTailwindConfig: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("../../src/utils/updaters/update-env-vars", () => ({
  updateEnvVars: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("../../src/utils/updaters/update-fonts", () => ({
  updateFonts: vi.fn().mockResolvedValue(undefined),
  massageTreeForFonts: vi.fn().mockImplementation((tree) => tree),
}))

vi.mock("../../src/utils/updaters/update-css", () => ({
  updateCss: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("../../src/utils/get-project-info", () => ({
  getProjectTailwindVersionFromConfig: vi.fn().mockResolvedValue("4"),
}))

vi.mock("../../src/utils/spinner", () => ({
  spinner: vi.fn().mockReturnValue({
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    fail: vi.fn().mockReturnThis(),
    info: vi.fn().mockReturnThis(),
  }),
}))

vi.mock("../../src/utils/logger", () => ({
  logger: {
    info: vi.fn(),
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

import { addComponents } from "../../src/utils/add-components"
import { resolveRegistryTree } from "../../src/registry/resolver"
import {
  findPackageRoot,
  getWorkspaceConfig,
} from "../../src/utils/get-config"
import { updateFiles } from "../../src/utils/updaters/update-files"
import { updateFonts } from "../../src/utils/updaters/update-fonts"

afterEach(() => {
  vi.clearAllMocks()
})

function createMockConfig(overrides: Partial<Config> = {}): Config {
  return {
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: true,
    tsx: true,
    tailwind: {
      css: "app/globals.css",
      baseColor: "zinc",
      cssVariables: true,
    },
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
    },
    resolvedPaths: {
      cwd: "/apps/web",
      tailwindConfig: "/apps/web/tailwind.config.ts",
      tailwindCss: "/apps/web/app/globals.css",
      utils: "/apps/web/lib/utils",
      components: "/apps/web/components",
      lib: "/apps/web/lib",
      hooks: "/apps/web/hooks",
      ui: "/apps/web/components/ui",
    },
    ...overrides,
  } as Config
}

describe("addComponents workspace routing", () => {
  test("should route registry:hook files to workspaceConfig.hooks", async () => {
    const appConfig = createMockConfig()
    const uiConfig = createMockConfig({
      resolvedPaths: {
        cwd: "/packages/ui",
        tailwindConfig: "/packages/ui/tailwind.config.ts",
        tailwindCss: "/packages/ui/src/globals.css",
        utils: "/packages/ui/src/lib/utils",
        components: "/packages/ui/src/components",
        lib: "/packages/ui/src/lib",
        hooks: "/packages/ui/src/hooks",
        ui: "/packages/ui/src/components/ui",
      },
    })

    // Hooks config resolves to the same package but is a distinct config object.
    // getWorkspaceConfig builds one config per alias key.
    const hooksConfig = createMockConfig({
      resolvedPaths: {
        cwd: "/packages/ui",
        tailwindConfig: "/packages/ui/tailwind.config.ts",
        tailwindCss: "/packages/ui/src/globals.css",
        utils: "/packages/ui/src/lib/utils",
        components: "/packages/ui/src/components",
        lib: "/packages/ui/src/lib",
        hooks: "/packages/ui/src/hooks",
        ui: "/packages/ui/src/components/ui",
      },
    })

    vi.mocked(getWorkspaceConfig).mockResolvedValue({
      ui: uiConfig,
      hooks: hooksConfig,
    })

    vi.mocked(resolveRegistryTree).mockResolvedValue({
      name: "sidebar",
      files: [
        {
          path: "registry/ui/sidebar.tsx",
          type: "registry:ui",
          content: "export function Sidebar() {}",
        },
        {
          path: "registry/hooks/use-mobile.ts",
          type: "registry:hook",
          content: "export function useMobile() {}",
        },
      ],
      dependencies: [],
      devDependencies: [],
    })

    vi.mocked(findPackageRoot).mockResolvedValue("/packages/ui")

    await addComponents(["sidebar"], appConfig, { silent: true })

    // updateFiles should be called twice: once for registry:ui, once for registry:hook.
    expect(updateFiles).toHaveBeenCalledTimes(2)

    // First call: registry:ui files with the UI workspace config.
    expect(updateFiles).toHaveBeenNthCalledWith(
      1,
      [
        expect.objectContaining({
          type: "registry:ui",
          path: "registry/ui/sidebar.tsx",
        }),
      ],
      uiConfig,
      expect.any(Object)
    )

    // Second call: registry:hook files with the hooks workspace config.
    expect(updateFiles).toHaveBeenNthCalledWith(
      2,
      [
        expect.objectContaining({
          type: "registry:hook",
          path: "registry/hooks/use-mobile.ts",
        }),
      ],
      hooksConfig,
      expect.any(Object)
    )
  })

  test("should route registry:lib files to workspaceConfig.lib", async () => {
    const appConfig = createMockConfig()
    const uiConfig = createMockConfig({
      resolvedPaths: {
        cwd: "/packages/ui",
        tailwindConfig: "/packages/ui/tailwind.config.ts",
        tailwindCss: "/packages/ui/src/globals.css",
        utils: "/packages/ui/src/lib/utils",
        components: "/packages/ui/src/components",
        lib: "/packages/ui/src/lib",
        hooks: "/packages/ui/src/hooks",
        ui: "/packages/ui/src/components/ui",
      },
    })
    const libConfig = createMockConfig({
      resolvedPaths: {
        cwd: "/packages/ui",
        tailwindConfig: "/packages/ui/tailwind.config.ts",
        tailwindCss: "/packages/ui/src/globals.css",
        utils: "/packages/ui/src/lib/utils",
        components: "/packages/ui/src/components",
        lib: "/packages/ui/src/lib",
        hooks: "/packages/ui/src/hooks",
        ui: "/packages/ui/src/components/ui",
      },
    })

    vi.mocked(getWorkspaceConfig).mockResolvedValue({
      ui: uiConfig,
      lib: libConfig,
    })

    vi.mocked(resolveRegistryTree).mockResolvedValue({
      name: "button",
      files: [
        {
          path: "registry/ui/button.tsx",
          type: "registry:ui",
          content: "export function Button() {}",
        },
        {
          path: "registry/lib/utils.ts",
          type: "registry:lib",
          content: "export function cn() {}",
        },
      ],
      dependencies: [],
      devDependencies: [],
    })

    vi.mocked(findPackageRoot).mockResolvedValue("/packages/ui")

    await addComponents(["button"], appConfig, { silent: true })

    expect(updateFiles).toHaveBeenCalledTimes(2)

    // First call: registry:ui files with the UI workspace config.
    expect(updateFiles).toHaveBeenNthCalledWith(
      1,
      [expect.objectContaining({ type: "registry:ui" })],
      uiConfig,
      expect.any(Object)
    )

    // Second call: registry:lib files with the lib workspace config.
    expect(updateFiles).toHaveBeenNthCalledWith(
      2,
      [expect.objectContaining({ type: "registry:lib" })],
      libConfig,
      expect.any(Object)
    )
  })

  test("should fall back to app config for unmapped types like registry:component", async () => {
    const appConfig = createMockConfig()
    const uiConfig = createMockConfig({
      resolvedPaths: {
        cwd: "/packages/ui",
        tailwindConfig: "/packages/ui/tailwind.config.ts",
        tailwindCss: "/packages/ui/src/globals.css",
        utils: "/packages/ui/src/lib/utils",
        components: "/packages/ui/src/components",
        lib: "/packages/ui/src/lib",
        hooks: "/packages/ui/src/hooks",
        ui: "/packages/ui/src/components/ui",
      },
    })

    vi.mocked(getWorkspaceConfig).mockResolvedValue({
      ui: uiConfig,
    })

    vi.mocked(resolveRegistryTree).mockResolvedValue({
      name: "login-01",
      files: [
        {
          path: "registry/components/login-form.tsx",
          type: "registry:component",
          content: "export function LoginForm() {}",
        },
      ],
      dependencies: [],
      devDependencies: [],
    })

    vi.mocked(findPackageRoot).mockResolvedValue("/apps/web")

    await addComponents(["login-01"], appConfig, { silent: true })

    expect(updateFiles).toHaveBeenCalledTimes(1)

    // registry:component should fall back to the app config.
    expect(updateFiles).toHaveBeenNthCalledWith(
      1,
      [expect.objectContaining({ type: "registry:component" })],
      appConfig,
      expect.any(Object)
    )
  })

  test("should fall back to app config when workspace key is missing", async () => {
    const appConfig = createMockConfig()
    const uiConfig = createMockConfig({
      resolvedPaths: {
        cwd: "/packages/ui",
        tailwindConfig: "/packages/ui/tailwind.config.ts",
        tailwindCss: "/packages/ui/src/globals.css",
        utils: "/packages/ui/src/lib/utils",
        components: "/packages/ui/src/components",
        lib: "/packages/ui/src/lib",
        hooks: "/packages/ui/src/hooks",
        ui: "/packages/ui/src/components/ui",
      },
    })

    // Workspace config only has ui — no hooks or lib.
    vi.mocked(getWorkspaceConfig).mockResolvedValue({
      ui: uiConfig,
    })

    vi.mocked(resolveRegistryTree).mockResolvedValue({
      name: "sidebar",
      files: [
        {
          path: "registry/ui/sidebar.tsx",
          type: "registry:ui",
          content: "export function Sidebar() {}",
        },
        {
          path: "registry/hooks/use-mobile.ts",
          type: "registry:hook",
          content: "export function useMobile() {}",
        },
      ],
      dependencies: [],
      devDependencies: [],
    })

    vi.mocked(findPackageRoot).mockResolvedValue("/packages/ui")

    await addComponents(["sidebar"], appConfig, { silent: true })

    expect(updateFiles).toHaveBeenCalledTimes(2)

    // registry:ui → workspaceConfig.ui.
    expect(updateFiles).toHaveBeenNthCalledWith(
      1,
      [expect.objectContaining({ type: "registry:ui" })],
      uiConfig,
      expect.any(Object)
    )

    // registry:hook with no workspaceConfig.hooks → falls back to app config.
    expect(updateFiles).toHaveBeenNthCalledWith(
      2,
      [expect.objectContaining({ type: "registry:hook" })],
      appConfig,
      expect.any(Object)
    )
  })

  test("should route all three mapped types to their workspace configs", async () => {
    const appConfig = createMockConfig()
    const uiConfig = createMockConfig({
      resolvedPaths: {
        cwd: "/packages/ui",
        tailwindConfig: "/packages/ui/tailwind.config.ts",
        tailwindCss: "/packages/ui/src/globals.css",
        utils: "/packages/ui/src/lib/utils",
        components: "/packages/ui/src/components",
        lib: "/packages/ui/src/lib",
        hooks: "/packages/ui/src/hooks",
        ui: "/packages/ui/src/components/ui",
      },
    })

    vi.mocked(getWorkspaceConfig).mockResolvedValue({
      ui: uiConfig,
      hooks: uiConfig,
      lib: uiConfig,
    })

    vi.mocked(resolveRegistryTree).mockResolvedValue({
      name: "sidebar",
      files: [
        {
          path: "registry/ui/sidebar.tsx",
          type: "registry:ui",
          content: "export function Sidebar() {}",
        },
        {
          path: "registry/hooks/use-mobile.ts",
          type: "registry:hook",
          content: "export function useMobile() {}",
        },
        {
          path: "registry/lib/utils.ts",
          type: "registry:lib",
          content: "export function cn() {}",
        },
      ],
      dependencies: [],
      devDependencies: [],
    })

    vi.mocked(findPackageRoot).mockResolvedValue("/packages/ui")

    await addComponents(["sidebar"], appConfig, { silent: true })

    // Three calls: one per type.
    expect(updateFiles).toHaveBeenCalledTimes(3)

    expect(updateFiles).toHaveBeenNthCalledWith(
      1,
      [expect.objectContaining({ type: "registry:ui" })],
      uiConfig,
      expect.any(Object)
    )
    expect(updateFiles).toHaveBeenNthCalledWith(
      2,
      [expect.objectContaining({ type: "registry:hook" })],
      uiConfig,
      expect.any(Object)
    )
    expect(updateFiles).toHaveBeenNthCalledWith(
      3,
      [expect.objectContaining({ type: "registry:lib" })],
      uiConfig,
      expect.any(Object)
    )
  })

  test("should fall back to app config for registry:file", async () => {
    const appConfig = createMockConfig()
    const uiConfig = createMockConfig({
      resolvedPaths: {
        cwd: "/packages/ui",
        tailwindConfig: "/packages/ui/tailwind.config.ts",
        tailwindCss: "/packages/ui/src/globals.css",
        utils: "/packages/ui/src/lib/utils",
        components: "/packages/ui/src/components",
        lib: "/packages/ui/src/lib",
        hooks: "/packages/ui/src/hooks",
        ui: "/packages/ui/src/components/ui",
      },
    })

    vi.mocked(getWorkspaceConfig).mockResolvedValue({
      ui: uiConfig,
    })

    vi.mocked(resolveRegistryTree).mockResolvedValue({
      name: "some-component",
      files: [
        {
          path: "registry/ui/button.tsx",
          type: "registry:ui",
          content: "export function Button() {}",
        },
        {
          path: ".env",
          type: "registry:file",
          target: "~/.env",
          content: "API_KEY=xxx",
        },
      ],
      dependencies: [],
      devDependencies: [],
    })

    vi.mocked(findPackageRoot).mockResolvedValue("/packages/ui")

    await addComponents(["some-component"], appConfig, { silent: true })

    expect(updateFiles).toHaveBeenCalledTimes(2)

    // registry:ui → workspace.
    expect(updateFiles).toHaveBeenNthCalledWith(
      1,
      [expect.objectContaining({ type: "registry:ui" })],
      uiConfig,
      expect.any(Object)
    )

    // registry:file → app config.
    expect(updateFiles).toHaveBeenNthCalledWith(
      2,
      [expect.objectContaining({ type: "registry:file" })],
      appConfig,
      expect.any(Object)
    )
  })

  test("should default files with no type to registry:ui", async () => {
    const appConfig = createMockConfig()
    const uiConfig = createMockConfig({
      resolvedPaths: {
        cwd: "/packages/ui",
        tailwindConfig: "/packages/ui/tailwind.config.ts",
        tailwindCss: "/packages/ui/src/globals.css",
        utils: "/packages/ui/src/lib/utils",
        components: "/packages/ui/src/components",
        lib: "/packages/ui/src/lib",
        hooks: "/packages/ui/src/hooks",
        ui: "/packages/ui/src/components/ui",
      },
    })

    vi.mocked(getWorkspaceConfig).mockResolvedValue({
      ui: uiConfig,
    })

    vi.mocked(resolveRegistryTree).mockResolvedValue({
      name: "button",
      files: [
        {
          path: "registry/ui/button.tsx",
          // No type — should default to registry:ui.
          content: "export function Button() {}",
        },
      ],
      dependencies: [],
      devDependencies: [],
    })

    vi.mocked(findPackageRoot).mockResolvedValue("/packages/ui")

    await addComponents(["button"], appConfig, { silent: true })

    expect(updateFiles).toHaveBeenCalledTimes(1)

    // Should route to workspace UI config.
    expect(updateFiles).toHaveBeenNthCalledWith(
      1,
      expect.any(Array),
      uiConfig,
      expect.any(Object)
    )
  })

  test("should group multiple files of the same type into one updateFiles call", async () => {
    const appConfig = createMockConfig()
    const uiConfig = createMockConfig({
      resolvedPaths: {
        cwd: "/packages/ui",
        tailwindConfig: "/packages/ui/tailwind.config.ts",
        tailwindCss: "/packages/ui/src/globals.css",
        utils: "/packages/ui/src/lib/utils",
        components: "/packages/ui/src/components",
        lib: "/packages/ui/src/lib",
        hooks: "/packages/ui/src/hooks",
        ui: "/packages/ui/src/components/ui",
      },
    })

    vi.mocked(getWorkspaceConfig).mockResolvedValue({
      ui: uiConfig,
    })

    vi.mocked(resolveRegistryTree).mockResolvedValue({
      name: "sidebar",
      files: [
        {
          path: "registry/ui/sidebar.tsx",
          type: "registry:ui",
          content: "export function Sidebar() {}",
        },
        {
          path: "registry/ui/sidebar-nav.tsx",
          type: "registry:ui",
          content: "export function SidebarNav() {}",
        },
        {
          path: "registry/ui/sidebar-menu.tsx",
          type: "registry:ui",
          content: "export function SidebarMenu() {}",
        },
      ],
      dependencies: [],
      devDependencies: [],
    })

    vi.mocked(findPackageRoot).mockResolvedValue("/packages/ui")

    await addComponents(["sidebar"], appConfig, { silent: true })

    // All three files are registry:ui — should be one call, not three.
    expect(updateFiles).toHaveBeenCalledTimes(1)
    expect(updateFiles).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ path: "registry/ui/sidebar.tsx" }),
        expect.objectContaining({ path: "registry/ui/sidebar-nav.tsx" }),
        expect.objectContaining({ path: "registry/ui/sidebar-menu.tsx" }),
      ]),
      uiConfig,
      expect.any(Object)
    )
  })

  test("should route hooks to separate package when aliases differ", async () => {
    const appConfig = createMockConfig({
      aliases: {
        components: "~foo/ui/components",
        utils: "~foo/ui/lib/utils",
        hooks: "~foo/hooks/src",
        lib: "~foo/ui/lib",
        ui: "~foo/ui/components",
      },
    })

    const uiPackageConfig = createMockConfig({
      resolvedPaths: {
        cwd: "/packages/ui",
        tailwindConfig: "/packages/ui/tailwind.config.ts",
        tailwindCss: "/packages/ui/src/globals.css",
        utils: "/packages/ui/src/lib/utils",
        components: "/packages/ui/src/components",
        lib: "/packages/ui/src/lib",
        hooks: "/packages/ui/src/hooks",
        ui: "/packages/ui/src/components/ui",
      },
    })

    const hooksPackageConfig = createMockConfig({
      resolvedPaths: {
        cwd: "/packages/hooks",
        tailwindConfig: "/packages/hooks/tailwind.config.ts",
        tailwindCss: "/packages/hooks/src/globals.css",
        utils: "/packages/hooks/src/lib/utils",
        components: "/packages/hooks/src/components",
        lib: "/packages/hooks/src/lib",
        hooks: "/packages/hooks/src/hooks",
        ui: "/packages/hooks/src/components/ui",
      },
    })

    vi.mocked(getWorkspaceConfig).mockResolvedValue({
      ui: uiPackageConfig,
      hooks: hooksPackageConfig,
      lib: uiPackageConfig,
    })

    vi.mocked(resolveRegistryTree).mockResolvedValue({
      name: "sidebar",
      files: [
        {
          path: "registry/ui/sidebar.tsx",
          type: "registry:ui",
          content: "export function Sidebar() {}",
        },
        {
          path: "registry/hooks/use-mobile.ts",
          type: "registry:hook",
          content: "export function useMobile() {}",
        },
      ],
      dependencies: [],
      devDependencies: [],
    })

    vi.mocked(findPackageRoot).mockImplementation(
      async (_cwd, resolvedPath) => {
        if (resolvedPath.startsWith("/packages/hooks")) {
          return "/packages/hooks"
        }
        return "/packages/ui"
      }
    )

    await addComponents(["sidebar"], appConfig, { silent: true })

    expect(updateFiles).toHaveBeenCalledTimes(2)

    // registry:ui → UI package.
    expect(updateFiles).toHaveBeenNthCalledWith(
      1,
      [expect.objectContaining({ type: "registry:ui" })],
      uiPackageConfig,
      expect.any(Object)
    )

    // registry:hook → hooks package (separate from UI).
    expect(updateFiles).toHaveBeenNthCalledWith(
      2,
      [expect.objectContaining({ type: "registry:hook" })],
      hooksPackageConfig,
      expect.any(Object)
    )
  })

  test("should call updateFonts with app config, not workspace config", async () => {
    const appConfig = createMockConfig()
    const uiConfig = createMockConfig({
      resolvedPaths: {
        cwd: "/packages/ui",
        tailwindConfig: "/packages/ui/tailwind.config.ts",
        tailwindCss: "/packages/ui/src/globals.css",
        utils: "/packages/ui/src/lib/utils",
        components: "/packages/ui/src/components",
        lib: "/packages/ui/src/lib",
        hooks: "/packages/ui/src/hooks",
        ui: "/packages/ui/src/components/ui",
      },
    })

    vi.mocked(getWorkspaceConfig).mockResolvedValue({
      ui: uiConfig,
    })

    vi.mocked(resolveRegistryTree).mockResolvedValue({
      name: "button",
      files: [
        {
          path: "registry/ui/button.tsx",
          type: "registry:ui",
          content: "export function Button() {}",
        },
      ],
      fonts: [
        {
          name: "font-inter",
          type: "registry:font",
          title: "Inter",
          font: {
            provider: "google",
            import: "Inter",
            family: "Inter, sans-serif",
            variable: "--font-sans",
            weight: ["400", "500", "600", "700"],
            subsets: ["latin"],
          },
        },
      ],
      dependencies: [],
      devDependencies: [],
    })

    vi.mocked(findPackageRoot).mockResolvedValue("/packages/ui")

    await addComponents(["button"], appConfig, { silent: true })

    // updateFonts should use the app config (layout lives in the app).
    expect(updateFonts).toHaveBeenCalledWith(
      expect.any(Array),
      appConfig,
      expect.any(Object)
    )

    // Verify it was NOT called with the workspace UI config.
    expect(updateFonts).not.toHaveBeenCalledWith(
      expect.anything(),
      uiConfig,
      expect.anything()
    )
  })
})
