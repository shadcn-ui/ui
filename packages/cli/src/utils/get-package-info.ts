import path from "path"
import fs from "fs-extra"
import { type PackageJson } from "type-fest"

export type ShadcnUIConfig = {
  "shadow-ui"?: {
    componentsDir?: string
  }
}

export type PkgJson = PackageJson & ShadcnUIConfig

export function getPackageInfo() {
  const packageJsonPath = path.join("package.json")

  return fs.readJSONSync(packageJsonPath) as PkgJson
}
