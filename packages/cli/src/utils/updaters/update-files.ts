import { existsSync, promises as fs } from "fs"
import path, { basename } from "path"
import { Config } from "@/src/utils/get-config"
import {
  getRegistryBaseColor,
  getRegistryItemFileTargetPath,
} from "@/src/utils/registry"
import { RegistryItem } from "@/src/utils/registry/schema"
import { transform } from "@/src/utils/transformers"
import { transformCssVars } from "@/src/utils/transformers/transform-css-vars"
import { transformImport } from "@/src/utils/transformers/transform-import"
import { transformRsc } from "@/src/utils/transformers/transform-rsc"
import { transformTwPrefixes } from "@/src/utils/transformers/transform-tw-prefix"

export async function updateFiles(
  files: RegistryItem["files"],
  config: Config,
  options: {
    overwrite?: boolean
    force?: boolean
  }
) {
  if (!files?.length) {
    return
  }
  options = {
    overwrite: false,
    force: false,
    ...options,
  }
  const baseColor = await getRegistryBaseColor(config.tailwind.baseColor)

  for (const file of files) {
    // Do nothing if the file is empty.
    if (!file.content) {
      continue
    }

    const targetDir = getRegistryItemFileTargetPath(file, config)

    // Create the target directory if it doesn't exist.
    if (!existsSync(targetDir)) {
      await fs.mkdir(targetDir, { recursive: true })
    }

    const fileName = basename(file.path)
    let filePath = path.join(targetDir, fileName)

    // Do nothing if the file already exists and we're not overwriting.
    const existingFile = existsSync(filePath)
    if (existingFile && !options.overwrite) {
      continue
    }

    // Run our transformers.
    const content = await transform(
      {
        filename: file.path,
        raw: file.content,
        config,
        baseColor,
        transformJsx: !config.tsx,
      },
      [transformImport, transformRsc, transformCssVars, transformTwPrefixes]
    )

    if (!config.tsx) {
      filePath = filePath.replace(/\.tsx?$/, (match) =>
        match === ".tsx" ? ".jsx" : ".js"
      )
    }

    await fs.writeFile(filePath, content, "utf-8")
  }
}
