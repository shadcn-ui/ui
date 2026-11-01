import * as React from "react"

function useLatest<T>(value: T) {
  const ref = React.useRef(value)

  ref.current = value

  return ref
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (typeof HTMLElement === "undefined" || !(target instanceof HTMLElement)) {
    return false
  }

  if (target.isContentEditable) {
    return true
  }

  const tagName = target.tagName
  if (tagName === "TEXTAREA" || tagName === "SELECT") {
    return true
  }

  if (tagName === "INPUT") {
    const input = target as HTMLInputElement
    const nonTextTypes = new Set([
      "button",
      "checkbox",
      "color",
      "file",
      "image",
      "radio",
      "reset",
      "submit",
    ])
    return !nonTextTypes.has(input.type)
  }

  return Boolean(target.closest?.('[role="textbox"]'))
}

export { useLatest, isEditableTarget }
