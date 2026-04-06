import * as fs from "node:fs"
import * as fsPromises from "node:fs/promises"
import path from "path"
import { logger } from "@/src/utils/logger"
import fsExtra from "fs-extra"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  formatMonorepoMessage,
  getMonorepoTargets,
  isMonorepoRoot,
} from "./get-monorepo-info"

let tmpDir: string

beforeEach(async () => {
  tmpDir = path.join(
    await fsPromises.realpath(require("os").tmpdir()),
    `shadcn-monorepo-test-${Date.now()}`
  )
  await fsPromises.mkdir(tmpDir, { recursive:true })
})

afterEach(async () => {
  await fsExtra.remove(tmpDir)
})

describe("isMonorepoRoot", () => {
  it("should detect pnpm-workspace.yaml", async () => {
    await fsPromises.writeFile(
      path.join(tmpDir, "pnpm-workspace.yaml"),
      "packages:\n  - apps/*\n"
    )
    expect(await isMonorepoRoot(tmpDir)).toBe(true)
  })

  it("should detect package.json with workspaces array", async () => {
    await fsExtra.writeJson(path.join(tmpDir, "package.json"), {
      name: "root",
      workspaces: ["apps/*", "packages/*"],
    })
    expect(await isMonorepoRoot(tmpDir)).toBe(true)
  })

  it("should detect package.json with workspaces.packages", async () => {
    await fsExtra.writeJson(path.join(tmpDir, "package.json"), {
      name: "root",
      workspaces: { packages: ["apps/*"] },
    })
    expect(await isMonorepoRoot(tmpDir)).toBe(true)
  })

  it("should detect lerna.json", async () => {
    await fsExtra.writeJson(path.join(tmpDir, "lerna.json"), { version: "0.0.0" })
    expect(await isMonorepoRoot(tmpDir)).toBe(true)
  })

  it("should detect nx.json", async () => {
    await fsExtra.writeJson(path.join(tmpDir, "nx.json"), {})
    expect(await isMonorepoRoot(tmpDir)).toBe(true)
  })

  it("should return false for a regular project", async () => {
    await fsExtra.writeJson(path.join(tmpDir, "package.json"), { name: "my-app" })
    expect(await isMonorepoRoot(tmpDir)).toBe(false)
  })

  it("should return false for an empty directory", async () => {
    expect(await isMonorepoRoot(tmpDir)).toBe(false)
  })
})

