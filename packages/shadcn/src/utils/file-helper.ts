import fsExtra from "fs-extra"

export const FILE_BACKUP_SUFFIX = ".bak"

export class FileBackupError extends Error {
  filePath: string

  constructor(filePath: string) {
    super(`Could not back up ${filePath}.`)
    this.name = "FileBackupError"
    this.filePath = filePath
  }
}

export function createFileBackup(filePath: string): string | null {
  if (!fsExtra.existsSync(filePath)) {
    return null
  }

  const backupPath = `${filePath}${FILE_BACKUP_SUFFIX}`
  try {
    fsExtra.renameSync(filePath, backupPath)
    return backupPath
  } catch {
    return null
  }
}

export function restoreFileBackup(filePath: string): boolean {
  const backupPath = `${filePath}${FILE_BACKUP_SUFFIX}`

  if (!fsExtra.existsSync(backupPath)) {
    return false
  }

  try {
    fsExtra.renameSync(backupPath, filePath)
    return true
  } catch (error) {
    console.error(
      `Warning: Could not restore backup file ${backupPath}: ${error}`
    )
    return false
  }
}

export function deleteFileBackup(filePath: string): boolean {
  const backupPath = `${filePath}${FILE_BACKUP_SUFFIX}`

  if (!fsExtra.existsSync(backupPath)) {
    return false
  }

  try {
    fsExtra.unlinkSync(backupPath)
    return true
  } catch {
    // Best effort - don't log as this is just cleanup
    return false
  }
}

export async function withFileBackup<T>(
  filePath: string,
  task: () => Promise<T>
) {
  if (!fsExtra.existsSync(filePath)) {
    return task()
  }

  const backupPath = createFileBackup(filePath)

  if (!backupPath) {
    throw new FileBackupError(filePath)
  }

  const restoreBackupOnExit = () => restoreFileBackup(filePath)

  process.on("exit", restoreBackupOnExit)

  try {
    const result = await task()
    process.removeListener("exit", restoreBackupOnExit)
    deleteFileBackup(filePath)
    return result
  } catch (error) {
    process.removeListener("exit", restoreBackupOnExit)
    restoreFileBackup(filePath)
    throw error
  }
}
