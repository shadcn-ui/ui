import { REGISTRY_URL } from "@/src/registry/constants"
import { describe, expect, it } from "vitest"

import { resolveRegistryUrl } from "./url"

describe("resolveRegistryUrl", () => {
  it("should return the URL as-is for valid URLs", () => {
    const url = "https://example.com/component.json"
    expect(resolveRegistryUrl(url)).toBe(url)
  })

  it("should append /json to v0 registry URLs", () => {
    const v0Url = "https://v0.dev/chat/b/abc123"
    expect(resolveRegistryUrl(v0Url)).toBe("https://v0.dev/chat/b/abc123/json")
  })

  it("should not append /json if already present", () => {
    const v0Url = "https://v0.dev/chat/b/abc123/json"
    expect(resolveRegistryUrl(v0Url)).toBe(v0Url)
  })

  it("should normalize URLs to their canonical form", () => {
    expect(resolveRegistryUrl("https://Acme.dev/r/x.json")).toBe(
      "https://acme.dev/r/x.json"
    )
    expect(resolveRegistryUrl("https://acme.dev")).toBe("https://acme.dev/")
    expect(resolveRegistryUrl("https://acme.dev/r/my item.json")).toBe(
      "https://acme.dev/r/my%20item.json"
    )
    expect(resolveRegistryUrl("https://acme.dev:443/r/x.json")).toBe(
      "https://acme.dev/r/x.json"
    )
  })

  it("should be idempotent for URLs", () => {
    for (const url of [
      "https://Acme.dev:443/r/my item.json",
      "https://v0.dev/chat/b/abc123",
    ]) {
      const resolved = resolveRegistryUrl(url)
      expect(resolveRegistryUrl(resolved)).toBe(resolved)
    }
  })

  it("should prepend REGISTRY_URL for non-URLs", () => {
    expect(resolveRegistryUrl("test.json")).toBe(`${REGISTRY_URL}/test.json`)
    expect(resolveRegistryUrl("styles/default/button.json")).toBe(
      `${REGISTRY_URL}/styles/default/button.json`
    )
  })
})
