import os from "os"
import path from "path"
import fs from "fs-extra"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  FILE_BACKUP_SUFFIX,
  FileBackupError,
  withFileBackup,
} from "./file-helper"

const tempDirs: string[] = []

async function createTempFile() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "shadcn-file-helper-"))
  tempDirs.push(dir)

  const filePath = path.join(dir, "components.json")
  await fs.writeFile(filePath, '{"style":"before"}\n', "utf8")

  return filePath
}

afterEach(async () => {
  vi.restoreAllMocks()
  await Promise.all(tempDirs.splice(0).map((dir) => fs.remove(dir)))
})

describe("withFileBackup", () => {
  it("should restore the original file when the task throws", async () => {
    const filePath = await createTempFile()

    await expect(
      withFileBackup(filePath, async () => {
        await fs.writeFile(filePath, '{"style":"after"}\n', "utf8")
        throw new Error("boom")
      })
    ).rejects.toThrow("boom")

    expect(await fs.readFile(filePath, "utf8")).toBe('{"style":"before"}\n')
    expect(await fs.pathExists(`${filePath}${FILE_BACKUP_SUFFIX}`)).toBe(false)
  })

  it("should remove the backup after a successful task", async () => {
    const filePath = await createTempFile()

    await withFileBackup(filePath, async () => {
      await fs.writeFile(filePath, '{"style":"after"}\n', "utf8")
    })

    expect(await fs.readFile(filePath, "utf8")).toBe('{"style":"after"}\n')
    expect(await fs.pathExists(`${filePath}${FILE_BACKUP_SUFFIX}`)).toBe(false)
  })

  it("should abort when backup creation fails", async () => {
    const filePath = await createTempFile()
    const task = vi.fn(async () => {
      await fs.writeFile(filePath, '{"style":"after"}\n', "utf8")
    })
    const renameSyncSpy = vi.spyOn(fs, "renameSync").mockImplementation(() => {
      throw new Error("boom")
    })

    await expect(withFileBackup(filePath, task)).rejects.toThrow(
      FileBackupError
    )

    expect(task).not.toHaveBeenCalled()
    expect(await fs.readFile(filePath, "utf8")).toBe('{"style":"before"}\n')
    expect(await fs.pathExists(`${filePath}${FILE_BACKUP_SUFFIX}`)).toBe(false)

    renameSyncSpy.mockRestore()
  })
})
