"use client"

import * as React from "react"

import type { DesignSystemSearchParams } from "@/app/(create)/lib/search-params"

type ParentToIframeMessage = {
  type: "design-system-params"
  data: DesignSystemSearchParams
}

export const isInIframe = () => {
  if (typeof window === "undefined") {
    return false
  }
  return window.self !== window.top
}

export function useIframeMessageListener<
  Message extends ParentToIframeMessage,
  MessageType extends Message["type"],
>(
  messageType: MessageType,
  onMessage: (data: Extract<Message, { type: MessageType }>["data"]) => void
) {
  React.useEffect(() => {
    if (!isInIframe()) {
      return
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === messageType) {
        onMessage(event.data.data)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [messageType, onMessage])
}

export function sendToIframe<
  Message extends ParentToIframeMessage,
  MessageType extends Message["type"],
>(
  iframe: HTMLIFrameElement | null,
  messageType: MessageType,
  data: Extract<Message, { type: MessageType }>["data"]
) {
  if (!iframe?.contentWindow) {
    return
  }

  iframe.contentWindow.postMessage(
    {
      type: messageType,
      data,
    },
    "*"
  )
}
