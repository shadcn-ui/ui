import path from "path"
import { afterEach, expect, test, vi } from "vitest"

afterEach(() => {
  vi.resetModules()
  vi.doUnmock("@antfu/ni")
})

test("get package manager", async () => {
  const { getPackageManager } = await import(
    "../../src/utils/get-package-manager"
  )

  expect(
    await getPackageManager(path.resolve(__dirname, "../fixtures/project-yarn"))
  ).toBe("yarn")

  expect(
    await getPackageManager(path.resolve(__dirname, "../fixtures/project-npm"))
  ).toBe("npm")

  expect(
    await getPackageManager(path.resolve(__dirname, "../fixtures/project-pnpm"))
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

test("normalizes versioned package manager results", async () => {
  vi.doMock("@antfu/ni", () => ({
    detect: vi
      .fn()
      .mockResolvedValueOnce("pnpm@9.15.0")
      .mockResolvedValueOnce("pnpm@9.15.0")
      .mockResolvedValueOnce("yarn@1.22.22"),
  }))

  const { getPackageManager, getPackageRunner } = await import(
    "../../src/utils/get-package-manager"
  )

  expect(await getPackageManager("/test")).toBe("pnpm")
  expect(await getPackageRunner("/test")).toBe("pnpm dlx")
  expect(await getPackageManager("/test")).toBe("yarn")
})
