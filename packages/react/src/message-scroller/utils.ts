import * as React from "react"

function useLatest<T>(value: T) {
  const ref = React.useRef(value)

  ref.current = value

  return ref
}

export { useLatest }
