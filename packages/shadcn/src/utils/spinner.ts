import { logger } from "@/src/utils/logger"
import ora, { type Options, type Ora } from "ora"

const activeSpinners = new Set<Ora>()

export function spinner(
  text: Options["text"],
  options?: {
    silent?: boolean
  }
) {
  const instance = ora({
    text,
    isSilent: options?.silent,
  })
  activeSpinners.add(instance)

  return instance
}

// Prints a line above any active spinner without stopping it. Clearing and
// re-rendering only applies on a TTY, where ora actually animates.
export function logAboveSpinner(message: string) {
  const spinning = process.stderr.isTTY
    ? Array.from(activeSpinners).filter((instance) => instance.isSpinning)
    : []

  for (const instance of spinning) {
    instance.clear()
  }
  logger.log(message)
  for (const instance of spinning) {
    instance.render()
  }
}
