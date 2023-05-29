import React, { useRef } from "react"

export default function useCheckbox(options: CheckboxRHFOptions) {
  const { ref, onBlur, onChange } = options
  const spyRef = useRef<HTMLButtonElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    if (!ref) return

    if (!inputRef.current) {
      inputRef.current = findInput(spyRef)

      setTimeout(() => {
        const el = inputRef.current
        el?.removeAttribute("value")

        if (ref instanceof Function) {
          ref(el)
        } else {
          ref.current = el
        }
      }, 0)
    }

    const inputEl = inputRef.current
    const btnElement = spyRef.current
    setTimeout(() => btnElement?.removeAttribute("value"), 0)

    function handleButtonClick() {
      inputEl?.click()
    }

    function handleButtonBlur() {
      inputEl?.focus()
    }

    function handleInputFocus() {
      inputEl?.blur()
    }

    function handleInputChange(e: Event) {
      setTimeout(() => {
        const el = inputRef.current
        el?.removeAttribute("value")
        if (!ref) return

        if (ref instanceof Function) {
          ref(el)
        } else {
          ref.current = el
        }

        ;(onChange as ChangeHandler)(e)
      }, 0)
    }

    function handleInputBlur(e: FocusEvent) {
      setTimeout(() => {
        const el = inputRef.current
        el?.removeAttribute("value")
        if (!ref) return

        if (ref instanceof Function) {
          ref(el)
        } else {
          ref.current = el
        }

        ;(onBlur as ChangeHandler)(e)
      }, 0)
    }

    if (inputEl && btnElement) {
      btnElement.addEventListener("click", handleButtonClick)
      btnElement.addEventListener("blur", handleButtonBlur)
      inputEl.addEventListener("focus", handleInputFocus)
      inputEl.addEventListener("blur", handleInputBlur)
      inputEl.addEventListener("change", handleInputChange)
    }

    return () => {
      if (inputEl) {
        inputEl.addEventListener("focus", handleInputFocus)
        inputEl.removeEventListener("blur", handleInputBlur)
        inputEl.removeEventListener("change", handleInputChange)
      }

      if (btnElement) {
        btnElement.addEventListener("click", handleButtonClick)
        btnElement.addEventListener("blur", handleButtonBlur)
      }
    }
  }, [ref, spyRef, onBlur, onChange])

  return spyRef
}

function findInput(
  siblingRef: React.MutableRefObject<HTMLButtonElement | null>
) {
  if (!siblingRef.current) return null

  const parent = siblingRef.current.parentNode

  let sibling = parent ? parent.firstChild : siblingRef.current

  while (sibling) {
    sibling = sibling.nextSibling
    if (sibling?.nodeName === "INPUT") {
      const el = sibling as HTMLInputElement
      setTimeout(() => el.removeAttribute("value"), 0)
      return el
    }
  }

  return null
}

// This matches the react-hook-form (v7) ChangeHandler type
// type ChangeHandler is compatible with the React.EventHandler type
type ChangeHandler = (event: {
  target: any
  type?: any
}) => Promise<void | boolean>

export type CheckboxRHFOptions = {
  ref?: React.ForwardedRef<HTMLInputElement | null>
  onChange?: React.FormEventHandler<HTMLButtonElement> | undefined
  onBlur?: React.FocusEventHandler<HTMLButtonElement> | undefined
}
