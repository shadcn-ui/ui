import path from "path"
import fs from "fs-extra"

/**
 * Linter options supported by the CLI
 */
export const LINTERS = {
  eslint: "eslint",
  biome: "biome",
} as const

/**
 * Type for supported linters
 */
export type Linter = keyof typeof LINTERS

/**
 * Removes ESLint configuration files from a directory
 * Handles both legacy (.eslintrc.*) and flat config formats (eslint.config.*)
 *
 * @param directory - Directory to remove ESLint config files from
 */
export async function removeEslintConfigs(directory: string) {
  // Legacy ESLint config files
  if (await fs.pathExists(path.join(directory, ".eslintrc.js"))) {
    await fs.remove(path.join(directory, ".eslintrc.js"))
  }
  if (await fs.pathExists(path.join(directory, ".eslintrc.json"))) {
    await fs.remove(path.join(directory, ".eslintrc.json"))
  }
  if (await fs.pathExists(path.join(directory, ".eslintrc.cjs"))) {
    await fs.remove(path.join(directory, ".eslintrc.cjs"))
  }
  if (await fs.pathExists(path.join(directory, ".eslintrc.mjs"))) {
    await fs.remove(path.join(directory, ".eslintrc.mjs"))
  }
  if (await fs.pathExists(path.join(directory, ".eslintrc"))) {
    await fs.remove(path.join(directory, ".eslintrc"))
  }
  if (await fs.pathExists(path.join(directory, ".eslintrc.yml"))) {
    await fs.remove(path.join(directory, ".eslintrc.yml"))
  }
  if (await fs.pathExists(path.join(directory, ".eslintrc.yaml"))) {
    await fs.remove(path.join(directory, ".eslintrc.yaml"))
  }

  // New flat config format
  if (await fs.pathExists(path.join(directory, "eslint.config.js"))) {
    await fs.remove(path.join(directory, "eslint.config.js"))
  }
  if (await fs.pathExists(path.join(directory, "eslint.config.mjs"))) {
    await fs.remove(path.join(directory, "eslint.config.mjs"))
  }
  if (await fs.pathExists(path.join(directory, "eslint.config.cjs"))) {
    await fs.remove(path.join(directory, "eslint.config.cjs"))
  }
}

/**
 * Removes ESLint dependencies from package.json devDependencies
 *
 * @param dependencies - Object containing devDependencies
 * @returns Object with ESLint dependencies removed
 */
export function removeEslintDependencies(dependencies: Record<string, string>) {
  const eslintDeps = Object.keys(dependencies).filter((dep) =>
    dep.includes("eslint")
  )

  const result = { ...dependencies }

  for (const dep of eslintDeps) {
    delete result[dep]
  }

  return result
}
