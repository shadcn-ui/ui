"use client"

import * as React from "react"
import { useAtom, useAtomValue } from "jotai"
import { Maximize2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"

import { Button } from "@/registry/new-york-v4/ui/button"
import { Slider } from "@/registry/new-york-v4/ui/slider"
import {
  canvaActionsAtom,
  ZOOM_CONSTANTS,
  zoomAtom,
} from "@/app/(design)/design/components/canva"

export function CanvaControls() {
  const [zoom, setZoom] = useAtom(zoomAtom)
  const canvaActions = useAtomValue(canvaActionsAtom)

  const handleZoomIn = React.useCallback(() => {
    setZoom((prev) => Math.min(prev + ZOOM_CONSTANTS.STEP, ZOOM_CONSTANTS.MAX))
  }, [setZoom])

  const handleZoomOut = React.useCallback(() => {
    setZoom((prev) => Math.max(prev - ZOOM_CONSTANTS.STEP, ZOOM_CONSTANTS.MIN))
  }, [setZoom])

  const handleSliderChange = React.useCallback(
    (value: number[]) => {
      const next = value[0]
      if (!Number.isFinite(next)) {
        return
      }
      setZoom(next)
    },
    [setZoom]
  )

  const handleZoomToFit = React.useCallback(() => {
    canvaActions?.zoomToFit()
  }, [canvaActions])

  const handleReset = React.useCallback(() => {
    canvaActions?.resetZoomAndPosition()
  }, [canvaActions])

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleZoomOut}
        disabled={zoom <= ZOOM_CONSTANTS.MIN}
        aria-label="Zoom out"
      >
        <ZoomOut />
      </Button>
      <div className="flex min-w-[120px] items-center gap-2">
        <Slider
          value={[zoom]}
          onValueChange={handleSliderChange}
          min={ZOOM_CONSTANTS.MIN}
          max={ZOOM_CONSTANTS.MAX}
          step={ZOOM_CONSTANTS.STEP}
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
        disabled={zoom >= ZOOM_CONSTANTS.MAX}
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
