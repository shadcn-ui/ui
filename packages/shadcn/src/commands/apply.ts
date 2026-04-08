import path from "path"
import { runInit } from "@/src/commands/init"
import { preFlightApply } from "@/src/preflights/preflight-apply"
import { decodePreset, isPresetCode } from "@/src/preset/preset"
import {
  DEFAULT_PRESETS,
  promptToOpenPresetBuilder,
  resolveCreateUrl,
  resolveInitUrl,
  resolveRegistryBaseConfig,
} from "@/src/preset/presets"
import { SHADCN_URL } from "@/src/registry/constants"
import { clearRegistryContext } from "@/src/registry/context"
import { registryConfigSchema } from "@/src/registry/schema"
import { isUrl } from "@/src/registry/utils"
import { getTemplateForFramework } from "@/src/templates/index"
import { loadEnvFiles } from "@/src/utils/env-loader"
import * as ERRORS from "@/src/utils/errors"
import { withFileBackup } from "@/src/utils/file-helper"
import { getBase } from "@/src/utils/get-config"
import {
  getProjectComponents,
  getProjectInfo,
} from "@/src/utils/get-project-info"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { Command } from "commander"
import prompts from "prompts"
import { z } from "zod"

export const applyOptionsSchema = z.object({
  cwd: z.string(),
  positionalPreset: z.string().optional(),
  preset: z.string().optional(),
  yes: z.boolean(),
  silent: z.boolean(),
})

export const apply = new Command()
  .name("apply")
  .description("apply a preset to an existing project")
  .argument("[preset]", "the preset to apply")
  .option("--preset <preset>", "preset configuration to apply")
  .option("-y, --yes", "skip confirmation prompt.", false)
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("-s, --silent", "mute output.", false)
  .action(async (positionalPreset, opts) => {
    try {
      const options = applyOptionsSchema.parse({
        ...opts,
        cwd: path.resolve(opts.cwd),
        positionalPreset,
      })

      const preset = resolveApplyPreset(options)

      const preflight = await preFlightApply(options)

      if (preflight.errors[ERRORS.MISSING_DIR_OR_EMPTY_PROJECT]) {
        logger.break()
        logger.error(
          `The ${highlighter.info(
            "apply"
          )} command only works in an existing project.`
        )
        logger.error(`Run ${highlighter.info(getInitCommand(preset))} first.`)
        logger.break()
        process.exit(1)
      }

      if (preflight.errors[ERRORS.MISSING_CONFIG]) {
        logger.break()
        logger.error(
          `No ${highlighter.info("components.json")} found at ${highlighter.info(
            options.cwd
          )}.`
        )
        logger.error(`Run ${highlighter.info(getInitCommand(preset))} first.`)
        logger.break()
        process.exit(1)
      }

      const existingConfig = preflight.config
      if (!existingConfig) {
        process.exit(1)
      }

      const rtl = existingConfig.rtl ?? false
      const template = await resolveApplyTemplate(options.cwd)

      if (!preset) {
        const createUrl = resolveCreateUrl({
          command: "init",
          template,
          base: getBase(existingConfig.style),
          rtl,
        })

        await promptToOpenPresetBuilder({
          createUrl,
          followUp: `Then run ${highlighter.info(
            "shadcn apply --preset <preset>"
          )} with the preset code or preset URL from ui.shadcn.com.`,
          prompt: !options.yes,
        })

        process.exit(0)
      }

      validatePreset(preset)

      const reinstallComponents = await getProjectComponents(options.cwd)

      if (!options.yes) {
        logger.break()
        logger.warn(
          highlighter.warn(
            `Applying a new preset will overwrite existing UI components, fonts, and CSS variables.`
          )
        )
        logger.warn(
          `Commit or stash your changes before continuing so you can easily go back.`
        )
        logger.break()
        logger.log("  The following components will be re-installed:")
        if (reinstallComponents.length) {
          for (let i = 0; i < reinstallComponents.length; i += 8) {
            logger.log(`  - ${reinstallComponents.slice(i, i + 8).join(", ")}`)
          }
        } else {
          logger.log("  - No installed UI components were detected.")
        }
        logger.break()

        const { proceed } = await prompts({
          type: "confirm",
          name: "proceed",
          message: "Would you like to continue?",
          initial: false,
        })

        if (!proceed) {
          logger.break()
          process.exit(1)
        }
      }

      await loadEnvFiles(options.cwd)

      const currentBase = getBase(existingConfig.style)
      const initUrl = resolveApplyInitUrl(preset, currentBase, {
        template,
        rtl,
      })

      await withFileBackup(
        path.resolve(options.cwd, "components.json"),
        async () => {
          const {
            registryBaseConfig,
            installStyleIndex,
            url: cleanUrl,
          } = await resolveRegistryBaseConfig(initUrl, options.cwd, {
            registries: existingConfig.registries as
              | z.infer<typeof registryConfigSchema>
              | undefined,
          })

          await runInit({
            cwd: options.cwd,
            yes: true,
            force: false,
            reinstall: true,
            defaults: false,
            silent: options.silent,
            isNewProject: false,
            cssVariables: true,
            installStyleIndex,
            registryBaseConfig,
            existingConfig,
            components: [cleanUrl, ...reinstallComponents],
          })
        },
        {
          onBackupFailure: () => {
            logger.error(
              `Could not back up ${highlighter.info(
                "components.json"
              )}. Aborting.`
            )
          },
        }
      )

      logger.break()
      logger.log("Preset applied successfully.")
      logger.break()
    } catch (error) {
      logger.break()
      handleError(error)
    } finally {
      clearRegistryContext()
    }
  })

