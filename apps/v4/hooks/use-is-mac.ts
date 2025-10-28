import { useState } from "react"

export function useIsMac() {
  const [isMac] = useState(() => {
    if (typeof window === "undefined") {
      return false
    }
    return navigator.platform.toUpperCase().includes("MAC")
  })

  return isMac
}
