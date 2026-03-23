"use client"

import * as React from "react"

import { CMD_K_FORWARD_TYPE } from "@/app/(create)/components/action-menu"
import {
  REDO_FORWARD_TYPE,
  UNDO_FORWARD_TYPE,
} from "@/app/(create)/components/history-buttons"
import { DARK_MODE_FORWARD_TYPE } from "@/app/(create)/components/mode-switcher"
import { RANDOMIZE_FORWARD_TYPE } from "@/app/(create)/components/random-button"
import { sendToIframe } from "@/app/(create)/hooks/use-iframe-sync"
import {
  serializeDesignSystemSearchParams,
  useDesignSystemSearchParams,
} from "@/app/(create)/lib/search-params"

// Hoisted — avoids recreating on every message event. (js-hoist-regexp)
const MAC_REGEX = /Mac|iPhone|iPad|iPod/

// Hoisted — only uses module-level constants, no component state. (rendering-hoist-jsx)
function handleMessage(event: MessageEvent) {
  if (
    typeof window === "undefined" ||
    event.origin !== window.location.origin
  ) {
    return
  }

  const type = event.data.type
  if (type === CMD_K_FORWARD_TYPE) {
    const isMac = MAC_REGEX.test(navigator.userAgent)
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: event.data.key || "k",
        metaKey: isMac,
        ctrlKey: !isMac,
        bubbles: true,
        cancelable: true,
      })
    )
  } else if (type === RANDOMIZE_FORWARD_TYPE) {
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: event.data.key || "r",
        bubbles: true,
        cancelable: true,
      })
    )
  } else if (type === UNDO_FORWARD_TYPE) {
    const isMac = MAC_REGEX.test(navigator.userAgent)
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "z",
        metaKey: isMac,
        ctrlKey: !isMac,
        bubbles: true,
        cancelable: true,
      })
    )
  } else if (type === REDO_FORWARD_TYPE) {
    const isMac = MAC_REGEX.test(navigator.userAgent)
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "z",
        shiftKey: true,
        metaKey: isMac,
        ctrlKey: !isMac,
        bubbles: true,
        cancelable: true,
      })
    )
  } else if (type === DARK_MODE_FORWARD_TYPE) {
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: event.data.key || "d",
        bubbles: true,
        cancelable: true,
      })
    )
  }
}

export function Preview() {
  const [params] = useDesignSystemSearchParams()
  const iframeRef = React.useRef<HTMLIFrameElement>(null)

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
    <div className="relative flex flex-1 flex-col justify-center overflow-hidden rounded-2xl ring ring-foreground/10 md:ring-muted dark:ring-foreground/10">
      <div className="relative z-0 mx-auto flex w-full flex-1 flex-col overflow-hidden">
        <div className="absolute inset-0 bg-muted dark:bg-muted/30" />
        <iframe
          key={params.base + params.item}
          ref={iframeRef}
          src={iframeSrc}
          className="z-10 size-full flex-1"
          title="Preview"
        />
      </div>
    </div>
  )
}
