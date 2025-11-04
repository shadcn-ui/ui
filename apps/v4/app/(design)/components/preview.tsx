"use client"

import { useEffect, useLayoutEffect, useRef } from "react"

import { useDesignSystemSync } from "@/app/(design)/hooks/use-design-system-sync"
import type { DesignSystemStyle } from "@/app/(design)/lib/style"

const MESSAGE_TYPE = "design-system-params"

export function Preview({ style }: { style: DesignSystemStyle["name"] }) {
  const params = useDesignSystemSync()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const hasLoadedRef = useRef(false)

  // Don't include theme/iconLibrary in URL - they're synced via postMessage.
  // Only item is in the URL since it determines which component to load.
  const iframeSrc = params.item ? `/design/${style}/${params.item}` : null

  // Send params immediately when iframe loads - use layoutEffect to fire before paint.
  useLayoutEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const sendParams = () => {
      console.log("[parent] Sending params:", params)
      iframe.contentWindow?.postMessage(
        {
          type: MESSAGE_TYPE,
          params: {
            theme: params.theme,
            iconLibrary: params.iconLibrary,
            item: params.item,
          },
        },
        "*"
      )
    }

    const handleLoad = () => {
      hasLoadedRef.current = true
      console.log("[parent] Iframe loaded, sending params")
      sendParams()
    }

    // Try sending immediately in case iframe is already loaded.
    if (iframe.contentWindow) {
      console.log("[parent] Iframe already loaded, sending params immediately")
      sendParams()
    }

    iframe.addEventListener("load", handleLoad)
    return () => {
      iframe.removeEventListener("load", handleLoad)
      hasLoadedRef.current = false
    }
  }, [params.item, params.theme, params.iconLibrary]) // Re-attach listener when params change.

  // Send postMessage updates when params change (after initial load).
  useEffect(() => {
    if (!hasLoadedRef.current) return

    const iframe = iframeRef.current
    if (!iframe?.contentWindow) return

    iframe.contentWindow.postMessage(
      {
        type: MESSAGE_TYPE,
        params: {
          theme: params.theme,
          iconLibrary: params.iconLibrary,
          item: params.item,
        },
      },
      "*"
    )
  }, [params.theme, params.iconLibrary, params.item])

  if (!iframeSrc) {
    return null
  }

  return (
    <div className="bg-background flex h-full w-full flex-1 flex-col overflow-hidden border">
      <iframe
        key={params.item}
        ref={iframeRef}
        src={iframeSrc}
        width="100%"
        height="100%"
        className="flex-1 border-0"
      />
    </div>
  )
}
