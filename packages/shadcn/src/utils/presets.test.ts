import { getPreset, getPresets } from "@/src/registry/api"
import { REGISTRY_URL } from "@/src/registry/constants"
import open from "open"
import prompts from "prompts"
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from "vitest"

import {
  buildInitUrl,
  getShadcnCreateUrl,
  getShadcnInitUrl,
  handlePresetOption,
} from "./presets"

vi.mock("open")
vi.mock("prompts")
vi.mock("@/src/registry/api", () => ({
  getPreset: vi.fn(),
  getPresets: vi.fn(),
}))
vi.mock("@/src/utils/logger", () => ({
  logger: {
    break: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    log: vi.fn(),
  },
}))
vi.mock("@/src/utils/highlighter", () => ({
  highlighter: {
    info: vi.fn((s: string) => s),
  },
}))

const SHADCN_URL = REGISTRY_URL.replace(/\/r\/?$/, "")

const mockPreset = {
  name: "default",
  title: "Default",
  description: "The default preset.",
  base: "radix",
  style: "new-york-v4",
  baseColor: "neutral",
  theme: "default",
  iconLibrary: "lucide",
  font: "inter",
  rtl: false,
  menuAccent: "subtle" as const,
  menuColor: "default" as const,
  radius: "0.5",
}

describe("getShadcnInitUrl", () => {
  it("should return the init url", () => {
    expect(getShadcnInitUrl()).toBe(`${SHADCN_URL}/init`)
  })
})

describe("getShadcnCreateUrl", () => {
  it("should return the create url with no params", () => {
    expect(getShadcnCreateUrl()).toBe(`${SHADCN_URL}/create`)
  })

  it("should append search params when provided", () => {
    const url = getShadcnCreateUrl({ rtl: "true", template: "next" })
    const parsed = new URL(url)
    expect(parsed.searchParams.get("rtl")).toBe("true")
    expect(parsed.searchParams.get("template")).toBe("next")
  })
})

describe("buildInitUrl", () => {
  it("should build url with all preset fields as query params", () => {
    const url = buildInitUrl(mockPreset, false)
    const parsed = new URL(url)
    expect(parsed.origin + parsed.pathname).toBe(`${SHADCN_URL}/init`)
    expect(parsed.searchParams.get("base")).toBe("radix")
    expect(parsed.searchParams.get("style")).toBe("new-york-v4")
    expect(parsed.searchParams.get("baseColor")).toBe("neutral")
    expect(parsed.searchParams.get("theme")).toBe("default")
    expect(parsed.searchParams.get("iconLibrary")).toBe("lucide")
    expect(parsed.searchParams.get("font")).toBe("inter")
    expect(parsed.searchParams.get("rtl")).toBe("false")
    expect(parsed.searchParams.get("menuAccent")).toBe("subtle")
    expect(parsed.searchParams.get("menuColor")).toBe("default")
    expect(parsed.searchParams.get("radius")).toBe("0.5")
  })

  it("should set rtl=true when rtl arg is true", () => {
    const url = buildInitUrl(mockPreset, true)
    const parsed = new URL(url)
    expect(parsed.searchParams.get("rtl")).toBe("true")
  })

  it("should set rtl=true when preset.rtl is true", () => {
    const url = buildInitUrl({ ...mockPreset, rtl: true }, false)
    const parsed = new URL(url)
    expect(parsed.searchParams.get("rtl")).toBe("true")
  })
})

describe("handlePresetOption", () => {
  let mockExit: MockInstance

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getPresets).mockResolvedValue([mockPreset])
    vi.mocked(getPreset).mockResolvedValue(mockPreset)
  })

  afterEach(() => {
    vi.resetAllMocks()
    mockExit?.mockRestore()
  })

  it("should show interactive list when presetArg is true", async () => {
    vi.mocked(prompts).mockResolvedValue({ selectedPreset: "default" })

    const result = await handlePresetOption(true, false)

    expect(getPresets).toHaveBeenCalled()
    expect(prompts).toHaveBeenCalled()
    expect(result).toEqual(mockPreset)
  })

  it("should return null when user cancels selection", async () => {
    vi.mocked(prompts).mockResolvedValue({ selectedPreset: undefined })

    const result = await handlePresetOption(true, false)

    expect(result).toBeNull()
  })

  it("should open browser and return null when custom is selected", async () => {
    vi.mocked(prompts).mockResolvedValue({ selectedPreset: "custom" })

    const result = await handlePresetOption(true, false)

    expect(open).toHaveBeenCalled()
    expect(result).toBeNull()
  })

  it("should resolve a preset by name", async () => {
    const result = await handlePresetOption("default", false)

    expect(getPreset).toHaveBeenCalledWith("default")
    expect(result).toEqual(mockPreset)
  })

  it("should return url object when arg is a URL", async () => {
    const url = "https://ui.shadcn.com/init?base=radix"
    const result = await handlePresetOption(url, false)

    expect(result).toEqual({ _isUrl: true, url })
  })

  it("should call process.exit(1) when preset name not found", async () => {
    vi.mocked(getPreset).mockResolvedValue(null)
    mockExit = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never)

    await handlePresetOption("nonexistent", false)

    expect(mockExit).toHaveBeenCalledWith(1)
  })

  it("should return null when presetArg is false", async () => {
    const result = await handlePresetOption(false as unknown as boolean, false)

    expect(result).toBeNull()
  })

  it("should exit with error when preset name is empty string", async () => {
    vi.mocked(getPreset).mockResolvedValue(null)
    mockExit = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never)

    await handlePresetOption("", false)

    expect(mockExit).toHaveBeenCalledWith(1)
  })

  it("should list available presets in error when not found", async () => {
    const { logger } = await import("@/src/utils/logger")
    const secondPreset = { ...mockPreset, name: "minimal", title: "Minimal" }
    vi.mocked(getPreset).mockResolvedValue(null)
    vi.mocked(getPresets).mockResolvedValue([mockPreset, secondPreset])
    mockExit = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never)

    await handlePresetOption("nonexistent", false)

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("default, minimal")
    )
  })

  it("should pass rtl to create url when custom is selected", async () => {
    vi.mocked(prompts).mockResolvedValue({ selectedPreset: "custom" })

    await handlePresetOption(true, true)

    expect(open).toHaveBeenCalledWith(expect.stringContaining("rtl=true"))
  })

  it("should select correct preset from multiple options", async () => {
    const secondPreset = {
      ...mockPreset,
      name: "minimal",
      title: "Minimal",
      baseColor: "zinc",
    }
    vi.mocked(getPresets).mockResolvedValue([mockPreset, secondPreset])
    vi.mocked(prompts).mockResolvedValue({ selectedPreset: "minimal" })

    const result = await handlePresetOption(true, false)

    expect(result).toEqual(secondPreset)
  })

  it("should propagate error when getPresets fails", async () => {
    vi.mocked(getPresets).mockRejectedValue(new Error("Network error"))

    await expect(handlePresetOption(true, false)).rejects.toThrow(
      "Network error"
    )
  })

  it("should propagate error when getPreset fails", async () => {
    vi.mocked(getPreset).mockRejectedValue(new Error("Network error"))

    await expect(handlePresetOption("default", false)).rejects.toThrow(
      "Network error"
    )
  })
})
