"use client"

import * as React from "react"
import { type ImperativePanelHandle } from "react-resizable-panels"

import { DARK_MODE_FORWARD_TYPE } from "@/components/mode-switcher"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { CMD_K_FORWARD_TYPE } from "@/app/(create)/components/item-picker"
import { RANDOMIZE_FORWARD_TYPE } from "@/app/(create)/components/random-button"
import { sendToIframe } from "@/app/(create)/hooks/use-iframe-sync"
import {
  serializeDesignSystemSearchParams,
  useDesignSystemSearchParams,
} from "@/app/(create)/lib/search-params"

export function Preview() {
  const [params] = useDesignSystemSearchParams()
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const resizablePanelRef = React.useRef<ImperativePanelHandle>(null)

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
      sendToIframe(iframe, "design-system-params", params)
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

  const iframeSrc = React.useMemo(() => {
    // The iframe src needs to include the serialized design system params
    // for the initial load, but not be reactive to them as it would cause
    // full-iframe reloads on every param change (flashes & loss of state).
    // Further updates of the search params will be sent to the iframe
    // via a postMessage channel, for it to sync its own history onto the host's.
    return serializeDesignSystemSearchParams(
      `/preview/${params.base}/${params.item}`,
      params
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.base, params.item])

  return (
    <div className="relative -mx-1 flex flex-1 flex-col justify-center sm:mx-0">
      <div className="ring-foreground/15 3xl:max-h-[1200px] 3xl:max-w-[1800px] relative -z-0 mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-2xl ring-1">
        <div className="bg-muted dark:bg-muted/30 absolute inset-0 rounded-2xl" />
        <iframe
          key={params.base + params.item}
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
