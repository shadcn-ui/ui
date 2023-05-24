import React from "react"

export default function useCheckbox(options: CheckboxRHFOptions) {
  const { ref, onBlur, onChange } = options

  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const interceptorRef = React.useRef<HTMLButtonElement | null>(null)

  React.useEffect(() => {
    if (!ref) return

    findInput(interceptorRef, inputRef)
    const inputEl = inputRef.current

    if (inputEl) {
      inputEl.addEventListener("blur", onBlur as ChangeHandler)
      inputEl.addEventListener("change", onChange as ChangeHandler)
    }

    if (ref instanceof Function) {
      ref(inputEl)
    } else {
      ref.current = inputEl
    }

    return () => {
      if (inputEl) {
        inputEl.removeEventListener("blur", onBlur as ChangeHandler)
        inputEl.removeEventListener("change", onChange as ChangeHandler)
      }
    }
  }, [ref, onBlur, onChange])

  const handleClick = React.useCallback(() => {
    inputRef.current?.click()
  }, [])

  return {
    spyRef: interceptorRef,
    handleClick,
  }
}

function findInput(
  siblingRef: React.MutableRefObject<HTMLButtonElement | null>,
  inputRef: React.MutableRefObject<HTMLInputElement | null>
) {
  if (!siblingRef.current) return

  const parent = siblingRef.current.parentNode

  let sibling = parent ? parent.firstChild : siblingRef.current

  while (sibling) {
    sibling = sibling.nextSibling
    if (sibling?.nodeName === "INPUT") {
      inputRef.current = sibling as HTMLInputElement
      return
    }
  }
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
