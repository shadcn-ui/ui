"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export function FrameworkPreviewIframe({
  src,
  title,
}: {
  src: string
  title: string
}) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const { resolvedTheme } = useTheme()

  React.useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe?.contentWindow) return

    iframe.contentWindow.postMessage(
      { type: "theme-change", theme: resolvedTheme },
      "*"
    )
  }, [resolvedTheme])

  const handleLoad = React.useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe?.contentWindow) return

    iframe.contentWindow.postMessage(
      { type: "theme-change", theme: resolvedTheme },
      "*"
    )
  }, [resolvedTheme])

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title={title}
      className="size-full"
      onLoad={handleLoad}
    />
  )
}
