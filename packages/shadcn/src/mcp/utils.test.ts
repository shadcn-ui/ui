import path from "path"
import { afterEach, describe, expect, it, vi } from "vitest"

vi.mock("@/src/registry/api", () => ({
  getRegistriesConfig: vi.fn(),
}))

vi.mock("@/src/utils/get-package-manager", () => ({
  getPackageRunner: vi.fn(async () => "pnpm dlx"),
}))

import { getRegistriesConfig } from "@/src/registry/api"

import { getMcpConfig, resolveMcpCwd } from "./utils"

describe("mcp utils cwd helpers", () => {
  const originalCwd = process.cwd()

  afterEach(() => {
    process.chdir(originalCwd)
    vi.clearAllMocks()
  })

  it("resolves an explicit cwd relative to the current working directory", () => {
    const targetCwd = path.dirname(originalCwd)
    const relativeTarget = path.relative(originalCwd, targetCwd) || "."

    expect(resolveMcpCwd(relativeTarget)).toBe(
      path.resolve(originalCwd, relativeTarget)
    )
  })

  it("falls back to process.cwd when no cwd is provided", () => {
    expect(resolveMcpCwd()).toBe(originalCwd)
  })

  it("uses the resolved cwd when loading MCP registries config", async () => {
    vi.mocked(getRegistriesConfig).mockResolvedValue({
      registries: {
        "@acme": "https://example.com/r/{name}.json",
      },
    } as any)

    const targetCwd = path.dirname(originalCwd)
    const relativeTarget = path.relative(originalCwd, targetCwd) || "."

    await getMcpConfig(relativeTarget)

    expect(getRegistriesConfig).toHaveBeenCalledWith(
      path.resolve(originalCwd, relativeTarget),
      {
        useCache: false,
      }
    )
  })
})
