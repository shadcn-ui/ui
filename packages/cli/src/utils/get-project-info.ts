import { existsSync } from "fs"
import path from "path"
import fs from "fs-extra"
import { TsConfigJson } from "type-fest"

export async function getProjectInfo() {
  const info = {
    tsconfig: null,
    srcDir: false,
    appDir: false,
    stylesDir: null,
    srcComponentsUiDir: false,
    componentsUiDir: false,
  }

  try {
    const tsconfig = await getTsConfig()
    const stylesDir = getStylesDir()
    return {
      tsconfig,
      srcDir: existsSync(path.resolve("./src")),
      appDir:
        existsSync(path.resolve("./app")) ||
        existsSync(path.resolve("./src/app")),
      stylesDir,
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
    return tsconfig as TsConfigJson
  } catch (error) {
    return null
  }
}

export function getStylesDir() {
  const stylesDir = existsSync(path.resolve("./styles"))
    ? "./styles"
    : existsSync(path.resolve("./src/styles"))
    ? "./src/styles"
    : existsSync(path.resolve("./src/app/styles"))
    ? "./src/app/styles"
    : existsSync(path.resolve("./app/styles"))
    ? "./app/styles"
    : null
  return stylesDir
}

export function resolveProjectDir(appDir: boolean, srcDir: boolean) {
  return appDir && srcDir ? "src/app" : appDir ? "app" : srcDir ? "src" : "."
}
