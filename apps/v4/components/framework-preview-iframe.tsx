"use client"

import * as React from "react"
import { SquareArrowOutUpRight } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

export function FrameworkPreviewIframe({
  src,
  title,
}: {
  src: string
  title: string
}) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const { resolvedTheme } = useTheme()
  // [FORCE-UI] portaled overlays (dialog/sheet/drawer) are trapped in the
  // iframe and clipped by its box. When the child reports an open overlay we
  // lift the iframe to a fixed full-viewport layer so position:fixed covers
  // the whole page, matching the React inline previews. Reverts on close.
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const postTheme = React.useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "theme-change", theme: resolvedTheme },
      "*"
    )
  }, [resolvedTheme])

  React.useEffect(() => {
    postTheme()
  }, [postTheme])

  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return
      if (event.data?.type === "preview-modal") {
        setIsModalOpen(event.data.state === "open")
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  return (
    <div className="relative size-full">
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        onLoad={postTheme}
        className={cn(
          "size-full",
          isModalOpen && "fixed inset-0 z-[9999] h-screen w-screen"
        )}
      />
      <a
        href={src}
        target="_blank"
        rel="noreferrer"
        title="Open preview in new tab"
        className="absolute top-2 right-2 z-10 flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-70 transition-opacity hover:bg-muted hover:opacity-100 focus-visible:opacity-100"
      >
        <span className="sr-only">Open preview in new tab</span>
        <SquareArrowOutUpRight className="size-4" />
      </a>
    </div>
  )
}
