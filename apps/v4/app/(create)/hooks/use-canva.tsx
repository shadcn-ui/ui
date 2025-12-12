"use client"

import * as React from "react"

import {
  sendToIframe,
  sendToParent,
  useParentMessageListener,
} from "@/app/(create)/hooks/use-iframe-sync"

const MESSAGE_TYPE = "canva-zoom"

export type ZoomCommand =
  | { type: "ZOOM_IN" }
  | { type: "ZOOM_OUT" }
  | { type: "ZOOM_SET"; value: number }
  | { type: "ZOOM_FIT" }
  | { type: "RESET" }

export function sendCanvaZoomCommand(
  iframe: HTMLIFrameElement | null,
  command: ZoomCommand
) {
  sendToIframe(iframe, MESSAGE_TYPE, { command })
}

export function sendCanvaZoomUpdate(zoom: number) {
  sendToParent(MESSAGE_TYPE, { zoom })
}

export function useCanvaZoomSync() {
  const [zoom, setZoom] = React.useState(1)

  useParentMessageListener<{ zoom: number }>(MESSAGE_TYPE, (data) => {
    if (typeof data.zoom === "number") {
      setZoom(data.zoom)
    }
  })

  return zoom
}
