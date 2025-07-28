import { describe, expect, it } from "vitest"

import { parseRegistryAndItemFromString } from "./parser"

describe("parseRegistryAndItemFromString", () => {
  it.each([
    ["@v0/button", { registry: "@v0", item: "button" }],
    ["@acme/data-table", { registry: "@acme", item: "data-table" }],
    [
      "@company/nested/component",
      { registry: "@company", item: "nested/component" },
    ],
    [
      "https://example.com/button",
      { registry: null, item: "https://example.com/button" },
    ],
  ])("should parse registry item: %s", (input, expected) => {
    expect(parseRegistryAndItemFromString(input)).toEqual(expected)
  })

  it.each([
    ["button", { registry: null, item: "button" }],
    ["components/button", { registry: null, item: "components/button" }],
    ["v0/button", { registry: null, item: "v0/button" }],
  ])(
    "should return null registry for non-registry item: %s",
    (input, expected) => {
      expect(parseRegistryAndItemFromString(input)).toEqual(expected)
    }
  )
})
