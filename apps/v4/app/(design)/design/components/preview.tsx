"use client"

import * as React from "react"

import type { Base } from "@/registry/bases"
import { Canva } from "@/app/(design)/design/components/canva"
import { CMD_K_FORWARD_TYPE } from "@/app/(design)/design/components/item-picker"
import { useDesignSystemSync } from "@/app/(design)/design/hooks/use-design-system"

const MESSAGE_TYPE = "design-system-params"

export function Preview({ base }: { base: Base["name"] }) {
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

  React.useEffect(() => {
    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  if (!params.item) {
    return null
  }

  const iframeSrc = `/preview/${base}/${params.item}?theme=${initialParams.theme ?? "neutral"}&iconLibrary=${initialParams.iconLibrary ?? "lucide"}&style=${initialParams.style ?? "default"}&font=${initialParams.font ?? "inter"}&baseColor=${initialParams.baseColor ?? "neutral"}`

  return (
    <Canva>
      <iframe
        key={params.item}
        ref={iframeRef}
        src={iframeSrc}
        className="w-full flex-1 border-0"
      />
    </Canva>
  )
}
