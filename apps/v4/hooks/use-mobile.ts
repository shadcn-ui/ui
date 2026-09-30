import * as React from "react";

export function useIsMobile(mobileBreakpoint = 768): boolean {
  const [isMobile, setIsMobile] = React.useState(() => {
    return typeof window !== "undefined"
      ? window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`).matches
      : false;
  });

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`);

    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    setIsMobile(mql.matches);

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [mobileBreakpoint]);

  return isMobile;
}