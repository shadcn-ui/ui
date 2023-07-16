import { existsSync, promises as fs } from "fs"
import path from "path"
import { Config } from "@/src/utils/get-config"
import { logger } from "@/src/utils/logger"
import { getItemTargetPath, getRegistryBaseColor } from "@/src/utils/registry"
import { registryWithContentSchema } from "@/src/utils/registry/schema"
import { transform } from "@/src/utils/transformers"
import chalk from "chalk"
import { execa } from "execa"
import ora from "ora"
import * as z from "zod"

import { getPackageManager } from "../utils/get-package-manager"

export type RegistryPayload = z.infer<typeof registryWithContentSchema>

export async function installComponents(
  selectedComponents: string[],
  payload: RegistryPayload,
  config: Config,
  cwd: string,
  optionsPath: string | undefined,
  preventOverwrite: boolean
) {
  const baseColor = await getRegistryBaseColor(config.tailwind.baseColor)
  const spinner = ora(`Installing components...`).start()
  for (const item of payload) {
    spinner.text = `Installing ${item.name}...`
    const targetDir = await getItemTargetPath(
      config,
      item,
      optionsPath ? path.resolve(cwd, optionsPath) : undefined
    )

    if (!targetDir) {
      continue
    }

    if (!existsSync(targetDir)) {
      await fs.mkdir(targetDir, { recursive: true })
    }

    const existingComponent = item.files.filter((file) =>
      existsSync(path.resolve(targetDir, file.name))
    )

    if (existingComponent.length && preventOverwrite) {
      if (selectedComponents.includes(item.name)) {
        logger.warn(
          `Component ${item.name} already exists. Use ${chalk.green(
            "--overwrite"
          )} to overwrite.`
        )
        process.exit(1)
      }

      continue
    }

    for (const file of item.files) {
      let filePath = path.resolve(targetDir, file.name)

      // Run transformers.
      const content = await transform({
        filename: file.name,
        raw: file.content,
        config,
        baseColor,
      })

      if (!config.tsx) {
        filePath = filePath.replace(/\.tsx$/, ".jsx")
      }

      await fs.writeFile(filePath, content)
    }

    // Install dependencies.
    if (item.dependencies?.length) {
      const packageManager = await getPackageManager(cwd)
      await execa(
        packageManager,
        [packageManager === "npm" ? "install" : "add", ...item.dependencies],
        {
          cwd,
        }
      )
    }
  }
  spinner.succeed(`Done.`)
}
