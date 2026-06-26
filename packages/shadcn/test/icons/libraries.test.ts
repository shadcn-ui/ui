import { describe, expect, test } from "vitest"

import { iconLibraries } from "../../src/icons/libraries"

// [FORCE-UI] Guards the Material Symbols entry, whose path-based default-import
// shape is consumed by build-icons.ts and transform-icons.ts.
describe("materialSymbols icon library", () => {
  const ms = iconLibraries.materialSymbols

  test("is registered", () => {
    expect(ms).toBeDefined()
    expect(ms.name).toBe("materialSymbols")
    expect(ms.packages).toContain("@material-symbols/svg-400")
  })

  test("uses a default, path-based import with NAME + ICON placeholders", () => {
    expect(ms.import).toContain("ICON")
    expect(ms.import).toContain("NAME")
    expect(ms.import).not.toContain("{ ICON }")
    expect(ms.import).toContain("@material-symbols/svg-400/rounded/")
    expect(ms.import).toContain(".svg?react") // SVGR query suffix
    expect(ms.usage).toBe("<ICON />")
  })
})
