import { searchRegistries } from "@/src/registry/search"
import { getConfig } from "@/src/utils/get-config"
import { ensureRegistriesInConfig } from "@/src/utils/registries"
import fsExtra from "fs-extra"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { search } from "./search"

const baseConfig = {
  $schema: "",
  style: "new-york",
  rsc: false,
  tsx: true,
  tailwind: {
    config: "",
    css: "",
    baseColor: "neutral",
    cssVariables: true,
    prefix: "",
  },
  aliases: {
    components: "@/components",
    ui: "@/components/ui",
    hooks: "@/hooks",
    lib: "@/lib",
    utils: "@/lib/utils",
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

const mockResults = {
  pagination: {
    total: 2,
    offset: 0,
    limit: 100,
    hasMore: false,
  },
  items: [
    {
      name: "button",
      type: "registry:ui",
      description: "A button component",
      registry: "@shadcn",
      addCommandArgument: "@shadcn/button",
    },
    {
      name: "card",
      type: "registry:ui",
      registry: "@shadcn",
      addCommandArgument: "@shadcn/card",
    },
  ],
}

vi.mock("fs-extra", () => ({
  default: {
    existsSync: vi.fn(() => false),
    readJson: vi.fn(),
  },
}))

vi.mock("@/src/utils/env-loader", () => ({
  loadEnvFiles: vi.fn(),
}))

vi.mock("@/src/utils/get-config", () => ({
  createConfig: vi.fn(() => baseConfig),
  getConfig: vi.fn(() => null),
}))

vi.mock("@/src/utils/registries", () => ({
  ensureRegistriesInConfig: vi.fn(() => ({
    config: baseConfig,
    newRegistries: [],
  })),
}))

vi.mock("@/src/registry/validator", () => ({
  validateRegistryConfigForItems: vi.fn(),
}))

// Stub searchRegistries but keep the real printSearchResults (both now live
// in @/src/registry/search) so the human-readable output is exercised.
vi.mock("@/src/registry/search", async (importActual) => ({
  ...(await importActual<typeof import("@/src/registry/search")>()),
  searchRegistries: vi.fn(() => mockResults),
}))

vi.mock("@/src/registry/context", () => ({
  clearRegistryContext: vi.fn(),
}))

vi.mock("@/src/utils/handle-error", () => ({
  handleError: vi.fn((error) => {
    throw error
  }),
}))

describe("search command", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("only discovers namespace registries for search inputs", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {})
    const exit = mockProcessExit()

    await expect(
      search.parseAsync(
        [
          "@acme",
          "acme/ui",
          "https://example.com/registry.json",
          "--cwd",
          "/tmp/test-project",
        ],
        {
          from: "user",
        }
      )
    ).rejects.toThrow("process.exit:0")

    expect(ensureRegistriesInConfig).toHaveBeenCalledWith(
      ["@acme/registry"],
      expect.any(Object),
      {
        silent: true,
        writeFile: false,
      }
    )

    log.mockRestore()
    exit.mockRestore()
  })

  it("prints human-readable output by default", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {})
    const exit = mockProcessExit()

    await expect(
      search.parseAsync(["@shadcn", "--cwd", "/tmp/test-project"], {
        from: "user",
      })
    ).rejects.toThrow("process.exit:0")

    expect(searchRegistries).toHaveBeenCalled()
    expect(log).toHaveBeenCalledWith(
      expect.stringContaining("Found 2 items in @shadcn")
    )
    expect(log).toHaveBeenCalledWith(expect.stringContaining("@shadcn/button"))
    expect(log).not.toHaveBeenCalledWith(
      expect.stringContaining('"pagination"')
    )

    log.mockRestore()
    exit.mockRestore()
  })

  it("prints JSON output with --json", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {})
    const exit = mockProcessExit()

    await expect(
      search.parseAsync(["@shadcn", "--cwd", "/tmp/test-project", "--json"], {
        from: "user",
      })
    ).rejects.toThrow("process.exit:0")

    expect(log).toHaveBeenCalledWith(JSON.stringify(mockResults, null, 2))

    log.mockRestore()
    exit.mockRestore()
  })

  it("requires a registry when no components.json is present", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {})
    const exit = mockProcessExit()

    // fs-extra.existsSync is mocked to return false (no components.json).
    // This is a usage error, so it prints a message and exits 1 directly
    // instead of routing through handleError.
    await expect(
      search.parseAsync(["--cwd", "/tmp/test-project"], {
        from: "user",
      })
    ).rejects.toThrow("process.exit:1")

    expect(log).toHaveBeenCalledWith(
      expect.stringContaining("Provide a registry or namespace to search")
    )
    expect(searchRegistries).not.toHaveBeenCalled()

    log.mockRestore()
    exit.mockRestore()
  })

  it("requires a registry when components.json has no registries", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {})
    const exit = mockProcessExit()

    vi.mocked(fsExtra.existsSync).mockReturnValueOnce(true as never)
    vi.mocked(fsExtra.readJson).mockResolvedValueOnce({ style: "new-york" })
    // components.json present but with no configured registries (only the
    // builtin @shadcn, which is excluded from "search all").
    vi.mocked(getConfig).mockReturnValueOnce({ ...baseConfig } as never)

    await expect(
      search.parseAsync(["--cwd", "/tmp/test-project"], {
        from: "user",
      })
    ).rejects.toThrow("process.exit:1")

    expect(log).toHaveBeenCalledWith(
      expect.stringContaining("No registries are configured")
    )
    expect(searchRegistries).not.toHaveBeenCalled()

    log.mockRestore()
    exit.mockRestore()
  })

  it("errors on an unknown --type", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {})
    const exit = mockProcessExit()

    await expect(
      search.parseAsync(
        ["@shadcn", "--type", "bogus", "--cwd", "/tmp/test-project"],
        {
          from: "user",
        }
      )
    ).rejects.toThrow("process.exit:1")

    expect(log).toHaveBeenCalledWith(expect.stringContaining("Unknown type"))
    expect(searchRegistries).not.toHaveBeenCalled()

    log.mockRestore()
    exit.mockRestore()
  })

  it("searches all configured registries when none are provided", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {})
    const exit = mockProcessExit()

    vi.mocked(fsExtra.existsSync).mockReturnValueOnce(true as never)
    // readJson returns a raw (unresolved) components.json shape.
    vi.mocked(fsExtra.readJson).mockResolvedValueOnce({ style: "new-york" })
    vi.mocked(getConfig).mockReturnValueOnce({
      ...baseConfig,
      registries: {
        "@acme": "https://acme.com/{name}.json",
        "@internal": "https://internal.com/{name}.json",
      },
    } as never)

    await expect(
      search.parseAsync(["--cwd", "/tmp/test-project"], {
        from: "user",
      })
    ).rejects.toThrow("process.exit:0")

    // No explicit namespace args, so nothing to discover.
    expect(ensureRegistriesInConfig).toHaveBeenCalledWith(
      [],
      expect.any(Object),
      expect.any(Object)
    )

    // Only the configured registries are searched (builtin @shadcn is
    // excluded), and per-registry failures are tolerated.
    expect(searchRegistries).toHaveBeenCalledWith(
      ["@acme", "@internal"],
      expect.objectContaining({ continueOnError: true })
    )

    log.mockRestore()
    exit.mockRestore()
  })

  it("exits non-zero when every registry fails in search-all", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {})
    const exit = mockProcessExit()

    vi.mocked(fsExtra.existsSync).mockReturnValueOnce(true as never)
    vi.mocked(fsExtra.readJson).mockResolvedValueOnce({ style: "new-york" })
    vi.mocked(getConfig).mockReturnValueOnce({
      ...baseConfig,
      registries: {
        "@acme": "https://acme.com/{name}.json",
        "@internal": "https://internal.com/{name}.json",
      },
    } as never)

    // Both configured registries failed to load.
    vi.mocked(searchRegistries).mockReturnValueOnce({
      pagination: { total: 0, offset: 0, limit: 0, hasMore: false },
      items: [],
      errors: [
        { registry: "@acme", message: "boom" },
        { registry: "@internal", message: "boom" },
      ],
    } as never)

    await expect(
      search.parseAsync(["--cwd", "/tmp/test-project"], {
        from: "user",
      })
    ).rejects.toThrow("process.exit:1")

    log.mockRestore()
    exit.mockRestore()
  })
})

function mockProcessExit() {
  return vi.spyOn(process, "exit").mockImplementation((code) => {
    throw new Error(`process.exit:${code}`)
  })
}
