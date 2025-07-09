import { describe, expect, it } from "vitest"

import { getDependencyFromModuleSpecifier, isLocalFile, isUrl } from "./utils"

describe("getDependencyFromModuleSpecifier", () => {
  it("should return the first part of a non-scoped package with path", () => {
    expect(getDependencyFromModuleSpecifier("foo/bar")).toBe("foo")
    expect(getDependencyFromModuleSpecifier("lodash/get")).toBe("lodash")
  })

  it("should return the full package name for scoped packages", () => {
    expect(getDependencyFromModuleSpecifier("@types/react")).toBe(
      "@types/react"
    )
    expect(getDependencyFromModuleSpecifier("@radix-ui/react-dialog")).toBe(
      "@radix-ui/react-dialog"
    )
  })

  it.each([
    // Core packages
    "react",
    "react/jsx-runtime",
    "react/dom",
    "react/experimental",
    "react-dom",
    "react-dom/client",
    "react-dom/server",
    "react-dom/test-utils",
    "next",
    "next/link",
    "next/image",
    "next/navigation",
  ])("should return null for core package %s", (moduleSpecifier) => {
    expect(getDependencyFromModuleSpecifier(moduleSpecifier)).toBe(null)
  })

  it.each([
    // Node.js modules
    "node:fs",
    "node:path",
    "node:http",
    "node:stream",
    // JSR modules
    "jsr:@std/fs",
    "jsr:@std/path",
    "jsr:@std/http",
    // NPM modules
    "npm:lodash",
    "npm:@types/react",
    "npm:express",
  ])("should return null for prefixed module %s", (moduleSpecifier) => {
    expect(getDependencyFromModuleSpecifier(moduleSpecifier)).toBe(null)
  })

  it.each([
    ["", ""],
    [" ", " "],
    ["/", ""],
  ])("should handle empty or invalid input %s", (input, expected) => {
    expect(getDependencyFromModuleSpecifier(input)).toBe(expected)
  })

  it.each([
    ["foo/bar/baz", "foo"],
    ["lodash/get/set", "lodash"],
  ])("should handle package %s with multiple slashes", (input, expected) => {
    expect(getDependencyFromModuleSpecifier(input)).toBe(expected)
  })

  it("should handle edge cases for scoped packages", () => {
    expect(getDependencyFromModuleSpecifier("@types/react/dom")).toBe(
      "@types/react"
    )
  })
})

describe("isUrl", () => {
  it("should return true for valid URLs", () => {
    expect(isUrl("https://example.com")).toBe(true)
    expect(isUrl("http://example.com")).toBe(true)
    expect(isUrl("https://example.com/path")).toBe(true)
    expect(isUrl("https://subdomain.example.com")).toBe(true)
    expect(isUrl("https://ui.shadcn.com/r/styles/new-york/button.json")).toBe(
      true
    )
  })

  it("should return false for non-URLs", () => {
    expect(isUrl("./local-file.json")).toBe(false)
    expect(isUrl("../relative/path.json")).toBe(false)
    expect(isUrl("/absolute/path.json")).toBe(false)
    expect(isUrl("component-name")).toBe(false)
    expect(isUrl("")).toBe(false)
    expect(isUrl("just-text")).toBe(false)
  })
})

describe("isLocalFile", () => {
  it("should return true for local JSON files", () => {
    expect(isLocalFile("./component.json")).toBe(true)
    expect(isLocalFile("../shared/button.json")).toBe(true)
    expect(isLocalFile("/absolute/path/card.json")).toBe(true)
    expect(isLocalFile("local-component.json")).toBe(true)
    expect(isLocalFile("nested/directory/dialog.json")).toBe(true)
    expect(isLocalFile("~/Desktop/component.json")).toBe(true)
    expect(isLocalFile("~/Documents/shared/button.json")).toBe(true)
  })

  it("should return false for URLs ending with .json", () => {
    expect(isLocalFile("https://example.com/component.json")).toBe(false)
    expect(isLocalFile("http://registry.com/button.json")).toBe(false)
    expect(
      isLocalFile("https://ui.shadcn.com/r/styles/new-york/button.json")
    ).toBe(false)
  })

  it("should return false for non-JSON files", () => {
    expect(isLocalFile("./component.tsx")).toBe(false)
    expect(isLocalFile("../shared/button.ts")).toBe(false)
    expect(isLocalFile("/absolute/path/card.js")).toBe(false)
    expect(isLocalFile("local-component.css")).toBe(false)
    expect(isLocalFile("component-name")).toBe(false)
    expect(isLocalFile("")).toBe(false)
  })

  it("should return false for directory paths", () => {
    expect(isLocalFile("./components/")).toBe(false)
    expect(isLocalFile("../shared")).toBe(false)
    expect(isLocalFile("/absolute/path")).toBe(false)
  })
})
