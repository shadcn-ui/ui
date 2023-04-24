import { existsSync } from "fs"
import path from "path"
import fs from "fs-extra"

export interface ProjectInfo {
  tsconfig: any | null
  alias: null | string
  srcDir: boolean
  appDir: boolean
}

export async function getProjectInfo() {
  const info: ProjectInfo = {
    tsconfig: null,
    alias: null,
    srcDir: false,
    appDir: false,
  }

  try {
    const tsconfig = await getTsConfig()
    const paths = tsconfig?.compilerOptions?.paths
    const alias = paths ? Object.keys(paths)[0].replace("*", "") : null

    return {
      tsconfig,
      alias,
      srcDir: existsSync(path.resolve("./src")),
      appDir:
        existsSync(path.resolve("./app")) ||
        existsSync(path.resolve("./src/app")),
    }
  } catch (error) {
    return info
  }
}

export async function getTsConfig() {
  try {
    const tsconfigPath = path.join("tsconfig.json")
    const tsconfig = await fs.readJSON(tsconfigPath)

    if (!tsconfig) {
      throw new Error("tsconfig.json is missing")
    }

    return tsconfig
  } catch (error) {
    return null
  }
}
