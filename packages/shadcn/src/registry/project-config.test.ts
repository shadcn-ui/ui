import { beforeEach, describe, expect, it, vi } from "vitest"

import { addRegistriesToConfig } from "./project-config"

const { getRegistries, getRegistriesConfig, pathExists, readJson, writeJson } =
  vi.hoisted(() => ({
    getRegistries: vi.fn(),
    getRegistriesConfig: vi.fn(),
    pathExists: vi.fn(),
    readJson: vi.fn(),
    writeJson: vi.fn(),
  }))

vi.mock("@/src/registry/api", () => ({
  getRegistries,
  getRegistriesConfig,
}))

vi.mock("fs-extra", () => ({
  default: { pathExists, readJson, writeJson },
}))

describe("addRegistriesToConfig", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    pathExists.mockResolvedValue(true)
    getRegistriesConfig.mockResolvedValue({ registries: { "@shadcn": "url" } })
    readJson.mockResolvedValue({ style: "new-york", registries: {} })
  })

  it("adds an explicit namespace mapping", async () => {
    const result = await addRegistriesToConfig(
      ["@acme=https://example.com/r/{name}.json"],
      { cwd: "/project" }
    )

    expect(result).toEqual({
      addedRegistries: ["@acme"],
      skippedRegistries: [],
    })
    expect(getRegistries).not.toHaveBeenCalled()
    expect(writeJson).toHaveBeenCalledWith(
      "/project/components.json",
      {
        style: "new-york",
        registries: { "@acme": "https://example.com/r/{name}.json" },
      },
      { spaces: 2 }
    )
  })

  it("resolves a namespace through the registry directory", async () => {
    getRegistries.mockResolvedValue([
      { name: "@acme", url: "https://example.com/r/{name}.json" },
    ])

    const result = await addRegistriesToConfig(["@acme"], {
      cwd: "/project",
      useCache: false,
    })

    expect(getRegistries).toHaveBeenCalledWith({ useCache: false })
    expect(result.addedRegistries).toEqual(["@acme"])
  })

  it("reports built-in and existing namespaces as skipped", async () => {
    getRegistriesConfig.mockResolvedValue({
      registries: {
        "@shadcn": "built-in",
        "@acme": "https://example.com/r/{name}.json",
      },
    })

    const result = await addRegistriesToConfig(
      [
        "@shadcn=https://other.example/r/{name}.json",
        "@acme=https://other.example/r/{name}.json",
      ],
      { cwd: "/project" }
    )

    expect(result).toEqual({
      addedRegistries: [],
      skippedRegistries: [
        { namespace: "@shadcn", reason: "built-in" },
        { namespace: "@acme", reason: "already-configured" },
      ],
    })
    expect(writeJson).not.toHaveBeenCalled()
  })

  it("requires an existing components.json", async () => {
    pathExists.mockResolvedValue(false)

    await expect(
      addRegistriesToConfig(["@acme=https://example.com/r/{name}.json"], {
        cwd: "/project",
      })
    ).rejects.toThrow("No components.json found at /project")
  })
})
