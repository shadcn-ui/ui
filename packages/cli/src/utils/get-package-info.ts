import path from "path"
import fs from "fs-extra"
import { type PackageJson } from "type-fest"

export function getPackageInfo() {
  const packageJsonPath = path.join("package.json")
  const fileContent = fs.readJSONSync(packageJsonPath, {
    throws: false,
  }) as PackageJson | null

  if (!fileContent) {
    throw new Error("Failed to read or parse package.json. Make sure it exists or is not malformed.")
  }

  return fileContent
}
