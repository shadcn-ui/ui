import { existsSync } from "fs"
import path from "path"
import fs from "fs-extra"

export async function getProjectInfo() {
  const info = {
    tsconfig: null,
    srcDir: false,
    appDir: false,
    srcComponentsUiDir: false,
    componentsUiDir: false,
  }

  try {
    const tsconfig = await getTsConfig()

    return {
      tsconfig,
      srcDir: existsSync(path.resolve("./src")),
      appDir:
        existsSync(path.resolve("./app")) ||
        existsSync(path.resolve("./src/app")),
      srcComponentsUiDir: existsSync(path.resolve("./src/components/ui")),
      componentsUiDir: existsSync(path.resolve("./components/ui")),
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
