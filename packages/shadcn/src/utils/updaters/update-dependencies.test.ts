import { beforeEach, describe, expect, it, vi } from "vitest"

const { MockExecaError, mockExeca, mockGetPackageInfo, mockGetPackageManager } =
  vi.hoisted(() => {
    class MockExecaError extends Error {
      cause?: { code?: string }

      constructor(message: string, cause?: { code?: string }) {
        super(message)
        this.name = "ExecaError"
        this.cause = cause
      }
    }

    return {
      MockExecaError,
      mockExeca: vi.fn(),
      mockGetPackageInfo: vi.fn(),
      mockGetPackageManager: vi.fn(),
    }
  })

vi.mock("execa", () => ({
  ExecaError: MockExecaError,
  execa: mockExeca,
}))

vi.mock("@/src/utils/get-package-info", () => ({
  getPackageInfo: mockGetPackageInfo,
}))

vi.mock("@/src/utils/get-package-manager", () => ({
  getPackageManager: mockGetPackageManager,
}))

vi.mock("@/src/utils/spinner", () => ({
  spinner: () => ({
    start() {
      return this
    },
    succeed: vi.fn(),
    stopAndPersist: vi.fn(),
  }),
}))

vi.mock("prompts", () => ({
  default: vi.fn(),
}))

import { updateDependencies } from "./update-dependencies"

const config = {
  resolvedPaths: {
    cwd: "/test/project",
  },
} as any

describe("updateDependencies", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetPackageInfo.mockReturnValue({ dependencies: {} })
    mockGetPackageManager.mockResolvedValue("pnpm")
  })

  it("adds a package-manager install hint when the detected executable is missing", async () => {
    mockExeca.mockRejectedValueOnce(
      new MockExecaError("spawn pnpm ENOENT", { code: "ENOENT" })
    )

    await expect(
      updateDependencies(["radix-ui"], [], config, { silent: true })
    ).rejects.toThrow(
      "Detected pnpm for this project, but the pnpm executable was not found. Install it first, for example: npm install -g pnpm"
    )
  })

  it("keeps non-ENOENT package manager errors unchanged", async () => {
    mockExeca.mockRejectedValueOnce(
      new MockExecaError("Command failed with exit code 1", { code: "EPERM" })
    )

    await expect(
      updateDependencies(["radix-ui"], [], config, { silent: true })
    ).rejects.toThrow("Command failed with exit code 1")
  })
})
