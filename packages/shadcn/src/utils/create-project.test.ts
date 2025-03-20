import { fetchRegistry } from "@/src/registry/api"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { LINTERS } from "@/src/utils/linter"
import { execa } from "execa"
import fs from "fs-extra"
import prompts from "prompts"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { TEMPLATES, createProject } from "./create-project"

// Mock dependencies
vi.mock("fs-extra")
vi.mock("execa")
vi.mock("prompts")
vi.mock("@/src/registry/api")
vi.mock("@/src/utils/get-package-manager", () => ({
  getPackageManager: vi.fn().mockResolvedValue("npm"),
}))

describe("createProject", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(fs.access).mockResolvedValue(undefined)
    vi.mocked(fs.existsSync).mockReturnValue(false)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it("should create a Next.js project with default options", async () => {
    vi.mocked(prompts).mockResolvedValue({ type: "next", name: "my-app" })

    const result = await createProject({
      cwd: "/test",
      force: false,
      srcDir: false,
      linter: LINTERS.eslint,
    })

    expect(result).toEqual({
      projectPath: "/test/my-app",
      projectName: "my-app",
      template: TEMPLATES.next,
    })

    expect(execa).toHaveBeenCalledWith(
      "npx",
      expect.arrayContaining(["create-next-app@latest", "/test/my-app"]),
      expect.any(Object)
    )
  })

  it("should create a Next.js project with Biome instead of ESLint", async () => {
    vi.mocked(prompts).mockResolvedValue({ type: "next", name: "my-app" })
    vi.mocked(fs.pathExists).mockImplementation(() => Promise.resolve(false))
    vi.mocked(fs.readJSON).mockResolvedValue({
      scripts: {},
      devDependencies: {},
    })

    const result = await createProject({
      cwd: "/test",
      force: false,
      srcDir: false,
      linter: LINTERS.biome,
    })

    expect(result).toEqual({
      projectPath: "/test/my-app",
      projectName: "my-app",
      template: TEMPLATES.next,
    })

    // Verify create-next-app is called with --no-eslint
    const createNextAppCall = vi
      .mocked(execa)
      .mock.calls.find(
        (call) =>
          call[1] &&
          Array.isArray(call[1]) &&
          call[1].includes("create-next-app@latest")
      )
    expect(createNextAppCall).toBeTruthy()
    if (createNextAppCall) {
      expect(createNextAppCall[1]).toContain("--no-eslint")
    }

    // Verify package.json was updated with Biome scripts
    const writeJSONCall = vi
      .mocked(fs.writeJSON)
      .mock.calls.find(
        (call) =>
          typeof call[0] === "string" && call[0].includes("package.json")
      )
    expect(writeJSONCall).toBeTruthy()
    if (
      writeJSONCall &&
      writeJSONCall[1] &&
      typeof writeJSONCall[1] === "object"
    ) {
      const pkgJson = writeJSONCall[1] as { scripts?: Record<string, string> }
      expect(pkgJson.scripts).toHaveProperty("lint", "biome lint .")
      expect(pkgJson.scripts).toHaveProperty("format", "biome format --write .")
      expect(pkgJson.scripts).toHaveProperty("check", "biome check .")
    }
  })

  it("should create a monorepo project when selected", async () => {
    vi.mocked(prompts).mockResolvedValue({
      type: "next-monorepo",
      name: "my-monorepo",
    })

    const result = await createProject({
      cwd: "/test",
      force: false,
      srcDir: false,
      linter: LINTERS.eslint,
    })

    expect(result).toEqual({
      projectPath: "/test/my-monorepo",
      projectName: "my-monorepo",
      template: TEMPLATES["next-monorepo"],
    })
  })

  it("should create a monorepo project with Biome instead of ESLint", async () => {
    vi.mocked(prompts).mockResolvedValue({
      type: "next-monorepo",
      name: "my-monorepo",
    })
    vi.mocked(fs.pathExists).mockImplementation(() => Promise.resolve(false))
    vi.mocked(fs.readJSON).mockResolvedValue({
      scripts: {},
      devDependencies: {},
    })
    vi.mocked(fs.readdir).mockImplementation(() =>
      Promise.resolve(["example-pkg"])
    )

    const result = await createProject({
      cwd: "/test",
      force: false,
      srcDir: false,
      linter: LINTERS.biome,
    })

    expect(result).toEqual({
      projectPath: "/test/my-monorepo",
      projectName: "my-monorepo",
      template: TEMPLATES["next-monorepo"],
    })

    // Verify package.json was updated with Biome scripts
    const writeJSONCall = vi
      .mocked(fs.writeJSON)
      .mock.calls.find(
        (call) =>
          typeof call[0] === "string" && call[0].includes("package.json")
      )
    expect(writeJSONCall).toBeTruthy()
    if (
      writeJSONCall &&
      writeJSONCall[1] &&
      typeof writeJSONCall[1] === "object"
    ) {
      const pkgJson = writeJSONCall[1] as { scripts?: Record<string, string> }
      expect(pkgJson.scripts).toHaveProperty("lint", "biome lint .")
      expect(pkgJson.scripts).toHaveProperty("format", "biome format --write .")
      expect(pkgJson.scripts).toHaveProperty("check", "biome check .")
    }
  })

  it("should handle remote components and force next template", async () => {
    vi.mocked(fetchRegistry).mockResolvedValue([
      {
        meta: { nextVersion: "13.0.0" },
      },
    ])

    const result = await createProject({
      cwd: "/test",
      force: true,
      components: ["/chat/b/some-component"],
      linter: LINTERS.eslint,
    })

    expect(result.template).toBe(TEMPLATES.next)
  })

  it("should throw error if project path already exists", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(prompts).mockResolvedValue({
      type: "next",
      name: "existing-app",
    })

    const mockExit = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never)

    await createProject({
      cwd: "/test",
      force: false,
      linter: LINTERS.eslint,
    })

    expect(mockExit).toHaveBeenCalledWith(1)
  })

  it("should throw error if path is not writable", async () => {
    vi.mocked(fs.access).mockRejectedValue(new Error("Permission denied"))
    vi.mocked(prompts).mockResolvedValue({ type: "next", name: "my-app" })

    const mockExit = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never)

    await createProject({
      cwd: "/test",
      force: false,
      linter: LINTERS.eslint,
    })

    expect(mockExit).toHaveBeenCalledWith(1)
  })
})
