import * as React from "react"

import { useColorPickerContext } from "./context"

// Matches CodeBlockCopyButton in the registry.
const COPIED_DURATION = 2000

function useColorPickerCopy() {
  const { disabled, value } = useColorPickerContext("ColorPicker.Copy")
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) {
      return
    }

    const timeout = setTimeout(() => setCopied(false), COPIED_DURATION)

    return () => clearTimeout(timeout)
  }, [copied])

  const buttonProps: React.ComponentPropsWithRef<"button"> = {
    "aria-label": copied ? "Copied" : "Copy color",
    disabled,
    onClick() {
      // The Clipboard API is missing outside secure contexts.
      navigator.clipboard
        ?.writeText(value)
        .then(() => setCopied(true))
        .catch(() => {})
    },
    type: "button",
  }

  return { buttonProps, copied, disabled }
}

export { useColorPickerCopy }
