import { existsSync } from "fs"
import path from "path"

export function isEnvFile(filePath: string) {
  const fileName = path.basename(filePath)
  return /^\.env(\.|$)/.test(fileName)
}

/**
 * Finds a file variant in the project.
 * TODO: abstract this to a more generic function.
 */
export function findExistingEnvFile(targetDir: string) {
  const variants = [
    ".env.local",
    ".env",
    ".env.development.local",
    ".env.development",
  ]

  for (const variant of variants) {
    const filePath = path.join(targetDir, variant)
    if (existsSync(filePath)) {
      return filePath
    }
  }

  return null
}

/**
 * Parse .env content into key-value pairs.
 */
export function parseEnvContent(content: string) {
  const lines = content.split("\n")
  const env: Record<string, string> = {}

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith("#")) {
      continue
    }

    // Find the first = and split there
    const equalIndex = trimmed.indexOf("=")
    if (equalIndex === -1) {
      continue
    }

    const key = trimmed.substring(0, equalIndex).trim()
    const value = trimmed.substring(equalIndex + 1).trim()

    if (key) {
      env[key] = value.replace(/^["']|["']$/g, "")
    }
  }

  return env
}

/**
 * Get the list of new keys that would be added when merging env content.
 */
export function getNewEnvKeys(existingContent: string, newContent: string) {
  const existingEnv = parseEnvContent(existingContent)
  const newEnv = parseEnvContent(newContent)

  const newKeys = []
  for (const key of Object.keys(newEnv)) {
    if (!(key in existingEnv)) {
      newKeys.push(key)
    }
  }

  return newKeys
}

/**
 * Merge env content by appending ONLY new keys that don't exist in the existing content.
 * Existing keys are preserved with their original values.
 */
export function mergeEnvContent(existingContent: string, newContent: string) {
  const existingEnv = parseEnvContent(existingContent)
  const newEnv = parseEnvContent(newContent)

  let result = existingContent.trimEnd()
  if (result && !result.endsWith("\n")) {
    result += "\n"
  }

  const newKeys: string[] = []
  for (const [key, value] of Object.entries(newEnv)) {
    if (!(key in existingEnv)) {
      newKeys.push(`${key}=${value}`)
    }
  }

  if (newKeys.length > 0) {
    if (result) {
      result += "\n"
    }
    result += newKeys.join("\n")
    return result + "\n"
  }

  // Ensure existing content ends with newline.
  if (result && !result.endsWith("\n")) {
    return result + "\n"
  }

  return result
}
