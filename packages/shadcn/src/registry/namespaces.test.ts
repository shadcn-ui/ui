import { beforeEach, describe, expect, it, vi } from "vitest"

import { Config } from "../utils/get-config"
import { BUILTIN_REGISTRIES } from "./constants"
import { RegistryNotConfiguredError } from "./errors"
import { resolveRegistryNamespaces } from "./namespaces"
import * as resolver from "./resolver"

// Mock the resolver module.
vi.mock("./resolver", () => ({
  fetchRegistryItems: vi.fn(),
}))

// Test utility function to check namespace configuration.
function checkNamespaceConfiguration(
  namespaces: string[],
  config: Config
): { configured: string[]; missing: string[] } {
  const configured: string[] = []
  const missing: string[] = []

  for (const namespace of namespaces) {
    if (BUILTIN_REGISTRIES[namespace] || config.registries?.[namespace]) {
      configured.push(namespace)
    } else {
      missing.push(namespace)
    }
  }

  return { configured, missing }
}

describe("resolveRegistryNamespaces", () => {
  const mockConfig: Config = {
    style: "default",
    tailwind: {
      config: "tailwind.config.js",
      css: "app/globals.css",
      baseColor: "slate",
      cssVariables: true,
    },
    rsc: true,
    tsx: true,
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
    },
    resolvedPaths: {
      cwd: "/test",
      tailwindConfig: "/test/tailwind.config.js",
      tailwindCss: "/test/app/globals.css",
      utils: "/test/lib/utils",
      components: "/test/components",
      ui: "/test/components/ui",
      lib: "/test/lib",
      hooks: "/test/hooks",
    },
    registries: {
      ...BUILTIN_REGISTRIES,
      "@foo": "https://foo.com/registry/{name}",
      "@bar": "https://bar.com/registry/{name}",
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should discover namespaces from direct components", async () => {
    const mockFetchRegistryItems = vi.mocked(resolver.fetchRegistryItems)
    mockFetchRegistryItems.mockResolvedValue([
      { name: "button", type: "registry:ui", files: [], dependencies: [] },
    ])

    const namespaces = await resolveRegistryNamespaces(
      ["@foo/button", "@bar/card"],
      mockConfig
    )

    expect(namespaces).toEqual(["@foo", "@bar"])
  })

  it("should skip built-in registries", async () => {
    const mockFetchRegistryItems = vi.mocked(resolver.fetchRegistryItems)
    mockFetchRegistryItems.mockResolvedValue([
      { name: "button", type: "registry:ui", files: [], dependencies: [] },
    ])

    const namespaces = await resolveRegistryNamespaces(
      ["@shadcn/button", "@foo/card"],
      mockConfig
    )

    expect(namespaces).toEqual(["@foo"])
  })

  it("should discover namespaces from registry dependencies", async () => {
    const mockFetchRegistryItems = vi.mocked(resolver.fetchRegistryItems)
    mockFetchRegistryItems
      .mockResolvedValueOnce([
        {
          name: "dialog",
          type: "registry:ui",
          files: [],
          dependencies: [],
          registryDependencies: ["@bar/button", "@baz/modal"],
        },
      ])
      .mockResolvedValueOnce([
        { name: "button", type: "registry:ui", files: [], dependencies: [] },
      ])
      .mockResolvedValueOnce([
        { name: "modal", type: "registry:ui", files: [], dependencies: [] },
      ])

    const namespaces = await resolveRegistryNamespaces(
      ["@foo/dialog"],
      mockConfig
    )

    expect(namespaces).toContain("@foo")
    expect(namespaces).toContain("@bar")
    expect(namespaces).toContain("@baz")
  })

  it("should handle circular dependencies", async () => {
    const mockFetchRegistryItems = vi.mocked(resolver.fetchRegistryItems)
    mockFetchRegistryItems
      .mockResolvedValueOnce([
        {
          name: "comp-a",
          type: "registry:ui",
          files: [],
          dependencies: [],
          registryDependencies: ["@bar/comp-b"],
        },
      ])
      .mockResolvedValueOnce([
        {
          name: "comp-b",
          type: "registry:ui",
          files: [],
          dependencies: [],
          registryDependencies: ["@foo/comp-a"],
        },
      ])

    const namespaces = await resolveRegistryNamespaces(
      ["@foo/comp-a"],
      mockConfig
    )

    expect(namespaces).toEqual(["@foo", "@bar"])
    // Should only fetch each component once despite circular reference.
    expect(mockFetchRegistryItems).toHaveBeenCalledTimes(2)
  })

  it("should handle RegistryNotConfiguredError gracefully", async () => {
    const mockFetchRegistryItems = vi.mocked(resolver.fetchRegistryItems)
    mockFetchRegistryItems.mockRejectedValue(
      new RegistryNotConfiguredError("@unknown")
    )

    const namespaces = await resolveRegistryNamespaces(
      ["@unknown/button"],
      mockConfig
    )

    expect(namespaces).toEqual(["@unknown"])
  })

  it("should continue processing on other errors", async () => {
    const mockFetchRegistryItems = vi.mocked(resolver.fetchRegistryItems)
    mockFetchRegistryItems
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce([
        { name: "card", type: "registry:ui", files: [], dependencies: [] },
      ])

    const namespaces = await resolveRegistryNamespaces(
      ["@foo/button", "@bar/card"],
      mockConfig
    )

    // Should still discover both @foo and @bar.
    // @foo from the initial parse, @bar from successful fetch.
    expect(namespaces).toContain("@foo")
    expect(namespaces).toContain("@bar")
    expect(namespaces).toHaveLength(2)
  })

  it("should handle deeply nested dependencies", async () => {
    const mockFetchRegistryItems = vi.mocked(resolver.fetchRegistryItems)
    mockFetchRegistryItems
      .mockResolvedValueOnce([
        {
          name: "level-1",
          type: "registry:ui",
          files: [],
          dependencies: [],
          registryDependencies: ["@level2/component"],
        },
      ])
      .mockResolvedValueOnce([
        {
          name: "component",
          type: "registry:ui",
          files: [],
          dependencies: [],
          registryDependencies: ["@level3/deep"],
        },
      ])
      .mockResolvedValueOnce([
        {
          name: "deep",
          type: "registry:ui",
          files: [],
          dependencies: [],
        },
      ])

    const namespaces = await resolveRegistryNamespaces(
      ["@level1/level-1"],
      mockConfig
    )

    expect(namespaces).toEqual(["@level1", "@level2", "@level3"])
  })

  it("should return unique namespaces", async () => {
    const mockFetchRegistryItems = vi.mocked(resolver.fetchRegistryItems)
    mockFetchRegistryItems
      .mockResolvedValueOnce([
        {
          name: "comp-a",
          type: "registry:ui",
          files: [],
          dependencies: [],
          registryDependencies: ["@foo/shared", "@bar/shared"],
        },
      ])
      .mockResolvedValueOnce([
        { name: "shared", type: "registry:ui", files: [], dependencies: [] },
      ])
      .mockResolvedValueOnce([
        { name: "shared", type: "registry:ui", files: [], dependencies: [] },
      ])

    const namespaces = await resolveRegistryNamespaces(
      ["@foo/comp-a", "@foo/comp-b", "@bar/comp-c"],
      mockConfig
    )

    // Should not have duplicate @foo.
    expect(namespaces).toEqual(["@foo", "@bar"])
  })

  it("should handle components without namespace", async () => {
    const mockFetchRegistryItems = vi.mocked(resolver.fetchRegistryItems)
    mockFetchRegistryItems.mockResolvedValue([
      { name: "button", type: "registry:ui", files: [], dependencies: [] },
    ])

    const namespaces = await resolveRegistryNamespaces(
      ["button", "@foo/card"],
      mockConfig
    )

    expect(namespaces).toEqual(["@foo"])
  })

  it("should handle empty input", async () => {
    const namespaces = await resolveRegistryNamespaces([], mockConfig)

    expect(namespaces).toEqual([])
    expect(resolver.fetchRegistryItems).not.toHaveBeenCalled()
  })

  it("should discover namespaces from components without namespaces but with registryDependencies", async () => {
    const mockFetchRegistryItems = vi.mocked(resolver.fetchRegistryItems)
    mockFetchRegistryItems
      .mockResolvedValueOnce([
        {
          name: "my-component",
          type: "registry:ui",
          files: [],
          dependencies: [],
          registryDependencies: ["@foo/dep1", "@bar/dep2"],
        },
      ])
      .mockResolvedValueOnce([
        {
          name: "dep1",
          type: "registry:ui",
          files: [],
          dependencies: [],
        },
      ])
      .mockResolvedValueOnce([
        {
          name: "dep2",
          type: "registry:ui",
          files: [],
          dependencies: [],
        },
      ])

    const namespaces = await resolveRegistryNamespaces(
      ["button"], // Component without namespace
      mockConfig
    )

    // Should discover namespaces from registryDependencies even though "button" has no namespace.
    expect(namespaces).toEqual(["@foo", "@bar"])
  })

  it("should discover namespaces from URL components with registryDependencies", async () => {
    const mockFetchRegistryItems = vi.mocked(resolver.fetchRegistryItems)
    mockFetchRegistryItems
      .mockResolvedValueOnce([
        {
          name: "to-8bitcn",
          type: "registry:item",
          files: [],
          dependencies: [],
          registryDependencies: ["@8bitcn/button"],
        },
      ])
      .mockResolvedValueOnce([
        {
          name: "branch",
          type: "registry:ui",
          files: [],
          dependencies: [],
        },
      ])
      .mockResolvedValueOnce([
        {
          name: "button",
          type: "registry:ui",
          files: [],
          dependencies: [],
        },
      ])

    const namespaces = await resolveRegistryNamespaces(
      ["https://api.npoint.io/2e006917dca7f7367495", "@ai-elements/branch"],
      mockConfig
    )

    expect(namespaces).toContain("@8bitcn")
    expect(namespaces).toContain("@ai-elements")

    // Verify fetchRegistryItems was called with the correct arguments.
    expect(mockFetchRegistryItems).toHaveBeenCalledWith(
      ["https://api.npoint.io/2e006917dca7f7367495"],
      mockConfig,
      { useCache: true }
    )
    expect(mockFetchRegistryItems).toHaveBeenCalledWith(
      ["@ai-elements/branch"],
      mockConfig,
      { useCache: true }
    )
    expect(mockFetchRegistryItems).toHaveBeenCalledWith(
      ["@8bitcn/button"],
      mockConfig,
      { useCache: true }
    )
  })
})

