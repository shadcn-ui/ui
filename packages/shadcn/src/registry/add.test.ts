import { beforeEach, describe, expect, it, vi } from "vitest"

import { addRegistryItems } from "./add"

const {
  mockAddComponents,
  mockClearRegistryContext,
  mockCreateConfig,
  mockEnsureRegistriesInConfig,
  mockGetConfig,
  mockGetRegistryItems,
  mockLoadEnvFiles,
} = vi.hoisted(() => ({
  mockAddComponents: vi.fn(),
  mockClearRegistryContext: vi.fn(),
  mockCreateConfig: vi.fn(),
  mockEnsureRegistriesInConfig: vi.fn(),
  mockGetConfig: vi.fn(),
  mockGetRegistryItems: vi.fn(),
  mockLoadEnvFiles: vi.fn(),
}))

vi.mock("@/src/registry/api", () => ({
  getRegistryItems: mockGetRegistryItems,
}))

vi.mock("@/src/registry/context", () => ({
  clearRegistryContext: mockClearRegistryContext,
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

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetConfig.mockResolvedValue(projectConfig)
    mockEnsureRegistriesInConfig.mockResolvedValue({
      config: updatedConfig,
      newRegistries: [],
    })
  })

  it("loads project configuration and installs registry items", async () => {
    await addRegistryItems(["@acme/button"], {
      cwd: "/project",
      overwrite: true,
      silent: true,
    })

    expect(mockLoadEnvFiles).toHaveBeenCalledWith("/project")
    expect(mockEnsureRegistriesInConfig).toHaveBeenCalledWith(
      ["@acme/button"],
      projectConfig,
      { silent: true, writeFile: true }
    )
    expect(mockAddComponents).toHaveBeenCalledWith(
      ["@acme/button"],
      updatedConfig,
      expect.objectContaining({ overwrite: true, silent: true })
    )
    expect(mockClearRegistryContext).toHaveBeenCalledOnce()
  })

  it("installs universal items without components.json", async () => {
    const universalConfig = { resolvedPaths: { cwd: "/project" } }
    mockGetConfig.mockResolvedValue(null)
    mockCreateConfig.mockReturnValue(universalConfig)
    mockEnsureRegistriesInConfig.mockResolvedValue({
      config: universalConfig,
      newRegistries: [],
    })
    mockGetRegistryItems.mockResolvedValue([
      {
        name: "agent",
        type: "registry:file",
        files: [
          {
            path: "agent.ts",
            target: "agent/extensions/agent.ts",
            type: "registry:file",
          },
        ],
      },
    ])

    await addRegistryItems(["https://example.com/agent.json"], {
      cwd: "/project",
    })

    expect(mockEnsureRegistriesInConfig).toHaveBeenCalledWith(
      ["https://example.com/agent.json"],
      universalConfig,
      { silent: undefined, writeFile: false }
    )
    expect(mockAddComponents).toHaveBeenCalledWith(
      ["https://example.com/agent.json"],
      universalConfig,
      expect.any(Object)
    )
  })

  it("rejects non-universal items without components.json", async () => {
    const universalConfig = { resolvedPaths: { cwd: "/project" } }
    mockGetConfig.mockResolvedValue(null)
    mockCreateConfig.mockReturnValue(universalConfig)
    mockEnsureRegistriesInConfig.mockResolvedValue({
      config: universalConfig,
      newRegistries: [],
    })
    mockGetRegistryItems.mockResolvedValue([
      { name: "button", type: "registry:ui" },
    ])

    await expect(
      addRegistryItems(["@acme/button"], { cwd: "/project" })
    ).rejects.toThrow("A components.json file is required")

    expect(mockAddComponents).not.toHaveBeenCalled()
    expect(mockClearRegistryContext).toHaveBeenCalledOnce()
  })
})