function resolveApplyPreset(options: z.infer<typeof applyOptionsSchema>) {
  const positionalPreset = options.positionalPreset?.trim()
  const flagPreset = options.preset?.trim()

  if (positionalPreset && flagPreset && positionalPreset !== flagPreset) {
    logger.error(
      `Received two different preset values. Use either the positional preset or ${highlighter.info(
        "--preset"
      )}, or pass the same value to both.`
    )
    logger.break()
    process.exit(1)
  }

  return flagPreset ?? positionalPreset
}

function validatePreset(preset: string) {
  if (isUrl(preset) || isPresetCode(preset)) {
    return
  }

  const knownPresetNames = Object.keys(DEFAULT_PRESETS)

  if (!knownPresetNames.includes(preset)) {
    logger.error(
      `Invalid preset: ${highlighter.info(
        preset
      )}.\nUse one of the available presets: ${knownPresetNames.join(", ")} \nor build your own at ${highlighter.info(`${SHADCN_URL}/create`)}`
    )
    logger.break()
    process.exit(1)
  }
}

async function resolveApplyTemplate(cwd: string) {
  const projectInfo = await getProjectInfo(cwd)
  return getTemplateForFramework(projectInfo?.framework.name)
}

export function resolveApplyInitUrl(
  preset: string,
  currentBase: "radix" | "base",
  options: { template?: string; rtl?: boolean } = {}
) {
  if (isUrl(preset)) {
    const url = new URL(preset)

    if (url.pathname === "/init" && preset.startsWith(SHADCN_URL)) {
      url.searchParams.set("track", "1")
    }

    url.searchParams.set("base", currentBase)
    url.searchParams.set("rtl", String(options.rtl ?? false))

    return url.toString()
  }

  if (isPresetCode(preset)) {
    const decoded = decodePreset(preset)
    if (!decoded) {
      logger.error(`Invalid preset code: ${highlighter.info(preset)}`)
      logger.break()
      process.exit(1)
    }

    return resolveInitUrl(
      {
        ...decoded,
        base: currentBase,
        rtl: options.rtl ?? false,
      },
      { preset, template: options.template }
    )
  }

  const resolvedPreset = DEFAULT_PRESETS[preset as keyof typeof DEFAULT_PRESETS]

  return resolveInitUrl(
    {
      ...resolvedPreset,
      base: currentBase,
      rtl: options.rtl ?? resolvedPreset.rtl,
    },
    { template: options.template }
  )
}

function quoteShellArg(value: string) {
  return /[^A-Za-z0-9_./:-]/.test(value) ? JSON.stringify(value) : value
}

function getInitCommand(preset?: string) {
  if (!preset) {
    return "shadcn init"
  }

  return `shadcn init --preset ${quoteShellArg(preset)}`
}
