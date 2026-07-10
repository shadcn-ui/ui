"use client"

import * as React from "react"

import {
  TYPESET_COMMAND_MESSAGE,
  type TypesetCommand,
} from "@/app/(app)/(typeset)/components/forward-scripts"
import { TypesetToolbar } from "@/app/(app)/(typeset)/components/toolbar"
import { useHistory } from "@/app/(app)/(typeset)/hooks/use-history"
import { useShuffle } from "@/app/(app)/(typeset)/hooks/use-shuffle"
import { useThemeToggle } from "@/app/(app)/(typeset)/hooks/use-theme-toggle"
import {
  serializeTypesetSearchParams,
  TYPESET_PARAMS_MESSAGE,
  useTypesetSearchParams,
} from "@/app/(app)/(typeset)/lib/search-params"

export function TypesetPreview() {
  const [params] = useTypesetSearchParams()
  const { shuffle, reset } = useShuffle()
  const { goBack, goForward } = useHistory()
  const { toggleTheme } = useThemeToggle({ shortcut: false })
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const [previewUrl, setPreviewUrl] = React.useState(() =>
    serializeTypesetSearchParams(`/preview/typeset/${params.item}`, params)
  )
  const itemRef = React.useRef(params.item)

  React.useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) {
      return
    }

    if (params.item !== itemRef.current) {
      itemRef.current = params.item
      setPreviewUrl(
        serializeTypesetSearchParams(`/preview/typeset/${params.item}`, params)
      )
      return
    }

    const sendParams = () => {
      iframe.contentWindow?.postMessage(
        { type: TYPESET_PARAMS_MESSAGE, data: params },
        window.location.origin
      )
    }

    sendParams()
    iframe.addEventListener("load", sendParams)

    return () => {
      iframe.removeEventListener("load", sendParams)
    }
  }, [params])

  // The iframe forwards its keyboard shortcuts as typed commands; handle them
  // here by calling the real actions.
  React.useEffect(() => {
    const commands: Record<TypesetCommand, () => void> = {
      shuffle,
      reset,
      undo: goBack,
      redo: goForward,
      "toggle-theme": toggleTheme,
    }

    const handleMessage = (event: MessageEvent) => {
      const iframeWindow = iframeRef.current?.contentWindow
      if (
        !iframeWindow ||
        event.origin !== window.location.origin ||
        event.source !== iframeWindow ||
        !event.data ||
        typeof event.data !== "object" ||
        event.data.type !== TYPESET_COMMAND_MESSAGE
      ) {
        return
      }

      const command: unknown = event.data.command
      if (typeof command === "string" && command in commands) {
        commands[command as TypesetCommand]()
      }
    }

    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [shuffle, reset, goBack, goForward, toggleTheme])

  return (
    <div className="relative isolate flex size-full min-h-0 flex-1 overflow-hidden rounded-2xl bg-background ring-1 ring-foreground/10">
      <iframe
        ref={iframeRef}
        src={previewUrl}
        title="typeset preview"
        className="size-full"
      />
      <TypesetToolbar />
    </div>
  )
}
