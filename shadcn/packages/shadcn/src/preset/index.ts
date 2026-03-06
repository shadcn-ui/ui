// Browser-safe re-export of preset utilities.
// Use `shadcn/preset` for client-side code.
export {
  PRESET_BASES,
  PRESET_STYLES,
  PRESET_BASE_COLORS,
  PRESET_THEMES,
  PRESET_ICON_LIBRARIES,
  PRESET_FONTS,
  PRESET_RADII,
  PRESET_MENU_ACCENTS,
  PRESET_MENU_COLORS,
  DEFAULT_PRESET_CONFIG,
  toBase62,
  fromBase62,
  encodePreset,
  decodePreset,
  isPresetCode,
  isValidPreset,
  generateRandomConfig,
  generateRandomPreset,
  type PresetConfig,
} from "./preset"