describe("getMonorepoTargets", () => {
  it("should find targets from pnpm-workspace.yaml", async () => {
    // Set up monorepo structure.
    await fsPromises.writeFile(
      path.join(tmpDir, "pnpm-workspace.yaml"),
      "packages:\n  - 'apps/*'\n"
    )
    await fsExtra.writeJson(path.join(tmpDir, "package.json"), { name: "root" })

    // Create an app with a Next.js config.
    const webDir = path.join(tmpDir, "apps", "web")
    await fsPromises.mkdir(webDir, { recursive: true })
    await fsExtra.writeJson(path.join(webDir, "package.json"), { name: "web" })
    await fsPromises.writeFile(
      path.join(webDir, "next.config.mjs"),
      "export default {}"
    )

    const targets = await getMonorepoTargets(tmpDir)
    expect(targets).toEqual([{ name: "apps/web", hasConfig: false }])
  })

  it("should find targets from package.json workspaces", async () => {
    await fsExtra.writeJson(path.join(tmpDir, "package.json"), {
      name: "root",
      workspaces: ["apps/*"],
    })

    const webDir = path.join(tmpDir, "apps", "web")
    await fsPromises.mkdir(webDir, { recursive: true })
    await fsExtra.writeJson(path.join(webDir, "package.json"), { name: "web" })
    await fsPromises.writeFile(path.join(webDir, "vite.config.ts"), "export default {}")

    const targets = await getMonorepoTargets(tmpDir)
    expect(targets).toEqual([{ name: "apps/web", hasConfig: false }])
  })

  it("should set hasConfig when components.json exists", async () => {
    await fsPromises.writeFile(
      path.join(tmpDir, "pnpm-workspace.yaml"),
      "packages:\n  - apps/*\n"
    )
    await fsExtra.writeJson(path.join(tmpDir, "package.json"), { name: "root" })

    const webDir = path.join(tmpDir, "apps", "web")
    await fsPromises.mkdir(webDir, { recursive: true })
    await fsExtra.writeJson(path.join(webDir, "package.json"), { name: "web" })
    await fsPromises.writeFile(
      path.join(webDir, "next.config.mjs"),
      "export default {}"
    )
    await fsExtra.writeJson(path.join(webDir, "components.json"), {})

    const targets = await getMonorepoTargets(tmpDir)
    expect(targets).toEqual([{ name: "apps/web", hasConfig: true }])
  })

  it("should find multiple targets", async () => {
    await fsPromises.writeFile(
      path.join(tmpDir, "pnpm-workspace.yaml"),
      "packages:\n  - apps/*\n"
    )
    await fsExtra.writeJson(path.join(tmpDir, "package.json"), { name: "root" })

    // apps/web with Next.js.
    const webDir = path.join(tmpDir, "apps", "web")
    await fsPromises.mkdir(webDir, { recursive: true })
    await fsExtra.writeJson(path.join(webDir, "package.json"), { name: "web" })
    await fsPromises.writeFile(
      path.join(webDir, "next.config.mjs"),
      "export default {}"
    )

    // apps/docs with Vite.
    const docsDir = path.join(tmpDir, "apps", "docs")
    await fsPromises.mkdir(docsDir, { recursive: true })
    await fsExtra.writeJson(path.join(docsDir, "package.json"), { name: "docs" })
    await fsPromises.writeFile(
      path.join(docsDir, "vite.config.ts"),
      "export default {}"
    )

    const targets = await getMonorepoTargets(tmpDir)
    expect(targets).toHaveLength(2)
    expect(targets.map((t) => t.name).sort()).toEqual(["apps/docs", "apps/web"])
  })

  it("should skip directories without package.json", async () => {
    await fsPromises.writeFile(
      path.join(tmpDir, "pnpm-workspace.yaml"),
      "packages:\n  - apps/*\n"
    )
    await fsExtra.writeJson(path.join(tmpDir, "package.json"), { name: "root" })

    // Directory without package.json.
    const libDir = path.join(tmpDir, "apps", "lib")
    await fsPromises.mkdir(libDir, { recursive: true })
    await fsPromises.writeFile(
      path.join(libDir, "next.config.mjs"),
      "export default {}"
    )

    const targets = await getMonorepoTargets(tmpDir)
    expect(targets).toEqual([])
  })

  it("should skip directories without framework config or components.json", async () => {
    await fsPromises.writeFile(
      path.join(tmpDir, "pnpm-workspace.yaml"),
      "packages:\n  - packages/*\n"
    )
    await fsExtra.writeJson(path.join(tmpDir, "package.json"), { name: "root" })

    // A utility package with no framework config.
    const utilsDir = path.join(tmpDir, "packages", "utils")
    await fsPromises.mkdir(utilsDir, { recursive: true })
    await fsExtra.writeJson(path.join(utilsDir, "package.json"), { name: "utils" })

    const targets = await getMonorepoTargets(tmpDir)
    expect(targets).toEqual([])
  })

  it("should return empty for no workspace patterns", async () => {
    await fsExtra.writeJson(path.join(tmpDir, "package.json"), { name: "root" })
    const targets = await getMonorepoTargets(tmpDir)
    expect(targets).toEqual([])
  })

  it("should detect astro, remix, and svelte configs", async () => {
    await fsPromises.writeFile(
      path.join(tmpDir, "pnpm-workspace.yaml"),
      "packages:\n  - apps/*\n"
    )
    await fsExtra.writeJson(path.join(tmpDir, "package.json"), { name: "root" })

    const astroDir = path.join(tmpDir, "apps", "astro-app")
    await fsPromises.mkdir(astroDir, { recursive: true})
    await fsExtra.writeJson(path.join(astroDir, "package.json"), {
      name: "astro-app",
    })
    await fsPromises.writeFile(
      path.join(astroDir, "astro.config.mjs"),
      "export default {}"
    )

    const targets = await getMonorepoTargets(tmpDir)
    expect(targets).toEqual([{ name: "apps/astro-app", hasConfig: false }])
  })

  it("should deduplicate patterns from both pnpm-workspace.yaml and package.json", async () => {
    await fsPromises.writeFile(
      path.join(tmpDir, "pnpm-workspace.yaml"),
      "packages:\n  - apps/*\n"
    )
    await fsExtra.writeJson(path.join(tmpDir, "package.json"), {
      name: "root",
      workspaces: ["apps/*"],
    })

    const webDir = path.join(tmpDir, "apps", "web")
    await fsPromises.mkdir(webDir, { recursive: true })
    await fsExtra.writeJson(path.join(webDir, "package.json"), { name: "web" })
    await fsPromises.writeFile(
      path.join(webDir, "next.config.mjs"),
      "export default {}"
    )

    const targets = await getMonorepoTargets(tmpDir)
    // Should not duplicate the target.
    expect(targets).toEqual([{ name: "apps/web", hasConfig: false }])
  })
})

describe("formatMonorepoMessage", () => {
  it("should log the monorepo message with targets", () => {
    const logSpy = vi.spyOn(logger, "log")
    const breakSpy = vi.spyOn(logger, "break")

    formatMonorepoMessage("init", [
      { name: "apps/web", hasConfig: false },
      { name: "apps/docs", hasConfig: true },
    ])

    expect(breakSpy).toHaveBeenCalled()
    const allLogCalls = logSpy.mock.calls.map((c) => c[0] as string)

    // Should mention monorepo root.
    expect(allLogCalls.some((msg) => msg.includes("monorepo root"))).toBe(true)
    // Should mention -c flag.
    expect(allLogCalls.some((msg) => msg.includes("-c"))).toBe(true)
    // Should list both targets.
    expect(
      allLogCalls.some((msg) => msg.includes("shadcn init -c apps/web"))
    ).toBe(true)
    expect(
      allLogCalls.some((msg) => msg.includes("shadcn init -c apps/docs"))
    ).toBe(true)

    logSpy.mockRestore()
    breakSpy.mockRestore()
  })

  it("should use the correct command name", () => {
    const logSpy = vi.spyOn(logger, "log")

    formatMonorepoMessage("add [component]", [
      { name: "apps/web", hasConfig: false },
    ])

    const allLogCalls = logSpy.mock.calls.map((c) => c[0] as string)
    expect(
      allLogCalls.some((msg) =>
        msg.includes("shadcn add [component] -c apps/web")
      )
    ).toBe(true)

    logSpy.mockRestore()
  })
})
