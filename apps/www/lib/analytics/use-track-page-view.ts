"use-client"

import { useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

import { useTrackActivity } from "./track-activity"
import { UiShadcnSiteActivityAction } from "./types"

// This includes the pathname and the query
// Any time that changes, we want to update the key so we can track a PageView event
// We need the observers because `useSearchParams` does not update for shallow replacements
function usePageKey(): string {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [locationKey, setLocationKey] = useState<string>()

  useEffect(() => {
    const observer = new MutationObserver(function changed() {
      // Allow mutations to settle
      setTimeout(() => {
        setLocationKey(window.location.pathname + window.location.search)
      })
    })

    observer.observe(window.document, {
      childList: true,
      subtree: true,
    })

    const listener = (): void => {
      setLocationKey(window.location.pathname + window.location.search)
    }

    window.addEventListener("popstate", listener)

    return (): void => {
      window.removeEventListener("popstate", listener)
      observer.disconnect()
    }
  }, [])

  return useMemo(() => {
    if (typeof window === "undefined") {
      return ""
    }

    return window.location.pathname + window.location.search
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationKey, pathname, searchParams])
}

export function useTrackPageView(): void {
  const { track } = useTrackActivity()
  const lastPage = useRef<string | undefined>(undefined)
  const page = usePageKey()
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === "undefined" || !page || lastPage.current === page) {
      return
    }

    lastPage.current = page
    void track(UiShadcnSiteActivityAction.PageView, {
      page_path: pathname,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])
}
