import { detect } from "@antfu/ni"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { getPackageManager } from "./get-package-manager"

vi.mock("@antfu/ni", () => ({
  detect: vi.fn(),
}))

describe("getPackageManager", () => {
  const originalUserAgent = process.env.npm_config_user_agent

  beforeEach(() => {
    vi.mocked(detect).mockReset()
    delete process.env.npm_config_user_agent
  })

  afterEach(() => {
    if (originalUserAgent === undefined) {
      delete process.env.npm_config_user_agent
    } else {
      process.env.npm_config_user_agent = originalUserAgent
    }
  })

  it("falls back to the user agent when detection fails in fallback mode", async () => {
    vi.mocked(detect).mockRejectedValue(
      Object.assign(
        new Error("EACCES: permission denied, scandir '/data/data'"),
        {
          code: "EACCES",
        }
      )
    )
    process.env.npm_config_user_agent = "pnpm/10.33.4 npm/? node/?"

    await expect(
      getPackageManager("/data/data/com.termux/files/home", {
        withFallback: true,
      })
    ).resolves.toBe("pnpm")
  })

  it("rethrows detection errors when fallback mode is disabled", async () => {
    const error = new Error("EACCES: permission denied")
    vi.mocked(detect).mockRejectedValue(error)

    await expect(getPackageManager("/data/data")).rejects.toBe(error)
  })

  it("uses a detected package manager before falling back to the user agent", async () => {
    vi.mocked(detect).mockResolvedValue("bun")
    process.env.npm_config_user_agent = "npm/10.0.0 node/?"

    await expect(
      getPackageManager("/project", {
        withFallback: true,
      })
    ).resolves.toBe("bun")
  })
})
