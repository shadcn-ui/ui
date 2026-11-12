import { describe, expect, it } from "vitest"

import { resolveGitHubRegistrySource, resolveItemAddress } from "./address"
import { RegistryValidationError } from "./errors"

describe("resolveItemAddress", () => {
  it.each([
    ["button", { scheme: "shadcn", item: "button" }],
    ["calendar", { scheme: "shadcn", item: "calendar" }],
  ])("resolves shadcn item address %s", (input, expected) => {
    expect(resolveItemAddress(input)).toEqual(expected)
  })

  it.each([
    [
      "@acme/button",
      { scheme: "namespace", namespace: "@acme", item: "button" },
    ],
    [
      "@acme/ui/button",
      { scheme: "namespace", namespace: "@acme", item: "ui/button" },
    ],
  ])("resolves namespace item address %s", (input, expected) => {
    expect(resolveItemAddress(input)).toEqual(expected)
  })

  it.each([
    [
      "https://example.com/r/button.json",
      { scheme: "url", url: "https://example.com/r/button.json" },
    ],
    [
      "https://example.com/r/button.json#fragment",
      { scheme: "url", url: "https://example.com/r/button.json#fragment" },
    ],
  ])("resolves url item address %s", (input, expected) => {
    expect(resolveItemAddress(input)).toEqual(expected)
  })

  it.each([
    ["./button.json", { scheme: "file", path: "./button.json" }],
    [
      "../registry/button.json",
      { scheme: "file", path: "../registry/button.json" },
    ],
    [
      "/Users/me/registry/button.json",
      { scheme: "file", path: "/Users/me/registry/button.json" },
    ],
  ])("resolves file item address %s", (input, expected) => {
    expect(resolveItemAddress(input)).toEqual(expected)
  })

  it.each([
    [
      "acme/ui/button",
      {
        scheme: "github",
        owner: "acme",
        repo: "ui",
        item: "button",
      },
    ],
    [
      "acme/ui/forms/login",
      {
        scheme: "github",
        owner: "acme",
        repo: "ui",
        item: "forms/login",
      },
    ],
    [
      "acme/ui/button#v1.2.0",
      {
        scheme: "github",
        owner: "acme",
        repo: "ui",
        item: "button",
        ref: "v1.2.0",
      },
    ],
    [
      "acme/ui/button#feature/login-form",
      {
        scheme: "github",
        owner: "acme",
        repo: "ui",
        item: "button",
        ref: "feature/login-form",
      },
    ],
  ])("resolves GitHub item address %s", (input, expected) => {
    expect(resolveItemAddress(input)).toEqual(expected)
  })

  it.each([
    ["foo/bar", { scheme: "shadcn", item: "foo/bar" }],
    ["-owner/repo/button", { scheme: "shadcn", item: "-owner/repo/button" }],
    ["owner-/repo/button", { scheme: "shadcn", item: "owner-/repo/button" }],
    ["owner/./button", { scheme: "shadcn", item: "owner/./button" }],
    ["owner/../button", { scheme: "shadcn", item: "owner/../button" }],
    [
      "owner/repo with space/button",
      { scheme: "shadcn", item: "owner/repo with space/button" },
    ],
  ])(
    "does not classify invalid GitHub addresses as GitHub: %s",
    (input, expected) => {
      expect(resolveItemAddress(input)).toEqual(expected)
    }
  )

  it("keeps .json addresses classified as file paths", () => {
    expect(resolveItemAddress("owner/repo/data/schema.json")).toEqual({
      scheme: "file",
      path: "owner/repo/data/schema.json",
    })
  })

  it("rejects empty GitHub refs", () => {
    expect(() => resolveItemAddress("acme/ui/button#")).toThrow(
      RegistryValidationError
    )
  })

  it("rejects GitHub refs with control characters", () => {
    expect(() => resolveItemAddress("acme/ui/button#bad\nref")).toThrow(
      RegistryValidationError
    )
  })

  it("rejects GitHub refs with whitespace", () => {
    expect(() => resolveItemAddress("acme/ui/button#my tag")).toThrow(
      RegistryValidationError
    )
  })

  it("rejects GitHub refs that look like git options", () => {
    expect(() =>
      resolveItemAddress("acme/ui/button#--upload-pack=/bin/false")
    ).toThrow(RegistryValidationError)
  })
})

describe("resolveGitHubRegistrySource", () => {
  it.each([
    ["acme/ui", { owner: "acme", repo: "ui" }],
    ["acme/ui#v1.0.0", { owner: "acme", repo: "ui", ref: "v1.0.0" }],
    [
      "acme/ui#feature/forms",
      { owner: "acme", repo: "ui", ref: "feature/forms" },
    ],
  ])("resolves GitHub registry source %s", (input, expected) => {
    expect(resolveGitHubRegistrySource(input)).toEqual(expected)
  })

  it.each([
    "acme",
    "acme/ui/button",
    "@acme/ui",
    "https://example.com",
    "owner/.",
    "owner/..",
  ])("does not resolve non-GitHub registry source %s", (input) => {
    expect(resolveGitHubRegistrySource(input)).toBeNull()
  })

  it("rejects refs that look like git options", () => {
    expect(() =>
      resolveGitHubRegistrySource("acme/ui#--upload-pack=/bin/false")
    ).toThrow(RegistryValidationError)
  })

  it("rejects refs with whitespace", () => {
    expect(() => resolveGitHubRegistrySource("acme/ui#my tag")).toThrow(
      RegistryValidationError
    )
  })
})
