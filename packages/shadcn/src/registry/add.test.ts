import { beforeEach, describe, expect, it, vi } from "vitest"

import { addRegistryItems } from "./add"
import { ConfigParseError } from "./errors"

const {
  mockAddComponents,
  mockConfigWithDefaults,
  mockLoadEnvFiles,
  mockResolveRegistryTree,
  mockWithRegistryContext,
} = vi.hoisted(() => ({
  mockAddComponents: vi.fn(),
  mockConfigWithDefaults: vi.fn(),
  mockLoadEnvFiles: vi.fn(),
  mockResolveRegistryTree: vi.fn(),
  mockWithRegistryContext: vi.fn(),
}))

vi.mock("@/src/registry/config", () => ({
  configWithDefaults: mockConfigWithDefaults,
}))

vi.mock("@/src/registry/resolver", () => ({
  resolveRegistryTree: mockResolveRegistryTree,
}))

vi.mock("@/src/registry/context", () => ({
  withRegistryContext: mockWithRegistryContext,
}))

vi.mock("@/src/utils/add-components", () => ({
  addComponents: mockAddComponents,
}))

vi.mock("@/src/utils/env-loader", () => ({
  loadEnvFiles: mockLoadEnvFiles,
}))

describe("addRegistryItems", () => {
  const projectConfig = {
    style: "new-york",
    rsc: false,
    tsx: true,
    tailwind: {
      config: "tailwind.config.ts",
      css: "app/globals.css",
      baseColor: "neutral",
      cssVariables: true,
    },
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
    },
    registries: {
      "@acme": "https://acme.com/{name}.json",
    },
    resolvedPaths: {
      cwd: "/project",
      tailwindConfig: "/project/tailwind.config.ts",
      tailwindCss: "/project/app/globals.css",
      utils: "/project/lib/utils",
      components: "/project/components",
      ui: "/project/components/ui",
      lib: "/project/lib",
      hooks: "/project/hooks",
    },
  }
  const projectEnv = { REGISTRY_TOKEN: "project-token" }

  beforeEach(() => {
    vi.clearAllMocks()
    mockLoadEnvFiles.mockResolvedValue(projectEnv)
    mockWithRegistryContext.mockImplementation((callback) => callback())
    mockConfigWithDefaults.mockImplementation((config) => config)
    mockResolveRegistryTree.mockResolvedValue({ files: [] })
  })

  it("uses a full project config to install registry items", async () => {
    const resolvedTree = { files: [] }
    mockResolveRegistryTree.mockResolvedValueOnce(resolvedTree)

    await addRegistryItems(["@acme/button"], {
      cwd: "/project",
      config: projectConfig,
      overwrite: true,
      silent: true,
      skipFonts: true,
      path: "src/components",
    })

    expect(mockLoadEnvFiles).toHaveBeenCalledWith("/project", {
      processEnv: expect.any(Object),
    })
    expect(mockLoadEnvFiles.mock.calls[0][1].processEnv).not.toBe(process.env)
    expect(mockWithRegistryContext).toHaveBeenCalledWith(expect.any(Function), {
      env: projectEnv,
    })
    expect(mockConfigWithDefaults).toHaveBeenCalledWith(projectConfig)
    expect(mockResolveRegistryTree).toHaveBeenCalledWith(
      ["@acme/button"],
      projectConfig,
      { requireUniversal: false, useCache: true }
    )
    expect(mockAddComponents).toHaveBeenCalledWith(
      ["@acme/button"],
      projectConfig,
      {
        overwrite: true,
        silent: true,
        skipFonts: true,
        path: "src/components",
        interactive: false,
        overwriteCssVars: undefined,
        resolvedTree,
      }
    )
  })

  it("uses a registries-only config for universal items", async () => {
    const inputConfig = {
      registries: {
        "@acme": "https://acme.com/{name}.json",
      },
    }
    const universalConfig = {
      ...projectConfig,
      resolvedPaths: {
        ...projectConfig.resolvedPaths,
        cwd: "/project",
      },
      registries: inputConfig.registries,
    }
    const resolvedTree = {
      files: [
        {
          path: "agent.ts",
          target: "agent/extensions/agent.ts",
          type: "registry:file",
        },
      ],
    }
    mockConfigWithDefaults.mockReturnValueOnce(universalConfig)
    mockResolveRegistryTree.mockResolvedValueOnce(resolvedTree)

    await addRegistryItems(["@acme/agent"], {
      cwd: "/project",
      config: inputConfig,
    })

    expect(mockConfigWithDefaults).toHaveBeenCalledWith({
      registries: inputConfig.registries,
      resolvedPaths: { cwd: "/project" },
    })
    expect(mockResolveRegistryTree).toHaveBeenCalledWith(
      ["@acme/agent"],
      universalConfig,
      { requireUniversal: true, useCache: true }
    )
    expect(mockAddComponents).toHaveBeenCalledWith(
      ["@acme/agent"],
      universalConfig,
      {
        interactive: false,
        overwriteCssVars: false,
        resolvedTree,
      }
    )
  })

  it("uses default config for universal URL items", async () => {
    const universalConfig = {
      ...projectConfig,
      resolvedPaths: {
        ...projectConfig.resolvedPaths,
        cwd: "/project",
      },
    }
    const resolvedTree = {
      files: [
        {
          path: "agent.ts",
          target: "agent/extensions/agent.ts",
          type: "registry:file",
        },
      ],
    }
    mockConfigWithDefaults.mockReturnValueOnce(universalConfig)
    mockResolveRegistryTree.mockResolvedValueOnce(resolvedTree)

    await addRegistryItems(["https://example.com/agent.json"], {
      cwd: "/project",
    })

    expect(mockConfigWithDefaults).toHaveBeenCalledWith({
      resolvedPaths: { cwd: "/project" },
    })
    expect(mockResolveRegistryTree).toHaveBeenCalledWith(
      ["https://example.com/agent.json"],
      universalConfig,
      { requireUniversal: true, useCache: true }
    )
    expect(mockAddComponents).toHaveBeenCalledWith(
      ["https://example.com/agent.json"],
      universalConfig,
      {
        interactive: false,
        overwriteCssVars: false,
        resolvedTree,
      }
    )
  })

  it("uses the config cwd when cwd is omitted", async () => {
    await addRegistryItems(["@acme/button"], {
      config: projectConfig,
    })

    expect(mockLoadEnvFiles).toHaveBeenCalledWith("/project", {
      processEnv: expect.any(Object),
    })
  })

  it("defaults cwd to process.cwd()", async () => {
    const cwd = "/default/project"
    const cwdSpy = vi.spyOn(process, "cwd").mockReturnValue(cwd)

    try {
      await addRegistryItems(["https://example.com/agent.json"])
    } finally {
      cwdSpy.mockRestore()
    }

    expect(mockLoadEnvFiles).toHaveBeenCalledWith(cwd, {
      processEnv: expect.any(Object),
    })
    expect(mockConfigWithDefaults).toHaveBeenCalledWith({
      resolvedPaths: { cwd },
    })
  })

  it("rejects a cwd that conflicts with a full project config", async () => {
    await expect(
      addRegistryItems(["@acme/button"], {
        cwd: "/other-project",
        config: projectConfig,
      })
    ).rejects.toThrow("The provided cwd must match config.resolvedPaths.cwd.")

    expect(mockLoadEnvFiles).not.toHaveBeenCalled()
    expect(mockResolveRegistryTree).not.toHaveBeenCalled()
    expect(mockAddComponents).not.toHaveBeenCalled()
  })

  it("rejects empty cwd values that conflict with a full project config", async () => {
    await expect(
      addRegistryItems(["@acme/button"], {
        cwd: "",
        config: projectConfig,
      })
    ).rejects.toThrow("The provided cwd must match config.resolvedPaths.cwd.")

    await expect(
      addRegistryItems(["@acme/button"], {
        cwd: "/project",
        config: {
          ...projectConfig,
          resolvedPaths: {
            ...projectConfig.resolvedPaths,
            cwd: "",
          },
        },
      })
    ).rejects.toThrow("The provided cwd must match config.resolvedPaths.cwd.")

    expect(mockLoadEnvFiles).not.toHaveBeenCalled()
    expect(mockResolveRegistryTree).not.toHaveBeenCalled()
    expect(mockAddComponents).not.toHaveBeenCalled()
  })

  it("reports partial configs with resolvedPaths as invalid", async () => {
    await expect(
      addRegistryItems(["@acme/agent"], {
        cwd: "/other-project",
        config: {
          registries: projectConfig.registries,
          resolvedPaths: projectConfig.resolvedPaths,
        },
      })
    ).rejects.toBeInstanceOf(ConfigParseError)

    expect(mockLoadEnvFiles).not.toHaveBeenCalled()
    expect(mockResolveRegistryTree).not.toHaveBeenCalled()
    expect(mockAddComponents).not.toHaveBeenCalled()
  })

  it("reports invalid attempted full configs", async () => {
    const invalidConfig = {
      ...projectConfig,
      unexpected: true,
    }

    await expect(
      addRegistryItems(["@acme/button"], {
        cwd: "/project",
        config: invalidConfig,
      })
    ).rejects.toBeInstanceOf(ConfigParseError)

    expect(mockConfigWithDefaults).not.toHaveBeenCalled()
    expect(mockLoadEnvFiles).not.toHaveBeenCalled()
    expect(mockResolveRegistryTree).not.toHaveBeenCalled()
    expect(mockAddComponents).not.toHaveBeenCalled()
  })

  it("reports missing fields in attempted full configs", async () => {
    const invalidConfig = {
      ...projectConfig,
      tailwind: {
        config: "tailwind.config.ts",
        css: "app/globals.css",
        cssVariables: true,
      },
    }

    await expect(
      addRegistryItems(["@acme/button"], {
        cwd: "/project",
        config: invalidConfig as never,
      })
    ).rejects.toThrow("tailwind.baseColor")
  })

  it("reports invalid resolvedPaths cwd values", async () => {
    const invalidConfig = {
      ...projectConfig,
      resolvedPaths: {
        ...projectConfig.resolvedPaths,
        cwd: 42,
      },
    }

    await expect(
      addRegistryItems(["@acme/button"], {
        config: invalidConfig as never,
      })
    ).rejects.toBeInstanceOf(ConfigParseError)

    expect(mockLoadEnvFiles).not.toHaveBeenCalled()
    expect(mockResolveRegistryTree).not.toHaveBeenCalled()
    expect(mockAddComponents).not.toHaveBeenCalled()
  })

  it("rejects non-universal items without a full project config", async () => {
    const universalConfig = {
      ...projectConfig,
      resolvedPaths: {
        ...projectConfig.resolvedPaths,
        cwd: "/project",
      },
    }
    mockConfigWithDefaults.mockReturnValueOnce(universalConfig)
    mockResolveRegistryTree.mockRejectedValueOnce(
      new Error(
        "A full project config is required to add non-universal registry items or dependencies."
      )
    )

    await expect(
      addRegistryItems(["@acme/button"], {
        cwd: "/project",
        config: {
          registries: projectConfig.registries,
        },
      })
    ).rejects.toThrow("A full project config is required")

    expect(mockAddComponents).not.toHaveBeenCalled()
  })

  it("rejects unresolved target aliases without a full project config", async () => {
    const universalConfig = {
      ...projectConfig,
      resolvedPaths: {
        ...projectConfig.resolvedPaths,
        cwd: "/project",
        ui: "",
      },
    }
    mockConfigWithDefaults.mockReturnValueOnce(universalConfig)
    mockResolveRegistryTree.mockResolvedValueOnce({
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
    ).rejects.toThrow(
      "A full project config is required to resolve target aliases."
    )

    expect(mockAddComponents).not.toHaveBeenCalled()
  })

  it("reports unresolved registry items without a full project config", async () => {
    const universalConfig = {
      ...projectConfig,
      resolvedPaths: {
        ...projectConfig.resolvedPaths,
        cwd: "/project",
      },
    }
    mockConfigWithDefaults.mockReturnValueOnce(universalConfig)
    mockResolveRegistryTree.mockResolvedValueOnce(null)

    await expect(
      addRegistryItems(["https://example.com/missing.json"], {
        cwd: "/project",
      })
    ).rejects.toThrow("Failed to fetch components from registry.")

    expect(mockAddComponents).not.toHaveBeenCalled()
  })

  it("propagates installation errors", async () => {
    mockAddComponents.mockRejectedValueOnce(new Error("Installation failed."))

    await expect(
      addRegistryItems(["@acme/button"], {
        cwd: "/project",
        config: projectConfig,
      })
    ).rejects.toThrow("Installation failed.")
  })

  it("does nothing when no items are provided", async () => {
    await addRegistryItems([], {
      cwd: "/project",
      config: projectConfig,
    })

    expect(mockLoadEnvFiles).not.toHaveBeenCalled()
    expect(mockAddComponents).not.toHaveBeenCalled()
  })
})
