import { existsSync } from "fs"
import path from "path"
import fs from "fs-extra"
import { TsConfigJson } from "type-fest"

export async function getProjectInfo(cwd: string) {
  const info = {
    tsconfig: null,
    srcDir: false,
    appDir: false,
    stylesDir: null,
    srcComponentsUiDir: false,
    componentsUiDir: false,
  }

  try {
    const tsconfig = await getTsConfig(cwd)
    const stylesDir = getStylesDir(cwd)
    return {
      tsconfig,
      srcDir: existsSync(path.resolve(cwd, "./src")),
      appDir:
        existsSync(path.resolve(cwd, "./app")) ||
        existsSync(path.resolve(cwd, "./src/app")),
      stylesDir,
      srcComponentsUiDir: existsSync(path.resolve(cwd, "./src/components/ui")),
      componentsUiDir: existsSync(path.resolve(cwd, "./components/ui")),
    }
  } catch (error) {
    return info
  }
}

export async function getTsConfig(cwd: string) {
  try {
    const tsconfigPath = path.join(cwd, "tsconfig.json")
    const tsconfig = await fs.readJSON(tsconfigPath)
    if (!tsconfig) {
      throw new Error("tsconfig.json is missing")
    }
    return tsconfig as TsConfigJson
  } catch (error) {
    return null
  }
}

export function getStylesDir(cwd: string) {
  const possiblePaths = [
    "./styles",
    "./src/styles",
    "./src/app/styles",
    "./app/styles",
  ]

  const stylesDir =
    possiblePaths.find((possiblePath) =>
      existsSync(path.resolve(cwd, possiblePath))
    ) || null

  return stylesDir
}

export function resolveProjectDir(appDir: boolean, srcDir: boolean) {
  if (appDir && srcDir) return "src/app"
  if (appDir) return "app"
  if (srcDir) return "src"

  return ""
}
