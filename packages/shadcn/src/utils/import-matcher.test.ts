import path from "path"
import { describe, expect, it } from "vitest"

import {
  applyWildcardTarget,
  getImportTargetEmitMode,
  getPatternWildcardValue,
  resolveImportEntryMatch,
  resolveLocalPathTarget,
  type ImportResolutionEntry,
} from "./import-matcher"

describe("resolveLocalPathTarget", () => {
  it("resolves direct local relative path string", () => {
    expect(resolveLocalPathTarget("./src/index.ts")).toBe("./src/index.ts")
    expect(resolveLocalPathTarget("./dist/bundle.js")).toBe("./dist/bundle.js")
  })

  it("returns null for non-local path strings", () => {
    expect(resolveLocalPathTarget("react")).toBeNull()
    expect(resolveLocalPathTarget("lodash-es/clone")).toBeNull()
    expect(resolveLocalPathTarget("/absolute/path")).toBeNull()
  })

  it("resolves from array of targets", () => {
    expect(resolveLocalPathTarget(["external-pkg", "./src/fallback.ts"])).toBe(
      "./src/fallback.ts"
    )
    expect(resolveLocalPathTarget(["pkg-a", "pkg-b"])).toBeNull()
  })

  it("resolves from conditional export objects", () => {
    expect(
      resolveLocalPathTarget({
        import: "./dist/index.mjs",
        require: "./dist/index.cjs",
      })
    ).toBe("./dist/index.mjs")
  })

  it("resolves from deeply nested conditional export structures", () => {
    expect(
      resolveLocalPathTarget({
        types: "./dist/index.d.ts",
        import: {
          default: "./dist/index.js",
        },
      })
    ).toBe("./dist/index.d.ts")
  })

  it("returns null for invalid or empty targets", () => {
    expect(resolveLocalPathTarget(null)).toBeNull()
    expect(resolveLocalPathTarget(undefined)).toBeNull()
    expect(resolveLocalPathTarget(123)).toBeNull()
    expect(resolveLocalPathTarget({})).toBeNull()
    expect(resolveLocalPathTarget([])).toBeNull()
  })
})

describe("getImportTargetEmitMode", () => {
  it("returns strip_extension for non-wildcard targets", () => {
    expect(getImportTargetEmitMode("./src/components/button.tsx")).toBe(
      "strip_extension"
    )
    expect(getImportTargetEmitMode("./src/lib/utils.ts")).toBe("strip_extension")
  })

  it("returns preserve_extension for bare wildcard targets", () => {
    expect(getImportTargetEmitMode("./src/components/*")).toBe(
      "preserve_extension"
    )
    expect(getImportTargetEmitMode("./src/*")).toBe("preserve_extension")
  })

  it("returns strip_extension when wildcard is followed by a file extension", () => {
    expect(getImportTargetEmitMode("./src/components/*.tsx")).toBe(
      "strip_extension"
    )
    expect(getImportTargetEmitMode("./src/lib/*.ts")).toBe("strip_extension")
    expect(getImportTargetEmitMode("./dist/*.mjs")).toBe("strip_extension")
  })

  it("returns preserve_extension when wildcard is followed by directory path", () => {
    expect(getImportTargetEmitMode("./src/*/index.ts")).toBe(
      "preserve_extension"
    )
    expect(getImportTargetEmitMode("./packages/*/src/index.ts")).toBe(
      "preserve_extension"
    )
  })
})

