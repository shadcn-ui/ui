import { useState } from "react"

export function useIsMac() {
  const [isMac] = useState(() => {
    if (typeof window === "undefined") {
      return false
    }
    // Use userAgentData if available, otherwise fallback to userAgent
    const platform =
      (navigator.userAgentData && navigator.userAgentData.platform) ||
      navigator.userAgent || "";
    return platform.toUpperCase().includes("MAC");
  })

  return isMac
}
