/** Sample text used when `text()`/`user()` is called without content. */
export const DEFAULT_TEXT = "Summarize the uploaded receipt."

/** Sample reasoning used when `reasoning()` is called without content. */
export const DEFAULT_REASONING =
  "I need to inspect the available context before answering."

/** Default delay between streamed text/reasoning deltas. */
export const DEFAULT_STREAM_DELAY_MS = 50

/** Compile-time exhaustiveness guard for discriminated unions we own. */
export function assertNever(value: never): never {
  throw new Error(`Unhandled variant: ${JSON.stringify(value)}`)
}

/** Resolves after `delayMs`, or immediately when `abortSignal` aborts. */
export function wait(delayMs: number, abortSignal?: AbortSignal) {
  if (abortSignal?.aborted) {
    return Promise.resolve()
  }

  return new Promise<void>((resolve) => {
    const timeoutId = setTimeout(finish, delayMs)

    function finish() {
      clearTimeout(timeoutId)
      abortSignal?.removeEventListener("abort", finish)
      resolve()
    }

    abortSignal?.addEventListener("abort", finish, { once: true })
  })
}

/** Returns a detached copy of a scripted value. */
export function cloneValue<T>(value: T): T {
  return structuredClone(value)
}

/** Splits text into word-plus-whitespace deltas for streaming. */
export function splitTextDeltas(text: string) {
  return text.match(/\S+\s*/g) ?? [text]
}

/** Extracts the data part name from a `data-<name>` type string. */
export function getDataPartName(type: `data-${string}`) {
  return type.slice("data-".length)
}
