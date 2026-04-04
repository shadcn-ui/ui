import path from "path"
import { detect } from "@antfu/ni"
import { describe, expect, test, vi } from "vitest"

import {
  getPackageManager,
  getPackageRunner,
} from "../../src/utils/get-package-manager"

vi.mock("@antfu/ni", async (importOriginal) => {
  const actual = (await importOriginal()) as any
  return {
    ...actual,
    detect: vi.fn(),
  }
})

describe("get package manager", () => {
  test("should detect package manager from fixtures", async () => {
    vi.mocked(detect).mockImplementation(async (options: any) => {
      if (options?.cwd?.includes("project-yarn")) return "yarn"
      if (options?.cwd?.includes("project-npm")) return "npm"
      if (options?.cwd?.includes("project-pnpm")) return "pnpm"
      if (options?.cwd?.includes("project-bun")) return "bun"
      if (options?.cwd?.includes("project-bun-lock")) return "bun"
      if (options?.cwd?.includes("next")) return "pnpm"
      return undefined
    })

    expect(
      await getPackageManager(
        path.resolve(__dirname, "../fixtures/project-yarn")
      )
    ).toBe("yarn")

    expect(
      await getPackageManager(path.resolve(__dirname, "../fixtures/project-npm"))
    ).toBe("npm")

    expect(
      await getPackageManager(
        path.resolve(__dirname, "../fixtures/project-pnpm")
      )
    ).toBe("pnpm")

    expect(
      await getPackageManager(path.resolve(__dirname, "../fixtures/project-bun"))
    ).toBe("bun")

    expect(
      await getPackageManager(
        path.resolve(__dirname, "../fixtures/project-bun-lock")
      )
    ).toBe("bun")

    expect(
      await getPackageManager(path.resolve(__dirname, "../fixtures/next"))
    ).toBe("pnpm")
  })
})

describe("get package runner", () => {
  test("should return correct runner for each package manager", async () => {
    const scenarios = [
      { detected: "yarn", expected: "npx" },
      { detected: "yarn@berry", expected: "yarn dlx" },
      { detected: "pnpm", expected: "pnpm dlx" },
      { detected: "pnpm@6", expected: "pnpm dlx" },
      { detected: "bun", expected: "bunx" },
      { detected: "npm", expected: "npx" },
      { detected: null, expected: "npx" },
    ]

    for (const { detected, expected } of scenarios) {
      vi.mocked(detect).mockResolvedValueOnce(detected as any)
      expect(await getPackageRunner("any-cwd")).toBe(expected)
    }
  })
})


