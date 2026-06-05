"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  getWheelForwardingSrc,
  isPreviewWheelMessage,
} from "@/components/preview-wheel-message"

function normalizeWheelDelta(delta: number, deltaMode: number) {
  switch (deltaMode) {
    case WheelEvent.DOM_DELTA_LINE:
      return delta * 16
    case WheelEvent.DOM_DELTA_PAGE:
      return delta * window.innerHeight
    default:
      return delta
  }
}

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
  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  React.useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) {
        return
      }

      if (event.source !== iframeRef.current?.contentWindow) {
        return
      }

      if (!isPreviewWheelMessage(event.data)) {
        return
      }

      window.scrollBy({
        left: normalizeWheelDelta(event.data.deltaX, event.data.deltaMode),
        top: normalizeWheelDelta(event.data.deltaY, event.data.deltaMode),
      })
    }

    window.addEventListener("message", onMessage)

    return () => {
      window.removeEventListener("message", onMessage)
    }
  }, [])

  return (
    <iframe
      ref={iframeRef}
      src={getWheelForwardingSrc(src)}
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
