import { describe, expect, it } from "vitest"

import { parseRegistryArg } from "../../src/commands/registry/add"

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

  it("should throw for namespace without @", () => {
    expect(() => parseRegistryArg("foo")).toThrow("must start with @")
    expect(() => parseRegistryArg("magicui")).toThrow("must start with @")
    expect(() =>
      parseRegistryArg("mycompany=https://example.com/r/{name}.json")
    ).toThrow("must start with @")
  })
})
