import { ensureRegistriesInConfig } from "@/src/utils/registries"
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

vi.mock("@/src/registry/search", () => ({
  searchRegistries: vi.fn(() => []),
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
})

function mockProcessExit() {
  return vi.spyOn(process, "exit").mockImplementation((code) => {
    throw new Error(`process.exit:${code}`)
  })
}
