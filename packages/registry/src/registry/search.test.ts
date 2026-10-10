import { describe, expect, it, vi } from "vitest"

import { getRegistry } from "./api"
import {
  buildRegistryItemNameFromRegistry,
  findUnknownSearchTypes,
  formatSearchResultDescription,
  formatSearchResultType,
  printSearchResults,
  resolveSearchRegistries,
  SEARCH_CONCURRENCY,
  SEARCH_RESULT_DESCRIPTION_MAX_LENGTH,
  SEARCHABLE_TYPES,
  searchRegistries,
} from "./search"

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
              title: "Button",
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
          title: "Button",
          type: "registry:ui",
          description: "A button component",
          registry: "@shadcn",
          addCommandArgument: "@shadcn/button",
        },
        {
          name: "card",
          type: "registry:ui",
          description: "A card component",
          registry: "@shadcn",
          addCommandArgument: "@shadcn/card",
        },
        {
          name: "header",
          type: "registry:component",
          description: "A header component",
          registry: "@custom",
          addCommandArgument: "@custom/header",
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

  it("includes titles in the SDK output and searches them", async () => {
    vi.mock("./api", () => ({
      getRegistry: vi.fn(),
    }))

    const mockGetRegistry = vi.mocked(getRegistry)

    mockGetRegistry.mockResolvedValue({
      name: "test/registry",
      homepage: "https://test.com",
      items: [
        {
          name: "account-menu",
          title: "User Settings",
          type: "registry:ui",
          description: "An account menu",
        },
        {
          name: "button",
          type: "registry:ui",
          description: "A button component",
        },
      ],
    })

    const results = await searchRegistries(["@test"], { query: "settings" })

    expect(results.items).toEqual([
      {
        name: "account-menu",
        title: "User Settings",
        type: "registry:ui",
        description: "An account menu",
        registry: "@test",
        addCommandArgument: "@test/account-menu",
      },
    ])

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
    expect(results.items[0].addCommandArgument).toBe("@shadcn/button")
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

  it("collects errors and continues when continueOnError is set", async () => {
    vi.mock("./api", () => ({
      getRegistry: vi.fn(),
    }))

    const mockGetRegistry = vi.mocked(getRegistry)

    mockGetRegistry.mockImplementation(async (name: string) => {
      if (name === "@ok") {
        return {
          name: "ok/registry",
          homepage: "https://ok.com",
          items: [
            { name: "button", type: "registry:ui", description: "A button" },
          ],
        }
      }
      throw new Error(`Registry not found: ${name}`)
    })

    const results = await searchRegistries(["@ok", "@broken"], {
      continueOnError: true,
    })

    // Items from the working registry are still returned.
    expect(results.items).toHaveLength(1)
    expect(results.items[0].name).toBe("button")

    // The failing registry is recorded in errors instead of throwing.
    expect(results.errors).toEqual([
      {
        registry: "@broken",
        message: "Registry not found: @broken",
      },
    ])

    mockGetRegistry.mockRestore()
  })

  it("preserves argument order even when responses resolve out of order", async () => {
    vi.mock("./api", () => ({
      getRegistry: vi.fn(),
    }))

    const mockGetRegistry = vi.mocked(getRegistry)

    // @slow resolves after @fast, but its items must still come first because
    // it is listed first. Guards the parallel fetch / ordered processing.
    mockGetRegistry.mockImplementation(async (name: string) => {
      if (name === "@slow") {
        await new Promise((resolve) => setTimeout(resolve, 20))
        return {
          name: "slow",
          homepage: "https://slow.com",
          items: [{ name: "slow-item", type: "registry:ui", description: "" }],
        }
      }
      if (name === "@fast") {
        return {
          name: "fast",
          homepage: "https://fast.com",
          items: [{ name: "fast-item", type: "registry:ui", description: "" }],
        }
      }
      throw new Error(`Unknown registry: ${name}`)
    })

    const results = await searchRegistries(["@slow", "@fast"])

    expect(results.items.map((item) => item.name)).toEqual([
      "slow-item",
      "fast-item",
    ])

    mockGetRegistry.mockRestore()
  })

  it("caps how many registries are fetched concurrently", async () => {
    vi.mock("./api", () => ({
      getRegistry: vi.fn(),
    }))

    const mockGetRegistry = vi.mocked(getRegistry)

    let active = 0
    let maxActive = 0
    mockGetRegistry.mockImplementation(async (name: string) => {
      active++
      maxActive = Math.max(maxActive, active)
      await new Promise((resolve) => setTimeout(resolve, 10))
      active--
      return {
        name,
        homepage: "https://test.com",
        items: [{ name: `${name}-item`, type: "registry:ui", description: "" }],
      }
    })

    const registries = Array.from({ length: 20 }, (_, i) => `@r${i}`)
    const results = await searchRegistries(registries)

    // All registries are still fetched...
    expect(results.items).toHaveLength(20)
    // ...but never more than the concurrency cap at once.
    expect(maxActive).toBeLessThanOrEqual(SEARCH_CONCURRENCY)

    mockGetRegistry.mockRestore()
  })

  it("filters by type (shorthand and full namespace, multiple)", async () => {
    vi.mock("./api", () => ({
      getRegistry: vi.fn(),
    }))

    const mockGetRegistry = vi.mocked(getRegistry)

    mockGetRegistry.mockImplementation(async () => ({
      name: "test/registry",
      homepage: "https://test.com",
      items: [
        { name: "button", type: "registry:ui", description: "" },
        { name: "dashboard", type: "registry:block", description: "" },
        { name: "use-foo", type: "registry:hook", description: "" },
      ],
    }))

    // Shorthand, multiple types.
    const multiple = await searchRegistries(["@test"], {
      types: ["ui", "hook"],
    })
    expect(multiple.items.map((item) => item.name)).toEqual([
      "button",
      "use-foo",
    ])

    // Full namespaced form is accepted too.
    const full = await searchRegistries(["@test"], {
      types: ["registry:block"],
    })
    expect(full.items.map((item) => item.name)).toEqual(["dashboard"])

    mockGetRegistry.mockRestore()
  })

  it("combines a type filter with a query", async () => {
    vi.mock("./api", () => ({
      getRegistry: vi.fn(),
    }))

    const mockGetRegistry = vi.mocked(getRegistry)

    mockGetRegistry.mockImplementation(async () => ({
      name: "test/registry",
      homepage: "https://test.com",
      items: [
        { name: "button", type: "registry:ui", description: "A button" },
        { name: "button-group", type: "registry:block", description: "" },
      ],
    }))

    const results = await searchRegistries(["@test"], {
      query: "button",
      types: ["ui"],
    })

    // Both match the query, but only the ui item survives the type filter.
    expect(results.items.map((item) => item.name)).toEqual(["button"])

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

describe("buildRegistryItemNameFromRegistry", () => {
  const testCases = [
    // Namespace registries
    {
      name: "namespace registry",
      itemName: "button",
      registry: "@shadcn",
      expected: "@shadcn/button",
    },
    {
      name: "namespace registry with org",
      itemName: "card",
      registry: "@myorg",
      expected: "@myorg/card",
    },

    // URL with registry in path
    {
      name: "URL with registry.json",
      itemName: "button",
      registry: "http://example.com/r/registry.json",
      expected: "http://example.com/r/button.json",
    },
    {
      name: "URL with multiple registry in path - replaces last",
      itemName: "button",
      registry: "http://example.com/registry/foo/registry",
      expected: "http://example.com/registry/foo/button",
    },
    {
      name: "URL with registry in nested path",
      itemName: "dialog",
      registry: "http://example.com/components/registry/index.json",
      expected: "http://example.com/components/dialog/index.json",
    },

    // URL with registry in query params
    {
      name: "URL with registry in query param",
      itemName: "modal",
      registry: "http://registry.foo.com?item=registry",
      expected: "http://registry.foo.com?item=modal",
    },
    {
      name: "URL with registry in query param (multiple params)",
      itemName: "tabs",
      registry: "http://api.example.com/fetch?name=registry&type=component",
      expected: "http://api.example.com/fetch?name=tabs&type=component",
    },
    {
      name: "URL with registry in both path and query",
      itemName: "button",
      registry: "http://example.com/registry?name=registry",
      expected: "http://example.com/button?name=button",
    },

    // Edge cases - should NOT replace in domain/subdomain
    {
      name: "URL with registry in subdomain - should NOT replace",
      itemName: "button",
      registry: "http://registry.example.com/api",
      expected: "http://registry.example.com/api",
    },
    {
      name: "URL with registry in domain - should NOT replace",
      itemName: "button",
      registry: "http://myregistry.com/api",
      expected: "http://myregistry.com/api",
    },

    // URLs without registry
    {
      name: "URL without registry word",
      itemName: "button",
      registry: "http://example.com/components/all",
      expected: "http://example.com/components/all",
    },
    {
      name: "URL with only query params, no registry",
      itemName: "button",
      registry: "http://example.com?type=ui",
      expected: "http://example.com?type=ui",
    },

    // HTTPS and ports
    {
      name: "HTTPS URL with registry",
      itemName: "sidebar",
      registry: "https://secure.example.com/components/registry",
      expected: "https://secure.example.com/components/sidebar",
    },
    {
      name: "URL with port and registry",
      itemName: "header",
      registry: "http://localhost:3000/api/registry",
      expected: "http://localhost:3000/api/header",
    },

    // Complex cases
    {
      name: "URL with hash and registry",
      itemName: "footer",
      registry: "http://example.com/registry#latest",
      expected: "http://example.com/footer#latest",
    },
    {
      name: "URL with encoded characters",
      itemName: "button",
      registry: "http://example.com/registry%20component",
      expected: "http://example.com/button%20component",
    },
  ]

  it.each(testCases)("$name", ({ itemName, registry, expected }) => {
    const result = buildRegistryItemNameFromRegistry(itemName, registry)
    expect(result).toBe(expected)
  })
})

describe("formatSearchResultType", () => {
  it("strips the registry prefix", () => {
    expect(formatSearchResultType("registry:ui")).toBe("ui")
    expect(formatSearchResultType("registry:block")).toBe("block")
  })

  it("returns other types unchanged", () => {
    expect(formatSearchResultType("custom:type")).toBe("custom:type")
    expect(formatSearchResultType(undefined)).toBe("")
  })
})

describe("formatSearchResultDescription", () => {
  it("returns short descriptions unchanged", () => {
    expect(formatSearchResultDescription("A simple login form.")).toBe(
      "A simple login form."
    )
  })

  it("truncates long descriptions with an ellipsis", () => {
    const description =
      "A dashboard with sidebar, charts, data table, filters, and many other widgets for managing your application."

    const formatted = formatSearchResultDescription(description)

    expect(formatted.length).toBeLessThanOrEqual(
      SEARCH_RESULT_DESCRIPTION_MAX_LENGTH
    )
    expect(formatted.endsWith("...")).toBe(true)
    expect(formatted).not.toBe(description)
  })
})

describe("printSearchResults", () => {
  it("prints type and description inline", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {})

    printSearchResults(
      {
        pagination: {
          total: 2,
          offset: 0,
          limit: 100,
          hasMore: false,
        },
        items: [
          {
            name: "button",
            type: "registry:ui",
            description: "A button component",
            registry: "@shadcn",
            addCommandArgument: "@shadcn/button",
          },
          {
            name: "card",
            type: "registry:ui",
            registry: "@shadcn",
            addCommandArgument: "@shadcn/card",
          },
        ],
      },
      {
        query: "button",
        registries: ["@shadcn"],
      }
    )

    expect(log).toHaveBeenCalledWith(
      expect.stringContaining('Found 2 items matching "button" in @shadcn')
    )
    expect(log).toHaveBeenCalledWith(
      expect.stringContaining("Showing 1-2 of 2")
    )
    expect(log).toHaveBeenCalledWith(
      expect.stringMatching(
        /- @shadcn\/button \(ui\) — A button component\n- @shadcn\/card \(ui\)$/
      )
    )

    log.mockRestore()
  })

  it("includes the type filter in the header (normalized for display)", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {})

    printSearchResults(
      {
        pagination: { total: 1, offset: 0, limit: 100, hasMore: false },
        items: [
          {
            name: "button",
            type: "registry:ui",
            registry: "@shadcn",
            addCommandArgument: "@shadcn/button",
          },
        ],
      },
      {
        // Full namespaced form on input is shown as the shorthand.
        types: ["registry:ui"],
        registries: ["@shadcn"],
      }
    )

    expect(log).toHaveBeenCalledWith(
      expect.stringContaining("Found 1 item of type ui in @shadcn")
    )

    log.mockRestore()
  })

  it("prints registry when searching multiple registries", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {})

    printSearchResults(
      {
        pagination: {
          total: 1,
          offset: 0,
          limit: 100,
          hasMore: false,
        },
        items: [
          {
            name: "header",
            type: "registry:component",
            description: "A header component",
            registry: "@custom",
            addCommandArgument: "@custom/header",
          },
        ],
      },
      {
        registries: ["@shadcn", "@custom"],
      }
    )

    expect(log).toHaveBeenCalledWith(
      expect.stringMatching(
        /- @custom\/header \(component\) · @custom — A header component/
      )
    )

    log.mockRestore()
  })

  it("prints a warning for each skipped registry", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {})

    printSearchResults(
      {
        pagination: {
          total: 1,
          offset: 0,
          limit: 100,
          hasMore: false,
        },
        items: [
          {
            name: "button",
            type: "registry:ui",
            registry: "@ok",
            addCommandArgument: "@ok/button",
          },
        ],
        errors: [{ registry: "@broken", message: "Not found" }],
      },
      {
        registries: ["@ok", "@broken"],
      }
    )

    expect(log).toHaveBeenCalledWith(
      expect.stringContaining("Skipped @broken: Not found")
    )

    log.mockRestore()
  })

  it("prints a warning when no items are found", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {})

    printSearchResults(
      {
        pagination: {
          total: 0,
          offset: 0,
          limit: 100,
          hasMore: false,
        },
        items: [],
      },
      {
        query: "missing",
        registries: ["@shadcn"],
      }
    )

    expect(log).toHaveBeenCalledWith(
      expect.stringContaining('No items found matching "missing" in @shadcn')
    )

    log.mockRestore()
  })
})

