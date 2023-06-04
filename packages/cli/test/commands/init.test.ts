import fs from "fs"
import path from "path"
import { execa } from "execa"
import { afterEach, expect, test, vi } from "vitest"

import { runInit } from "../../src/commands/init"
import { RawConfig, getConfig } from "../../src/utils/get-config"
import * as getPackageManger from "../../src/utils/get-package-manager"

vi.mock("execa")
vi.mock("fs/promises", () => ({
  writeFile: vi.fn(),
  mkdir: vi.fn(),
}))

vi.mock("execa")
vi.mock("fs/promises", () => ({
  writeFile: vi.fn(),
  mkdir: vi.fn(),
}))
vi.mock("ora")

test("init config-full", async () => {
  vi.spyOn(getPackageManger, "getPackageManager").mockResolvedValue("pnpm")
  const mockMkdir = vi.spyOn(fs.promises, "mkdir").mockResolvedValue(undefined)
  const mockWriteFile = vi.spyOn(fs.promises, "writeFile").mockResolvedValue()

  const targetDir = path.resolve(__dirname, "../fixtures/config-full")
  const config = await getConfig(targetDir)

  await runInit(targetDir, config)

  expect(mockMkdir).toHaveBeenNthCalledWith(
    1,
    expect.stringMatching(/src\/app$/),
    expect.anything()
  )
  expect(mockMkdir).toHaveBeenNthCalledWith(
    2,
    expect.stringMatching(/src\/lib\/utils$/),
    expect.anything()
  )
  expect(mockMkdir).toHaveBeenNthCalledWith(
    3,
    expect.stringMatching(/src\/components$/),
    expect.anything()
  )
  expect(mockWriteFile).toHaveBeenNthCalledWith(
    1,
    expect.stringMatching(/tailwind.config.ts$/),
    expect.stringContaining(`/** @type {import('tailwindcss').Config} */`),
    "utf8"
  )
  expect(mockWriteFile).toHaveBeenNthCalledWith(
    2,
    expect.stringMatching(/src\/app\/globals.css$/),
    expect.stringContaining(`@tailwind base`),
    "utf8"
  )
  expect(mockWriteFile).toHaveBeenNthCalledWith(
    3,
    expect.stringMatching(/src\/lib\/utils\/cn.ts$/),
    expect.stringContaining(`import { type ClassValue, clsx } from "clsx"`),
    "utf8"
  )
  expect(execa).toHaveBeenCalledWith(
    "pnpm",
    [
      "add",
      "tailwindcss-animate",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
      "lucide-react",
    ],
    {
      cwd: targetDir,
    }
  )

  mockMkdir.mockRestore()
  mockWriteFile.mockRestore()
})

test("init config-partial", async () => {
  vi.spyOn(getPackageManger, "getPackageManager").mockResolvedValue("npm")
  const mockMkdir = vi.spyOn(fs.promises, "mkdir").mockResolvedValue(undefined)
  const mockWriteFile = vi.spyOn(fs.promises, "writeFile").mockResolvedValue()

  const targetDir = path.resolve(__dirname, "../fixtures/config-partial")
  const config = (await getConfig(targetDir)) as RawConfig

  await runInit(targetDir, config)

  expect(mockMkdir).toHaveBeenNthCalledWith(
    1,
    expect.stringMatching(/app$/),
    expect.anything()
  )
  expect(mockMkdir).toHaveBeenNthCalledWith(
    2,
    expect.stringMatching(/utils$/),
    expect.anything()
  )
  expect(mockMkdir).toHaveBeenNthCalledWith(
    3,
    expect.stringMatching(/components$/),
    expect.anything()
  )
  expect(mockWriteFile).toHaveBeenNthCalledWith(
    1,
    expect.stringMatching(/tailwind.config.js$/),
    expect.stringContaining(`/** @type {import('tailwindcss').Config} */`),
    "utf8"
  )
  expect(mockWriteFile).toHaveBeenNthCalledWith(
    2,
    expect.stringMatching(/app\/globals.css$/),
    expect.stringContaining(`@tailwind base`),
    "utf8"
  )
  expect(mockWriteFile).toHaveBeenNthCalledWith(
    3,
    expect.stringMatching(/utils\/cn.ts$/),
    expect.stringContaining(`import { type ClassValue, clsx } from "clsx"`),
    "utf8"
  )
  expect(execa).toHaveBeenCalledWith(
    "npm",
    [
      "install",
      "tailwindcss-animate",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
      "lucide-react",
    ],
    {
      cwd: targetDir,
    }
  )

  mockMkdir.mockRestore()
  mockWriteFile.mockRestore()
})

afterEach(() => {
  vi.resetAllMocks()
})
