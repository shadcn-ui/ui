"use client"

import * as React from "react"
import { ImperativePanelHandle } from "react-resizable-panels"

import type { Base } from "@/registry/config"
import { CMD_K_FORWARD_TYPE } from "@/app/(create)/components/item-picker"
import { useDesignSystemSync } from "@/app/(create)/hooks/use-design-system"

const MESSAGE_TYPE = "design-system-params"

export function Preview({ base }: { base: Base["name"] }) {
  const params = useDesignSystemSync()
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const resizablePanelRef = React.useRef<ImperativePanelHandle>(null)
  const [initialParams] = React.useState(params)
  const [iframeKey, setIframeKey] = React.useState(0)

  // Sync resizable panel with URL param changes.
  React.useEffect(() => {
    if (resizablePanelRef.current && params.size) {
      resizablePanelRef.current.resize(params.size)
    }
  }, [params.size])

  React.useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) {
      return
    }

    const sendParams = () => {
      iframe.contentWindow?.postMessage(
        {
          type: MESSAGE_TYPE,
          params,
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
  }, [params])

  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === CMD_K_FORWARD_TYPE) {
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
      const key = event.data.key || "k"

      const syntheticEvent = new KeyboardEvent("keydown", {
        key,
        metaKey: isMac,
        ctrlKey: !isMac,
        bubbles: true,
        cancelable: true,
      })
      document.dispatchEvent(syntheticEvent)
    }
  }

  React.useEffect(() => {
    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  if (!params.item) {
    return null
  }

  const iframeSrc = `/preview/${base}/${params.item}?theme=${initialParams.theme ?? "neutral"}&iconLibrary=${initialParams.iconLibrary ?? "lucide"}&style=${initialParams.style ?? "vega"}&font=${initialParams.font ?? "inter"}&baseColor=${initialParams.baseColor ?? "neutral"}`

  return (
    <div className="ring-foreground/15 relative -z-0 flex flex-1 flex-col overflow-hidden rounded-xl ring-1">
      <div className="bg-muted dark:bg-muted/30 absolute inset-0 rounded-2xl" />
      <iframe
        key={`${params.item}-${iframeKey}`}
        ref={iframeRef}
        src={iframeSrc}
        className="z-10 size-full"
      />
    </div>
  )
}
