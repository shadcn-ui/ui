import { describe, expect, it, vi } from "vitest"

vi.mock("@/src/utils/get-package-manager", () => {
  return {
    getPackageRunner: vi.fn(async () => "pnpm dlx"),
  }
})

describe("formatSearchResultsWithPagination", () => {
  it("renders an awaited add command (not [object Promise])", async () => {
    const { formatSearchResultsWithPagination } = await import("./utils")

    const output = await formatSearchResultsWithPagination(
      {
        pagination: {
          total: 1,
          offset: 0,
          limit: 20,
          hasMore: false,
        },
        items: [
          {
            name: "sidebar",
            type: "ui",
            description: "A sidebar component.",
            registry: "@shadcn",
            addCommandArgument: "@shadcn/sidebar",
          },
        ],
      },
      { query: "sidebar", registries: ["@shadcn"] }
    )

    expect(output).not.toContain("[object Promise]")
    expect(output).toContain(
      "Add command: `pnpm dlx shadcn@latest add @shadcn/sidebar`"
    )
  })
})
