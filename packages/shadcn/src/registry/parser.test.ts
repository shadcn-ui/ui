import { describe, expect, it } from "vitest"

import { parseRegistryAndItemFromString } from "./parser"

describe("parseRegistryAndItemFromString", () => {
  describe("valid registry items", () => {
    it.each([
      ["@v0/button", { registry: "@v0", item: "button" }],
      ["@acme/data-table", { registry: "@acme", item: "data-table" }],
      [
        "@company/nested/component",
        { registry: "@company", item: "nested/component" },
      ],
      ["@test/simple", { registry: "@test", item: "simple" }],
      ["@my-registry/item", { registry: "@my-registry", item: "item" }],
      ["@my_registry/item", { registry: "@my_registry", item: "item" }],
      ["@123registry/item", { registry: "@123registry", item: "item" }],
      ["@registry123/item", { registry: "@registry123", item: "item" }],
      ["@r/item", { registry: "@r", item: "item" }],
      [
        "@very-long-registry-name/item",
        { registry: "@very-long-registry-name", item: "item" },
      ],
    ])("should parse registry item: %s", (input, expected) => {
      expect(parseRegistryAndItemFromString(input)).toEqual(expected)
    })
  })

  describe("non-registry items", () => {
    it.each([
      ["button", { registry: null, item: "button" }],
      ["components/button", { registry: null, item: "components/button" }],
      ["v0/button", { registry: null, item: "v0/button" }],
      ["@button", { registry: null, item: "@button" }],
      ["button@", { registry: null, item: "button@" }],
      ["@", { registry: null, item: "@" }],
      ["@/button", { registry: null, item: "@/button" }],
      ["@-registry/item", { registry: null, item: "@-registry/item" }],
      ["@registry-/item", { registry: null, item: "@registry-/item" }],
      ["@-registry-/item", { registry: null, item: "@-registry-/item" }],
    ])(
      "should return null registry for non-registry item: %s",
      (input, expected) => {
        expect(parseRegistryAndItemFromString(input)).toEqual(expected)
      }
    )
  })

  describe("URLs and external paths", () => {
    it.each([
      [
        "https://example.com/button",
        { registry: null, item: "https://example.com/button" },
      ],
      [
        "http://localhost:3000/component",
        { registry: null, item: "http://localhost:3000/component" },
      ],
      [
        "file:///path/to/component",
        { registry: null, item: "file:///path/to/component" },
      ],
      [
        "ftp://example.com/file",
        { registry: null, item: "ftp://example.com/file" },
      ],
      [
        "//cdn.example.com/component",
        { registry: null, item: "//cdn.example.com/component" },
      ],
    ])("should handle URLs: %s", (input, expected) => {
      expect(parseRegistryAndItemFromString(input)).toEqual(expected)
    })
  })

  describe("complex item paths", () => {
    it.each([
      ["@acme/ui/button", { registry: "@acme", item: "ui/button" }],
      [
        "@company/components/forms/input",
        { registry: "@company", item: "components/forms/input" },
      ],
      [
        "@test/nested/deep/path/component",
        { registry: "@test", item: "nested/deep/path/component" },
      ],
      [
        "@registry/path/with/multiple/slashes",
        { registry: "@registry", item: "path/with/multiple/slashes" },
      ],
    ])("should handle complex item paths: %s", (input, expected) => {
      expect(parseRegistryAndItemFromString(input)).toEqual(expected)
    })
  })

  describe("edge cases and special characters", () => {
    it.each([
      ["", { registry: null, item: "" }],
      ["@", { registry: null, item: "@" }],
      ["@@", { registry: null, item: "@@" }],
      ["@@@", { registry: null, item: "@@@" }],
      ["@/", { registry: null, item: "@/" }],
      ["@//", { registry: null, item: "@//" }],
      ["@/item", { registry: null, item: "@/item" }],
      ["@registry/", { registry: null, item: "@registry/" }],
      ["@registry//", { registry: "@registry", item: "/" }],
      ["@registry///", { registry: "@registry", item: "//" }],
    ])("should handle edge cases: %s", (input, expected) => {
      expect(parseRegistryAndItemFromString(input)).toEqual(expected)
    })
  })

  describe("registry names with special characters", () => {
    it.each([
      ["@my-registry/item", { registry: "@my-registry", item: "item" }],
      ["@my_registry/item", { registry: "@my_registry", item: "item" }],
      [
        "@my-registry-name/item",
        { registry: "@my-registry-name", item: "item" },
      ],
      [
        "@my_registry_name/item",
        { registry: "@my_registry_name", item: "item" },
      ],
      [
        "@my-registry_name/item",
        { registry: "@my-registry_name", item: "item" },
      ],
      [
        "@my_registry-name/item",
        { registry: "@my_registry-name", item: "item" },
      ],
      ["@123-registry/item", { registry: "@123-registry", item: "item" }],
      ["@registry-123/item", { registry: "@registry-123", item: "item" }],
      ["@123_registry/item", { registry: "@123_registry", item: "item" }],
      ["@registry_123/item", { registry: "@registry_123", item: "item" }],
    ])(
      "should handle registry names with special characters: %s",
      (input, expected) => {
        expect(parseRegistryAndItemFromString(input)).toEqual(expected)
      }
    )
  })

  describe("invalid registry patterns", () => {
    it.each([
      ["@-registry/item", { registry: null, item: "@-registry/item" }],
      ["@registry-/item", { registry: null, item: "@registry-/item" }],
      ["@-registry-/item", { registry: null, item: "@-registry-/item" }],
      ["@-item", { registry: null, item: "@-item" }],
      ["@item-", { registry: null, item: "@item-" }],
      ["@-item-", { registry: null, item: "@-item-" }],
      ["@_registry/item", { registry: null, item: "@_registry/item" }],
      ["@registry_/item", { registry: null, item: "@registry_/item" }],
      ["@_registry_/item", { registry: null, item: "@_registry_/item" }],
      ["@_item", { registry: null, item: "@_item" }],
      ["@item_", { registry: null, item: "@item_" }],
      ["@_item_", { registry: null, item: "@_item_" }],
    ])("should reject invalid registry patterns: %s", (input, expected) => {
      expect(parseRegistryAndItemFromString(input)).toEqual(expected)
    })
  })

  describe("whitespace and formatting", () => {
    it.each([
      [" @v0/button", { registry: null, item: " @v0/button" }],
      ["@v0/button ", { registry: "@v0", item: "button " }],
      [" @v0/button ", { registry: null, item: " @v0/button " }],
      ["\t@v0/button", { registry: null, item: "\t@v0/button" }],
      ["@v0/button\t", { registry: "@v0", item: "button\t" }],
      ["\n@v0/button", { registry: null, item: "\n@v0/button" }],
      ["@v0/button\n", { registry: null, item: "@v0/button\n" }],
    ])("should handle whitespace: %s", (input, expected) => {
      expect(parseRegistryAndItemFromString(input)).toEqual(expected)
    })
  })

  describe("case sensitivity", () => {
    it.each([
      ["@V0/button", { registry: "@V0", item: "button" }],
      ["@v0/BUTTON", { registry: "@v0", item: "BUTTON" }],
      ["@V0/BUTTON", { registry: "@V0", item: "BUTTON" }],
      ["@MyRegistry/item", { registry: "@MyRegistry", item: "item" }],
      ["@MYREGISTRY/item", { registry: "@MYREGISTRY", item: "item" }],
      ["@myregistry/ITEM", { registry: "@myregistry", item: "ITEM" }],
    ])("should be case sensitive: %s", (input, expected) => {
      expect(parseRegistryAndItemFromString(input)).toEqual(expected)
    })
  })

  describe("numbers and mixed content", () => {
    it.each([
      ["@123/item", { registry: "@123", item: "item" }],
      ["@registry123/item", { registry: "@registry123", item: "item" }],
      ["@123registry/item", { registry: "@123registry", item: "item" }],
      ["@r123/item", { registry: "@r123", item: "item" }],
      ["@123r/item", { registry: "@123r", item: "item" }],
      ["@item123/item", { registry: "@item123", item: "item" }],
      ["@123-item/item", { registry: "@123-item", item: "item" }],
      ["@item-123/item", { registry: "@item-123", item: "item" }],
      ["@123_item/item", { registry: "@123_item", item: "item" }],
      ["@item_123/item", { registry: "@item_123", item: "item" }],
    ])("should handle numbers and mixed content: %s", (input, expected) => {
      expect(parseRegistryAndItemFromString(input)).toEqual(expected)
    })
  })

  describe("single character cases", () => {
    it.each([
      ["@a/b", { registry: "@a", item: "b" }],
      ["@a/", { registry: null, item: "@a/" }],
      ["@a//", { registry: "@a", item: "/" }],
      ["@1/b", { registry: "@1", item: "b" }],
      ["@1/", { registry: null, item: "@1/" }],
      ["@1//", { registry: "@1", item: "/" }],
    ])(
      "should handle single character registry names: %s",
      (input, expected) => {
        expect(parseRegistryAndItemFromString(input)).toEqual(expected)
      }
    )
  })

  describe("very long inputs", () => {
    it("should handle very long registry names", () => {
      const longRegistry = "@" + "a".repeat(100)
      const result = parseRegistryAndItemFromString(longRegistry + "/item")
      expect(result).toEqual({
        registry: longRegistry,
        item: "item",
      })
    })

    it("should handle very long item paths", () => {
      const longItem = "a".repeat(100)
      const result = parseRegistryAndItemFromString("@registry/" + longItem)
      expect(result).toEqual({
        registry: "@registry",
        item: longItem,
      })
    })

    it("should handle very long non-registry paths", () => {
      const longPath = "a".repeat(100)
      const result = parseRegistryAndItemFromString(longPath)
      expect(result).toEqual({
        registry: null,
        item: longPath,
      })
    })
  })
})
