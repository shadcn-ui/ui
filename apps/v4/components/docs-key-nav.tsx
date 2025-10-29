"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface DocsKeyNavProps {
  prevHref?: string
  nextHref?: string
}

export function DocsKeyNav({ prevHref, nextHref }: DocsKeyNavProps) {
  const router = useRouter()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" && prevHref) {
        router.push(prevHref)
      } else if (e.key === "ArrowRight" && nextHref) {
        router.push(nextHref)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [router, prevHref, nextHref])

  return null
}


