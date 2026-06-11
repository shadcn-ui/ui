import fs from "fs"
import os from "os"
import path from "path"
import { describe, expect, it } from "vitest"

import { normalizeAddComponents } from "./add"

describe("normalizeAddComponents", () => {
  it("treats a literal wildcard as add-all", () => {
    expect(normalizeAddComponents(["*"], "/tmp/project")).toEqual({
      components: [],
      useAll: true,
    })
  })

  it("detects shell-expanded project roots and falls back to add-all", () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "shadcn-add-"))
    const components = [
      "app",
      "bun.lock",
      "components",
      "components.json",
      "package.json",
      "public",
    ]

    for (const item of components) {
      fs.writeFileSync(path.join(cwd, item), "")
    }

    try {
      expect(normalizeAddComponents(components, cwd)).toEqual({
        components: [],
        useAll: true,
      })
    } finally {
      fs.rmSync(cwd, { recursive: true, force: true })
    }
  })

  it("does not infer add-all for a single shell-expanded entry", () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "shadcn-add-"))
    fs.writeFileSync(path.join(cwd, "app"), "")

    try {
      expect(normalizeAddComponents(["app"], cwd)).toEqual({
        components: ["app"],
        useAll: false,
      })
    } finally {
      fs.rmSync(cwd, { recursive: true, force: true })
    }
  })

  it("does not infer add-all for multiple non-project path entries", () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "shadcn-add-"))
    const components = ["app", "components", "public"]

    for (const item of components) {
      fs.writeFileSync(path.join(cwd, item), "")
    }

    try {
      expect(normalizeAddComponents(components, cwd)).toEqual({
        components,
        useAll: false,
      })
    } finally {
      fs.rmSync(cwd, { recursive: true, force: true })
    }
  })

  it("does not infer add-all when path arguments look like registry sources", () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "shadcn-add-"))

    try {
      expect(normalizeAddComponents(["button", "card.json"], cwd)).toEqual({
        components: ["button", "card.json"],
        useAll: false,
      })
    } finally {
      fs.rmSync(cwd, { recursive: true, force: true })
    }
  })
})
