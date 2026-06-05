export const PREVIEW_WHEEL_MESSAGE = "shadcn:preview-wheel"
export const WHEEL_FORWARD_PARAM = "forwardWheel"

export type PreviewWheelMessage = {
  type: typeof PREVIEW_WHEEL_MESSAGE
  deltaMode: number
  deltaX: number
  deltaY: number
}

export function getWheelForwardingSrc(src: string) {
  const separator = src.includes("?") ? "&" : "?"

  return `${src}${separator}${WHEEL_FORWARD_PARAM}=1`
}

export function isPreviewWheelMessage(
  value: unknown
): value is PreviewWheelMessage {
  if (!value || typeof value !== "object") {
    return false
  }

  const message = value as Record<string, unknown>

  return (
    message.type === PREVIEW_WHEEL_MESSAGE &&
    typeof message.deltaMode === "number" &&
    typeof message.deltaX === "number" &&
    typeof message.deltaY === "number"
  )
}
