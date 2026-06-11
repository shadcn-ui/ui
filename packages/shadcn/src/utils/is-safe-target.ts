import path from "path"

export function isSafeTarget(targetPath: string, cwd: string): boolean {
  // Check for null bytes which can be used to bypass validations.
  if (targetPath.includes("\0")) {
    return false
  }

  // Decode URL-encoded sequences to catch encoded traversal attempts.
  let decodedPath: string
  try {
    // Decode multiple times to catch double-encoded sequences.
    decodedPath = targetPath
    let prevPath = ""
    while (decodedPath !== prevPath && decodedPath.includes("%")) {
      prevPath = decodedPath
      decodedPath = decodeURIComponent(decodedPath)
    }
  } catch {
    // If decoding fails, treat as unsafe.
    return false
  }

  // Normalize both paths to handle different path separators.
  // Convert Windows backslashes to forward slashes for consistent handling.
  const normalizedTarget = path.normalize(decodedPath.replace(/\\/g, "/"))
  const normalizedRoot = path.normalize(cwd)

  // Check for explicit path traversal sequences in both encoded and decoded forms.
  // Allow [...] pattern which is common in framework routing (e.g., [...slug])
  const hasPathTraversal = (path: string) => {
    // Remove [...] patterns before checking for ..
    const withoutBrackets = path.replace(/\[\.\.\..*?\]/g, "")
    return withoutBrackets.includes("..")
  }

  if (
    hasPathTraversal(normalizedTarget) ||
    hasPathTraversal(decodedPath) ||
    hasPathTraversal(targetPath)
  ) {
    return false
  }

  // Check for current directory references that might be used in traversal.
  // First, remove [...] patterns to avoid false positives
  const cleanPath = (path: string) => path.replace(/\[\.\.\..*?\]/g, "")
  const cleanTarget = cleanPath(targetPath)
  const cleanDecoded = cleanPath(decodedPath)

  const suspiciousPatterns = [
    /\.\.[\/\\]/, // ../ or ..\
    /[\/\\]\.\./, // /.. or \..
    /\.\./, // .. anywhere
    /\.\.%/, // URL encoded traversal
    /\x00/, // null byte
    /[\x01-\x1f]/, // control characters
  ]

  if (
    suspiciousPatterns.some(
      (pattern) => pattern.test(cleanTarget) || pattern.test(cleanDecoded)
    )
  ) {
    return false
  }

  // Allow ~/ at the start (home directory expansion within project) but reject ~/../ patterns.
  if (
    (targetPath.includes("~") || decodedPath.includes("~")) &&
    (targetPath.includes("../") || decodedPath.includes("../"))
  ) {
    return false
  }

  // Check for Windows drive letters (even on non-Windows systems for safety).
  const driveLetterRegex = /^[a-zA-Z]:[\/\\]/
  if (driveLetterRegex.test(decodedPath)) {
    // On Windows, check if it starts with the project root.
    if (process.platform === "win32") {
      return decodedPath.toLowerCase().startsWith(cwd.toLowerCase())
    }
    // On non-Windows systems, reject all Windows absolute paths.
    return false
  }

  // If it's an absolute path, ensure it's within the project root.
  if (path.isAbsolute(normalizedTarget)) {
    return normalizedTarget.startsWith(normalizedRoot + path.sep)
  }

  // For relative paths, resolve and check if within project bounds.
  const resolvedPath = path.resolve(normalizedRoot, normalizedTarget)
  return (
    resolvedPath.startsWith(normalizedRoot + path.sep) ||
    resolvedPath === normalizedRoot
  )
}
