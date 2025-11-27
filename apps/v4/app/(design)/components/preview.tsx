"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"
import { ImperativePanelHandle } from "react-resizable-panels"

import type { Base } from "@/registry/bases"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/new-york-v4/ui/resizable"
import { CMD_K_FORWARD_TYPE } from "@/app/(design)/components/item-picker"
import { useDesignSystemSync } from "@/app/(design)/hooks/use-design-system"
import { designSystemSearchParams } from "@/app/(design)/lib/search-params"

const MESSAGE_TYPE = "design-system-params"

export function Preview({ base }: { base: Base["name"] }) {
  const params = useDesignSystemSync()
  const [urlParams, setUrlParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
  })
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

  const iframeSrc = `/preview/${base}/${params.item}?theme=${initialParams.theme ?? "neutral"}&iconLibrary=${initialParams.iconLibrary ?? "lucide"}&style=${initialParams.style ?? "vega"}&font=${initialParams.font ?? "inter"}&baseColor=${initialParams.baseColor ?? "neutral"}`

  return (
    <div className="relative -z-0 flex flex-1 flex-col">
      <div className="absolute inset-0 [background-image:radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:20px_20px] dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"></div>
      <ResizablePanelGroup
        direction="horizontal"
        className="after:bg-surface/50 relative z-10 after:absolute after:inset-0 after:-z-10 after:rounded-xl"
      >
        <ResizablePanel
          ref={resizablePanelRef}
          className="relative z-20 overflow-hidden rounded-lg border md:rounded-xl"
          defaultSize={100}
          minSize={30}
          onResize={(size) => setUrlParams({ size: Math.round(size) })}
        >
          <iframe
            key={`${params.item}-${iframeKey}`}
            ref={iframeRef}
            src={iframeSrc}
            className="size-full"
          />
        </ResizablePanel>
        <ResizableHandle className="after:bg-border relative z-50 -mr-3 hidden w-3 bg-transparent p-0 after:absolute after:top-1/2 after:h-8 after:w-[6px] after:rounded-full after:transition-all after:hover:h-10 md:block" />
        <ResizablePanel defaultSize={0} minSize={0} />
      </ResizablePanelGroup>
    </div>
  )
}
