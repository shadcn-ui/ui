import path from "path"
import fs from "fs-extra"

import { getProjectInfo, resolveProjectDir } from "./get-project-info"

export const getInitialValues = async () => {
  const { srcDir, appDir, tsconfig, stylesDir } = await getProjectInfo()
  const dir = resolveProjectDir(appDir, srcDir)
  const cssDir = stylesDir ?? dir
  const css = (await findCssFile(cssDir)) ?? "globals.css"
  const paths = tsconfig?.compilerOptions?.paths
  const alias = paths
    ? Object.keys(paths)
        .find((key) => paths[key].toString().includes(dir))
        ?.split("/*")[0] ??
      Object.keys(paths)[0].split("/")[0] ??
      "@"
    : dir
  const twConfig = await findTwConfig("./")
  return {
    DEFAULT_TAILWIND_CSS: cssDir.length ? `${cssDir}/${css}` : css,
    DEFAULT_COMPONENTS: alias.length ? `${alias}/components` : "components",
    DEFAULT_UTILS: alias.length ? `${alias}/lib/utils` : "lib/utils",
    DEFAULT_TAILWIND_BASE_COLOR: "slate",
    DEFAULT_TAILWIND_CONFIG: twConfig,
    DEFAULT_STYLE: "default",
  }
}

//find common global css files
const findCssFile = async (dir: string) => {
  const files = await fs.readdir(dir || "./")
  const cssFiles = files.filter((file) => file.endsWith(".css"))
  const prioritizedKeywords = ["index", "global", "style", "tailwind", "main"]

  const matchingFile = cssFiles.find((file) => {
    return prioritizedKeywords.some((keyword) => file.includes(keyword))
  })
  if (matchingFile) {
    return matchingFile
  }

  return null
}

const findTwConfig = async (dir: string) => {
  const files = await fs.readdir(dir ?? "./")
  return files.find((file) => file.includes("tailwind.config"))
}
