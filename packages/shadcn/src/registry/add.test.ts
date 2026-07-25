import { beforeEach, describe, expect, it, vi } from "vitest"

import { addRegistryItems } from "./add"

const {
  mockAddComponents,
  mockClearRegistryContext,
  mockCreateConfig,
  mockEnsureRegistriesInConfig,
  mockGetConfig,
  mockLoadEnvFiles,
  mockResolveRegistryTree,
  mockWithRegistryContext,
} = vi.hoisted(() => ({
  mockAddComponents: vi.fn(),
  mockClearRegistryContext: vi.fn(),
  mockCreateConfig: vi.fn(),
  mockEnsureRegistriesInConfig: vi.fn(),
  mockGetConfig: vi.fn(),
  mockLoadEnvFiles: vi.fn(),
  mockResolveRegistryTree: vi.fn(),
  mockWithRegistryContext: vi.fn(),
}))

vi.mock("@/src/registry/resolver", () => ({
  resolveRegistryTree: mockResolveRegistryTree,
}))

vi.mock("@/src/registry/context", () => ({
  clearRegistryContext: mockClearRegistryContext,
  withRegistryContext: mockWithRegistryContext,
}))

vi.mock("@/src/utils/add-components", () => ({
  addComponents: mockAddComponents,
}))

vi.mock("@/src/utils/env-loader", () => ({
  loadEnvFiles: mockLoadEnvFiles,
}))

vi.mock("@/src/utils/get-config", () => ({
  createConfig: mockCreateConfig,
  getConfig: mockGetConfig,
}))

vi.mock("@/src/utils/registries", () => ({
  ensureRegistriesInConfig: mockEnsureRegistriesInConfig,
}))