describe("resolveSearchRegistries", () => {
  it("returns explicitly provided registries unchanged", () => {
    expect(
      resolveSearchRegistries(["@one", "@two"], {
        registries: { "@shadcn": "x/{name}.json", "@one": "y/{name}.json" },
      })
    ).toEqual(["@one", "@two"])
  })

  it("returns all configured registries (excluding builtins) when none given", () => {
    expect(
      resolveSearchRegistries([], {
        registries: {
          "@shadcn": "x/{name}.json",
          "@one": "y/{name}.json",
          "@two": "z/{name}.json",
        },
      })
    ).toEqual(["@one", "@two"])
  })

  it("returns empty when none given and nothing is configured", () => {
    expect(resolveSearchRegistries([], { registries: {} })).toEqual([])
    expect(resolveSearchRegistries([], undefined)).toEqual([])
  })
})

describe("findUnknownSearchTypes", () => {
  it("accepts known types in shorthand and full form", () => {
    expect(findUnknownSearchTypes(["ui", "registry:block", "HOOK"])).toEqual([])
  })

  it("returns the unknown types", () => {
    expect(findUnknownSearchTypes(["ui", "bogus", "blok"])).toEqual([
      "bogus",
      "blok",
    ])
  })

  it("does not offer internal-only types", () => {
    expect(SEARCHABLE_TYPES).not.toContain("example")
    expect(SEARCHABLE_TYPES).not.toContain("internal")
    expect(findUnknownSearchTypes(["internal"])).toEqual(["internal"])
  })
})

