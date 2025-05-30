import { describe, expect, it } from "vitest"

import { getDependencyFromModuleSpecifier } from "./utils"

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
