"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useThemeConfig } from "@/components/active-theme"

export function ChartIframe({
  src,
  height,
  title,
}: {
  src: string
  height: number
  title: string
}) {
  const [loaded, setLoaded] = React.useState(false)
  const { activeTheme } = useThemeConfig()

  // Append theme as query param so iframe can apply it.
  const iframeSrc = `${src}?theme=${activeTheme}`

  return (
    <iframe
      src={iframeSrc}
      className={cn(
        "w-full border-none transition-opacity duration-300",
        loaded ? "opacity-100" : "opacity-0"
      )}
      height={height}
      loading="lazy"
      title={title}
      onLoad={() => setLoaded(true)}
    />
  )
}
