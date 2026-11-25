import * as React from "react"

import { parseColor } from "./color"
import { useColorPickerContext } from "./context"
import type { EyeDropperConstructor } from "./types"
import { preserveHue } from "./utils"

function getEyeDropper() {
  if (typeof window === "undefined") {
    return undefined
  }

  return (window as Window & { EyeDropper?: EyeDropperConstructor }).EyeDropper
}

function subscribe() {
  return () => {}
}

// Chromium browsers only. The server snapshot is false, so the button
// appears after hydration instead of causing a mismatch.
function useEyeDropperSupported() {
  return React.useSyncExternalStore(
    subscribe,
    () => getEyeDropper() !== undefined,
    () => false
  )
}

function useColorPickerEyeDropper() {
  const context = useColorPickerContext("ColorPicker.EyeDropper")
  const supported = useEyeDropperSupported()
  const [picking, setPicking] = React.useState(false)
  const controllerRef = React.useRef<AbortController | null>(null)
  // The pick resolves after an await, so read the latest color and setter.
  const contextRef = React.useRef(context)

  React.useLayoutEffect(() => {
    contextRef.current = context
  })

  React.useEffect(() => {
    return () => controllerRef.current?.abort()
  }, [])

  const pick = async () => {
    const EyeDropper = getEyeDropper()

    if (!EyeDropper || context.disabled || controllerRef.current) {
      return
    }

    const controller = new AbortController()

    controllerRef.current = controller
    setPicking(true)

    try {
      const { sRGBHex } = await new EyeDropper().open({
        signal: controller.signal,
      })
      const parsed = parseColor(sRGBHex)

      if (parsed && !controller.signal.aborted) {
        const { color, setColor } = contextRef.current

        // The screen has no alpha, so keep the current one.
        setColor({ ...preserveHue(color, parsed), a: color.a })
      }
    } catch {
      // Escape or an aborted pick leaves the color unchanged.
    } finally {
      controllerRef.current = null
      setPicking(false)
    }
  }

  const buttonProps: React.ComponentPropsWithRef<"button"> = {
    "aria-label": "Pick a color from the screen",
    disabled: context.disabled,
    onClick() {
      void pick()
    },
    type: "button",
  }

  return { buttonProps, disabled: context.disabled, picking, supported }
}

export { useColorPickerEyeDropper }
