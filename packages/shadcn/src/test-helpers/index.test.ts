import fs from "fs-extra"
import { describe, expect, it } from "vitest"

import { getFixturesDir, withTempDir } from "@/src/test-helpers"

describe("getFixturesDir", () => {
  it("resolves an absolute path into test/fixtures", async () => {
    const dir = getFixturesDir("config-partial")
    expect(await fs.pathExists(dir)).toBe(true)
  })
})

describe("withTempDir", () => {
  it("passes an existing directory to the callback", async () => {
    let capturedDir = ""
    await withTempDir(async (dir) => {
      capturedDir = dir
      expect(await fs.pathExists(dir)).toBe(true)
    })
    expect(capturedDir).not.toBe("")
  })

  it("removes the directory after the callback resolves", async () => {
    let capturedDir = ""
    await withTempDir(async (dir) => {
      capturedDir = dir
    })
    expect(await fs.pathExists(capturedDir)).toBe(false)
  })

  it("passes through the callback's return value", async () => {
    const result = await withTempDir(async () => "hello")
    expect(result).toBe("hello")
  })

  it("cleans up the directory even when the callback throws", async () => {
    let capturedDir = ""
    await expect(
      withTempDir(async (dir) => {
        capturedDir = dir
        throw new Error("boom")
      })
    ).rejects.toThrow("boom")
    expect(await fs.pathExists(capturedDir)).toBe(false)
  })
})
