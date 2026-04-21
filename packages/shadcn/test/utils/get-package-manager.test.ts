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
    await getPackageManager(
      path.resolve(__dirname, "../fixtures/project-bun-lock")
    )
  ).toBe("bun")

  expect(
    await getPackageManager(path.resolve(__dirname, "../fixtures/next"))
  ).toBe("pnpm")
})

test("prefers invoking package manager when withFallback is enabled", async () => {
  const originalUserAgent = process.env.npm_config_user_agent

  try {
    process.env.npm_config_user_agent = "npm/10.0.0 node/v22.0.0"
    await expect(
      getPackageManager(path.resolve(__dirname, "../fixtures/project-bun"), {
        withFallback: true,
      })
    ).resolves.toBe("npm")

    process.env.npm_config_user_agent = "pnpm/9.0.0 npm/? node/v22.0.0"
    await expect(
      getPackageManager(path.resolve(__dirname, "../fixtures/project-npm"), {
        withFallback: true,
      })
    ).resolves.toBe("pnpm")
  } finally {
    if (typeof originalUserAgent === "undefined") {
      delete process.env.npm_config_user_agent
    } else {
      process.env.npm_config_user_agent = originalUserAgent
    }
  }
})
