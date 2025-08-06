import fsExtra from "fs-extra"

export const FILE_BACKUP_SUFFIX = ".bak"

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
  } catch (error) {
    // Best effort - don't log as this is just cleanup
    return false
  }
}
