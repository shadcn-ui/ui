import { existsSync } from "fs"
import path from "path"
import { resolveProjectPreset } from "@/src/preset/resolve"
import { getConfig } from "@/src/utils/get-config"
import {
  formatMonorepoMessage,
  getMonorepoTargets,
  isMonorepoRoot,
} from "@/src/utils/get-monorepo-info"
import { getProjectInfo } from "@/src/utils/get-project-info"
import { logger } from "@/src/utils/logger"
import open from "open"
import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  decodePresetCode,
  getPresetUrl,
  openCommand,
  preset as presetCommand,
  printPresetDecode,
  resolve as resolveCommand,
  url,
} from "./preset"

vi.mock("fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("fs")>()
  return {
    ...actual,
    existsSync: vi.fn(),
  }
})

vi.mock("open", () => ({
  default: vi.fn(),
}))

vi.mock("@/src/preset/resolve", () => ({
  resolveProjectPreset: vi.fn(),
}))

vi.mock("@/src/utils/get-config", () => ({
  getBase: vi.fn(() => "radix"),
  getConfig: vi.fn(),
}))

vi.mock("@/src/utils/get-monorepo-info", () => ({
  formatMonorepoMessage: vi.fn(),
  getMonorepoTargets: vi.fn(),
  isMonorepoRoot: vi.fn(),
}))

vi.mock("@/src/utils/get-project-info", () => ({
  getProjectComponents: vi.fn(),
  getProjectInfo: vi.fn(),
}))

vi.mock("@/src/utils/handle-error", () => ({
  handleError: vi.fn((error) => {
    throw error
  }),
}))

vi.mock("@/src/utils/highlighter", () => ({
  highlighter: {
    info: (value: string) => value,
  },
}))

vi.mock("@/src/utils/logger", () => ({
  logger: {
    break: vi.fn(),
    error: vi.fn(),
    log: vi.fn(),
  },
}))

