import { describe, expect, it, vi } from "vitest"

import { getRegistry } from "./api"
import { searchRegistries } from "./search"

describe("searchRegistries", () => {
  it("should fetch and return registries in flat format", async () => {
    // Mock getRegistry
    vi.mock("./api", () => ({
      getRegistry: vi.fn(),
    }))

    const mockGetRegistry = vi.mocked(getRegistry)

    mockGetRegistry.mockImplementation(async (name: string) => {
      if (name === "@shadcn" || name === "@shadcn/registry") {
        return {
          name: "shadcn/ui",
          homepage: "https://ui.shadcn.com",
          items: [
            {
              name: "button",
              type: "registry:ui",
              description: "A button component",
            },
            {
              name: "card",
              type: "registry:ui",
              description: "A card component",
            },
          ],
        }
      }
      if (name === "@custom" || name === "@custom/registry") {
        return {
          name: "custom/components",
          homepage: "https://custom.com",
          items: [
            {
              name: "header",
              type: "registry:component",
              description: "A header component",
            },
          ],
        }
      }
      throw new Error(`Unknown registry: ${name}`)
    })

    const results = await searchRegistries(["@shadcn", "@custom"])

    expect(results).toEqual({
      items: [
        {
          name: "button",
          type: "registry:ui",
          description: "A button component",
          registry: "@shadcn",
        },
        {
          name: "card",
          type: "registry:ui",
          description: "A card component",
          registry: "@shadcn",
        },
        {
          name: "header",
          type: "registry:component",
          description: "A header component",
          registry: "@custom",
        },
      ],
      pagination: {
        total: 3,
        offset: 0,
        limit: 3,
        hasMore: false,
      },
    })

    mockGetRegistry.mockRestore()
  })

  it("should apply search filter when query is provided", async () => {
    vi.mock("./api", () => ({
      getRegistry: vi.fn(),
    }))

    const mockGetRegistry = vi.mocked(getRegistry)

    mockGetRegistry.mockImplementation(async (name: string) => {
      if (name === "@shadcn" || name === "@shadcn/registry") {
        return {
          name: "shadcn/ui",
          homepage: "https://ui.shadcn.com",
          items: [
            {
              name: "button",
              type: "registry:ui",
              description: "A button component",
            },
            {
              name: "card",
              type: "registry:ui",
              description: "A card component",
            },
            {
              name: "dialog",
              type: "registry:ui",
              description: "A dialog component",
            },
          ],
        }
      }
      throw new Error(`Unknown registry: ${name}`)
    })

    const results = await searchRegistries(["@shadcn"], { query: "button" })

    expect(results.items).toHaveLength(1)
    expect(results.items[0].name).toBe("button")
    expect(results.items[0].registry).toBe("@shadcn")
    expect(results.pagination).toEqual({
      total: 1,
      offset: 0,
      limit: 1,
      hasMore: false,
    })

    mockGetRegistry.mockRestore()
  })

  it("should fail fast on registry error", async () => {
    vi.mock("./api", () => ({
      getRegistry: vi.fn(),
    }))

    const mockGetRegistry = vi.mocked(getRegistry)

    mockGetRegistry.mockImplementation(async (name: string) => {
      throw new Error(`Registry not found: ${name}`)
    })

    await expect(searchRegistries(["@unknown"])).rejects.toThrow(
      "Registry not found"
    )

    mockGetRegistry.mockRestore()
  })

  it("should return empty items when search has no matches", async () => {
    vi.mock("./api", () => ({
      getRegistry: vi.fn(),
    }))

    const mockGetRegistry = vi.mocked(getRegistry)

    mockGetRegistry.mockImplementation(async () => ({
      name: "test/registry",
      homepage: "https://test.com",
      items: [{ name: "button", type: "registry:ui", description: "A button" }],
    }))

    const results = await searchRegistries(["@test"], { query: "nonexistent" })

    expect(results.items).toHaveLength(0)
    expect(results.pagination).toEqual({
      total: 0,
      offset: 0,
      limit: 0,
      hasMore: false,
    })

    mockGetRegistry.mockRestore()
  })

  it("should handle fuzzy search", async () => {
    vi.mock("./api", () => ({
      getRegistry: vi.fn(),
    }))

    const mockGetRegistry = vi.mocked(getRegistry)

    mockGetRegistry.mockImplementation(async () => ({
      name: "test/registry",
      homepage: "https://test.com",
      items: [
        {
          name: "button",
          type: "registry:ui",
          description: "A button component",
        },
        {
          name: "dialog",
          type: "registry:ui",
          description: "A dialog overlay",
        },
      ],
    }))

    const results = await searchRegistries(["@test"], { query: "butto" })

    expect(results.items).toHaveLength(1)
    expect(results.items[0].name).toBe("button")
    expect(results.pagination).toEqual({
      total: 1,
      offset: 0,
      limit: 1,
      hasMore: false,
    })

    mockGetRegistry.mockRestore()
  })

  it("should search in descriptions", async () => {
    vi.mock("./api", () => ({
      getRegistry: vi.fn(),
    }))

    const mockGetRegistry = vi.mocked(getRegistry)

    mockGetRegistry.mockImplementation(async () => ({
      name: "test/registry",
      homepage: "https://test.com",
      items: [
        {
          name: "button",
          type: "registry:ui",
          description: "A clickable element",
        },
        { name: "dialog", type: "registry:ui", description: "A modal overlay" },
      ],
    }))

    const results = await searchRegistries(["@test"], { query: "modal" })

    expect(results.items).toHaveLength(1)
    expect(results.items[0].name).toBe("dialog")
    expect(results.pagination).toEqual({
      total: 1,
      offset: 0,
      limit: 1,
      hasMore: false,
    })

    mockGetRegistry.mockRestore()
  })

  it("should respect limit option", async () => {
    vi.mock("./api", () => ({
      getRegistry: vi.fn(),
    }))

    const mockGetRegistry = vi.mocked(getRegistry)

    mockGetRegistry.mockImplementation(async () => ({
      name: "test/registry",
      homepage: "https://test.com",
      items: [
        { name: "alert", type: "registry:ui", description: "Alert component" },
        {
          name: "avatar",
          type: "registry:ui",
          description: "Avatar component",
        },
        {
          name: "accordion",
          type: "registry:ui",
          description: "Accordion component",
        },
        {
          name: "aspect-ratio",
          type: "registry:ui",
          description: "Aspect ratio component",
        },
      ],
    }))

    const results = await searchRegistries(["@test"], { query: "a", limit: 2 })

    expect(results.items.length).toBeLessThanOrEqual(2)
    expect(results.pagination.limit).toBe(2)
    expect(results.pagination.offset).toBe(0)

    mockGetRegistry.mockRestore()
  })

  it("should handle offset and limit for pagination", async () => {
    vi.mock("./api", () => ({
      getRegistry: vi.fn(),
    }))

    const mockGetRegistry = vi.mocked(getRegistry)

    mockGetRegistry.mockImplementation(async () => ({
      name: "test/registry",
      homepage: "https://test.com",
      items: [
        { name: "item1", type: "registry:ui", description: "Item 1" },
        { name: "item2", type: "registry:ui", description: "Item 2" },
        { name: "item3", type: "registry:ui", description: "Item 3" },
        { name: "item4", type: "registry:ui", description: "Item 4" },
        { name: "item5", type: "registry:ui", description: "Item 5" },
      ],
    }))

    const results = await searchRegistries(["@test"], { offset: 2, limit: 2 })

    expect(results.items).toHaveLength(2)
    expect(results.items[0].name).toBe("item3")
    expect(results.items[1].name).toBe("item4")
    expect(results.pagination).toEqual({
      total: 5,
      offset: 2,
      limit: 2,
      hasMore: true,
    })

    mockGetRegistry.mockRestore()
  })

  it("should set hasMore to false when no more items", async () => {
    vi.mock("./api", () => ({
      getRegistry: vi.fn(),
    }))

    const mockGetRegistry = vi.mocked(getRegistry)

    mockGetRegistry.mockImplementation(async () => ({
      name: "test/registry",
      homepage: "https://test.com",
      items: [
        { name: "item1", type: "registry:ui", description: "Item 1" },
        { name: "item2", type: "registry:ui", description: "Item 2" },
        { name: "item3", type: "registry:ui", description: "Item 3" },
      ],
    }))

    const results = await searchRegistries(["@test"], { offset: 2, limit: 2 })

    expect(results.items).toHaveLength(1)
    expect(results.items[0].name).toBe("item3")
    expect(results.pagination.hasMore).toBe(false)

    mockGetRegistry.mockRestore()
  })

  it("should handle pagination across multiple registries", async () => {
    vi.mock("./api", () => ({
      getRegistry: vi.fn(),
    }))

    const mockGetRegistry = vi.mocked(getRegistry)

    mockGetRegistry.mockImplementation(async (name: string) => {
      if (name === "@one") {
        return {
          name: "one",
          homepage: "https://one.com",
          items: [
            { name: "item1", type: "registry:ui", description: "Item 1" },
            { name: "item2", type: "registry:ui", description: "Item 2" },
            { name: "item3", type: "registry:ui", description: "Item 3" },
          ],
        }
      }
      if (name === "@two") {
        return {
          name: "two",
          homepage: "https://two.com",
          items: [
            { name: "item4", type: "registry:ui", description: "Item 4" },
            { name: "item5", type: "registry:ui", description: "Item 5" },
          ],
        }
      }
      throw new Error("Unknown registry")
    })

    const results = await searchRegistries(["@one", "@two"], {
      offset: 1,
      limit: 3,
    })

    expect(results.items).toHaveLength(3)
    expect(results.items[0].name).toBe("item2")
    expect(results.items[0].registry).toBe("@one")
    expect(results.items[1].name).toBe("item3")
    expect(results.items[1].registry).toBe("@one")
    expect(results.items[2].name).toBe("item4")
    expect(results.items[2].registry).toBe("@two")
    expect(results.pagination).toEqual({
      total: 5,
      offset: 1,
      limit: 3,
      hasMore: true,
    })

    mockGetRegistry.mockRestore()
  })

  // Tests for URL support
  it("should search registries from direct URLs", async () => {
    const registryUrl1 = "https://example.com/registry1.json"
    const registryUrl2 = "https://example.com/registry2.json"

    // Mock getRegistry to handle URLs
    const mockGetRegistry = vi.mocked(getRegistry)

    mockGetRegistry.mockImplementation(async (nameOrUrl: string) => {
      if (nameOrUrl === registryUrl1) {
        return {
          name: "registry1",
          homepage: "https://example.com/registry1",
          items: [
            {
              name: "component1",
              type: "registry:ui",
              description: "First component",
            },
            {
              name: "component2",
              type: "registry:ui",
              description: "Second component",
            },
          ],
        }
      }
      if (nameOrUrl === registryUrl2) {
        return {
          name: "registry2",
          homepage: "https://example.com/registry2",
          items: [
            {
              name: "component3",
              type: "registry:ui",
              description: "Third component",
            },
          ],
        }
      }
      throw new Error(`Unknown URL: ${nameOrUrl}`)
    })

    const results = await searchRegistries([registryUrl1, registryUrl2])

    expect(results.items).toHaveLength(3)
    expect(results.items[0]).toMatchObject({
      name: "component1",
      registry: registryUrl1,
    })
    expect(results.items[1]).toMatchObject({
      name: "component2",
      registry: registryUrl1,
    })
    expect(results.items[2]).toMatchObject({
      name: "component3",
      registry: registryUrl2,
    })

    mockGetRegistry.mockRestore()
  })

  it("should handle mixed registry names and URLs", async () => {
    const registryName = "@shadcn"
    const registryUrl = "https://custom.com/registry.json"

    const mockGetRegistry = vi.mocked(getRegistry)

    mockGetRegistry.mockImplementation(async (nameOrUrl: string) => {
      if (nameOrUrl === "@shadcn" || nameOrUrl === "@shadcn/registry") {
        return {
          name: "shadcn/ui",
          homepage: "https://ui.shadcn.com",
          items: [
            {
              name: "button",
              type: "registry:ui",
              description: "A button component",
            },
          ],
        }
      }
      if (nameOrUrl === registryUrl) {
        return {
          name: "custom",
          homepage: "https://custom.com",
          items: [
            {
              name: "custom-component",
              type: "registry:ui",
              description: "A custom component",
            },
          ],
        }
      }
      throw new Error(`Unknown registry: ${nameOrUrl}`)
    })

    const results = await searchRegistries([registryName, registryUrl], {
      query: "button",
    })

    // Should find the button from @shadcn
    expect(results.items).toHaveLength(1)
    expect(results.items[0]).toMatchObject({
      name: "button",
      registry: registryName,
    })

    mockGetRegistry.mockRestore()
  })

  it("should handle URL fetch errors gracefully", async () => {
    const badUrl = "https://nonexistent.com/registry.json"

    const mockGetRegistry = vi.mocked(getRegistry)

    mockGetRegistry.mockImplementation(async (nameOrUrl: string) => {
      if (nameOrUrl === badUrl) {
        throw new Error("Failed to fetch registry")
      }
      throw new Error(`Unknown registry: ${nameOrUrl}`)
    })

    await expect(searchRegistries([badUrl])).rejects.toThrow(
      "Failed to fetch registry"
    )

    mockGetRegistry.mockRestore()
  })
})
