import { promises as fs } from "fs"
import { Config } from "@/src/utils/get-config"
import { RegistryItem } from "@/src/utils/registry/schema"
import * as templates from "@/src/utils/templates"

export async function updateFiles(
  files: RegistryItem["files"],
  config: Config
) {
  const extension = config.tsx ? "ts" : "js"
  await fs.writeFile(
    `${config.resolvedPaths.utils}.${extension}`,
    extension === "ts" ? templates.UTILS : templates.UTILS_JS,
    "utf8"
  )
}
