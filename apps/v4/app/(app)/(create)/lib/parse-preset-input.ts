import { isPresetCode } from "shadcn/preset"

const PRESET_FLAG_PATTERN = /^--preset\b\s+(.+)$/i

export function parsePresetInput(value: string) {
  const input = value.trim()

  if (!input) {
    return null
  }

  const preset = input.match(PRESET_FLAG_PATTERN)?.[1]?.trim() ?? input

  return isPresetCode(preset) ? preset : null
}
