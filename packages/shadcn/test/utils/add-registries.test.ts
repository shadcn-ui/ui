import { describe, expect, it } from "vitest"

import {
  isRegistryOnlyArg,
  parseRegistryArg,
} from "../../src/commands/registry/add"

describe("isRegistryOnlyArg", () => {
  it("should return true for registry namespace", () => {
    expect(isRegistryOnlyArg("@magicui")).toBe(true)
    expect(isRegistryOnlyArg("@my-company")).toBe(true)
    expect(isRegistryOnlyArg("@aceternity")).toBe(true)
  })

  it("should return true for registry with custom URL", () => {
    expect(
      isRegistryOnlyArg("@mycompany=https://example.com/r/{name}.json")
    ).toBe(true)
    expect(
      isRegistryOnlyArg("@foo=https://example.com/r/{name}.json?token=abc")
    ).toBe(true)
  })

  it("should return false for component from registry", () => {
    expect(isRegistryOnlyArg("@magicui/button")).toBe(false)
    expect(isRegistryOnlyArg("@my-company/card")).toBe(false)
    expect(isRegistryOnlyArg("@aceternity/globe")).toBe(false)
  })

  it("should return false for plain component", () => {
    expect(isRegistryOnlyArg("button")).toBe(false)
    expect(isRegistryOnlyArg("alert-dialog")).toBe(false)
    expect(isRegistryOnlyArg("card")).toBe(false)
  })

  it("should return false for URLs", () => {
    expect(isRegistryOnlyArg("https://example.com/registry.json")).toBe(false)
    expect(isRegistryOnlyArg("http://localhost:3000/r/button.json")).toBe(false)
  })

  it("should return false for local file paths", () => {
    expect(isRegistryOnlyArg("./registry/button.json")).toBe(false)
    expect(isRegistryOnlyArg("../fixtures/registry/example.json")).toBe(false)
  })
})

describe("parseRegistryArg", () => {
  it("should parse namespace without URL", () => {
    expect(parseRegistryArg("@magicui")).toEqual({ namespace: "@magicui" })
    expect(parseRegistryArg("@aceternity")).toEqual({ namespace: "@aceternity" })
  })

  it("should parse namespace with URL", () => {
    expect(
      parseRegistryArg("@mycompany=https://example.com/r/{name}.json")
    ).toEqual({
      namespace: "@mycompany",
      url: "https://example.com/r/{name}.json",
    })
  })

  it("should handle URL with query params containing =", () => {
    expect(
      parseRegistryArg("@foo=https://example.com/r/{name}.json?token=abc")
    ).toEqual({
      namespace: "@foo",
      url: "https://example.com/r/{name}.json?token=abc",
    })
  })

  it("should handle URL with multiple = in query params", () => {
    expect(
      parseRegistryArg(
        "@bar=https://example.com/r/{name}.json?token=abc&key=xyz"
      )
    ).toEqual({
      namespace: "@bar",
      url: "https://example.com/r/{name}.json?token=abc&key=xyz",
    })
  })

  it("should handle URL with port number", () => {
    expect(
      parseRegistryArg("@local=http://localhost:8080/r/{name}.json")
    ).toEqual({
      namespace: "@local",
      url: "http://localhost:8080/r/{name}.json",
    })
  })
})
