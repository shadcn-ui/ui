import { getConfig } from "@/src/utils/get-config"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { handleError } from "@/src/utils/handle-error"
import { execa } from "execa"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { mcp } from "./mcp"

vi.mock("fs", () => ({
  promises: {
    readFile: vi.fn().mockRejectedValue(new Error("not found")),
    writeFile: vi.fn(),
  },
}))

vi.mock("execa", () => ({
  execa: vi.fn(),
}))

vi.mock("fs-extra", () => ({
  default: {
    ensureDir: vi.fn(),
  },
}))

vi.mock("@/src/mcp", () => ({
  server: {
    connect: vi.fn(),
  },
}))

vi.mock("@/src/utils/get-config", () => ({
  getConfig: vi.fn(),
}))

vi.mock("@/src/utils/get-package-manager", () => ({
  getPackageManager: vi.fn(),
}))

vi.mock("@/src/utils/handle-error", () => ({
  handleError: vi.fn(),
}))

vi.mock("@/src/utils/logger", () => ({
  logger: {
    break: vi.fn(),
    info: vi.fn(),
    log: vi.fn(),
    success: vi.fn(),
  },
}))

vi.mock("@/src/utils/spinner", () => ({
  spinner: vi.fn(() => {
    const instance = {
      start: vi.fn(),
      succeed: vi.fn(),
    }
    instance.start.mockReturnValue(instance)
    return instance
  }),
}))

vi.mock("@/src/utils/updaters/update-dependencies", () => ({
  updateDependencies: vi.fn(),
}))

describe("mcp init", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getConfig).mockResolvedValue(null)
    vi.mocked(getPackageManager).mockResolvedValue("deno")
    vi.mocked(execa).mockResolvedValue({} as never)
  })

  it("prefixes npm dependencies when installing with deno", async () => {
    await mcp.parseAsync(
      ["--cwd", "/test/project", "init", "--client", "vscode"],
      { from: "user" }
    )

    expect(handleError).not.toHaveBeenCalled()
    expect(execa).toHaveBeenCalledWith(
      "deno",
      ["add", "-D", "npm:shadcn@latest"],
      { cwd: "/test/project" }
    )
  })
})