describe("preset commands", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(existsSync).mockReturnValue(true)
    vi.mocked(isMonorepoRoot).mockResolvedValue(false)
    vi.mocked(getMonorepoTargets).mockResolvedValue([])
    vi.mocked(getConfig).mockResolvedValue(
      {} as Awaited<ReturnType<typeof getConfig>>
    )
    vi.mocked(getProjectInfo).mockResolvedValue(
      {} as Awaited<ReturnType<typeof getProjectInfo>>
    )
    vi.mocked(resolveProjectPreset).mockResolvedValue({
      code: "b123",
      fallbacks: [],
      values: {
        style: "luma",
        baseColor: "mist",
        theme: "blue",
        chartColor: "emerald",
        iconLibrary: "phosphor",
        font: "inter",
        fontHeading: "lora",
        radius: "large",
        menuAccent: "bold",
        menuColor: "inverted",
      },
    })
  })

  it("decodes current preset codes", () => {
    const result = decodePresetCode("b0")

    expect(result).toEqual({
      code: "b0",
      version: "b",
      values: {
        style: "nova",
        baseColor: "neutral",
        theme: "neutral",
        chartColor: "neutral",
        iconLibrary: "lucide",
        font: "inter",
        fontHeading: "inherit",
        radius: "default",
        menuAccent: "subtle",
        menuColor: "default",
      },
      derived: [],
      url: getPresetUrl("b0"),
    })
  })

  it("applies compatibility values for older preset codes", () => {
    const result = decodePresetCode("a0")

    expect(result.version).toBe("a")
    expect(result.values.chartColor).toBe("blue")
    expect(result.derived).toEqual(["chartColor"])
  })

  it("prints compatibility markers in human output", () => {
    printPresetDecode(decodePresetCode("a0"))

    expect(logger.log).toHaveBeenCalledWith("Preset")
    expect(logger.log).toHaveBeenCalledWith("  code         a0")
    expect(logger.log).toHaveBeenCalledWith("  version      a")
    expect(logger.log).toHaveBeenCalledWith("  chartColor   blue*")
    expect(logger.log).toHaveBeenCalledWith(
      `  url          ${getPresetUrl("a0")}`
    )
    expect(logger.log).toHaveBeenCalledWith(
      "  * Compatibility value for older preset versions."
    )
  })

  it("matches decoded preset output ordering to resolved preset output", () => {
    printPresetDecode(decodePresetCode("b0"))

    expect(logger.log).toHaveBeenCalledWith("Preset")
    expect(vi.mocked(logger.log).mock.calls.map((call) => call[0])).toEqual([
      "Preset",
      "  code         b0",
      "  version      b",
      "  style        nova",
      "  baseColor    neutral",
      "  theme        neutral",
      "  chartColor   neutral",
      "  iconLibrary  lucide",
      "  font         inter",
      "  fontHeading  inherit",
      "  radius       default",
      "  menuAccent   subtle",
      "  menuColor    default",
      `  url          ${getPresetUrl("b0")}`,
    ])
  })

  it("prints decoded preset JSON with derived values", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {})

    await presetCommand.parseAsync(["decode", "a0", "--json"], { from: "user" })

    expect(JSON.parse(log.mock.calls[0][0] as string)).toEqual({
      code: "a0",
      version: "a",
      values: {
        style: "nova",
        baseColor: "neutral",
        theme: "neutral",
        chartColor: "blue",
        iconLibrary: "lucide",
        font: "inter",
        fontHeading: "inherit",
        radius: "default",
        menuAccent: "subtle",
        menuColor: "default",
      },
      derived: ["chartColor"],
      url: getPresetUrl("a0"),
    })
    log.mockRestore()
  })

  it("rejects invalid codes", () => {
    expect(() => decodePresetCode("c0")).toThrow("Invalid preset code: c0")
  })

  it("rejects URLs", () => {
    expect(() =>
      decodePresetCode("https://ui.shadcn.com/create?preset=a0")
    ).toThrow("Invalid preset code: https://ui.shadcn.com/create?preset=a0")
  })

  it("prints the create URL from preset url", async () => {
    await url.parseAsync(["a0"], { from: "user" })

    expect(logger.break).not.toHaveBeenCalled()
    expect(logger.log).toHaveBeenCalledWith(getPresetUrl("a0"))
  })

  it("prints the create URL before opening it", async () => {
    vi.mocked(open).mockImplementation(async () => {
      expect(logger.log).toHaveBeenCalledWith(
        `  Opening ${getPresetUrl("a0")} in your browser.`
      )
      return {} as Awaited<ReturnType<typeof open>>
    })

    await openCommand.parseAsync(["a0"], { from: "user" })

    expect(logger.break).toHaveBeenCalledTimes(2)
    expect(logger.log).toHaveBeenCalledWith(
      `  Opening ${getPresetUrl("a0")} in your browser.`
    )
    expect(open).toHaveBeenCalledWith(getPresetUrl("a0"))
  })

  it("does not open invalid preset codes", async () => {
    const exit = mockProcessExit()

    await expect(
      openCommand.parseAsync(["https://ui.shadcn.com/create?preset=a0"], {
        from: "user",
      })
    ).rejects.toThrow("process.exit:1")

    expect(logger.error).toHaveBeenCalledWith(
      "Invalid preset code: https://ui.shadcn.com/create?preset=a0"
    )
    expect(open).not.toHaveBeenCalled()
    exit.mockRestore()
  })

  it("fails when opening the browser fails", async () => {
    const exit = mockProcessExit()
    vi.mocked(open).mockRejectedValue(new Error("open failed"))

    await expect(
      openCommand.parseAsync(["a0"], { from: "user" })
    ).rejects.toThrow("process.exit:1")

    expect(logger.log).toHaveBeenCalledWith(
      `  Opening ${getPresetUrl("a0")} in your browser.`
    )
    expect(logger.error).toHaveBeenCalledWith(
      "Failed to open preset URL: open failed"
    )
    exit.mockRestore()
  })

  it("resolves a project preset using the existing resolver", async () => {
    await resolveCommand.parseAsync([], { from: "user" })

    expect(logger.log).toHaveBeenCalledWith("Preset")
    expect(logger.log).toHaveBeenCalledWith("  code         b123")
    expect(logger.log).toHaveBeenCalledWith("  version      b")
    expect(logger.log).toHaveBeenCalledWith(expect.stringContaining("b123"))
    expect(logger.log).toHaveBeenCalledWith(
      expect.stringContaining("https://ui.shadcn.com/create?preset=b123")
    )
    expect(resolveProjectPreset).toHaveBeenCalledWith({}, {})
  })

  it("prints fallback markers when resolving a project preset", async () => {
    vi.mocked(resolveProjectPreset).mockResolvedValueOnce({
      code: "b123",
      fallbacks: ["theme"],
      values: {
        style: "luma",
        baseColor: "mist",
        theme: "neutral",
        chartColor: "emerald",
        iconLibrary: "phosphor",
        font: "inter",
        fontHeading: "lora",
        radius: "large",
        menuAccent: "bold",
        menuColor: "inverted",
      },
    })

    await resolveCommand.parseAsync([], { from: "user" })

    expect(logger.log).toHaveBeenCalledWith(expect.stringContaining("neutral*"))
    expect(logger.log).toHaveBeenCalledWith(
      "  * Uses preset defaults for values not available as options on shadcn/create."
    )
  })

  it("prints the resolved preset as JSON", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {})

    await resolveCommand.parseAsync(["--json"], { from: "user" })

    expect(JSON.parse(log.mock.calls[0][0] as string)).toEqual({
      code: "b123",
      fallbacks: [],
      values: {
        style: "luma",
        baseColor: "mist",
        theme: "blue",
        chartColor: "emerald",
        iconLibrary: "phosphor",
        font: "inter",
        fontHeading: "lora",
        radius: "large",
        menuAccent: "bold",
        menuColor: "inverted",
      },
    })
    log.mockRestore()
  })

  it("prints fallback metadata in resolved preset JSON", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {})
    vi.mocked(resolveProjectPreset).mockResolvedValueOnce({
      code: "b123",
      fallbacks: ["theme"],
      values: {
        style: "luma",
        baseColor: "mist",
        theme: "neutral",
        chartColor: "emerald",
        iconLibrary: "phosphor",
        font: "inter",
        fontHeading: "lora",
        radius: "large",
        menuAccent: "bold",
        menuColor: "inverted",
      },
    })

    await resolveCommand.parseAsync(["--json"], { from: "user" })

    expect(JSON.parse(log.mock.calls[0][0] as string)).toMatchObject({
      fallbacks: ["theme"],
      values: {
        theme: "neutral",
      },
    })
    log.mockRestore()
  })

  it("supports preset info as an alias for preset resolve", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {})

    await presetCommand.parseAsync(["info", "--json"], { from: "user" })

    expect(JSON.parse(log.mock.calls[0][0] as string)).toMatchObject({
      code: "b123",
    })
    log.mockRestore()
  })

  it("resolves presets from the provided cwd", async () => {
    await resolveCommand.parseAsync(["--cwd", "apps/web"], { from: "user" })

    expect(getConfig).toHaveBeenCalledWith(path.resolve("apps/web"))
    expect(getProjectInfo).toHaveBeenCalledWith(path.resolve("apps/web"))
  })

  it("prints no-config output when no components.json exists", async () => {
    vi.mocked(existsSync).mockReturnValue(false)
    vi.mocked(getConfig).mockResolvedValueOnce(null)

    await resolveCommand.parseAsync([], { from: "user" })

    expect(logger.log).toHaveBeenCalledWith("No components.json found.")
  })

  it("prints null JSON when no components.json exists", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {})
    vi.mocked(existsSync).mockReturnValue(false)
    vi.mocked(getConfig).mockResolvedValueOnce(null)

    await resolveCommand.parseAsync(["--json"], { from: "user" })

    expect(JSON.parse(log.mock.calls[0][0] as string)).toBeNull()
    log.mockRestore()
  })

  it("prints null JSON when no preset can be resolved", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {})
    vi.mocked(resolveProjectPreset).mockResolvedValueOnce({
      code: null,
      fallbacks: [],
      values: null,
    })

    await resolveCommand.parseAsync(["--json"], { from: "user" })

    expect(JSON.parse(log.mock.calls[0][0] as string)).toBeNull()
    log.mockRestore()
  })

  it("matches info monorepo-root behavior", async () => {
    const exit = mockProcessExit()
    const targets = [{ name: "apps/web" }]
    vi.mocked(existsSync).mockReturnValue(false)
    vi.mocked(isMonorepoRoot).mockResolvedValue(true)
    vi.mocked(getMonorepoTargets).mockResolvedValue(targets as never)

    await expect(
      resolveCommand.parseAsync([], { from: "user" })
    ).rejects.toThrow("process.exit:1")

    expect(formatMonorepoMessage).toHaveBeenCalledWith(
      "preset resolve",
      targets
    )
    expect(getConfig).not.toHaveBeenCalled()
    exit.mockRestore()
  })

  it("prints monorepo-root JSON for preset resolve --json", async () => {
    const exit = mockProcessExit()
    const log = vi.spyOn(console, "log").mockImplementation(() => {})
    const targets = [{ name: "apps/web" }]
    vi.mocked(existsSync).mockReturnValue(false)
    vi.mocked(isMonorepoRoot).mockResolvedValue(true)
    vi.mocked(getMonorepoTargets).mockResolvedValue(targets as never)

    await expect(
      resolveCommand.parseAsync(["--json"], { from: "user" })
    ).rejects.toThrow("process.exit:1")

    expect(JSON.parse(log.mock.calls[0][0] as string)).toEqual({
      error: "monorepo_root",
      message:
        "You are running preset resolve from a monorepo root. Use the -c flag to specify a workspace.",
      targets: ["apps/web"],
    })
    expect(formatMonorepoMessage).not.toHaveBeenCalled()
    expect(getConfig).not.toHaveBeenCalled()
    log.mockRestore()
    exit.mockRestore()
  })

  it("prints help when no preset subcommand is provided", async () => {
    const outputHelp = vi
      .spyOn(presetCommand, "outputHelp")
      .mockImplementation(() => {})

    await presetCommand.parseAsync([], { from: "user" })

    expect(outputHelp).toHaveBeenCalledOnce()
    outputHelp.mockRestore()
  })

  it("errors on unknown preset subcommands", async () => {
    const exit = mockProcessExit()
    const outputHelp = vi
      .spyOn(presetCommand, "outputHelp")
      .mockImplementation(() => {})
    const writeErr = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true)

    await expect(
      presetCommand.parseAsync(["bogus"], { from: "user" })
    ).rejects.toThrow("process.exit:1")

    expect(outputHelp).not.toHaveBeenCalled()
    expect(writeErr.mock.calls.join("")).toContain("too many arguments")
    writeErr.mockRestore()
    outputHelp.mockRestore()
    exit.mockRestore()
  })
})

function mockProcessExit() {
  return vi.spyOn(process, "exit").mockImplementation((code) => {
    throw new Error(`process.exit:${code}`)
  })
}
