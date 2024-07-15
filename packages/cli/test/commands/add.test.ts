import fs, { appendFile, mkdir } from "fs"
import path from "path"
import execa from "execa"
import {afterEach, expect, test, vi} from "vitest"
import {add, runAdd} from "../../src/commands/add"
import { getConfig } from "../../src/utils/get-config"

vi.mock("execa")
vi.mock("fs/promises", () => ({
  appendFile: vi.fn(),
  mkdir: vi.fn(),
  writeFile: vi.fn()
}))

test("add with reExport", async () => {
  const targetDir = path.resolve(__dirname, "../fixtures/config-reexport")
  const config = await getConfig(targetDir)

  vi.spyOn(fs.promises, "writeFile").mockResolvedValue()
  const mockMkdir = vi.spyOn(fs.promises, "mkdir").mockResolvedValue(undefined)
  const mockAppendFile = vi.spyOn(fs.promises, "appendFile").mockResolvedValue(undefined)

  await runAdd(targetDir, config, {
    all: false,
    components: ["button"],
    cwd: targetDir,
    overwrite: false,
    yes: true,
  });

  expect(mockMkdir).toHaveBeenCalledTimes(1);
  expect(mockAppendFile).toHaveBeenCalledWith(
    expect.stringMatching("src/components/ui/index.tsx"),
    "export * from \"./button\""
  )
})

test("add without reExport", async () => {
  const targetDir = path.resolve(__dirname, "../fixtures/config-full")
  const config = await getConfig(targetDir)

  vi.spyOn(fs.promises, "writeFile").mockResolvedValue()
  const mockMkdir = vi.spyOn(fs.promises, "mkdir").mockResolvedValue(undefined)
  const mockAppendFile = vi.spyOn(fs.promises, "appendFile").mockResolvedValue(undefined)

  await runAdd(targetDir, config, {
    all: false,
    components: ["button"],
    cwd: targetDir,
    overwrite: false,
    yes: true,
  });

  expect(mockMkdir).toHaveBeenCalledTimes(1);
  expect(mockAppendFile).not.toHaveBeenCalled()
})