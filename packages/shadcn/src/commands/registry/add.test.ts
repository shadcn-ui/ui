import { parseRegistryArgument } from "@/src/registry/project-config"
import { describe, expect, it } from "vitest"

describe("parseRegistryArgument", () => {
  it("should parse namespace without URL", () => {
    expect(parseRegistryArgument("@magicui")).toEqual({
      namespace: "@magicui",
    })
    expect(parseRegistryArgument("@aceternity")).toEqual({
      namespace: "@aceternity",
    })
  })

  it("should parse namespace with URL", () => {
    expect(
      parseRegistryArgument("@mycompany=https://example.com/r/{name}.json")
    ).toEqual({
      namespace: "@mycompany",
      url: "https://example.com/r/{name}.json",
    })
  })

  it("should preserve URL query parameters containing =", () => {
    expect(
      parseRegistryArgument(
        "@foo=https://example.com/r/{name}.json?token=abc&key=xyz"
      )
    ).toEqual({
      namespace: "@foo",
      url: "https://example.com/r/{name}.json?token=abc&key=xyz",
    })
  })

  it("should handle URL with port number", () => {
    expect(
      parseRegistryArgument("@local=http://localhost:8080/r/{name}.json")
    ).toEqual({
      namespace: "@local",
      url: "http://localhost:8080/r/{name}.json",
    })
  })

  it("should throw for namespace without @", () => {
    expect(() => parseRegistryArgument("foo")).toThrow("must start with @")
    expect(() =>
      parseRegistryArgument("mycompany=https://example.com/r/{name}.json")
    ).toThrow("must start with @")
  })
})
