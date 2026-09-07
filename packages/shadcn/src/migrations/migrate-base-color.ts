import { promises as fs } from "fs"
import path from "path"
import { getRegistryBaseColor } from "@/src/registry/api"
import { BASE_COLORS } from "@/src/registry/constants"
import {
  registryBaseColorSchema,
  registryItemCssVarsSchema,
} from "@/src/schema"
import { Config } from "@/src/utils/get-config"
import { getProjectInfo, TailwindVersion } from "@/src/utils/get-project-info"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { spinner } from "@/src/utils/spinner"
import {
  isLocalHSLValue,
  updateCssVars,
} from "@/src/utils/updaters/update-css-vars"
import fsExtra from "fs-extra"
import postcss from "postcss"
import prompts from "prompts"
import { z } from "zod"

type CssVars = z.infer<typeof registryItemCssVarsSchema>

export interface SkippedToken {
  token: string
  reason: string
}

export async function migrateBaseColor(
  config: Config,
  options: {
    from?: string
    to?: string
    yes?: boolean
  } = {}
) {
  if (!config.resolvedPaths.tailwindCss) {
    throw new Error(
      "We could not find a valid CSS file in your `components.json` file. Please ensure you have a valid `tailwind.css` path in your `components.json` file."
    )
  }

  if (!config.tailwind.cssVariables) {
    throw new Error(
      "The `base-color` migration requires CSS variables. Your `components.json` has `cssVariables: false`, which uses inline Tailwind color classes instead of theme variables."
    )
  }

  const baseColorChoices = BASE_COLORS.map((baseColor) => ({
    title: baseColor.label,
    value: baseColor.name,
  }))
  const baseColorNames: string[] = BASE_COLORS.map(
    (baseColor) => baseColor.name
  )

  // Only the target is validated. The source can be a legacy base color
  // (e.g. slate) an existing project still uses.
  if (options.to && !baseColorNames.includes(options.to)) {
    throw new Error(
      `Unknown base color: ${options.to}. Available base colors: ${baseColorNames.join(
        ", "
      )}.`
    )
  }

  // Default the source to the project's current base color.
  let sourceBaseColor = options.from || config.tailwind.baseColor
  let targetBaseColor = options.to

  if (!sourceBaseColor || !targetBaseColor) {
    const currentBaseColorIndex = baseColorChoices.findIndex(
      (choice) => choice.value === config.tailwind.baseColor
    )
    const migrateOptions = await prompts([
      {
        type: sourceBaseColor ? null : "select",
        name: "sourceBaseColor",
        message: `Which base color would you like to ${highlighter.info(
          "migrate from"
        )}?`,
        choices: baseColorChoices,
        initial: currentBaseColorIndex === -1 ? 0 : currentBaseColorIndex,
      },
      {
        type: targetBaseColor ? null : "select",
        name: "targetBaseColor",
        message: `Which base color would you like to ${highlighter.info(
          "migrate to"
        )}?`,
        choices: baseColorChoices,
      },
    ])

    sourceBaseColor = sourceBaseColor || migrateOptions.sourceBaseColor
    targetBaseColor = targetBaseColor || migrateOptions.targetBaseColor
  }

  if (!sourceBaseColor || !targetBaseColor) {
    logger.info("Migration cancelled.")
    process.exit(0)
  }

  if (sourceBaseColor === targetBaseColor) {
    throw new Error(
      "You cannot migrate to the same base color. Please choose a different base color."
    )
  }

  if (!options.yes) {
    const relativePath = `./${path.relative(
      config.resolvedPaths.cwd,
      config.resolvedPaths.tailwindCss
    )}`
    const { confirm } = await prompts({
      type: "confirm",
      name: "confirm",
      initial: true,
      message: `We will migrate ${highlighter.info(
        relativePath
      )} from ${highlighter.info(sourceBaseColor)} to ${highlighter.info(
        targetBaseColor
      )}. Continue?`,
    })

    if (!confirm) {
      logger.info("Migration cancelled.")
      process.exit(0)
    }
  }

  const sourceColor = await getRegistryBaseColor(sourceBaseColor)
  const targetColor = await getRegistryBaseColor(targetBaseColor)

  if (!sourceColor) {
    throw new Error(`Unknown base color: ${sourceBaseColor}.`)
  }

  if (!targetColor) {
    throw new Error("Something went wrong fetching the base colors.")
  }

  const projectInfo = await getProjectInfo(config.resolvedPaths.cwd)
  const tailwindVersion = projectInfo?.tailwindVersion ?? "v4"

  const sourceVars = getBaseColorCssVars(sourceColor, tailwindVersion)
  const targetVars = getBaseColorCssVars(targetColor, tailwindVersion)

  const migrationSpinner = spinner(`Migrating base color...`)?.start()

  const raw = await fs.readFile(config.resolvedPaths.tailwindCss, "utf-8")
  const { cssVars, skipped } = getBaseColorMigration(
    raw,
    sourceVars,
    targetVars,
    tailwindVersion
  )

  if (
    Object.keys(cssVars.light).length > 0 ||
    Object.keys(cssVars.dark).length > 0
  ) {
    await updateCssVars(cssVars, config, {
      overwriteCssVars: true,
      tailwindVersion,
      silent: true,
    })
  }

  migrationSpinner.succeed("Migration complete.")

  // Keep components.json in sync so future `shadcn add` installs use the new
  // base color.
  await updateConfigBaseColor(config, targetBaseColor)

  const skippedTokens = new Map<string, string>()
  for (const { token, reason } of skipped) {
    if (!skippedTokens.has(token)) {
      skippedTokens.set(token, reason)
    }
  }

  if (skippedTokens.size > 0) {
    logger.break()
    logger.warn(
      `Skipped ${skippedTokens.size} token${
        skippedTokens.size === 1 ? "" : "s"
      }. These were left untouched:`
    )
    for (const [token, reason] of Array.from(skippedTokens)) {
      logger.warn(`  - ${token}: ${reason}`)
    }
  }
}

