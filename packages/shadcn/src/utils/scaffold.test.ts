import path from "path"
import { createTemplate } from "@/src/templates/create-template"
import { spinner } from "@/src/utils/spinner"
import { execa } from "execa"
import fs from "fs-extra"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("fs-extra")
vi.mock("execa")
vi.mock("@/src/utils/spinner")
vi.mock("@/src/utils/logger", () => ({
  logger: { break: vi.fn(), error: vi.fn(), info: vi.fn() },
}))

let mockSpinner: Record<string, ReturnType<typeof vi.fn>>

function setupMocks() {
  mockSpinner = {
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    fail: vi.fn().mockReturnThis(),
  }

  vi.mocked(fs.ensureDir).mockResolvedValue(undefined)
  vi.mocked(fs.writeFile).mockResolvedValue(undefined)
  vi.mocked(fs.move).mockResolvedValue(undefined)
  vi.mocked(fs.remove).mockResolvedValue(undefined)
  vi.mocked(fs.existsSync).mockReturnValue(false)
  vi.mocked(fs.copy).mockResolvedValue(undefined)

  vi.mocked(execa).mockResolvedValue({
    stdout: "",
    stderr: "",
    exitCode: 0,
  } as any)

  vi.mocked(spinner).mockReturnValue(mockSpinner as any)
}

