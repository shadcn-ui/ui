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
    : dir.replace(".", "")
  const twConfig = await findTwConfig("./")

  return {
    DEFAULT_TAILWIND_CSS: `${cssDir}/${css}`,
    DEFAULT_COMPONENTS: `${alias}/components`,
    DEFAULT_UTILS: `${alias}/lib/utils`,
    DEFAULT_TAILWIND_BASE_COLOR: "slate",
    DEFAULT_TAILWIND_CONFIG: twConfig,
    DEFAULT_STYLE: "default",
  }
}

const findCssFile = async (dir: string) => {
  const files = await fs.readdir(dir || "./")
  return files.find((file) => {
    if (file.endsWith(".css")) {
      return (
        file.includes("index") ||
        file.includes("global") ||
        file.includes("style") ||
        file.includes("tailwind") ||
        file.includes("main")
      )
    }
  })
}

const findTwConfig = async (dir: string) => {
  const files = await fs.readdir(dir ?? "./")
  return files.find((file) => file.includes("tailwind.config"))
}
