import path from "path"
import { initOptionsSchema } from "@/src/commands/init"
import { resolveTemplate, templates } from "@/src/templates/index"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import fs from "fs-extra"
import prompts from "prompts"
import { z } from "zod"

export async function createProject(
  options: Pick<
    z.infer<typeof initOptionsSchema>,
    "cwd" | "name" | "force" | "components" | "template" | "monorepo"
  >
) {
  let template: keyof typeof templates =
    options.template && options.template in templates
      ? (options.template as keyof typeof templates)
      : "next"

  const resolved = resolveTemplate(templates[template], {
    monorepo: options.monorepo,
  })
  let projectName: string = options.name ?? resolved.defaultProjectName

  const isRemoteComponent =
    options.components?.length === 1 &&
    !!options.components[0].match(/\/chat\/b\//)

  // Force template to next for remote components.
  if (isRemoteComponent) {
    template = "next"
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
          description: t.description,
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

  // Re-resolve after potential template change from prompt.
  const effectiveTemplate = resolveTemplate(templates[template], {
    monorepo: options.monorepo,
  })

  const packageManager =
    effectiveTemplate.packageManager ??
    (await getPackageManager(options.cwd, {
      withFallback: true,
    }))

  const projectPath = path.join(options.cwd, projectName)

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

  await effectiveTemplate.scaffold({
    projectPath,
    packageManager,
    cwd: options.cwd,
  })

  return {
    projectPath,
    projectName,
    template,
  }
}
