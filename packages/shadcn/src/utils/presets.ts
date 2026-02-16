import { getRegistryItems } from "@/src/registry/api"
import { buildUrlAndHeadersForRegistryItem } from "@/src/registry/builder"
import { configWithDefaults } from "@/src/registry/config"
import { REGISTRY_URL } from "@/src/registry/constants"
import { type registryConfigSchema } from "@/src/registry/schema"
import { type Preset } from "@/src/schema"
import { createConfig } from "@/src/utils/get-config"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { ensureRegistriesInConfig } from "@/src/utils/registries"
import open from "open"
import prompts from "prompts"
import { type z } from "zod"

const SHADCN_URL = REGISTRY_URL.replace(/\/r\/?$/, "")

export const DEFAULT_PRESETS = {
  "radix-nova": {
    name: "radix-nova",
    title: "Radix",
    description: "Nova / Lucide / Geist",
    base: "radix",
    style: "nova",
    baseColor: "neutral",
    theme: "neutral",
    iconLibrary: "lucide",
    font: "geist",
    menuAccent: "subtle",
    menuColor: "default",
    radius: "default",
    rtl: false,
  },
  "base-nova": {
    name: "base-nova",
    title: "Base",
    description: "Nova / Lucide / Geist",
    base: "base",
    style: "nova",
    baseColor: "neutral",
    theme: "neutral",
    iconLibrary: "lucide",
    font: "geist",
    menuAccent: "subtle",
    menuColor: "default",
    radius: "default",
    rtl: false,
  },
} satisfies Record<string, Preset>

export function resolveCreateUrl(
  searchParams?: Partial<{
    command: "create" | "init"
    template: string
    rtl: boolean
    base: string
  }>
) {
  const url = new URL(`${SHADCN_URL}/create`)
  const { rtl, ...params } = searchParams ?? {}

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  }

  // Do not set rtl if it's false.
  if (rtl) {
    url.searchParams.set("rtl", "true")
  }

  return url.toString()
}

export function resolveInitUrl(
  preset: Omit<Preset, "name" | "title" | "description">
) {
  const params = new URLSearchParams({
    base: preset.base,
    style: preset.style,
    baseColor: preset.baseColor,
    theme: preset.theme,
    iconLibrary: preset.iconLibrary,
    font: preset.font,
    rtl: String(preset.rtl ?? false),
    menuAccent: preset.menuAccent,
    menuColor: preset.menuColor,
    radius: preset.radius,
  })

  return `${SHADCN_URL}/init?${params.toString()}`
}

export async function promptForPreset(options: {
  rtl: boolean
  template?: string
}) {
  const presets = Object.values(DEFAULT_PRESETS)

  const { selectedPreset } = await prompts({
    type: "select",
    name: "selectedPreset",
    message: `Which ${highlighter.info("preset")} would you like to use?`,
    choices: [
      ...presets.map((preset) => ({
        title: preset.title,
        description: preset.description,
        value: preset.name,
      })),
      {
        title: "Custom",
        description: "Build your own on https://ui.shadcn.com",
        value: "custom",
      },
    ],
  })

  if (!selectedPreset) {
    process.exit(0)
  }

  if (selectedPreset === "custom") {
    const createUrl = resolveCreateUrl({
      command: "init",
      rtl: options.rtl,
      ...(options.template && { template: options.template }),
    })
    logger.break()
    logger.log(`  Build your custom preset on ${highlighter.info(createUrl)}`)
    logger.log(
      `  Then ${highlighter.info(
        "copy and run the command"
      )} from ui.shadcn.com.`
    )
    logger.break()

    const { proceed } = await prompts({
      type: "confirm",
      name: "proceed",
      message: "Open in browser?",
      initial: true,
    })

    if (proceed) {
      await open(createUrl)
    }

    process.exit(0)
  }

  const preset = presets.find((p) => p.name === selectedPreset)
  if (!preset) {
    process.exit(0)
  }

  return resolveInitUrl({ ...preset, rtl: options.rtl })
}

export async function resolveRegistryBaseConfig(
  initUrl: string,
  cwd: string,
  options?: {
    registries?: z.infer<typeof registryConfigSchema>
  }
) {
  // Use a shadow config to fetch the registry:base item.
  let shadowConfig = configWithDefaults(
    createConfig({
      resolvedPaths: {
        cwd,
      },
      ...(options?.registries && { registries: options.registries }),
    })
  )

  // Ensure all registries used in the init URL are configured.
  const { config: updatedConfig } = await ensureRegistriesInConfig(
    [initUrl],
    shadowConfig,
    {
      silent: true,
      writeFile: false,
    }
  )
  shadowConfig = updatedConfig

  // This forces a shadowConfig validation early in the process.
  buildUrlAndHeadersForRegistryItem(initUrl, shadowConfig)

  const [item] = await getRegistryItems([initUrl], {
    config: shadowConfig,
  })

  const registryBaseConfig =
    item?.type === "registry:base" && item.config ? item.config : undefined

  return {
    registryBaseConfig,
    installStyleIndex: item?.extends !== "none",
  }
}
