import * as React from "react"

export function useIsMobile(mobileBreakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // rem in media queries resolves against the browser's default font size,
    // matching Tailwind's rem-based breakpoints (md = 48rem).
    const mql = window.matchMedia(`(width < ${mobileBreakpoint / 16}rem)`)
    const onChange = () => {
      setIsMobile(mql.matches)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(mql.matches)
    return () => mql.removeEventListener("change", onChange)
  }, [mobileBreakpoint])

  return !!isMobile
}
