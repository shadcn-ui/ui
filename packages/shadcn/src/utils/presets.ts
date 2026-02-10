import { getPreset, getPresets } from "@/src/registry/api"
import { REGISTRY_URL } from "@/src/registry/constants"
import { isUrl } from "@/src/registry/utils"
import { Preset } from "@/src/schema"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import open from "open"
import prompts from "prompts"

const SHADCN_URL = REGISTRY_URL.replace(/\/r\/?$/, "")

export function getShadcnCreateUrl(searchParams?: Record<string, string>) {
  const url = new URL(`${SHADCN_URL}/create`)
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value)
    }
  }
  return url.toString()
}

export function getShadcnInitUrl() {
  return `${SHADCN_URL}/init`
}

export function buildInitUrl(preset: Preset, rtl: boolean) {
  const params = new URLSearchParams({
    base: preset.base,
    style: preset.style,
    baseColor: preset.baseColor,
    theme: preset.theme,
    iconLibrary: preset.iconLibrary,
    font: preset.font,
    rtl: String(rtl || preset.rtl),
    menuAccent: preset.menuAccent,
    menuColor: preset.menuColor,
    radius: preset.radius,
  })

  return `${getShadcnInitUrl()}?${params.toString()}`
}

export async function handlePresetOption(
  presetArg: string | boolean,
  rtl: boolean
) {
  // If --preset is used without a name, show interactive list.
  if (presetArg === true) {
    const presets = await getPresets()

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
      return null
    }

    if (selectedPreset === "custom") {
      const url = getShadcnCreateUrl(rtl ? { rtl: "true" } : undefined)
      logger.info(`\nOpening ${highlighter.info(url)} in your browser...\n`)
      await open(url)
      return null
    }

    return presets.find((p) => p.name === selectedPreset) ?? null
  }

  // If --preset NAME or URL is provided.
  if (typeof presetArg === "string") {
    // Check if it's a URL.
    if (isUrl(presetArg)) {
      return { _isUrl: true, url: presetArg } as const
    }

    // Otherwise, fetch that preset by name.
    const preset = await getPreset(presetArg)

    if (!preset) {
      const presets = await getPresets()
      const presetNames = presets.map((p) => p.name).join(", ")
      logger.error(
        `Preset "${presetArg}" not found. Available presets: ${presetNames}`
      )
      process.exit(1)
    }

    return preset
  }

  return null
}
