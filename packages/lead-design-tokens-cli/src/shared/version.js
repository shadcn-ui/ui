// src/shared/version.js
// Read the CLI package version from package.json. Used by `build` to stamp
// generated artifacts.

import { readFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const packageJsonPath = resolve(here, "../../package.json")

export async function readPackageVersion() {
  const raw = await readFile(packageJsonPath, "utf8")
  const parsed = JSON.parse(raw)
  if (typeof parsed.version !== "string") {
    throw new Error("readPackageVersion: package.json has no string version.")
  }
  return parsed.version
}
