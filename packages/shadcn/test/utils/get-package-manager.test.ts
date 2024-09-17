import path from "path"
import { expect, test } from "vitest"

import { getPackageManager } from "../../src/utils/get-package-manager"

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
    await getPackageManager(path.resolve(__dirname, "../fixtures/next"))
  ).toBe("pnpm")
})
