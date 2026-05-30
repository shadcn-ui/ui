import { mkdir, mkdtemp, rm } from "fs/promises"
import os from "os"
import path from "path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { getProjectInfo } from "./get-project-info"

vi.mock("fast-glob", () => {
  const glob = vi.fn((patterns: string | string[]) => {
    if (
      typeof patterns === "string" &&
      patterns.startsWith("**/{next,vite,astro,app}.config.")
    ) {
      const error = new Error("Permission denied")
      ;(error as { code?: string }).code = "EACCES"
      throw error
    }

    return []
  })

  return {
    default: {
      glob,
    },
  }
})

vi.mock("@/src/utils/get-package-info", () => ({
  getPackageInfo: vi.fn(async () => ({
    dependencies: {},
    devDependencies: {},
  })),
}))

vi.mock("@/src/utils/package-imports", () => ({
  getPackageImportAliases: vi.fn(async () => null),
  getPackageImportPrefix: vi.fn(() => null),
}))

vi.mock("tsconfig-paths", () => ({
  loadConfig: vi.fn(),
}))

describe("getProjectInfo", () => {
  let cwd: string

  beforeEach(async () => {
    cwd = await mkdtemp(path.join(os.tmpdir(), "shadcn-project-info-test-"))
  })

  afterEach(async () => {
    await rm(cwd, { recursive: true, force: true })
  })

  it("falls back to manual detection when framework config glob hits EACCES", async () => {
    await mkdir(path.join(cwd, "src"), { recursive: true })

    const projectInfo = await getProjectInfo(cwd)

    expect(projectInfo).toMatchObject({
      framework: {
        name: "manual",
      },
      isSrcDir: true,
      isTsx: false,
      isRSC: false,
      frameworkVersion: null,
      aliasPrefix: null,
    })
  })
})
