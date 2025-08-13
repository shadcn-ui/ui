import * as fs from "fs"
import * as add from "@/src/utils/add-components"
import { Config } from "@/src/utils/get-config"
import * as fg from "fast-glob"
import prompts from "prompts"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { migrateFormat } from "./migrate-format"

vi.mock("fs", () => ({
  promises: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    unlink: vi.fn(),
    mkdtemp: vi.fn(),
  },
}))

vi.mock("fast-glob", () => ({
  default: vi.fn(),
}))

vi.mock("prompts", () => ({
  default: vi.fn(),
}))

vi.mock("@/src/utils/add-components", () => ({
  addComponents: vi.fn(),
}))

vi.mock("@/src/utils/spinner", () => ({
  spinner: () => ({
    start: () => ({
      text: "",
      stop: vi.fn(),
    }),
  }),
}))

vi.mock("@/src/utils/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    break: vi.fn(),
    log: vi.fn(),
    error: vi.fn(),
  },
}))

const mockedFg = fg.default as vi.Mock
const mockedPrompts = prompts as unknown as vi.Mock
const mockedUnlink = fs.promises.unlink as vi.Mock
const mockedAddComponents = add.addComponents as vi.Mock

const config: Config = {
  resolvedPaths: {
    cwd: "/project",
    ui: "/project/src/components/ui",
  },
} as any

describe("migrateFormat", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("migrates valid files and deletes them", async () => {
    mockedFg.mockResolvedValue(["Button.jsx", "Input.jsx", "Other.tsx"])
    mockedPrompts.mockResolvedValueOnce({ from: "jsx", to: "tsx" })
    mockedPrompts.mockResolvedValueOnce({ confirm: true })

    mockedAddComponents.mockResolvedValue(undefined)

    await migrateFormat(config)

    expect(mockedAddComponents).toHaveBeenCalledTimes(2)
    expect(mockedAddComponents).toHaveBeenCalledWith(
      ["Button"],
      expect.anything(),
      expect.objectContaining({ overwrite: true })
    )
    expect(mockedUnlink).toHaveBeenCalledWith(
      "/project/src/components/ui/Button.jsx"
    )
    expect(mockedUnlink).toHaveBeenCalledWith(
      "/project/src/components/ui/Input.jsx"
    )
    expect(mockedUnlink).not.toHaveBeenCalledWith(
      "/project/src/components/ui/Other.tsx"
    )
  })

  it("skips invalid files without throwing", async () => {
    mockedFg.mockResolvedValue(["Fake.jsx", "Real.jsx"])
    mockedPrompts.mockResolvedValueOnce({ from: "jsx", to: "tsx" })
    mockedPrompts.mockResolvedValueOnce({ confirm: true })

    mockedAddComponents
      .mockImplementationOnce(() => {
        throw { __intercepted: true }
      })
      .mockResolvedValueOnce(undefined)

    await migrateFormat(config)

    expect(mockedAddComponents).toHaveBeenCalledTimes(2)
    expect(mockedUnlink).toHaveBeenCalledWith(
      "/project/src/components/ui/Real.jsx"
    )
    expect(mockedUnlink).not.toHaveBeenCalledWith(
      "/project/src/components/ui/Fake.jsx"
    )
  })

  it("aborts migration if user cancels", async () => {
    mockedFg.mockResolvedValue(["One.jsx"])
    mockedPrompts.mockResolvedValueOnce({ from: "jsx", to: "tsx" })
    mockedPrompts.mockResolvedValueOnce({ confirm: false })

    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("exit")
    })

    try {
      await migrateFormat(config)
    } catch (e) {
      // expected
    }

    expect(exitSpy).toHaveBeenCalledWith(0)
    expect(mockedAddComponents).not.toHaveBeenCalled()
    expect(mockedUnlink).not.toHaveBeenCalled()
  })

  it("throws if no files to migrate", async () => {
    mockedFg.mockResolvedValue(["Other.tsx"])
    mockedPrompts.mockResolvedValueOnce({ from: "jsx", to: "tsx" })

    await expect(migrateFormat(config)).rejects.toThrow(
      "No .jsx files found to migrate."
    )
  })

  it("throws if from === to", async () => {
    mockedFg.mockResolvedValue(["Input.tsx"])
    mockedPrompts.mockResolvedValueOnce({ from: "tsx", to: "tsx" })

    await expect(migrateFormat(config)).rejects.toThrow(
      "You cannot migrate to the same format."
    )
  })
})
