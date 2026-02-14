import path from "path"
import { initOptionsSchema } from "@/src/commands/init"
import { fetchRegistry } from "@/src/registry/fetcher"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { templates } from "@/src/utils/templates/index"
import { execa } from "execa"
import fs from "fs-extra"
import prompts from "prompts"
import { z } from "zod"

export async function createProject(
  options: Pick<
    z.infer<typeof initOptionsSchema>,
    "cwd" | "name" | "force" | "srcDir" | "components" | "template"
  >
) {
  options = {
    srcDir: false,
    ...options,
  }

  let template: keyof typeof templates =
    options.template && options.template in templates
      ? (options.template as keyof typeof templates)
      : "next"
  let projectName: string =
    options.name ?? templates[template].defaultProjectName
  let nextVersion = "latest"

  const isRemoteComponent =
    options.components?.length === 1 &&
    !!options.components[0].match(/\/chat\/b\//)

  if (options.components && isRemoteComponent) {
    try {
      const [result] = await fetchRegistry(options.components)
      const { meta } = z
        .object({
          meta: z.object({
            nextVersion: z.string(),
          }),
        })
        .parse(result)
      nextVersion = meta.nextVersion

      // Force template to next for remote components.
      template = "next"
    } catch (error) {
      logger.break()
      handleError(error)
    }
  }

  if (!options.force) {
    const { type, name } = await prompts([
      {
        type: options.template || isRemoteComponent ? null : "select",
        name: "type",
        message: `The path ${highlighter.info(
          options.cwd
        )} does not contain a package.json file.\n  Would you like to start a new project?`,
        choices: Object.entries(templates).map(([key, t]) => ({
          title: t.title,
          value: key,
        })),
        initial: 0,
      },
      {
        type: options.name ? null : "text",
        name: "name",
        message: "What is your project named?",
        initial: projectName,
        format: (value: string) => value.trim(),
        validate: (value: string) =>
          value.length > 128
            ? `Name should be less than 128 characters.`
            : true,
      },
    ])

    template = type ?? template
    projectName = name ?? projectName
  }

  const packageManager = await getPackageManager(options.cwd, {
    withFallback: true,
  })

  const projectPath = `${options.cwd}/${projectName}`

  // Check if path is writable.
  try {
    await fs.access(options.cwd, fs.constants.W_OK)
  } catch (error) {
    logger.break()
    logger.error(`The path ${highlighter.info(options.cwd)} is not writable.`)
    logger.error(
      `It is likely you do not have write permissions for this folder or the path ${highlighter.info(
        options.cwd
      )} does not exist.`
    )
    logger.break()
    process.exit(1)
  }

  if (fs.existsSync(path.resolve(options.cwd, projectName, "package.json"))) {
    logger.break()
    logger.error(
      `A project with the name ${highlighter.info(projectName)} already exists.`
    )
    logger.error(`Please choose a different name and try again.`)
    logger.break()
    process.exit(1)
  }

  await templates[template].init({
    projectPath,
    packageManager,
    cwd: options.cwd,
    srcDir: !!options.srcDir,
    version: nextVersion,
  })

  return {
    projectPath,
    projectName,
    template,
  }
}
