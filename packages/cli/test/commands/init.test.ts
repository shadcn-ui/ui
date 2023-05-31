import fs from "fs"
import path from "path"
import { execa } from "execa"
import { afterEach, expect, test, vi } from "vitest"

import { runInit } from "../../src/commands/init"
import { Config, getConfig } from "../../src/utils/get-config"
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

test("init project", async () => {
  vi.spyOn(getPackageManger, "getPackageManager").mockResolvedValue("pnpm")
  const mockMkdir = vi.spyOn(fs.promises, "mkdir").mockResolvedValue(undefined)
  const mockWriteFile = vi.spyOn(fs.promises, "writeFile").mockResolvedValue()

  const targetDir = path.resolve(__dirname, "../fixtures/project")
  const config = (await getConfig(targetDir)) as Config

  await runInit(targetDir, config)

  expect(mockMkdir).toHaveBeenNthCalledWith(
    1,
    expect.stringMatching(/components$/),
    expect.anything()
  )
  expect(mockMkdir).toHaveBeenNthCalledWith(
    2,
    expect.stringMatching(/components\/ui$/),
    expect.anything()
  )
  expect(mockMkdir).toHaveBeenNthCalledWith(
    3,
    expect.stringMatching(/lib$/),
    expect.anything()
  )
  expect(mockWriteFile).toHaveBeenNthCalledWith(
    1,
    expect.stringMatching(/lib\/utils.ts$/),
    expect.stringContaining(`import { type ClassValue, clsx } from "clsx"`),
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
    expect.stringMatching(/tailwind.config.js$/),
    expect.stringContaining(`/** @type {import('tailwindcss').Config} */`),
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

test("init project-src", async () => {
  vi.spyOn(getPackageManger, "getPackageManager").mockResolvedValue("npm")
  const mockMkdir = vi.spyOn(fs.promises, "mkdir").mockResolvedValue(undefined)
  const mockWriteFile = vi.spyOn(fs.promises, "writeFile").mockResolvedValue()

  const targetDir = path.resolve(__dirname, "../fixtures/project-src")
  const config = (await getConfig(targetDir)) as Config

  await runInit(targetDir, config)

  expect(mockMkdir).toHaveBeenNthCalledWith(
    1,
    expect.stringMatching(/src\/components$/),
    expect.anything()
  )
  expect(mockMkdir).toHaveBeenNthCalledWith(
    2,
    expect.stringMatching(/src\/ui$/),
    expect.anything()
  )
  expect(mockMkdir).toHaveBeenNthCalledWith(
    3,
    expect.stringMatching(/src\/lib$/),
    expect.anything()
  )
  expect(mockWriteFile).toHaveBeenNthCalledWith(
    1,
    expect.stringMatching(/src\/lib\/cn.ts$/),
    expect.stringContaining(`import { type ClassValue, clsx } from "clsx"`),
    "utf8"
  )
  expect(mockWriteFile).toHaveBeenNthCalledWith(
    2,
    expect.stringMatching(/src\/styles\/main.css$/),
    expect.stringContaining(`@tailwind base`),
    "utf8"
  )
  expect(mockWriteFile).toHaveBeenNthCalledWith(
    3,
    expect.stringMatching(/tailwind.config.ts$/),
    expect.stringContaining(`/** @type {import('tailwindcss').Config} */`),
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
