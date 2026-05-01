import { existsSync } from "fs"
import path from "path"
import { printPresetInfo } from "@/src/commands/info"
import {
  decodePreset,
  V1_CHART_COLOR_MAP,
  type PresetConfig,
} from "@/src/preset/preset"
import { resolveProjectPreset } from "@/src/preset/resolve"
import { SHADCN_URL } from "@/src/registry/constants"
import { getConfig } from "@/src/utils/get-config"
import {
  formatMonorepoMessage,
  getMonorepoTargets,
  isMonorepoRoot,
} from "@/src/utils/get-monorepo-info"
import { getProjectInfo } from "@/src/utils/get-project-info"
import { handleError } from "@/src/utils/handle-error"
import { logger } from "@/src/utils/logger"
import { Command } from "commander"
import open from "open"

type PresetValues = Omit<PresetConfig, "chartColor"> & {
  chartColor: NonNullable<PresetConfig["chartColor"]>
}

type PresetDecodeResult = {
  code: string
  version: string
  values: PresetValues
  derived: string[]
  url: string
}

export function getPresetUrl(code: string) {
  return `${SHADCN_URL}/create?preset=${code}`
}

export function decodePresetCode(code: string): PresetDecodeResult {
  const decoded = decodePreset(code)

  if (!decoded) {
    throw new Error(`Invalid preset code: ${code}`)
  }

  const derived: string[] = []
  const chartColor = (decoded.chartColor ??
    V1_CHART_COLOR_MAP[decoded.theme] ??
    decoded.theme) as PresetValues["chartColor"]

  if (!decoded.chartColor) {
    derived.push("chartColor")
  }

  return {
    code,
    version: code[0],
    values: {
      ...decoded,
      chartColor,
    },
    derived,
    url: getPresetUrl(code),
  }
}

export function printPresetDecode(result: PresetDecodeResult) {
  printPresetInfo(
    {
      code: result.code,
      fallbacks: result.derived,
      values: result.values,
    },
    {
      fallbackNote: "  * Compatibility value for older preset versions.",
    }
  )
}

export const decode = new Command()
  .name("decode")
  .description("decode a preset code")
  .argument("<code>", "the preset code to decode")
  .option("--json", "output as JSON.", false)
  .action((code, opts) => {
    try {
      const result = decodePresetCode(code)

      if (opts.json) {
        console.log(
          JSON.stringify(
            {
              code: result.code,
              version: result.version,
              values: result.values,
              derived: result.derived,
              url: result.url,
            },
            null,
            2
          )
        )
        return
      }

      printPresetDecode(result)
    } catch (error) {
      handlePresetError(error)
    }
  })

export const url = new Command()
  .name("url")
  .description("get the create URL for a preset code")
  .argument("<code>", "the preset code")
  .action((code) => {
    try {
      logger.log(decodePresetCode(code).url)
    } catch (error) {
      handlePresetError(error)
    }
  })

export const openCommand = new Command()
  .name("open")
  .description("open a preset code in the browser")
  .argument("<code>", "the preset code")
  .action(async (code) => {
    let presetUrl: string

    try {
      presetUrl = decodePresetCode(code).url
    } catch (error) {
      handlePresetError(error)
      return
    }

    logger.break()
    logger.log(`  Opening ${presetUrl} in your browser.`)
    logger.break()

    try {
      await open(presetUrl)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      handlePresetError(new Error(`Failed to open preset URL: ${message}`))
    }
  })

export const resolve = new Command()
  .name("resolve")
  .alias("info")
  .description("resolve a preset from your project")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("--json", "output as JSON.", false)
  .action(async (opts) => {
    try {
      const cwd = path.resolve(opts.cwd)

      if (
        !existsSync(path.resolve(cwd, "components.json")) &&
        (await isMonorepoRoot(cwd))
      ) {
        const targets = await getMonorepoTargets(cwd)
        if (targets.length > 0) {
          if (opts.json) {
            console.log(
              JSON.stringify(
                {
                  error: "monorepo_root",
                  message:
                    "You are running preset resolve from a monorepo root. Use the -c flag to specify a workspace.",
                  targets: targets.map((target) => target.name),
                },
                null,
                2
              )
            )
          } else {
            formatMonorepoMessage("preset resolve", targets)
          }
          process.exit(1)
        }
      }

      const config = await getConfig(cwd)
      if (!config) {
        if (opts.json) {
          console.log(JSON.stringify(null, null, 2))
          return
        }

        logger.log("No components.json found.")
        return
      }

      const projectInfo = await getProjectInfo(cwd)
      const preset = await resolveProjectPreset(config, projectInfo)

      if (opts.json) {
        console.log(JSON.stringify(preset.code ? preset : null, null, 2))
        return
      }

      printPresetInfo(preset)
    } catch (error) {
      handleError(error)
    }
  })

export const preset = new Command()
  .name("preset")
  .description("manage presets")
  .addCommand(decode)
  .addCommand(resolve)
  .addCommand(url)
  .addCommand(openCommand)
  .action(() => {
    preset.outputHelp()
  })

function handlePresetError(error: unknown) {
  if (error instanceof Error) {
    logger.error(error.message)
  }
  process.exit(1)
}
