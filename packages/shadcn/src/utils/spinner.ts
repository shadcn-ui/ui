import ora, { type Options } from "ora"

export function spinner(
  text: Options["text"],
  options?: {
    silent?: boolean
  }
) {
  return ora({
    text,
    isSilent: options?.silent,
  })
}
