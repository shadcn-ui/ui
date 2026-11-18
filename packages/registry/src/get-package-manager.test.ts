import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { getFixturesDir } from "@/src/test-helpers"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  getPackageManager,
  getPackageManagerFromUserAgent,
  getPackageRunnerCommand,
} from "./get-package-manager"

describe("getPackageManager", () => {
  afterEach(() => vi.unstubAllEnvs())

  it("prefers the detected package manager over the invoking runner", async () => {
    vi.stubEnv("npm_config_user_agent", "npm/10.0.0 node/v22")

    await expect(
      getPackageManager(getFixturesDir("project-pnpm"), { withFallback: true })
    ).resolves.toBe("pnpm")
  })

  it("uses the invoking runner when no package manager is detected", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "shadcn-package-manager-"))
    vi.stubEnv("npm_config_user_agent", "pnpm/10.0.0 npm/? node/v22")

    try {
      await expect(
        getPackageManager(cwd, { withFallback: true })
      ).resolves.toBe("pnpm")
      await expect(getPackageManager(cwd)).resolves.toBe("npm")
    } finally {
      await rm(cwd, { recursive: true, force: true })
    }
  })

  it("get package manager", async () => {
    expect(await getPackageManager(getFixturesDir("project-yarn"))).toBe("yarn")

    expect(await getPackageManager(getFixturesDir("project-npm"))).toBe("npm")

    expect(await getPackageManager(getFixturesDir("project-pnpm"))).toBe("pnpm")

    expect(await getPackageManager(getFixturesDir("project-bun"))).toBe("bun")

    expect(await getPackageManager(getFixturesDir("project-bun-lock"))).toBe(
      "bun"
    )

    expect(await getPackageManager(getFixturesDir("next"))).toBe("pnpm")
  })
})

describe("getPackageManagerFromUserAgent", () => {
  it("get package manager from user agent", () => {
    expect(getPackageManagerFromUserAgent("pnpm/10.0.0 npm/? node/v22")).toBe(
      "pnpm"
    )
    expect(getPackageManagerFromUserAgent("bun/1.2.0 npm/? node/v22")).toBe(
      "bun"
    )
    expect(getPackageManagerFromUserAgent("npm/10.0.0 node/v22")).toBe("npm")
    expect(getPackageManagerFromUserAgent("")).toBeNull()
  })
})

describe("getPackageRunnerCommand", () => {
  it("get package runner command", () => {
    expect(getPackageRunnerCommand("pnpm")).toBe("pnpm dlx")
    expect(getPackageRunnerCommand("bun")).toBe("bunx")
    expect(getPackageRunnerCommand("npm")).toBe("npx")
    expect(getPackageRunnerCommand(null)).toBe("npx")
  })
})
