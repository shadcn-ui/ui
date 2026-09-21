import { execa } from "execa"
import { describe, expect, it, vi } from "vitest"

import { next } from "./next"

vi.mock("execa", () => ({
  execa: vi.fn().mockResolvedValue({}),
}))

describe("next scaffold", () => {
  it("uses create-next-app with npm and preserves interactive prompts", async () => {
    await next.scaffold?.({
      projectPath: "/tmp/my-app",
      packageManager: "npm",
      cwd: "/tmp",
    })

    expect(execa).toHaveBeenCalledWith(
      "npx",
      ["create-next-app@latest", "my-app", "--use-npm"],
      {
        cwd: "/tmp",
        stdio: "inherit",
      }
    )
  })

  it("uses pnpm dlx for pnpm projects", async () => {
    await next.scaffold?.({
      projectPath: "/tmp/my-app",
      packageManager: "pnpm",
      cwd: "/tmp",
    })

    expect(execa).toHaveBeenCalledWith(
      "pnpm",
      ["dlx", "create-next-app@latest", "my-app", "--use-pnpm"],
      {
        cwd: "/tmp",
        stdio: "inherit",
      }
    )
  })

  it("uses bunx for bun projects", async () => {
    await next.scaffold?.({
      projectPath: "/tmp/my-app",
      packageManager: "bun",
      cwd: "/tmp",
    })

    expect(execa).toHaveBeenCalledWith(
      "bunx",
      ["create-next-app@latest", "my-app", "--use-bun"],
      {
        cwd: "/tmp",
        stdio: "inherit",
      }
    )
  })
})
