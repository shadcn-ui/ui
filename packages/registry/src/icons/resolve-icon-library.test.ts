import { describe, expect, it } from "vitest"

import { resolveIconLibrary } from "./libraries"

describe("resolveIconLibrary", () => {
  it.each(["lucide", "tabler", "hugeicons", "phosphor", "remixicon"])(
    "resolves %s as a built-in library",
    (name) => {
      expect(resolveIconLibrary(name)).toMatchObject({
        type: "builtin",
        name,
      })
    }
  )

  it("preserves legacy radix behavior", () => {
    expect(resolveIconLibrary("radix")).toEqual({
      type: "legacy",
    })
  })

  it.each([
    ["solar-icons", "solar-icons"],
    ["@solar-icons/react", "@solar-icons/react"],
    ["@solar-icons/react/shadcn", "@solar-icons/react"],
    ["@company/icons/react", "@company/icons"],
  ])(
    "resolves custom package path %s",
    (importPath, packageName) => {
      expect(resolveIconLibrary(importPath)).toEqual({
        type: "custom",
        importPath,
        packageName,
      })
    }
  )

  it.each([
    undefined,
    "",
    "./icons",
    "../icons",
    "/icons",
    "https://example.com/icons",
    "file:./icons",
    "@scope",
    "@scope/",
    "@scope/package/",
    "package//icons",
    "package/../icons",
    "package name",
  ])("rejects invalid library configuration: %s", (value) => {
    expect(resolveIconLibrary(value)).toEqual({
      type: "invalid",
    })
  })
})