describe("addRegistryItems", () => {
  const projectConfig = { resolvedPaths: { cwd: "/project" } }
  const updatedConfig = { ...projectConfig, registries: { "@acme": "url" } }
  const projectEnv = { REGISTRY_TOKEN: "project-token" }

  beforeEach(() => {
    vi.clearAllMocks()
    mockLoadEnvFiles.mockResolvedValue(projectEnv)
    mockWithRegistryContext.mockImplementation((callback) => callback())
    mockGetConfig.mockResolvedValue(projectConfig)
    mockEnsureRegistriesInConfig.mockResolvedValue({
      config: updatedConfig,
      newRegistries: [],
    })
    mockResolveRegistryTree.mockResolvedValue({ files: [] })
  })

  it("loads project configuration and installs registry items", async () => {
    await addRegistryItems(["@acme/button"], {
      cwd: "/project",
      overwrite: true,
      silent: true,
    })

    expect(mockLoadEnvFiles).toHaveBeenCalledWith("/project", {
      processEnv: expect.any(Object),
    })
    expect(mockLoadEnvFiles.mock.calls[0][1].processEnv).not.toBe(process.env)
    expect(mockWithRegistryContext).toHaveBeenCalledWith(expect.any(Function), {
      env: projectEnv,
    })
    expect(mockEnsureRegistriesInConfig).toHaveBeenCalledWith(
      ["@acme/button"],
      projectConfig,
      { silent: true, writeFile: true }
    )
    expect(mockAddComponents).toHaveBeenCalledWith(
      ["@acme/button"],
      updatedConfig,
      expect.objectContaining({
        overwrite: true,
        silent: true,
        interactive: false,
      })
    )
    expect(mockClearRegistryContext).toHaveBeenCalledOnce()
  })

  it("defaults cwd to process.cwd()", async () => {
    const cwd = "/default/project"
    const cwdSpy = vi.spyOn(process, "cwd").mockReturnValue(cwd)

    try {
      await addRegistryItems(["@acme/button"])
    } finally {
      cwdSpy.mockRestore()
    }

    expect(mockLoadEnvFiles).toHaveBeenCalledWith(cwd, {
      processEnv: expect.any(Object),
    })
    expect(mockGetConfig).toHaveBeenCalledWith(cwd)
  })

  it("propagates installation errors to the caller", async () => {
    mockAddComponents.mockRejectedValueOnce(new Error("Installation failed."))

    await expect(
      addRegistryItems(["@acme/button"], { cwd: "/project" })
    ).rejects.toThrow("Installation failed.")

    expect(mockClearRegistryContext).toHaveBeenCalledOnce()
  })

  it("installs universal items without components.json", async () => {
    const universalConfig = { resolvedPaths: { cwd: "/project" } }
    const resolvedTree = {
      files: [
        {
          path: "agent.ts",
          target: "agent/extensions/agent.ts",
          type: "registry:file",
        },
      ],
    }
    mockGetConfig.mockResolvedValue(null)
    mockCreateConfig.mockReturnValue(universalConfig)
    mockEnsureRegistriesInConfig.mockResolvedValue({
      config: universalConfig,
      newRegistries: [],
    })
    mockResolveRegistryTree.mockResolvedValue(resolvedTree)

    await addRegistryItems(["https://example.com/agent.json"], {
      cwd: "/project",
    })

    expect(mockCreateConfig).toHaveBeenCalledWith({
      style: "new-york",
      resolvedPaths: { cwd: "/project" },
    })
    expect(mockEnsureRegistriesInConfig).toHaveBeenCalledWith(
      ["https://example.com/agent.json"],
      universalConfig,
      { silent: undefined, writeFile: false }
    )
    expect(mockResolveRegistryTree).toHaveBeenCalledWith(
      ["https://example.com/agent.json"],
      universalConfig,
      { requireUniversal: true, useCache: true }
    )
    expect(mockAddComponents).toHaveBeenCalledWith(
      ["https://example.com/agent.json"],
      universalConfig,
      expect.objectContaining({
        interactive: false,
        overwriteCssVars: false,
        resolvedTree,
      })
    )
  })

  it("rejects non-universal dependencies without components.json", async () => {
    const universalConfig = { resolvedPaths: { cwd: "/project" } }
    mockGetConfig.mockResolvedValue(null)
    mockCreateConfig.mockReturnValue(universalConfig)
    mockEnsureRegistriesInConfig.mockResolvedValue({
      config: universalConfig,
      newRegistries: [],
    })
    mockResolveRegistryTree.mockRejectedValue(
      new Error(
        "A components.json file is required to add non-universal registry items or dependencies."
      )
    )

    await expect(
      addRegistryItems(["https://example.com/agent.json"], {
        cwd: "/project",
      })
    ).rejects.toThrow("non-universal registry items or dependencies")

    expect(mockAddComponents).not.toHaveBeenCalled()
  })

  it("rejects unresolved target aliases without components.json", async () => {
    const universalConfig = {
      resolvedPaths: { cwd: "/project", ui: "" },
    }
    mockGetConfig.mockResolvedValue(null)
    mockCreateConfig.mockReturnValue(universalConfig)
    mockEnsureRegistriesInConfig.mockResolvedValue({
      config: universalConfig,
      newRegistries: [],
    })
    mockResolveRegistryTree.mockResolvedValue({
      files: [
        {
          path: "agent.ts",
          target: "@ui/agent.ts",
          type: "registry:file",
        },
      ],
    })

    await expect(
      addRegistryItems(["https://example.com/agent.json"], {
        cwd: "/project",
      })
    ).rejects.toThrow("resolve target aliases")

    expect(mockAddComponents).not.toHaveBeenCalled()
  })

  it("reports unresolved registry items without components.json", async () => {
    const universalConfig = { resolvedPaths: { cwd: "/project" } }
    mockGetConfig.mockResolvedValue(null)
    mockCreateConfig.mockReturnValue(universalConfig)
    mockEnsureRegistriesInConfig.mockResolvedValue({
      config: universalConfig,
      newRegistries: [],
    })
    mockResolveRegistryTree.mockResolvedValue(null)

    await expect(
      addRegistryItems(["https://example.com/missing.json"], {
        cwd: "/project",
      })
    ).rejects.toThrow("Failed to fetch components from registry.")

    expect(mockAddComponents).not.toHaveBeenCalled()
  })

  it("rejects non-universal items without components.json", async () => {
    const universalConfig = { resolvedPaths: { cwd: "/project" } }
    mockGetConfig.mockResolvedValue(null)
    mockCreateConfig.mockReturnValue(universalConfig)
    mockEnsureRegistriesInConfig.mockResolvedValue({
      config: universalConfig,
      newRegistries: [],
    })
    mockResolveRegistryTree.mockRejectedValue(
      new Error(
        "A components.json file is required to add non-universal registry items or dependencies."
      )
    )

    await expect(
      addRegistryItems(["@acme/button"], { cwd: "/project" })
    ).rejects.toThrow("A components.json file is required")

    expect(mockAddComponents).not.toHaveBeenCalled()
    expect(mockClearRegistryContext).toHaveBeenCalledOnce()
  })
})
