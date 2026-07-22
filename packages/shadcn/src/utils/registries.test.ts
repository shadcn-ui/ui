import { afterEach, describe, expect, test, vi } from "vitest"

import type { Config } from "../../src/utils/get-config"

// Mock dependencies.
vi.mock("../../src/registry/namespaces", () => ({
  resolveRegistryNamespaces: vi.fn().mockResolvedValue(["@foo"]),
}))

vi.mock("../../src/registry/api", () => ({
  getRegistriesIndex: vi.fn().mockResolvedValue({
    "@foo": "https://foo.com/r/{name}.json",
  }),
}))

vi.mock("../../src/utils/spinner", () => ({
  spinner: vi.fn().mockReturnValue({
    start: vi.fn().mockReturnValue({
      succeed: vi.fn(),
      fail: vi.fn(),
      stop: vi.fn(),
    }),
  }),
}))

vi.mock("fs-extra", () => ({
  default: {
    writeFile: vi.fn().mockResolvedValue(undefined),
  },
}))

import { ensureRegistriesInConfig } from "../../src/utils/registries"
import fs from "fs-extra"

afterEach(() => {
  vi.clearAllMocks()
})

const baseConfig: Config = {
  $schema: "",
  style: "new-york",
  tailwind: {
    config: "",
    css: "",
    baseColor: "",
    cssVariables: true,
    prefix: "",
  },
  rsc: false,
  tsx: true,
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
    ui: "@/components/ui",
    lib: "@/lib",
    hooks: "@/hooks",
  },
  registries: {},
  resolvedPaths: {
    cwd: "/tmp/test-project",
    tailwindConfig: "",
    tailwindCss: "",
    utils: "",
    components: "",
    lib: "",
    hooks: "",
    ui: "",
  },
}

describe("ensureRegistriesInConfig", () => {
  test("does not write to disk when writeFile is false", async () => {
    const { config, newRegistries } = await ensureRegistriesInConfig(
      ["@foo/bar"],
      baseConfig,
      { writeFile: false }
    )

    // Should still return the updated config with new registries.
    expect(newRegistries).toEqual(["@foo"])
    expect(config.registries?.["@foo"]).toBe(
      "https://foo.com/r/{name}.json"
    )

    // Should NOT have written to disk.
    expect(fs.writeFile).not.toHaveBeenCalled()
  })

  test("writes to disk when writeFile is true", async () => {
    await ensureRegistriesInConfig(["@foo/bar"], baseConfig, {
      writeFile: true,
    })

    expect(fs.writeFile).toHaveBeenCalledTimes(1)
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining("components.json"),
      expect.any(String),
      "utf-8"
    )
  })

  test("writes to disk by default (writeFile not specified)", async () => {
    await ensureRegistriesInConfig(["@foo/bar"], baseConfig)

    expect(fs.writeFile).toHaveBeenCalledTimes(1)
  })

  test("does not write when no new registries are found", async () => {
    const configWithRegistry: Config = {
      ...baseConfig,
      registries: {
        "@foo": "https://foo.com/r/{name}.json",
      },
    }

    await ensureRegistriesInConfig(["@foo/bar"], configWithRegistry, {
      writeFile: true,
    })

    // No new registries, so no write.
    expect(fs.writeFile).not.toHaveBeenCalled()
  })
})
