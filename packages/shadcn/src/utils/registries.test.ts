import {
  getPackageJsonRegistries,
  getRegistriesIndex,
} from "@/src/registry/api"
import { resolveRegistryNamespaces } from "@/src/registry/namespaces"
import type { Config } from "@/src/utils/get-config"
import fs from "fs-extra"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ensureRegistriesInConfig } from "./registries"

// Mock dependencies.
vi.mock("@/src/registry/namespaces", () => ({
  resolveRegistryNamespaces: vi.fn(),
}))

vi.mock("@/src/registry/api", () => ({
  getRegistriesIndex: vi.fn(),
  getPackageJsonRegistries: vi.fn(),
}))

vi.mock("@/src/utils/spinner", () => ({
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
    writeFile: vi.fn(),
    readJson: vi.fn(),
    existsSync: vi.fn(),
  },
}))

beforeEach(() => {
  vi.mocked(resolveRegistryNamespaces).mockResolvedValue(["@foo"])
  vi.mocked(getRegistriesIndex).mockResolvedValue({
    "@foo": "https://foo.com/r/{name}.json",
  })
  vi.mocked(getPackageJsonRegistries).mockResolvedValue({})
  vi.mocked(fs.writeFile).mockResolvedValue(undefined)
  vi.mocked(fs.readJson).mockResolvedValue({})
  vi.mocked(fs.existsSync).mockReturnValue(true)
})

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

function writtenConfig() {
  const write = vi.mocked(fs.writeFile).mock.calls[0]
  return JSON.parse(write[1] as string)
}

describe("ensureRegistriesInConfig", () => {
  it("does not write to disk when writeFile is false", async () => {
    const { config, newRegistries } = await ensureRegistriesInConfig(
      ["@foo/bar"],
      baseConfig,
      { writeFile: false }
    )

    // Should still return the updated config with new registries.
    expect(newRegistries).toEqual(["@foo"])
    expect(config.registries?.["@foo"]).toBe("https://foo.com/r/{name}.json")

    // Should NOT have written to disk.
    expect(fs.writeFile).not.toHaveBeenCalled()
  })

  it("writes to disk when writeFile is true", async () => {
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

  it("writes to disk by default (writeFile not specified)", async () => {
    await ensureRegistriesInConfig(["@foo/bar"], baseConfig)

    expect(fs.writeFile).toHaveBeenCalledTimes(1)
  })

  it("does not write when no new registries are found", async () => {
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

  it("resolves registries from package.json without fetching the index", async () => {
    vi.mocked(getPackageJsonRegistries).mockResolvedValue({
      "@foo": "https://package.com/r/{name}.json",
    })

    const { config, newRegistries, discoveredRegistries } =
      await ensureRegistriesInConfig(["@foo/bar"], baseConfig)

    expect(newRegistries).toEqual(["@foo"])
    expect(config.registries?.["@foo"]).toBe(
      "https://package.com/r/{name}.json"
    )
    expect(discoveredRegistries).toEqual({})

    // Fully resolved from package.json: no index fetch, no write.
    expect(getRegistriesIndex).not.toHaveBeenCalled()
    expect(fs.writeFile).not.toHaveBeenCalled()
  })

  it("resolves from package.json and falls back to the index", async () => {
    vi.mocked(resolveRegistryNamespaces).mockResolvedValue(["@foo", "@pkg"])
    vi.mocked(getPackageJsonRegistries).mockResolvedValue({
      "@pkg": "https://package.com/r/{name}.json",
    })

    const { config, newRegistries } = await ensureRegistriesInConfig(
      ["@foo/bar", "@pkg/baz"],
      baseConfig
    )

    expect(newRegistries.sort()).toEqual(["@foo", "@pkg"])
    expect(config.registries?.["@foo"]).toBe("https://foo.com/r/{name}.json")
    expect(config.registries?.["@pkg"]).toBe(
      "https://package.com/r/{name}.json"
    )

    // Only the index-discovered registry is written to components.json.
    expect(fs.writeFile).toHaveBeenCalledTimes(1)
    expect(writtenConfig().registries).toEqual({
      "@foo": "https://foo.com/r/{name}.json",
    })
  })

  it("does not persist in-memory registries from a previous run", async () => {
    // Simulate a config that already picked up a package.json registry
    // in memory from an earlier ensureRegistriesInConfig call.
    const configWithInMemoryRegistry: Config = {
      ...baseConfig,
      registries: {
        "@pkg": "https://package.com/r/{name}.json",
      },
    }
    vi.mocked(resolveRegistryNamespaces).mockResolvedValue(["@bar"])
    vi.mocked(getRegistriesIndex).mockResolvedValue({
      "@bar": "https://bar.com/r/{name}.json",
    })

    const { config } = await ensureRegistriesInConfig(
      ["@bar/baz"],
      configWithInMemoryRegistry
    )

    expect(config.registries?.["@pkg"]).toBe(
      "https://package.com/r/{name}.json"
    )
    expect(config.registries?.["@bar"]).toBe("https://bar.com/r/{name}.json")

    // The write starts from the file on disk, so the in-memory registry
    // never leaks into components.json.
    expect(writtenConfig().registries).toEqual({
      "@bar": "https://bar.com/r/{name}.json",
    })
  })

  it("returns package.json registries when the index is unavailable", async () => {
    vi.mocked(getPackageJsonRegistries).mockResolvedValue({
      "@foo": "https://package.com/r/{name}.json",
    })
    vi.mocked(resolveRegistryNamespaces).mockResolvedValue(["@foo", "@bar"])
    vi.mocked(getRegistriesIndex).mockResolvedValue(null)

    const { config, newRegistries } = await ensureRegistriesInConfig(
      ["@foo/bar", "@bar/baz"],
      baseConfig
    )

    expect(newRegistries).toEqual(["@foo"])
    expect(config.registries?.["@foo"]).toBe(
      "https://package.com/r/{name}.json"
    )
    expect(fs.writeFile).not.toHaveBeenCalled()
  })

  it("skips the write when components.json does not exist", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)

    const { config, newRegistries } = await ensureRegistriesInConfig(
      ["@foo/bar"],
      baseConfig
    )

    // Config is still updated in memory.
    expect(newRegistries).toEqual(["@foo"])
    expect(config.registries?.["@foo"]).toBe("https://foo.com/r/{name}.json")
    expect(fs.writeFile).not.toHaveBeenCalled()
  })

  it("preserves unrelated fields in components.json when writing", async () => {
    vi.mocked(fs.readJson).mockResolvedValue({
      style: "new-york",
      registries: {
        "@keep": "https://keep.com/r/{name}.json",
      },
    })

    await ensureRegistriesInConfig(["@foo/bar"], baseConfig)

    expect(writtenConfig()).toEqual({
      style: "new-york",
      registries: {
        "@keep": "https://keep.com/r/{name}.json",
        "@foo": "https://foo.com/r/{name}.json",
      },
    })
  })
})
