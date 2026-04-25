import _prompts, { type PromptObject } from "prompts"

/**
 * Wraps `prompts` to strip C0 control characters (0x00-0x1F) and DEL (0x7F)
 * from text input values.
 *
 * The `prompts` library operates stdin in raw mode but doesn't filter
 * unrecognized control sequences (e.g. Ctrl+U, Ctrl+W). Raw bytes from
 * these keypresses leak into the input value and corrupt filenames, paths,
 * and identifiers downstream.
 *
 * See: https://github.com/terkelg/prompts/issues/394
 */
function stripControlChars(value: unknown) {
  return typeof value === "string"
    ? value.replace(/[\x00-\x1f\x7f]/g, "")
    : value
}

export default async function prompts(
  questions: PromptObject | PromptObject[],
  options?: Parameters<typeof _prompts>[1]
) {
  const qs = (Array.isArray(questions) ? questions : [questions]).map((q) => {
    const orig = q.format
    return {
      ...q,
      format: orig
        ? (val: any, values: any, prompt: any) =>
            orig(stripControlChars(val), values, prompt)
        : (val: any) => stripControlChars(val),
    }
  })
  return _prompts(qs, options)
}
