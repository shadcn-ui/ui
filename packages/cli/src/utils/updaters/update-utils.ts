import { promises as fs } from "fs"
import { Config } from "@/src/utils/get-config"
import * as templates from "@/src/utils/templates"

export async function updateUtils(config: Config) {
  const extension = config.tsx ? "ts" : "js"
  await fs.writeFile(
    `${config.resolvedPaths.utils}.${extension}`,
    extension === "ts" ? templates.UTILS : templates.UTILS_JS,
    "utf8"
  )
}
