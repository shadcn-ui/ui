"use client"

import * as React from "react"
import InfiniteViewer from "react-infinite-viewer"

import { cn } from "@/lib/utils"

const ZOOM_MIN = 0.5
const ZOOM_MAX = 2
const FIT_PADDING = 200
const FRAME_WIDTH = 1500
const SCROLL_LEFT_OFFSET = 280
const SCROLL_TOP_OFFSET = 64

export const Canva = React.memo(function Canva({
  children,
}: {
  children: React.ReactNode
}) {
  const canvaRef = React.useRef<InfiniteViewer>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = React.useState(false)

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
      // Calculate zoom based on window width and known content width.
      const windowWidth = window.innerWidth
      const availableWidth = windowWidth - FIT_PADDING * 2
      const zoom = Math.min(availableWidth / FRAME_WIDTH, 1.0)
      const finalZoom = Math.max(zoom, ZOOM_MIN)

      // Apply zoom.
      viewer.setZoom(finalZoom)

      // Get the actual frame element to measure.
      const frame = document.querySelector(
        '[data-slot="canva-frame"]'
      ) as HTMLElement
      if (!frame) {
        return
      }

      const windowHeight = window.innerHeight
      const greenAreaHeight = windowHeight - SCROLL_TOP_OFFSET

      // Content center in natural coordinates (before zoom).
      const contentCenterX = FRAME_WIDTH / 2
      const contentCenterY = frame.offsetHeight / 2

      // Calculate target screen position.
      const targetScreenX =
        SCROLL_LEFT_OFFSET + (windowWidth - SCROLL_LEFT_OFFSET) / 2

      // Calculate frame height at current zoom.
      const frameHeightScaled = frame.offsetHeight * finalZoom

      let targetScreenY: number
      if (frameHeightScaled <= greenAreaHeight) {
        // Frame fits in green area - center it vertically.
        targetScreenY = SCROLL_TOP_OFFSET + greenAreaHeight / 2
      } else {
        // Frame too tall for green area - align top of frame to top of green area.
        // To align top edge, we need to position content so its top is at SCROLL_TOP_OFFSET.
        // Content top = contentCenterY - frame.offsetHeight / 2
        // We want: (contentCenterY - frame.offsetHeight / 2) * zoom = SCROLL_TOP_OFFSET
        targetScreenY = SCROLL_TOP_OFFSET + (frame.offsetHeight / 2) * finalZoom
      }

      // Convert screen coordinates to scroll coordinates.
      const scrollLeft = contentCenterX - targetScreenX / finalZoom
      const scrollTop = contentCenterY - targetScreenY / finalZoom

      viewer.scrollTo(scrollLeft, scrollTop)

      // Mark as ready after setup is complete.
      setIsReady(true)
    }

    // Small delay to ensure viewer is ready.
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

      // Ensure form elements can receive focus and clicks.
      const handleMouseDown = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        if (isFormElement(target)) {
          // For form elements, we need to ensure focus happens.
          // Stop the event from reaching InfiniteViewer's drag handler.
          e.stopImmediatePropagation()
        }
      }

      const handleWheel = (e: WheelEvent) => {
        const target = e.target as HTMLElement
        if (!viewerElement.contains(target) || e.metaKey || e.ctrlKey) {
          return
        }

        // Check if we're on a scrollable element and if it can scroll in the wheel direction.
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

          // Check if scrolling vertically.
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

          // Check if scrolling horizontally.
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
        dragCondition={dragCondition}
        useAutoZoom
        zoomRange={[ZOOM_MIN, ZOOM_MAX]}
        useWheelScroll
        useWheelPinch
        wheelPinchKey="meta"
        usePinch
      >
        {children}
      </InfiniteViewer>
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
