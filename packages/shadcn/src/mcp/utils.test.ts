import type { registryItemSchema, searchResultsSchema } from "@/src/schema"
import { describe, expect, it, vi } from "vitest"
import { z } from "zod"

vi.mock("@/src/utils/get-package-manager", () => ({
  getPackageRunner: vi.fn().mockResolvedValue("npx"),
}))

import { SEARCHABLE_TYPES } from "@/src/registry/search"

import {
  findUnknownTypesMessage,
  formatItemExamples,
  formatRegistryItems,
  formatSearchResultsWithPagination,
  formatSkippedRegistries,
} from "./utils"

type SearchResults = z.infer<typeof searchResultsSchema>
type RegistryItem = z.infer<typeof registryItemSchema>

const minimalResults: SearchResults = {
  items: [
    {
      name: "button",
      type: "registry:ui",
      description: "A button.",
      registry: "@shadcn",
      addCommandArgument: "@shadcn/button",
    },
  ],
  pagination: { total: 1, offset: 0, limit: 10, hasMore: false },
}

describe("formatSearchResultsWithPagination", () => {
  // KNOWN BUG (plans/005): npxShadcn is async but interpolated without await
  // at src/mcp/utils.ts:49, so output contains "[object Promise]" instead of
  // a runnable command. When someone fixes the bug, this it.fails test will
  // start failing — flip it to a plain it() at that point.
  it.fails("renders a runnable add command (currently broken)", () => {
    const output = formatSearchResultsWithPagination(minimalResults)
    expect(output).toContain(
      "Add command: `npx shadcn@latest add @shadcn/button`"
    )
  })

  it("pins the current broken output (contains [object Promise])", () => {
    const output = formatSearchResultsWithPagination(minimalResults)
    expect(output).toContain("Add command: `[object Promise]`")
  })

  it("includes a header without query or registries", () => {
    const output = formatSearchResultsWithPagination(minimalResults)
    expect(output).toContain("Found 1 items:")
  })

  it("includes the query in the header when provided", () => {
    const output = formatSearchResultsWithPagination(minimalResults, {
      query: "button",
    })
    expect(output).toContain('Found 1 items matching "button":')
  })

  it("includes registries in the header when provided", () => {
    const output = formatSearchResultsWithPagination(minimalResults, {
      registries: ["@shadcn", "@acme"],
    })
    expect(output).toContain(
      "Found 1 items in registries @shadcn, @acme:"
    )
  })

  it("includes both query and registries in the header when provided", () => {
    const output = formatSearchResultsWithPagination(minimalResults, {
      query: "button",
      registries: ["@shadcn"],
    })
    expect(output).toContain(
      'Found 1 items matching "button" in registries @shadcn:'
    )
  })

  it("clamps the showing range to the total", () => {
    const results: SearchResults = {
      items: [],
      pagination: { total: 25, offset: 20, limit: 10, hasMore: false },
    }
    const output = formatSearchResultsWithPagination(results)
    expect(output).toContain("Showing items 21-25 of 25:")
  })

  it("shows the full range when there is no clamping needed", () => {
    const output = formatSearchResultsWithPagination(minimalResults)
    expect(output).toContain("Showing items 1-1 of 1:")
  })

  it("adds an offset hint when hasMore is true", () => {
    const results: SearchResults = {
      items: [],
      pagination: { total: 25, offset: 0, limit: 10, hasMore: true },
    }
    const output = formatSearchResultsWithPagination(results)
    expect(output).toContain(
      "More items available. Use offset: 10 to see the next page."
    )
  })

  it("does not add an offset hint when hasMore is false", () => {
    const output = formatSearchResultsWithPagination(minimalResults)
    expect(output).not.toContain("More items available")
  })

  it("includes type, description, and registry in item lines", () => {
    const output = formatSearchResultsWithPagination(minimalResults)
    expect(output).toContain("- button (registry:ui) - A button. [@shadcn]")
  })

  it("omits the registry bracket when registry is not present", () => {
    const results: SearchResults = {
      items: [
        {
          name: "button",
          registry: "",
          addCommandArgument: "@shadcn/button",
        },
      ],
      pagination: { total: 1, offset: 0, limit: 10, hasMore: false },
    }
    const output = formatSearchResultsWithPagination(results)
    expect(output).not.toContain("[]")
    expect(output).toContain("- button")
  })
})

describe("findUnknownTypesMessage", () => {
  it("returns null for undefined", () => {
    expect(findUnknownTypesMessage(undefined)).toBeNull()
  })

  it("returns null for an empty array", () => {
    expect(findUnknownTypesMessage([])).toBeNull()
  })

  it("returns null when all types are valid", () => {
    expect(findUnknownTypesMessage(["ui", "hook"])).toBeNull()
  })

  it("returns a singular message for one unknown type", () => {
    const message = findUnknownTypesMessage(["bogus"])
    expect(message).toBe(
      `Unknown type: bogus. Valid types: ${SEARCHABLE_TYPES.join(", ")}.`
    )
  })

  it("returns a plural message for multiple unknown types", () => {
    const message = findUnknownTypesMessage(["bogus", "fake"])
    expect(message).toBe(
      `Unknown types: bogus, fake. Valid types: ${SEARCHABLE_TYPES.join(", ")}.`
    )
  })
})