describe("getPatternWildcardValue", () => {
  it("handles non-wildcard pattern matching", () => {
    expect(getPatternWildcardValue("components", "components")).toBe("")
    expect(getPatternWildcardValue("components", "utils")).toBeNull()
  })

  it("extracts wildcard value from simple prefix pattern", () => {
    expect(
      getPatternWildcardValue("@/components/button", "@/components/*")
    ).toBe("button")
    expect(
      getPatternWildcardValue("#components/ui/button", "#components/*")
    ).toBe("ui/button")
  })

  it("extracts wildcard value with both prefix and suffix", () => {
    expect(
      getPatternWildcardValue(
        "src/components/button.tsx",
        "src/components/*.tsx"
      )
    ).toBe("button")
  })

  it("returns null when path does not match prefix or suffix", () => {
    expect(
      getPatternWildcardValue("@/other/button", "@/components/*")
    ).toBeNull()
    expect(
      getPatternWildcardValue("src/components/button.js", "src/components/*.tsx")
    ).toBeNull()
  })

  it("supports bare alias base fallback when enabled", () => {
    expect(
      getPatternWildcardValue("@/components", "@/components/*", {
        allowBareAliasBase: true,
      })
    ).toBe("")

    expect(
      getPatternWildcardValue("@/components", "@/components/*", {
        allowBareAliasBase: false,
      })
    ).toBeNull()
  })
})

describe("applyWildcardTarget", () => {
  it("returns original target if no wildcard is present", () => {
    expect(applyWildcardTarget("./src/components/button.tsx", "button")).toBe(
      "./src/components/button.tsx"
    )
  })

  it("replaces wildcard with given value", () => {
    expect(applyWildcardTarget("./src/components/*.tsx", "button")).toBe(
      "./src/components/button.tsx"
    )
    expect(applyWildcardTarget("./src/*", "utils/math")).toBe(
      "./src/utils/math"
    )
  })

  it("trims trailing slash when wildcard value is empty", () => {
    expect(applyWildcardTarget("./src/components/*", "")).toBe(
      "./src/components"
    )
    expect(applyWildcardTarget("./src/*", "")).toBe("./src")
  })

  it("replaces wildcard in the middle of a path", () => {
    expect(applyWildcardTarget("./src/*/index.ts", "button")).toBe(
      "./src/button/index.ts"
    )
  })
})

describe("resolveImportEntryMatch", () => {
  const rootDir = path.resolve("/test-root")

  const entries: ImportResolutionEntry[] = [
    {
      key: "@/exact/button",
      aliasBase: "@/exact/button",
      target: "./src/exact-button.tsx",
      emitMode: "strip_extension",
      hasWildcard: false,
      rootDir,
    },
    {
      key: "@/components/ui/*",
      aliasBase: "@/components/ui",
      target: "./src/components/ui/*.tsx",
      emitMode: "strip_extension",
      hasWildcard: true,
      rootDir,
    },
    {
      key: "@/*",
      aliasBase: "@",
      target: "./src/*",
      emitMode: "preserve_extension",
      hasWildcard: true,
      rootDir,
    },
  ]

  it("prefers exact match over wildcard matches", () => {
    const result = resolveImportEntryMatch("@/exact/button", entries)

    expect(result).toEqual({
      path: path.resolve(rootDir, "./src/exact-button.tsx"),
      matchedAlias: "@/exact/button",
      matchedTarget: "./src/exact-button.tsx",
      emitMode: "strip_extension",
    })
  })

  it("prefers longer (more specific) wildcard match over generic wildcard", () => {
    const result = resolveImportEntryMatch("@/components/ui/card", entries)

    expect(result).toEqual({
      path: path.resolve(rootDir, "./src/components/ui/card.tsx"),
      matchedAlias: "@/components/ui/*",
      matchedTarget: "./src/components/ui/*.tsx",
      emitMode: "strip_extension",
    })
  })

  it("falls back to generic wildcard when specific one does not match", () => {
    const result = resolveImportEntryMatch("@/lib/utils", entries)

    expect(result).toEqual({
      path: path.resolve(rootDir, "./src/lib/utils"),
      matchedAlias: "@/*",
      matchedTarget: "./src/*",
      emitMode: "preserve_extension",
    })
  })

  it("returns null when no entries match the import path", () => {
    expect(resolveImportEntryMatch("other-package/button", entries)).toBeNull()
  })

  it("resolves bare alias base matching a wildcard entry", () => {
    const result = resolveImportEntryMatch("@/components/ui", entries)

    expect(result).toEqual({
      path: path.resolve(rootDir, "./src/components/ui"),
      matchedAlias: "@/components/ui/*",
      matchedTarget: "./src/components/ui/*.tsx",
      emitMode: "strip_extension",
    })
  })
})