describe("checkNamespaceConfiguration", () => {
  const mockConfig: Config = {
    style: "default",
    tailwind: {
      config: "tailwind.config.js",
      css: "app/globals.css",
      baseColor: "slate",
      cssVariables: true,
    },
    rsc: true,
    tsx: true,
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
    },
    resolvedPaths: {
      cwd: "/test",
      tailwindConfig: "/test/tailwind.config.js",
      tailwindCss: "/test/app/globals.css",
      utils: "/test/lib/utils",
      components: "/test/components",
      ui: "/test/components/ui",
      lib: "/test/lib",
      hooks: "/test/hooks",
    },
    registries: {
      ...BUILTIN_REGISTRIES,
      "@foo": "https://foo.com/registry/{name}",
      "@bar": "https://bar.com/registry/{name}",
    },
  }

  it("should identify configured namespaces", () => {
    const result = checkNamespaceConfiguration(["@foo", "@bar"], mockConfig)

    expect(result.configured).toEqual(["@foo", "@bar"])
    expect(result.missing).toEqual([])
  })

  it("should identify missing namespaces", () => {
    const result = checkNamespaceConfiguration(
      ["@foo", "@unknown", "@missing"],
      mockConfig
    )

    expect(result.configured).toEqual(["@foo"])
    expect(result.missing).toEqual(["@unknown", "@missing"])
  })

  it("should handle built-in registries as configured", () => {
    const result = checkNamespaceConfiguration(["@shadcn", "@foo"], mockConfig)

    expect(result.configured).toEqual(["@shadcn", "@foo"])
    expect(result.missing).toEqual([])
  })

  it("should handle empty input", () => {
    const result = checkNamespaceConfiguration([], mockConfig)

    expect(result.configured).toEqual([])
    expect(result.missing).toEqual([])
  })

  it("should handle config without registries", () => {
    const configWithoutRegistries: Config = {
      ...mockConfig,
      registries: undefined,
    }

    const result = checkNamespaceConfiguration(
      ["@foo", "@bar"],
      configWithoutRegistries
    )

    expect(result.configured).toEqual([])
    expect(result.missing).toEqual(["@foo", "@bar"])
  })

  it("should handle mixed configured and missing namespaces", () => {
    const result = checkNamespaceConfiguration(
      ["@shadcn", "@foo", "@unknown", "@bar", "@missing"],
      mockConfig
    )

    expect(result.configured).toContain("@shadcn")
    expect(result.configured).toContain("@foo")
    expect(result.configured).toContain("@bar")
    expect(result.missing).toContain("@unknown")
    expect(result.missing).toContain("@missing")
  })
})
