import * as React from "react"

const MOBILE_BREAKPOINT = "48rem"

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(width < ${MOBILE_BREAKPOINT})`)
    const onChange = () => setIsMobile(mql.matches)

    mql.addEventListener("change", onChange)
    setIsMobile(mql.matches)

    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
