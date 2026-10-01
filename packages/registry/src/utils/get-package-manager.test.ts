import { getFixturesDir } from "@/src/test-helpers"
import { describe, expect, it } from "vitest"

import {
  getPackageManager,
  getPackageManagerFromUserAgent,
  getPackageRunnerCommand,
} from "./get-package-manager"

describe("getPackageManager", () => {
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
