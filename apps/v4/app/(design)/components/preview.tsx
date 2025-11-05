"use client"

import { useEffect, useLayoutEffect, useRef } from "react"

import { useDesignSystemSync } from "@/app/(design)/hooks/use-design-system-sync"
import type { DesignSystemStyle } from "@/app/(design)/lib/style"

const MESSAGE_TYPE = "design-system-params"
const CMD_K_FORWARD_TYPE = "cmd-k-forward"

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
    if (!hasLoadedRef.current) {
      return
    }

    const iframe = iframeRef.current
    if (!iframe?.contentWindow) {
      return
    }

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

  // Listen for Cmd+K forwarded from iframe and dispatch synthetic keyboard event.
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === CMD_K_FORWARD_TYPE) {
        // Dispatch a synthetic keyboard event to trigger the command menu.
        const syntheticEvent = new KeyboardEvent("keydown", {
          key: "k",
          metaKey: navigator.platform.includes("Mac"),
          ctrlKey: !navigator.platform.includes("Mac"),
          bubbles: true,
          cancelable: true,
        })
        document.dispatchEvent(syntheticEvent)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  if (!iframeSrc) {
    return null
  }

  return (
    <iframe
      key={params.item}
      ref={iframeRef}
      src={iframeSrc}
      width="100%"
      height="100%"
      className="flex-1 border-0"
    />
  )
}