export function getBaseColorMigration(
  css: string,
  sourceVars: CssVars,
  targetVars: CssVars,
  tailwindVersion: TailwindVersion
): {
  cssVars: { light: Record<string, string>; dark: Record<string, string> }
  skipped: SkippedToken[]
} {
  const currentVars = readCssVars(css)

  const light: Record<string, string> = {}
  const dark: Record<string, string> = {}
  const skipped: SkippedToken[] = []

  const modes = [
    { mode: "light", selector: ":root", target: light },
    { mode: "dark", selector: ".dark", target: dark },
  ] as const

  for (const { mode, selector, target } of modes) {
    for (const [name, sourceValue] of Object.entries(sourceVars[mode] ?? {})) {
      const targetValue = targetVars[mode]?.[name]

      // Skip tokens that are identical in both base colors (e.g. radius).
      if (
        targetValue === undefined ||
        normalizeValue(sourceValue) === normalizeValue(targetValue)
      ) {
        continue
      }

      const prop = `--${name.replace(/^--/, "")}`
      const currentValue = currentVars[selector][prop]

      if (currentValue === undefined) {
        skipped.push({ token: prop, reason: "not found in your CSS" })
        continue
      }

      // Only replace tokens that still hold the source base color value.
      if (
        normalizeValue(currentValue) ===
        normalizeValue(getWrittenValue(sourceValue, tailwindVersion))
      ) {
        target[name] = targetValue
      } else {
        skipped.push({
          token: prop,
          reason: "does not match the source base color",
        })
      }
    }
  }

  return { cssVars: { light, dark }, skipped }
}

function getBaseColorCssVars(
  baseColor: z.infer<typeof registryBaseColorSchema>,
  tailwindVersion: TailwindVersion
): CssVars {
  if (tailwindVersion === "v4" && baseColor.cssVarsV4) {
    return baseColor.cssVarsV4
  }
  return baseColor.cssVars
}

function readCssVars(css: string) {
  const vars: Record<string, Record<string, string>> = {
    ":root": {},
    ".dark": {},
  }

  postcss.parse(css).walkRules((rule) => {
    if (rule.selector !== ":root" && rule.selector !== ".dark") {
      return
    }

    rule.walkDecls((declaration) => {
      if (declaration.prop.startsWith("--")) {
        vars[rule.selector][declaration.prop] = declaration.value
      }
    })
  })

  return vars
}

function getWrittenValue(value: string, tailwindVersion: TailwindVersion) {
  // Local HSL channels are wrapped in hsl() when written to CSS in v4.
  if (tailwindVersion === "v4" && isLocalHSLValue(value)) {
    return `hsl(${value})`
  }
  return value
}

function normalizeValue(value: string) {
  return value.trim().replace(/\s+/g, " ")
}

async function updateConfigBaseColor(config: Config, baseColor: string) {
  const targetPath = path.resolve(config.resolvedPaths.cwd, "components.json")

  if (!fsExtra.existsSync(targetPath)) {
    return
  }

  const rawConfig = await fsExtra.readJson(targetPath)

  if (rawConfig.tailwind?.baseColor === baseColor) {
    return
  }

  rawConfig.tailwind = { ...rawConfig.tailwind, baseColor }
  await fsExtra.writeJson(targetPath, rawConfig, { spaces: 2 })
  logger.info(
    `Updated ${highlighter.info(
      "baseColor"
    )} in components.json to ${highlighter.info(baseColor)}.`
  )
}
