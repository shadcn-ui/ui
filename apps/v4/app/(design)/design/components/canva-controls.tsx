"use client"

import * as React from "react"
import { Maximize2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"

import { Button } from "@/registry/new-york-v4/ui/button"
import { Slider } from "@/registry/new-york-v4/ui/slider"
import {
  sendCanvaZoomCommand,
  useCanvaZoomSync,
} from "@/app/(design)/design/hooks/use-canva"

const ZOOM_MIN = 0.5
const ZOOM_MAX = 2
const ZOOM_STEP = 0.1

export function CanvaControls() {
  const zoom = useCanvaZoomSync()
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null)

  React.useEffect(() => {
    const iframe = document.querySelector(
      'iframe[src^="/preview/"]'
    ) as HTMLIFrameElement
    iframeRef.current = iframe
  }, [])

  const handleZoomIn = React.useCallback(() => {
    sendCanvaZoomCommand(iframeRef.current, { type: "ZOOM_IN" })
  }, [])

  const handleZoomOut = React.useCallback(() => {
    sendCanvaZoomCommand(iframeRef.current, { type: "ZOOM_OUT" })
  }, [])

  const handleSliderChange = React.useCallback((value: number[]) => {
    const next = value[0]
    if (!Number.isFinite(next)) {
      return
    }
    sendCanvaZoomCommand(iframeRef.current, { type: "ZOOM_SET", value: next })
  }, [])

  const handleZoomToFit = React.useCallback(() => {
    sendCanvaZoomCommand(iframeRef.current, { type: "ZOOM_FIT" })
  }, [])

  const handleReset = React.useCallback(() => {
    sendCanvaZoomCommand(iframeRef.current, { type: "RESET" })
  }, [])

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleZoomOut}
        disabled={zoom <= ZOOM_MIN}
        aria-label="Zoom out"
      >
        <ZoomOut />
      </Button>
      <div className="flex min-w-[120px] items-center gap-2">
        <Slider
          value={[zoom]}
          onValueChange={handleSliderChange}
          min={ZOOM_MIN}
          max={ZOOM_MAX}
          step={ZOOM_STEP}
          className="w-full"
        />
        <span className="text-muted-foreground text-xs tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleZoomIn}
        disabled={zoom >= ZOOM_MAX}
        aria-label="Zoom in"
      >
        <ZoomIn />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleZoomToFit}
        aria-label="Zoom to fit"
      >
        <Maximize2 />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleReset}
        aria-label="Reset zoom and position"
      >
        <RotateCcw />
      </Button>
    </div>
  )
}
