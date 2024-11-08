import path from "path"
import { Command } from "commander"
import fs from "fs-extra"
import prompts from "prompts"
import { z } from "zod"

import { RawConfig, getRawConfig, rawConfigSchema } from "../utils/get-config"
import { handleError } from "../utils/handle-error"
import { highlighter } from "../utils/highlighter"
import { logger } from "../utils/logger"
import { spinner } from "../utils/spinner"

async function updateComponentsJson(cwd: string, config: RawConfig) {
  const componentSpinner = spinner(`Updating components.json.`).start()
  const targetPath = path.resolve(cwd, "components.json")
  await fs.writeFile(
    targetPath,
    JSON.stringify(rawConfigSchema.parse(config), null, 2),
    "utf8"
  )
  componentSpinner.succeed()
}

export const addOptionsSchema = z.object({
  name: z.string(),
  url: z.string(),
  cwd: z.string(),
  style: z.string(),
  update: z.boolean(),
})

const addRegistry = new Command()
  .name("add")
  .description("add an external registry")
  .argument("name", "name of the registry")
  .argument("url", "the url of the registry")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("-s, --style <style>", "style to use for this registry", "default")
  .option("-u, --update", "update an existing registry", false)
  .action(async (name, url, opts) => {
    try {
      const options = addOptionsSchema.parse({
        url,
        name,
        ...opts,
      })

      const config = await getRawConfig(options.cwd)
      if (!config) {
        logger.warn(
          `Configuration is missing. Please run ${highlighter.success(
            `init`
          )} to create a components.json file.`
        )
        process.exit(1)
      }

      config.registries ??= {}

      if (!options.update && options.name in config.registries) {
        const { proceed } = await prompts({
          type: "confirm",
          name: "proceed",
          message: `Registry ${highlighter.info(
            options.name
          )} already exists. Do you want to update?`,
          initial: true,
        })

        if (!proceed) {
          logger.break()
          process.exit(1)
        }
      }

      config.registries[options.name] = {
        url: options.url,
        style: options.style,
      }

      await updateComponentsJson(options.cwd, config)
    } catch (error) {
      logger.break()
      handleError(error)
    }
  })

export const deleteOptionsSchema = z.object({
  name: z.string(),
  cwd: z.string(),
})

const removeRegistry = new Command()
  .name("remove")
  .description("remove an external registry")
  .argument("name", "name of the registry")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(async (name, opts) => {
    try {
      const options = deleteOptionsSchema.parse({
        name,
        ...opts,
      })

      const config = await getRawConfig(options.cwd)
      if (!config) {
        logger.warn(
          `Configuration is missing. Please run ${highlighter.success(
            `init`
          )} to create a components.json file.`
        )
        process.exit(1)
      }

      if (config.registries && options.name in config.registries) {
        delete config.registries[options.name]
        await updateComponentsJson(options.cwd, config)
      } else {
        logger.warn(
          `Registry ${highlighter.info(
            options.name
          )} not found in components.json.`
        )
      }
    } catch (error) {
      logger.break()
      handleError(error)
    }
  })
export const registry = new Command()
  .name("registry")
  .description("manage external registries")
  .addCommand(addRegistry)
  .addCommand(removeRegistry)
