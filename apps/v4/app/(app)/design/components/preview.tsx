"use client"

import * as React from "react"

import type { ComponentLibrary } from "@/registry/component-libraries"
import { CMD_P_FORWARD_TYPE } from "@/app/(app)/design/components/item-picker"
import { useDesignSystemSync } from "@/app/(app)/design/hooks/use-design-system"

const MESSAGE_TYPE = "design-system-params"

export function Preview({ library }: { library: ComponentLibrary["name"] }) {
  const params = useDesignSystemSync()
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const [initialParams] = React.useState(params)

  React.useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) {
      return
    }

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
            baseColor: params.baseColor,
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
  }, [
    params.theme,
    params.iconLibrary,
    params.style,
    params.font,
    params.item,
    params.baseColor,
  ])

  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === CMD_P_FORWARD_TYPE) {
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)

      const syntheticEvent = new KeyboardEvent("keydown", {
        key: "p",
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

  const iframeSrc = `/preview/${library}/${params.item}?theme=${initialParams.theme ?? "neutral"}&iconLibrary=${initialParams.iconLibrary ?? "lucide"}&style=${initialParams.style ?? "default"}&font=${initialParams.font ?? "inter"}&baseColor=${initialParams.baseColor ?? "neutral"}`

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
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
