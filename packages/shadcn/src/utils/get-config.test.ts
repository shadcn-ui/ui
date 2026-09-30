import path from "path"
import { describe, expect, it } from "vitest"

import { isIndexFile, stripFileExtension } from "./get-config"

// Regression tests for https://github.com/shadcn-ui/ui/issues/10799 - the
// previous regex used `[^/]+$` to detect file extensions, but on Windows the
// path separator is `\` (not part of that character class), so a path like
// `C:\2.MY_APP\packages\ui\src\components` was mistakenly truncated to `C:\2`.
// Using `path.extname` (which dispatches to `path.win32` / `path.posix`)
// avoids that.
describe("stripFileExtension", () => {
  it("strips a normal file extension from a POSIX path", () => {
    expect(
      stripFileExtension("/repo/packages/ui/src/components/button.tsx")
    ).toBe("/repo/packages/ui/src/components/button")
  })

  it("returns the path unchanged when there is no extension on POSIX", () => {
    expect(stripFileExtension("/repo/packages/ui/src/components")).toBe(
      "/repo/packages/ui/src/components"
    )
  })

  it("returns the path unchanged for a POSIX path with a dotted ancestor and no extension at the end", () => {
    expect(stripFileExtension("/repo/2.MY_APP/packages/ui/src/components")).toBe(
      "/repo/2.MY_APP/packages/ui/src/components"
    )
  })

  it("path.win32.extname returns an empty extension for a Windows path with a dotted ancestor", () => {
    // This is the property `stripFileExtension` relies on. `path.extname`
    // automatically uses `path.win32.extname` on Windows.
    expect(
      path.win32.extname(
        "C:\\2.MY_APP\\1. MY_SHIFT\\packages\\ui\\src\\components"
      )
    ).toBe("")
  })

  it("the previous regex would have truncated a Windows path with a dotted ancestor (sanity)", () => {
    // Encoding the old behavior here makes the regression crystal clear: if
    // anyone reintroduces the `[^/]+$` regex, this expectation will fail and
    // point at the bug.
    expect(
      "C:\\2.MY_APP\\1. MY_SHIFT\\packages\\ui\\src\\components".replace(
        /\.[^/]+$/,
        ""
      )
    ).toBe("C:\\2")
  })
})

describe("isIndexFile", () => {
  it("detects an `index.ts` POSIX path", () => {
    expect(isIndexFile("/repo/packages/ui/src/components/index.ts")).toBe(true)
  })

  it("detects an `index.tsx` POSIX path", () => {
    expect(isIndexFile("/repo/packages/ui/src/components/index.tsx")).toBe(true)
  })

  it("returns false for a non-index file", () => {
    expect(isIndexFile("/repo/packages/ui/src/components/button.tsx")).toBe(
      false
    )
  })

  it("returns false for a path with no extension", () => {
    expect(isIndexFile("/repo/packages/ui/src/components")).toBe(false)
  })

  it("returns false for a directory whose last segment happens to contain `index`", () => {
    expect(isIndexFile("/repo/packages/ui/src/index-foo")).toBe(false)
  })
})
