export const CUSTOMIZER_STATE_COOKIE_NAME = "customizer_state"
export const CUSTOMIZER_STATE_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

export const CUSTOMIZER_POSITION_COOKIE_NAME = "customizer_position"

export const CUSTOMIZER_POSITIONS = ["left", "right"] as const

export type CustomizerPosition = (typeof CUSTOMIZER_POSITIONS)[number]
export type CustomizerDesktopPickerSide = "left" | "right"

export function parseCustomizerPosition(
  value: string | undefined
): CustomizerPosition {
  return value === "right" ? "right" : "left"
}

export function getCustomizerDesktopPickerSide(
  position: CustomizerPosition
): CustomizerDesktopPickerSide {
  return position === "right" ? "left" : "right"
}
