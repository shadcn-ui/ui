export const BUTTON_FEEDBACK_VALUES = [
  "press",
  "ripple",
  "soft-ripple",
] as const

export type ButtonFeedbackValue = (typeof BUTTON_FEEDBACK_VALUES)[number]

export function resolveButtonFeedback(config: {
  buttonFeedback?: unknown
}): ButtonFeedbackValue | undefined {
  return BUTTON_FEEDBACK_VALUES.includes(
    config.buttonFeedback as ButtonFeedbackValue
  )
    ? (config.buttonFeedback as ButtonFeedbackValue)
    : undefined
}