describe("formatSkippedRegistries", () => {
  it("returns an empty string when there are no errors", () => {
    expect(formatSkippedRegistries(minimalResults)).toBe("")
  })

  it("returns singular wording for one error", () => {
    const results: SearchResults = {
      ...minimalResults,
      errors: [{ registry: "@acme", message: "timed out" }],
    }
    const output = formatSkippedRegistries(results)
    expect(output).toContain("Skipped 1 registry that failed to load:")
    expect(output).toContain("- @acme: timed out")
  })

  it("returns plural wording with one line per error", () => {
    const results: SearchResults = {
      ...minimalResults,
      errors: [
        { registry: "@acme", message: "timed out" },
        { registry: "@other", message: "not found" },
      ],
    }
    const output = formatSkippedRegistries(results)
    expect(output).toContain("Skipped 2 registries that failed to load:")
    expect(output).toContain("- @acme: timed out")
    expect(output).toContain("- @other: not found")
  })
})

describe("formatRegistryItems", () => {
  it("renders all lines for a full item", () => {
    const items: RegistryItem[] = [
      {
        name: "button",
        type: "registry:ui",
        description: "A button.",
        files: [
          { path: "button.tsx", type: "registry:ui", target: "" },
        ],
        dependencies: ["radix-ui"],
        devDependencies: ["typescript"],
      } as RegistryItem,
    ]

    const [output] = formatRegistryItems(items)

    expect(output).toContain("## button")
    expect(output).toContain("A button.")
    expect(output).toContain("**Type:** registry:ui")
    expect(output).toContain("**Files:** 1 file(s)")
    expect(output).toContain("**Dependencies:** radix-ui")
    expect(output).toContain("**Dev Dependencies:** typescript")
  })

  it("renders just the heading and type for a minimal item", () => {
    const items: RegistryItem[] = [
      { name: "minimal", type: "registry:ui" } as RegistryItem,
    ]

    const [output] = formatRegistryItems(items)

    expect(output).toBe("## minimal\n**Type:** registry:ui")
  })

  it("produces no dependency/file lines for empty arrays", () => {
    const items: RegistryItem[] = [
      {
        name: "empty",
        type: "registry:ui",
        files: [],
        dependencies: [],
        devDependencies: [],
      } as RegistryItem,
    ]

    const [output] = formatRegistryItems(items)

    expect(output).toBe("## empty\n**Type:** registry:ui")
  })
})

describe("formatItemExamples", () => {
  it("includes a tsx fence for files with content", () => {
    const items: RegistryItem[] = [
      {
        name: "button",
        type: "registry:ui",
        files: [
          {
            path: "button.tsx",
            type: "registry:ui",
            target: "",
            content: "export const Button = () => null",
          },
        ],
      } as RegistryItem,
    ]

    const output = formatItemExamples(items, "button")

    expect(output).toContain("### Code (button.tsx):")
    expect(output).toContain("```tsx")
    expect(output).toContain("export const Button = () => null")
  })

  it("omits files without content", () => {
    const items: RegistryItem[] = [
      {
        name: "button",
        type: "registry:ui",
        files: [{ path: "button.tsx", type: "registry:ui", target: "" }],
      } as RegistryItem,
    ]

    const output = formatItemExamples(items, "button")

    expect(output).not.toContain("### Code")
    expect(output).not.toContain("```tsx")
  })

  it("joins two items with a --- separator", () => {
    const items: RegistryItem[] = [
      { name: "one", type: "registry:ui" } as RegistryItem,
      { name: "two", type: "registry:ui" } as RegistryItem,
    ]

    const output = formatItemExamples(items, "q")

    expect(output).toContain("## Example: one")
    expect(output).toContain("\n\n---\n\n")
    expect(output).toContain("## Example: two")
  })

  it("uses singular wording for one example", () => {
    const items: RegistryItem[] = [
      { name: "one", type: "registry:ui" } as RegistryItem,
    ]

    const output = formatItemExamples(items, "q")

    expect(output).toContain('Found 1 example matching "q":')
  })

  it("uses plural wording for multiple examples", () => {
    const items: RegistryItem[] = [
      { name: "one", type: "registry:ui" } as RegistryItem,
      { name: "two", type: "registry:ui" } as RegistryItem,
    ]

    const output = formatItemExamples(items, "q")

    expect(output).toContain('Found 2 examples matching "q":')
  })
})
