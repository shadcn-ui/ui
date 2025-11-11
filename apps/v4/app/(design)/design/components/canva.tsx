"use client"

import * as React from "react"
import { atom, useAtom } from "jotai"
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import InfiniteViewer from "react-infinite-viewer"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Slider } from "@/registry/new-york-v4/ui/slider"

const zoomAtom = atom<number>(1)

const ZOOM_MIN = 0.5
const ZOOM_MAX = 2
const FIT_PADDING = 200
const FRAME_WIDTH = 1500
const SCROLL_LEFT_OFFSET = 304
const SCROLL_TOP_OFFSET = 64
const FIT_ZOOM = false
const ZOOM_STEP = 0.1

function CanvaControls({ onReset }: { onReset: () => void }) {
  const [zoom, setZoom] = useAtom(zoomAtom)

  const handleZoomIn = React.useCallback(() => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, ZOOM_MAX))
  }, [setZoom])

  const handleZoomOut = React.useCallback(() => {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, ZOOM_MIN))
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

  return (
    <div className="bg-background border-border fixed right-6 bottom-6 z-50 flex items-center gap-2 rounded-lg border p-2 shadow-lg">
      <Button
        variant="outline"
        size="icon"
        onClick={handleZoomOut}
        disabled={zoom <= ZOOM_MIN}
        aria-label="Zoom out"
      >
        <ZoomOut className="size-4" />
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
        variant="outline"
        size="icon"
        onClick={handleZoomIn}
        disabled={zoom >= ZOOM_MAX}
        aria-label="Zoom in"
      >
        <ZoomIn className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
        aria-label="Reset zoom and position"
      >
        <RotateCcw className="size-4" />
      </Button>
    </div>
  )
}

