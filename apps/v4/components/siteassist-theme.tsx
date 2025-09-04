"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

export default function SiteAssistTheme() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    window.SiteAssist?.(
      "changeTheme",
      resolvedTheme === "dark" ? "dark" : "light"
    )
  }, [resolvedTheme])

  return null
}
