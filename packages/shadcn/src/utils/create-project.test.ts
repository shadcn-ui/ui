import { fetchRegistry } from "@/src/registry/fetcher"
import { spinner } from "@/src/utils/spinner"
import { execa } from "execa"
import fs from "fs-extra"
import prompts from "prompts"
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from "vitest"

import { TEMPLATES, createProject } from "./create-project"

// Mock dependencies
vi.mock("fs-extra")
vi.mock("execa")
vi.mock("prompts")
vi.mock("@/src/registry/fetcher")
vi.mock("@/src/utils/get-package-manager", () => ({
  getPackageManager: vi.fn().mockResolvedValue("npm"),
}))
vi.mock("@/src/utils/spinner")
vi.mock("@/src/utils/logger", () => ({
  logger: {
    break: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}))

describe("createProject", () => {
  let mockExit: MockInstance

  beforeEach(() => {
    vi.clearAllMocks()

    // Reset all fs mocks
    vi.mocked(fs.access).mockResolvedValue(undefined)
    vi.mocked(fs.existsSync).mockReturnValue(false)
    vi.mocked(fs.ensureDir).mockResolvedValue(undefined)
    vi.mocked(fs.writeFile).mockResolvedValue(undefined)
    vi.mocked(fs.move).mockResolvedValue(undefined)
    vi.mocked(fs.remove).mockResolvedValue(undefined)

    // Mock execa to resolve immediately without actual execution
    vi.mocked(execa).mockResolvedValue({
      stdout: "",
      stderr: "",
      exitCode: 0,
      signal: undefined,
      signalDescription: undefined,
      command: "",
      escapedCommand: "",
      failed: false,
      timedOut: false,
      isCanceled: false,
      killed: false,
    } as any)

    // Mock fetch for monorepo template
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    } as any)

    // Reset prompts mock
    vi.mocked(prompts).mockResolvedValue({ type: "next", name: "my-app" })

    // Reset registry mock
    vi.mocked(fetchRegistry).mockResolvedValue([])

    // Mock spinner function
    const mockSpinner = {
      start: vi.fn().mockReturnThis(),
      succeed: vi.fn().mockReturnThis(),
      fail: vi.fn().mockReturnThis(),
      stop: vi.fn().mockReturnThis(),
      text: "",
      prefixText: "",
      suffixText: "",
      color: "cyan" as const,
      indent: 0,
      spinner: "dots" as const,
      isSpinning: false,
      interval: 100,
      stream: process.stderr,
      clear: vi.fn(),
      render: vi.fn(),
      frame: vi.fn(),
      stopAndPersist: vi.fn(),
      warn: vi.fn(),
      info: vi.fn(),
    }
    vi.mocked(spinner).mockReturnValue(mockSpinner as any)
  })

  afterEach(() => {
    vi.resetAllMocks()
    mockExit?.mockRestore()
    delete (global as any).fetch
  })

  it("should create a Next.js project with default options", async () => {
    vi.mocked(prompts).mockResolvedValue({ type: "next", name: "my-app" })

    const result = await createProject({
      cwd: "/test",
      force: false,
      srcDir: false,
    })

    expect(result).toEqual({
      projectPath: "/test/my-app",
      projectName: "my-app",
      template: TEMPLATES.next,
    })

    expect(execa).toHaveBeenCalledWith(
      "npx",
      expect.arrayContaining(["create-next-app@15", "/test/my-app"]),
      expect.any(Object)
    )
  })

  it("should create a Next.js 16 project when next-16 template is selected", async () => {
    vi.mocked(prompts).mockResolvedValue({ type: "next-16", name: "my-app" })

    const result = await createProject({
      cwd: "/test",
      force: false,
      srcDir: false,
    })

    expect(result).toEqual({
      projectPath: "/test/my-app",
      projectName: "my-app",
      template: TEMPLATES["next-16"],
    })

    expect(execa).toHaveBeenCalledWith(
      "npx",
      expect.arrayContaining([
        "create-next-app@latest",
        "/test/my-app",
        "--no-react-compiler",
      ]),
      expect.any(Object)
    )
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
    })

    expect(result).toEqual({
      projectPath: "/test/my-monorepo",
      projectName: "my-monorepo",
      template: TEMPLATES["next-monorepo"],
    })
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
    })

    expect(result.template).toBe(TEMPLATES.next)
  })

  it("should throw error if project path already exists", async () => {
    // Mock fs.existsSync to return true only for the specific package.json path
    vi.mocked(fs.existsSync).mockImplementation((path: any) => {
      return path.toString().includes("existing-app/package.json")
    })
    vi.mocked(prompts).mockResolvedValue({ type: "next", name: "existing-app" })

    mockExit = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never)

    await createProject({
      cwd: "/test",
      force: false,
    })

    expect(mockExit).toHaveBeenCalledWith(1)
  })

  it("should throw error if path is not writable", async () => {
    vi.mocked(fs.access).mockRejectedValue(new Error("Permission denied"))
    vi.mocked(prompts).mockResolvedValue({ type: "next", name: "my-app" })

    mockExit = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never)

    await createProject({
      cwd: "/test",
      force: false,
    })

    expect(mockExit).toHaveBeenCalledWith(1)
  })

  it("should include --no-react-compiler flag for Next.js 16 (latest)", async () => {
    vi.mocked(prompts).mockResolvedValue({ type: "next-16", name: "my-app" })

    await createProject({
      cwd: "/test",
      force: false,
      srcDir: false,
    })

    expect(execa).toHaveBeenCalledWith(
      "npx",
      expect.arrayContaining(["--no-react-compiler"]),
      expect.any(Object)
    )
  })

  it("should not include --no-react-compiler flag for Next.js 15", async () => {
    vi.mocked(prompts).mockResolvedValue({ type: "next", name: "my-app" })

    await createProject({
      cwd: "/test",
      force: false,
      srcDir: false,
    })

    const execaCalls = vi.mocked(execa).mock.calls
    const createNextCall = execaCalls.find(
      (call) => Array.isArray(call[1]) && call[1].includes("create-next-app@15")
    )

    expect(createNextCall).toBeDefined()
    expect(createNextCall?.[1]).not.toContain("--no-react-compiler")
  })
})
