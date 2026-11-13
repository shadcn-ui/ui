"use client"

import * as React from "react"

import {
  TYPESET_COMMAND_MESSAGE,
  type TypesetCommand,
} from "@/app/(app)/(typeset)/components/forward-scripts"
import { usePreviewOverrideValue } from "@/app/(app)/(typeset)/components/preview-override"
import { TypesetToolbar } from "@/app/(app)/(typeset)/components/toolbar"
import { useHistory } from "@/app/(app)/(typeset)/hooks/use-history"
import { useShuffle } from "@/app/(app)/(typeset)/hooks/use-shuffle"
import { useThemeToggle } from "@/app/(app)/(typeset)/hooks/use-theme-toggle"
import {
  serializeTypesetSearchParams,
  TYPESET_PARAMS_MESSAGE,
  useTypesetSearchParams,
  type TypesetSearchParams,
} from "@/app/(app)/(typeset)/lib/search-params"

function isSameParams(a: TypesetSearchParams | null, b: TypesetSearchParams) {
  if (!a) {
    return false
  }

  return Object.keys(b).every(
    (key) => a[key as keyof typeof b] === b[key as keyof typeof b]
  )
}

export function TypesetPreview() {
  const [params] = useTypesetSearchParams()
  const override = usePreviewOverrideValue()
  const { shuffle, reset } = useShuffle()
  const { goBack, goForward } = useHistory()
  const { toggleTheme } = useThemeToggle({ shortcut: false })
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const [previewUrl, setPreviewUrl] = React.useState(() =>
    serializeTypesetSearchParams(`/preview/typeset/${params.item}`, params)
  )
  const itemRef = React.useRef(params.item)
  const lastSentParamsRef = React.useRef<TypesetSearchParams | null>(null)

  // Hover previews overlay the committed params without touching the URL —
  // clearing the override re-sends the committed params, reverting the
  // preview. Overrides never contain `item`, so the reload branch below is
  // only ever driven by committed changes.
  const mergedParams = React.useMemo(
    () => (override ? { ...params, ...override } : params),
    [params, override]
  )

  React.useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) {
      return
    }

    if (mergedParams.item !== itemRef.current) {
      itemRef.current = mergedParams.item
      setPreviewUrl(
        serializeTypesetSearchParams(
          `/preview/typeset/${mergedParams.item}`,
          mergedParams
        )
      )
      return
    }

    const sendParams = () => {
      iframe.contentWindow?.postMessage(
        { type: TYPESET_PARAMS_MESSAGE, data: mergedParams },
        window.location.origin
      )
      lastSentParamsRef.current = mergedParams
    }

    // Skip content-identical re-sends (e.g. an override matching the
    // committed params) — each message triggers a full param sync in the
    // iframe.
    if (!isSameParams(lastSentParamsRef.current, mergedParams)) {
      sendParams()
    }

    iframe.addEventListener("load", sendParams)

    return () => {
      iframe.removeEventListener("load", sendParams)
    }
  }, [mergedParams])

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
