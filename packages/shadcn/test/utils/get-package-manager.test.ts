import path from "path"
import { expect, test } from "vitest"

import {
  getPackageManager,
  getPackageManagerFromUserAgent,
  getPackageRunnerCommand,
} from "../../src/utils/get-package-manager"

test("get package manager", async () => {
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

test("get package manager from user agent", () => {
  expect(getPackageManagerFromUserAgent("pnpm/10.0.0 npm/? node/v22")).toBe(
    "pnpm"
  )
  expect(getPackageManagerFromUserAgent("bun/1.2.0 npm/? node/v22")).toBe(
    "bun"
  )
  expect(getPackageManagerFromUserAgent("npm/10.0.0 node/v22")).toBe("npm")
  expect(getPackageManagerFromUserAgent("")).toBeNull()
})

test("get package runner command", () => {
  expect(getPackageRunnerCommand("pnpm")).toBe("pnpm dlx")
  expect(getPackageRunnerCommand("bun")).toBe("bunx")
  expect(getPackageRunnerCommand("npm")).toBe("npx")
  expect(getPackageRunnerCommand(null)).toBe("npx")
})
