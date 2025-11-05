"use client"

import { useEffect, useLayoutEffect, useRef } from "react"

import { useDesignSystemSync } from "@/app/(design)/hooks/use-design-system-sync"
import type { DesignSystemStyle } from "@/app/(design)/lib/style"

const MESSAGE_TYPE = "design-system-params"

export function Preview({ style }: { style: DesignSystemStyle["name"] }) {
  const params = useDesignSystemSync()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const hasLoadedRef = useRef(false)

  const iframeSrc = params.item ? `/design/${style}/${params.item}` : null

  useLayoutEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const sendParams = () => {
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
      sendParams()
    }

    // Send immediately if iframe is already loaded.
    if (iframe.contentWindow) {
      sendParams()
    }

    iframe.addEventListener("load", handleLoad)
    return () => {
      iframe.removeEventListener("load", handleLoad)
      hasLoadedRef.current = false
    }
  }, [params])

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
