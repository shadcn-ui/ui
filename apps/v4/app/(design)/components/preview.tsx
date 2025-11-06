"use client"

import { useEffect, useRef, useState } from "react"

import type { ComponentLibrary } from "@/registry/component-libraries"
import { useDesignSystemSync } from "@/app/(design)/hooks/use-design-system-sync"

const MESSAGE_TYPE = "design-system-params"
const CMD_K_FORWARD_TYPE = "cmd-k-forward"

export function Preview({ library }: { library: ComponentLibrary["name"] }) {
  const params = useDesignSystemSync()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [initialParams] = useState(params)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const sendParams = () => {
      iframe.contentWindow?.postMessage(
        {
          type: MESSAGE_TYPE,
          params: {
            theme: params.theme,
            iconLibrary: params.iconLibrary,
            style: params.style,
            font: params.font,
            item: params.item,
          },
        },
        "*"
      )
    }

    if (iframe.contentWindow) {
      sendParams()
    }

    iframe.addEventListener("load", sendParams)
    return () => {
      iframe.removeEventListener("load", sendParams)
    }
  }, [params.theme, params.iconLibrary, params.style, params.font, params.item])

  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === CMD_K_FORWARD_TYPE) {
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)

      const syntheticEvent = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: isMac,
        ctrlKey: !isMac,
        bubbles: true,
        cancelable: true,
      })
      document.dispatchEvent(syntheticEvent)
    }
  }

  useEffect(() => {
    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  if (!params.item) {
    return null
  }

  // Use initial params for iframe src to avoid reload on param changes.
  const iframeSrc = `/design/${library}/${params.item}?theme=${initialParams.theme ?? "neutral"}&iconLibrary=${initialParams.iconLibrary ?? "lucide"}&style=${initialParams.style ?? "default"}&font=${initialParams.font ?? "inter"}`

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
