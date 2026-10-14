import * as React from "react"

export function useIsMobile(mobileBreakpoint = "48rem") {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(width < ${mobileBreakpoint})`)
    const onChange = () => setIsMobile(mql.matches)

    mql.addEventListener("change", onChange)
    setIsMobile(mql.matches)

    return () => mql.removeEventListener("change", onChange)
  }, [mobileBreakpoint])

  return !!isMobile
}
