"use client"

import * as React from "react"
import { type ImperativePanelHandle } from "react-resizable-panels"

import { DARK_MODE_FORWARD_TYPE } from "@/components/mode-switcher"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { RANDOMIZE_FORWARD_TYPE } from "@/app/(create)/components/customizer-controls"
import { CMD_K_FORWARD_TYPE } from "@/app/(create)/components/item-picker"
import { useDesignSystemSync } from "@/app/(create)/hooks/use-design-system"

const MESSAGE_TYPE = "design-system-params"

export function Preview() {
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

    if (event.data.type === RANDOMIZE_FORWARD_TYPE) {
      const key = event.data.key || "r"

      const syntheticEvent = new KeyboardEvent("keydown", {
        key,
        bubbles: true,
        cancelable: true,
      })
      document.dispatchEvent(syntheticEvent)
    }

    if (event.data.type === DARK_MODE_FORWARD_TYPE) {
      const key = event.data.key || "d"

      const syntheticEvent = new KeyboardEvent("keydown", {
        key,
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

  if (!params.item || !params.base) {
    return null
  }

  const iframeSrc = `/preview/${params.base}/${params.item}?theme=${initialParams.theme ?? "neutral"}&iconLibrary=${initialParams.iconLibrary ?? "lucide"}&style=${initialParams.style ?? "vega"}&font=${initialParams.font ?? "inter"}&baseColor=${initialParams.baseColor ?? "neutral"}`

  return (
    <div className="relative -mx-1 flex flex-1 flex-col justify-center sm:mx-0">
      <div className="ring-foreground/15 3xl:max-h-[1200px] 3xl:max-w-[1800px] relative -z-0 mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-2xl ring-1">
        <div className="bg-muted dark:bg-muted/30 absolute inset-0 rounded-2xl" />
        <iframe
          key={`${params.item}-${iframeKey}`}
          ref={iframeRef}
          src={iframeSrc}
          className="z-10 size-full flex-1"
          title="Preview"
        />
        <Badge
          className="absolute right-2 bottom-2 isolate z-10"
          variant="secondary"
        >
          Preview
        </Badge>
      </div>
    </div>
  )
}
