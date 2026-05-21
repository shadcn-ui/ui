import * as fs from "fs/promises"
import { tmpdir } from "os"
import * as path from "path"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { validate } from "./validate"

vi.mock("@/src/utils/handle-error", () => ({
  handleError: vi.fn((error) => {
    throw error
  }),
}))

vi.mock("@/src/utils/highlighter", () => ({
  highlighter: {
    error: (value: string) => value,
    info: (value: string) => value,
    success: (value: string) => value,
  },
}))

vi.mock("@/src/utils/logger", () => ({
  logger: {
    break: vi.fn(),
    error: vi.fn(),
    log: vi.fn(),
  },
}))

vi.mock("@/src/utils/spinner", () => ({
  spinner: vi.fn(() => ({
    fail: vi.fn(),
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn(),
  })),
}))

describe("registry validate command", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.exitCode = undefined
  })

  it("prints success with checked counts", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        items: [],
      }),
    })

    await validate.parseAsync(["registry.json", "--cwd", cwd], {
      from: "user",
    })

    const validationSpinner = vi.mocked(spinner).mock.results[0].value
    const summarySpinner = vi.mocked(spinner).mock.results[1].value
    expect(validationSpinner.succeed).toHaveBeenCalledWith("Registry is valid.")
    expect(spinner).toHaveBeenCalledWith("Checked 1 registry file and 0 items.")
    expect(summarySpinner.succeed).toHaveBeenCalled()
    expect(logger.log).toHaveBeenCalledWith("  - registry.json")
    expect(
      vi.mocked(logger.log).mock.calls.map(([message]) => message)
    ).toEqual(["  - registry.json"])
    expect(process.exitCode).toBeUndefined()
  })

  it("prints grouped diagnostics and sets a failing exit code", async () => {
    const cwd = await createFixture({
      "registry.json": JSON.stringify({
        name: "example",
        homepage: "https://example.com",
        include: ["components/ui/registry.json"],
      }),
      "components/ui/registry.json": JSON.stringify({
        items: [
          {
            name: "button",
            type: "registry:ui",
            files: [
              {
                path: "missing.tsx",
                type: "registry:ui",
              },
            ],
          },
        ],
      }),
    })

    await validate.parseAsync(["registry.json", "--cwd", cwd], {
      from: "user",
    })

    const validationSpinner = vi.mocked(spinner).mock.results[0].value
    expect(validationSpinner.fail).toHaveBeenCalledWith(
      "Registry validation failed."
    )
    expect(spinner).toHaveBeenCalledTimes(1)
    expect(logger.log).toHaveBeenCalledWith(
      "  Checked 2 registry files and 1 item."
    )
    expect(logger.log).toHaveBeenCalledWith("  - registry.json")
    expect(logger.log).toHaveBeenCalledWith("  - components/ui/registry.json")
    expect(logger.log).toHaveBeenCalledWith("components/ui/registry.json")
    expect(logger.error).toHaveBeenCalledWith(
      '  - items[0] "button" file "missing.tsx": File "missing.tsx" was not found or could not be read.'
    )
    expect(
      vi.mocked(logger.log).mock.calls.map(([message]) => message)
    ).toEqual([
      "  Checked 2 registry files and 1 item.",
      "  - registry.json",
      "  - components/ui/registry.json",
      "components/ui/registry.json",
      "    Make sure the file path is relative to the registry.json file that declares the item.",
    ])
    expect(process.exitCode).toBe(1)
  })
})

async function createFixture(files: Record<string, string>) {
  const cwd = await fs.mkdtemp(path.join(tmpdir(), "shadcn-validate-command-"))

  await Promise.all(
    Object.entries(files).map(async ([filePath, content]) => {
      const targetPath = path.join(cwd, filePath)
      await fs.mkdir(path.dirname(targetPath), { recursive: true })
      await fs.writeFile(targetPath, content)
    })
  )

  return cwd
}
