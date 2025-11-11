"use client"

import * as React from "react"

const MESSAGE_TYPE = "canva-zoom"

const isInIframe = () => {
  if (typeof window === "undefined") return false
  return window.self !== window.top
}

export type ZoomCommand =
  | { type: "ZOOM_IN" }
  | { type: "ZOOM_OUT" }
  | { type: "ZOOM_SET"; value: number }
  | { type: "ZOOM_FIT" }
  | { type: "RESET" }

const zoomStore = { zoom: 1 }
const zoomListeners = new Set<() => void>()

if (typeof window !== "undefined" && isInIframe()) {
  window.addEventListener("message", (event: MessageEvent) => {
    if (event.data.type === MESSAGE_TYPE && event.data.command) {
      zoomListeners.forEach((listener) => listener())
    }
  })
}

export function useCanvaZoom() {
  const subscribe = (callback: () => void) => {
    if (isInIframe()) {
      zoomListeners.add(callback)
      return () => {
        zoomListeners.delete(callback)
      }
    }
    return () => {}
  }

  const getSnapshot = () => {
    return zoomStore.zoom
  }

  const getServerSnapshot = () => {
    return 1
  }

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function useCanvaZoomCommand() {
  if (!isInIframe()) {
    throw new Error("useCanvaZoomCommand can only be used inside iframe")
  }

  return React.useMemo(() => {
    return new Promise<ZoomCommand>((resolve) => {
      const handler = (event: MessageEvent) => {
        if (event.data.type === MESSAGE_TYPE && event.data.command) {
          resolve(event.data.command)
          window.removeEventListener("message", handler)
        }
      }
      window.addEventListener("message", handler)
    })
  }, [])
}

export function sendCanvaZoomCommand(
  iframe: HTMLIFrameElement | null,
  command: ZoomCommand
) {
  if (!iframe || !iframe.contentWindow) {
    return
  }

  iframe.contentWindow.postMessage(
    {
      type: MESSAGE_TYPE,
      command,
    },
    "*"
  )
}

export function sendCanvaZoomUpdate(zoom: number) {
  if (!isInIframe()) {
    return
  }

  window.parent.postMessage(
    {
      type: MESSAGE_TYPE,
      zoom,
    },
    "*"
  )
}

export function useCanvaZoomSync() {
  const [zoom, setZoom] = React.useState(1)

  React.useEffect(() => {
    if (isInIframe()) {
      return
    }

    const handleMessage = (event: MessageEvent) => {
      if (
        event.data.type === MESSAGE_TYPE &&
        typeof event.data.zoom === "number"
      ) {
        setZoom(event.data.zoom)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  return zoom
}