export const Canva = React.memo(function Canva({
  children,
}: {
  children: React.ReactNode
}) {
  const canvaRef = React.useRef<InfiniteViewer>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = React.useState(false)
  const [zoom, setZoom] = useAtom(zoomAtom)

  const calculateInitialZoom = React.useCallback(() => {
    const windowWidth = window.innerWidth
    const availableWidth = windowWidth - FIT_PADDING * 2
    const calculatedZoom = Math.min(availableWidth / FRAME_WIDTH, 1.0)
    return FIT_ZOOM ? Math.max(calculatedZoom, ZOOM_MIN) : 1.0
  }, [])

  const resetZoomAndPosition = React.useCallback(() => {
    const viewer = canvaRef.current
    if (!viewer) {
      return
    }

    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const finalZoom = calculateInitialZoom()

    const frame = document.querySelector(
      '[data-slot="canva-frame"]'
    ) as HTMLElement
    if (!frame) {
      return
    }

    const greenAreaHeight = windowHeight - SCROLL_TOP_OFFSET
    const greenAreaWidth = windowWidth - SCROLL_LEFT_OFFSET
    const frameWidthScaled = FRAME_WIDTH * finalZoom
    const frameHeightScaled = frame.offsetHeight * finalZoom
    const fitsInSpace =
      frameWidthScaled <= greenAreaWidth && frameHeightScaled <= greenAreaHeight

    const scrollLeft = fitsInSpace
      ? FRAME_WIDTH / 2 - (SCROLL_LEFT_OFFSET + greenAreaWidth / 2) / finalZoom
      : -SCROLL_LEFT_OFFSET / finalZoom
    const scrollTop = fitsInSpace
      ? frame.offsetHeight / 2 -
        (SCROLL_TOP_OFFSET + greenAreaHeight / 2) / finalZoom
      : -SCROLL_TOP_OFFSET / finalZoom

    viewer.setZoom(finalZoom)
    viewer.scrollTo(scrollLeft, scrollTop)
    setZoom(finalZoom)
  }, [calculateInitialZoom, setZoom])

  const handleReset = React.useCallback(() => {
    resetZoomAndPosition()
  }, [resetZoomAndPosition])

  React.useEffect(() => {
    if (!isReady) {
      return
    }
    const viewer = canvaRef.current
    if (!viewer) {
      return
    }
    viewer.setZoom(zoom)
  }, [zoom, isReady])

  const handleZoomChange = React.useCallback(
    (newZoom: number) => {
      if (Math.abs(newZoom - zoom) > 0.001) {
        setZoom(newZoom)
      }
    },
    [zoom, setZoom]
  )

  const isFormElement = React.useCallback(
    (target: HTMLElement | null): boolean => {
      if (!target) {
        return false
      }

      return (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "BUTTON" ||
        target.tagName === "SELECT" ||
        target.isContentEditable === true ||
        !!target.closest("input, textarea, button, select, [contenteditable]")
      )
    },
    []
  )

  const isScrollableElement = React.useCallback(
    (target: HTMLElement | null): boolean => {
      if (!target) {
        return false
      }

      let element: HTMLElement | null = target
      while (element && element !== document.body) {
        const style = window.getComputedStyle(element)
        const overflowY = style.overflowY
        const overflowX = style.overflowX

        const isScrollableY =
          (overflowY === "scroll" || overflowY === "auto") &&
          element.scrollHeight > element.clientHeight

        const isScrollableX =
          (overflowX === "scroll" || overflowX === "auto") &&
          element.scrollWidth > element.clientWidth

        if (isScrollableY || isScrollableX) {
          return true
        }

        element = element.parentElement
      }

      return false
    },
    []
  )

  const dragCondition = React.useCallback(
    (e: any) => {
      const originalEvent = e.originalEvent || e
      const target = (originalEvent.target ||
        originalEvent.srcElement) as HTMLElement

      return !isFormElement(target) && !isScrollableElement(target)
    },
    [isFormElement, isScrollableElement]
  )

  React.useEffect(() => {
    const viewer = canvaRef.current
    if (!viewer) {
      return
    }

    const setup = () => {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      const availableWidth = windowWidth - FIT_PADDING * 2
      const calculatedZoom = Math.min(availableWidth / FRAME_WIDTH, 1.0)
      const finalZoom = FIT_ZOOM ? Math.max(calculatedZoom, ZOOM_MIN) : 1.0
      viewer.setZoom(finalZoom)

      const frame = document.querySelector(
        '[data-slot="canva-frame"]'
      ) as HTMLElement
      if (!frame) {
        return
      }
      const greenAreaHeight = windowHeight - SCROLL_TOP_OFFSET
      const greenAreaWidth = windowWidth - SCROLL_LEFT_OFFSET
      const frameWidthScaled = FRAME_WIDTH * finalZoom
      const frameHeightScaled = frame.offsetHeight * finalZoom
      const fitsInSpace =
        frameWidthScaled <= greenAreaWidth &&
        frameHeightScaled <= greenAreaHeight

      const scrollLeft = fitsInSpace
        ? FRAME_WIDTH / 2 -
          (SCROLL_LEFT_OFFSET + greenAreaWidth / 2) / finalZoom
        : -SCROLL_LEFT_OFFSET / finalZoom
      const scrollTop = fitsInSpace
        ? frame.offsetHeight / 2 -
          (SCROLL_TOP_OFFSET + greenAreaHeight / 2) / finalZoom
        : -SCROLL_TOP_OFFSET / finalZoom

      viewer.scrollTo(scrollLeft, scrollTop)

      setIsReady(true)
    }

    const timeoutId = setTimeout(setup, 200)
    return () => clearTimeout(timeoutId)
  }, [])

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      const viewer = canvaRef.current
      const container = containerRef.current
      if (!viewer || !container) {
        return
      }

      const viewerElement = (viewer as any).getElement?.() || container

      const handleMouseDown = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        if (isFormElement(target)) {
          e.stopImmediatePropagation()
        }
      }

      const handleWheel = (e: WheelEvent) => {
        const target = e.target as HTMLElement
        if (!viewerElement.contains(target) || e.metaKey || e.ctrlKey) {
          return
        }

        let element: HTMLElement | null = target
        while (element && element !== document.body) {
          const style = window.getComputedStyle(element)
          const overflowY = style.overflowY
          const overflowX = style.overflowX

          const isScrollableY =
            (overflowY === "scroll" || overflowY === "auto") &&
            element.scrollHeight > element.clientHeight

          const isScrollableX =
            (overflowX === "scroll" || overflowX === "auto") &&
            element.scrollWidth > element.clientWidth

          if (isScrollableY && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            const canScrollDown =
              e.deltaY > 0 &&
              element.scrollTop < element.scrollHeight - element.clientHeight
            const canScrollUp = e.deltaY < 0 && element.scrollTop > 0

            if (canScrollDown || canScrollUp) {
              e.stopPropagation()
              return
            }
          }

          if (isScrollableX && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            const canScrollRight =
              e.deltaX > 0 &&
              element.scrollLeft < element.scrollWidth - element.clientWidth
            const canScrollLeft = e.deltaX < 0 && element.scrollLeft > 0

            if (canScrollRight || canScrollLeft) {
              e.stopPropagation()
              return
            }
          }

          element = element.parentElement
        }
      }

      document.addEventListener("mousedown", handleMouseDown, true)
      document.addEventListener("wheel", handleWheel, true)

      return () => {
        document.removeEventListener("mousedown", handleMouseDown, true)
        document.removeEventListener("wheel", handleWheel, true)
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isFormElement])

  return (
    <div
      ref={containerRef}
      className="relative size-full opacity-0 data-[ready=true]:opacity-100"
      style={
        {
          "--canva-frame-width": `${FRAME_WIDTH}px`,
        } as React.CSSProperties
      }
      data-ready={isReady}
    >
      <InfiniteViewer
        ref={canvaRef}
        className="section-soft h-screen w-full"
        margin={0}
        displayVerticalScroll={false}
        displayHorizontalScroll={false}
        useMouseDrag
        pinchThreshold={0.5}
        threshold={10}
        dragCondition={dragCondition}
        useAutoZoom
        zoomRange={[ZOOM_MIN, ZOOM_MAX]}
        useWheelScroll
        useWheelPinch
        wheelPinchKey="meta"
        usePinch
        onPinch={(e) => {
          handleZoomChange(e.zoom)
        }}
        onScroll={(e) => {
          handleZoomChange(e.zoomX)
        }}
      >
        {children}
      </InfiniteViewer>
      <CanvaControls onReset={handleReset} />
    </div>
  )
})

export function CanvaPortal({
  children,
}: {
  element?: React.ReactElement
  children?: React.ReactNode
}) {
  return <>{children}</>
}

export function CanvaFrame({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="canva-frame"
      className={cn(
        "bg-background no-scrollbar ring-border flex aspect-[1.5/1] max-w-(--canva-frame-width) scroll-pb-8 overflow-hidden rounded-xl p-8 ring-1",
        className
      )}
      {...props}
    />
  )
}