describe("defaultScaffold", () => {
  const originalEnv = { ...process.env }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockExit: any

  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.SHADCN_TEMPLATE_DIR
    delete process.env.SHADCN_GITHUB_URL
    mockExit = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never)
    setupMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
    mockExit.mockRestore()
    process.env = { ...originalEnv }
  })

  function createTestTemplate() {
    return createTemplate({
      name: "next",
      title: "Next.js",
      defaultProjectName: "next-app",
      templateDir: "next-app",
      create: vi.fn(),
    })
  }

  it("should clone the repo with sparse checkout", async () => {
    const template = createTestTemplate()

    await template.scaffold({
      projectPath: "/test/my-app",
      packageManager: "pnpm",
      cwd: "/test",
    })

    // Should clone with --depth 1, --filter=blob:none, --sparse.
    expect(vi.mocked(execa)).toHaveBeenCalledWith("git", [
      "clone",
      "--depth",
      "1",
      "--filter=blob:none",
      "--sparse",
      "https://github.com/shadcn-ui/ui.git",
      expect.stringContaining("shadcn-template-"),
    ])

    // Should set sparse-checkout to the template directory.
    expect(vi.mocked(execa)).toHaveBeenCalledWith("git", [
      "-C",
      expect.stringContaining("shadcn-template-"),
      "sparse-checkout",
      "set",
      "templates/next-app",
    ])
  })

  it("should move template directory to project path", async () => {
    const template = createTestTemplate()

    await template.scaffold({
      projectPath: "/test/my-app",
      packageManager: "pnpm",
      cwd: "/test",
    })

    expect(vi.mocked(fs.move)).toHaveBeenCalledWith(
      expect.stringContaining(path.join("templates", "next-app")),
      "/test/my-app"
    )
  })

  it("should clean up the temp directory after extraction", async () => {
    const template = createTestTemplate()

    await template.scaffold({
      projectPath: "/test/my-app",
      packageManager: "pnpm",
      cwd: "/test",
    })

    expect(vi.mocked(fs.remove)).toHaveBeenCalledWith(
      expect.stringContaining("shadcn-template-")
    )
  })

  it("should use local templates when SHADCN_TEMPLATE_DIR is set", async () => {
    process.env.SHADCN_TEMPLATE_DIR = "/local/templates"

    const template = createTestTemplate()

    await template.scaffold({
      projectPath: "/test/my-app",
      packageManager: "pnpm",
      cwd: "/test",
    })

    // Should not call git clone.
    const execaCalls = vi.mocked(execa).mock.calls
    expect(
      execaCalls.some(
        (call) => call[0] === "git" && (call[1] as string[]).includes("clone")
      )
    ).toBe(false)

    expect(vi.mocked(fs.copy)).toHaveBeenCalledWith(
      path.resolve("/local/templates", "next-app"),
      "/test/my-app",
      expect.objectContaining({ filter: expect.any(Function) })
    )
  })

  it("should exit on git clone failure", async () => {
    vi.mocked(execa).mockRejectedValueOnce(new Error("git clone failed"))

    const template = createTestTemplate()

    await template.scaffold({
      projectPath: "/test/my-app",
      packageManager: "pnpm",
      cwd: "/test",
    })

    expect(mockSpinner.fail).toHaveBeenCalled()
    expect(mockExit).toHaveBeenCalledWith(1)
  })

  it("should remove pnpm-lock.yaml for non-pnpm package managers", async () => {
    vi.mocked(fs.existsSync).mockImplementation((p: any) =>
      p.toString().includes("pnpm-lock.yaml")
    )

    const template = createTestTemplate()

    await template.scaffold({
      projectPath: "/test/my-app",
      packageManager: "npm",
      cwd: "/test",
    })

    expect(vi.mocked(fs.remove)).toHaveBeenCalledWith(
      path.join("/test/my-app", "pnpm-lock.yaml")
    )
  })

  it("should not remove pnpm-lock.yaml when using pnpm", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)

    const template = createTestTemplate()

    await template.scaffold({
      projectPath: "/test/my-app",
      packageManager: "pnpm",
      cwd: "/test",
    })

    // fs.remove is called for temp dir cleanup, but not for pnpm-lock.yaml.
    const removeCalls = vi.mocked(fs.remove).mock.calls
    expect(
      removeCalls.some((call) => call[0].toString().includes("pnpm-lock.yaml"))
    ).toBe(false)
  })

  it("should run package manager install", async () => {
    const template = createTestTemplate()

    await template.scaffold({
      projectPath: "/test/my-app",
      packageManager: "bun",
      cwd: "/test",
    })

    expect(vi.mocked(execa)).toHaveBeenCalledWith("bun", ["install"], {
      cwd: "/test/my-app",
    })
  })

  it("should pass --no-frozen-lockfile for pnpm", async () => {
    const template = createTestTemplate()

    await template.scaffold({
      projectPath: "/test/my-app",
      packageManager: "pnpm",
      cwd: "/test",
    })

    expect(vi.mocked(execa)).toHaveBeenCalledWith(
      "pnpm",
      ["install", "--no-frozen-lockfile"],
      { cwd: "/test/my-app" }
    )
  })

  it("should strip packageManager field from package.json for non-pnpm", async () => {
    vi.mocked(fs.existsSync).mockImplementation((p: any) =>
      p.toString().includes("package.json")
    )
    vi.mocked(fs.readFile).mockResolvedValue(
      JSON.stringify({
        name: "my-app",
        packageManager: "pnpm@9.0.0",
      }) as any
    )

    const template = createTestTemplate()

    await template.scaffold({
      projectPath: "/test/my-app",
      packageManager: "bun",
      cwd: "/test",
    })

    // The first writeFile call is from adaptWorkspaceConfig.
    const writeCalls = vi.mocked(fs.writeFile).mock.calls
    const adaptCall = writeCalls.find(
      (call) => call[0] === path.join("/test/my-app", "package.json")
    )
    expect(adaptCall).toBeDefined()
    const written = JSON.parse(adaptCall![1] as string)
    expect(written.packageManager).toBeUndefined()
  })

  it("should convert pnpm-workspace.yaml to workspaces field for non-pnpm monorepo", async () => {
    vi.mocked(fs.existsSync).mockImplementation((p: any) => {
      const s = p.toString()
      return s.includes("pnpm-workspace.yaml") || s.includes("package.json")
    })

    // Return different content based on which file is being read.
    vi.mocked(fs.readFile).mockImplementation(((filePath: string) => {
      if (filePath.includes("pnpm-workspace.yaml")) {
        return Promise.resolve("packages:\n  - 'apps/*'\n  - 'packages/*'\n")
      }
      return Promise.resolve(
        JSON.stringify({ name: "my-mono", packageManager: "pnpm@9.0.0" })
      )
    }) as any)

    const template = createTestTemplate()

    await template.scaffold({
      projectPath: "/test/my-app",
      packageManager: "bun",
      cwd: "/test",
    })

    // Should remove pnpm-workspace.yaml.
    expect(vi.mocked(fs.remove)).toHaveBeenCalledWith(
      path.join("/test/my-app", "pnpm-workspace.yaml")
    )

    // Should write workspaces array to package.json.
    const writeCalls = vi.mocked(fs.writeFile).mock.calls
    const adaptCall = writeCalls.find(
      (call) => call[0] === path.join("/test/my-app", "package.json")
    )
    expect(adaptCall).toBeDefined()
    const written = JSON.parse(adaptCall![1] as string)
    expect(written.workspaces).toEqual(["apps/*", "packages/*"])
    expect(written.packageManager).toBeUndefined()
  })

  it("should rewrite workspace: protocol refs to * for npm monorepo", async () => {
    vi.mocked(fs.existsSync).mockImplementation((p: any) => {
      const s = p.toString()
      return s.includes("pnpm-workspace.yaml") || s.includes("package.json")
    })

    const rootPkg = JSON.stringify({
      name: "my-mono",
      packageManager: "pnpm@9.0.0",
    })
    const nestedPkg = JSON.stringify({
      name: "web",
      dependencies: { "@workspace/ui": "workspace:*" },
    })

    vi.mocked(fs.readFile).mockImplementation(((filePath: string) => {
      if (filePath.includes("pnpm-workspace.yaml")) {
        return Promise.resolve("packages:\n  - 'apps/*'\n")
      }
      if (filePath.includes("apps")) {
        return Promise.resolve(nestedPkg)
      }
      return Promise.resolve(rootPkg)
    }) as any)

    // Mock readdir for the recursive rewriteWorkspaceProtocol walk.
    vi.mocked(fs.readdir).mockImplementation(((dir: string) => {
      if (dir === "/test/my-app") {
        return Promise.resolve([
          { name: "apps", isDirectory: () => true },
          { name: "package.json", isDirectory: () => false },
        ])
      }
      if (dir.includes("apps")) {
        return Promise.resolve([
          { name: "package.json", isDirectory: () => false },
        ])
      }
      return Promise.resolve([])
    }) as any)

    const template = createTestTemplate()

    await template.scaffold({
      projectPath: "/test/my-app",
      packageManager: "npm",
      cwd: "/test",
    })

    // Should have rewritten workspace:* to * in nested package.json.
    const writeCalls = vi.mocked(fs.writeFile).mock.calls
    const nestedWrite = writeCalls.find(
      (call) =>
        (call[0] as string).includes("apps") &&
        (call[0] as string).includes("package.json")
    )
    expect(nestedWrite).toBeDefined()
    const written = JSON.parse(nestedWrite![1] as string)
    expect(written.dependencies["@workspace/ui"]).toBe("*")
  })

  it("should not rewrite workspace: protocol refs for bun", async () => {
    vi.mocked(fs.existsSync).mockImplementation((p: any) => {
      const s = p.toString()
      return s.includes("pnpm-workspace.yaml") || s.includes("package.json")
    })

    vi.mocked(fs.readFile).mockImplementation(((filePath: string) => {
      if (filePath.includes("pnpm-workspace.yaml")) {
        return Promise.resolve("packages:\n  - 'apps/*'\n")
      }
      return Promise.resolve(
        JSON.stringify({ name: "my-mono", packageManager: "pnpm@9.0.0" })
      )
    }) as any)

    const template = createTestTemplate()

    await template.scaffold({
      projectPath: "/test/my-app",
      packageManager: "bun",
      cwd: "/test",
    })

    // readdir should not be called since rewriteWorkspaceProtocol is skipped for bun.
    expect(vi.mocked(fs.readdir)).not.toHaveBeenCalled()
  })

  it("should write project name to package.json", async () => {
    vi.mocked(fs.existsSync).mockImplementation((p: any) =>
      p.toString().includes("package.json")
    )
    vi.mocked(fs.readFile).mockResolvedValue(
      JSON.stringify({ name: "template-name" }) as any
    )

    const template = createTestTemplate()

    await template.scaffold({
      projectPath: "/test/my-app",
      packageManager: "pnpm",
      cwd: "/test",
    })

    expect(vi.mocked(fs.writeFile)).toHaveBeenCalledWith(
      path.join("/test/my-app", "package.json"),
      JSON.stringify({ name: "my-app" }, null, 2) + "\n"
    )
  })
})
