import * as React from "react"

import { parseColor } from "./color"
import { useColorPickerContext } from "./context"
import { preserveHue } from "./utils"

// Text is kept as a draft while typing and committed on Enter or blur. Text
// that does not parse is dropped, so onValueChange never sees it.
function useColorPickerInput() {
  const { color, disabled, invalid, setColor, value } =
    useColorPickerContext("ColorPicker.Input")
  const [draft, setDraft] = React.useState<string | null>(null)

  const commit = (text: string) => {
    const parsed = parseColor(text)

    if (parsed) {
      setColor(preserveHue(color, parsed))
    }

    setDraft(null)
  }

  const inputProps: React.ComponentPropsWithRef<"input"> = {
    "aria-invalid": invalid || undefined,
    autoCapitalize: "off",
    autoComplete: "off",
    autoCorrect: "off",
    // Color values read left to right. In an RTL page "#3b82f6" would
    // otherwise display as "3b82f6#".
    dir: "ltr",
    disabled,
    onBlur() {
      if (draft !== null) {
        commit(draft)
      }
    },
    onChange(event) {
      setDraft(event.currentTarget.value)
    },
    onKeyDown(event) {
      if (draft === null) {
        return
      }

      if (event.key === "Enter") {
        // Commit instead of submitting the form with a half-typed value.
        event.preventDefault()
        commit(draft)
      } else if (event.key === "Escape") {
        event.preventDefault()
        setDraft(null)
      }
    },
    spellCheck: false,
    type: "text",
    value: draft ?? value,
  }

  return { inputProps }
}

export { useColorPickerInput }
