import path from "path"
import fs from "fs-extra"

export async function getProjectInfo() {
  try {
    const tsconfigPath = path.join("tsconfig.json")
    const tsconfig = await fs.readJSON(tsconfigPath)

    if (!tsconfig) {
      throw new Error("tsconfig.json is missing")
    }

    const paths = tsconfig.compilerOptions?.paths
    if (!paths) {
      throw new Error("tsconfig.json is missing paths")
    }

    const alias = Object.keys(paths)[0].replace("*", "")

    return {
      alias,
    }
  } catch (error) {
    return null
  }
}