describe("searchRegistries with dynamic registries", () => {
  it("forwards search params to the registry", async () => {
    const mockGetRegistry = vi.mocked(getRegistry)

    mockGetRegistry.mockResolvedValue({
      name: "acme",
      homepage: "https://acme.com",
      items: [],
    })

    await searchRegistries(["@acme"], {
      query: "button",
      types: ["ui", "registry:block"],
      limit: 20,
      offset: 40,
    })

    expect(mockGetRegistry).toHaveBeenCalledWith(
      "@acme",
      expect.objectContaining({
        searchParams: {
          query: "button",
          types: ["registry:ui", "registry:block"],
          limit: 20,
          offset: 40,
        },
      })
    )

    mockGetRegistry.mockRestore()
  })

  it("pushes down filters but not offset when searching multiple registries", async () => {
    const mockGetRegistry = vi.mocked(getRegistry)

    mockGetRegistry.mockResolvedValue({
      name: "acme",
      homepage: "https://acme.com",
      items: [],
    })

    await searchRegistries(["@one", "@two"], {
      query: "button",
      limit: 10,
      offset: 20,
    })

    // Each registry is over-fetched (offset + limit) so the requested page
    // can be filled after the merge.
    for (const registry of ["@one", "@two"]) {
      expect(mockGetRegistry).toHaveBeenCalledWith(
        registry,
        expect.objectContaining({
          searchParams: {
            query: "button",
            types: undefined,
            limit: 30,
            offset: undefined,
          },
        })
      )
    }

    mockGetRegistry.mockRestore()
  })

  it("trusts server results when a single dynamic registry is searched", async () => {
    const mockGetRegistry = vi.mocked(getRegistry)

    // The server returns items that would not match a local fuzzy search to
    // prove no local filtering is applied on top.
    mockGetRegistry.mockResolvedValue({
      name: "acme",
      homepage: "https://acme.com",
      items: [
        {
          name: "unrelated-item",
          type: "registry:ui",
          description: "Does not mention the query.",
        },
      ],
      pagination: {
        total: 500,
        offset: 10,
        limit: 1,
        hasMore: true,
      },
    })

    const results = await searchRegistries(["@acme"], {
      query: "button",
      limit: 1,
      offset: 10,
    })

    expect(results).toEqual({
      items: [
        {
          name: "unrelated-item",
          type: "registry:ui",
          description: "Does not mention the query.",
          registry: "@acme",
          addCommandArgument: "@acme/unrelated-item",
        },
      ],
      pagination: {
        total: 500,
        offset: 10,
        limit: 1,
        hasMore: true,
      },
    })

    mockGetRegistry.mockRestore()
  })

  it("merges dynamic and static registries", async () => {
    const mockGetRegistry = vi.mocked(getRegistry)

    mockGetRegistry.mockImplementation(async (name: string) => {
      if (name === "@dynamic") {
        return {
          name: "dynamic",
          homepage: "https://dynamic.com",
          items: [
            {
              name: "button",
              type: "registry:ui",
              description: "A server-filtered button.",
            },
          ],
          pagination: {
            total: 42,
            offset: 0,
            limit: 1,
            hasMore: true,
          },
        }
      }
      if (name === "@static") {
        return {
          name: "static",
          homepage: "https://static.com",
          items: [
            {
              name: "button-group",
              type: "registry:ui",
              description: "A button group.",
            },
            {
              name: "card",
              type: "registry:ui",
              description: "A card component.",
            },
          ],
        }
      }
      throw new Error(`Unknown registry: ${name}`)
    })

    const results = await searchRegistries(["@dynamic", "@static"], {
      query: "button",
    })

    // Server-filtered items are kept as-is. Static items still go through
    // the local fuzzy filter, which drops "card".
    expect(results.items).toEqual([
      {
        name: "button",
        type: "registry:ui",
        description: "A server-filtered button.",
        registry: "@dynamic",
        addCommandArgument: "@dynamic/button",
      },
      {
        name: "button-group",
        type: "registry:ui",
        description: "A button group.",
        registry: "@static",
        addCommandArgument: "@static/button-group",
      },
    ])

    // The dynamic registry's total includes matches beyond the returned
    // items. No limit was requested, so the identical request would be sent
    // again for a deeper page — the tail is unreachable and hasMore is false.
    expect(results.pagination.total).toBe(43)
    expect(results.pagination.hasMore).toBe(false)

    mockGetRegistry.mockRestore()
  })

  it("reports more pages when a dynamic registry fills the requested limit", async () => {
    const mockGetRegistry = vi.mocked(getRegistry)

    mockGetRegistry.mockImplementation(async (name: string) => {
      if (name === "@dynamic") {
        return {
          name: "dynamic",
          homepage: "https://dynamic.com",
          items: [
            { name: "button", type: "registry:ui" },
            { name: "button-group", type: "registry:ui" },
          ],
          pagination: {
            total: 42,
            offset: 0,
            limit: 2,
            hasMore: true,
          },
        }
      }
      return {
        name: "static",
        homepage: "https://static.com",
        items: [],
      }
    })

    const results = await searchRegistries(["@dynamic", "@static"], {
      query: "button",
      limit: 2,
    })

    // The registry filled the requested limit, so deeper pages re-request it
    // with a larger limit and can surface the remaining matches.
    expect(results.items).toHaveLength(2)
    expect(results.pagination.total).toBe(42)
    expect(results.pagination.hasMore).toBe(true)

    mockGetRegistry.mockRestore()
  })

  it("does not report more pages when a dynamic registry caps its response", async () => {
    const mockGetRegistry = vi.mocked(getRegistry)

    // The registry claims 500 matches but caps every response at one item,
    // regardless of the requested limit.
    mockGetRegistry.mockResolvedValue({
      name: "capped",
      homepage: "https://capped.com",
      items: [{ name: "item-0", type: "registry:ui" }],
      pagination: {
        total: 500,
        offset: 0,
        limit: 1,
        hasMore: true,
      },
    })

    const results = await searchRegistries(["@capped", "@static"], {
      limit: 5,
      offset: 10,
    })

    // The page beyond the cap is empty. hasMore must be false so paging
    // stops instead of looping through empty pages toward total.
    expect(results.items).toEqual([])
    expect(results.pagination.hasMore).toBe(false)

    mockGetRegistry.mockRestore()
  })

  it("keeps local pagination when no registry returns pagination", async () => {
    const mockGetRegistry = vi.mocked(getRegistry)

    mockGetRegistry.mockResolvedValue({
      name: "static",
      homepage: "https://static.com",
      items: [
        { name: "button", type: "registry:ui" },
        { name: "card", type: "registry:ui" },
        { name: "input", type: "registry:ui" },
      ],
    })

    const results = await searchRegistries(["@static"], {
      limit: 2,
      offset: 1,
    })

    expect(results.items.map((item) => item.name)).toEqual(["card", "input"])
    expect(results.pagination).toEqual({
      total: 3,
      offset: 1,
      limit: 2,
      hasMore: false,
    })

    mockGetRegistry.mockRestore()
  })
})
