import fsExtra from "fs-extra"

export const FILE_BACKUP_SUFFIX = ".bak"

type WithFileBackupOptions = {
  onBackupFailure?: (filePath: string) => void
}

export function createFileBackup(filePath: string): string | null {
  if (!fsExtra.existsSync(filePath)) {
    return null
  }

  const backupPath = `${filePath}${FILE_BACKUP_SUFFIX}`
  try {
    fsExtra.renameSync(filePath, backupPath)
    return backupPath
  } catch (error) {
    console.error(`Failed to create backup of ${filePath}: ${error}`)
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
  task: () => Promise<T>,
  options: WithFileBackupOptions = {}
) {
  if (!fsExtra.existsSync(filePath)) {
    return task()
  }

  const backupPath = createFileBackup(filePath)

  if (!backupPath) {
    options.onBackupFailure?.(filePath)
    throw new Error(`Could not back up ${filePath}.`)
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
