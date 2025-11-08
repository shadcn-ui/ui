"use client"

import * as React from "react"
import InfiniteViewer from "react-infinite-viewer"

import { cn } from "@/lib/utils"

const ZOOM_MIN = 0.5
const ZOOM_MAX = 2

export const Canva = React.memo(function Canva({
  children,
}: {
  children: React.ReactNode
}) {
  const canvaRef = React.useRef<InfiniteViewer>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

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

  const dragCondition = React.useCallback(
    (e: any) => {
      const originalEvent = e.originalEvent || e
      const target = (originalEvent.target ||
        originalEvent.srcElement) as HTMLElement

      return !isFormElement(target)
    },
    [isFormElement]
  )

  React.useEffect(() => {
    let cleanup: (() => void) | null = null

    const timeoutId = setTimeout(() => {
      const viewer = canvaRef.current
      const container = containerRef.current
      if (!viewer || !container) {
        return
      }

      const viewerElement = (viewer as any).getElement?.() || container

      const handleMouseDown = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        if (!viewerElement.contains(target)) {
          return
        }

        if (isFormElement(target)) {
          e.stopPropagation()
          e.stopImmediatePropagation()
        }
      }

      const handleTouchStart = (e: TouchEvent) => {
        const target = e.target as HTMLElement
        if (!viewerElement.contains(target)) {
          return
        }

        if (isFormElement(target)) {
          e.stopPropagation()
          e.stopImmediatePropagation()
        }
      }
      document.addEventListener("mousedown", handleMouseDown, true)
      document.addEventListener("touchstart", handleTouchStart, true)

      cleanup = () => {
        document.removeEventListener("mousedown", handleMouseDown, true)
        document.removeEventListener("touchstart", handleTouchStart, true)
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      cleanup?.()
    }
  }, [isFormElement])

  return (
    <div ref={containerRef} className="relative size-full">
      <div className="absolute inset-x-0 top-0 z-40 h-8 bg-gradient-to-b from-white to-transparent dark:hidden" />
      <InfiniteViewer
        ref={canvaRef}
        className="bg-muted h-screen w-full"
        margin={0}
        threshold={0}
        displayVerticalScroll={false}
        displayHorizontalScroll={false}
        useMouseDrag
        dragCondition={dragCondition}
        useAutoZoom
        zoomRange={[ZOOM_MIN, ZOOM_MAX]}
        useWheelScroll
        useWheelPinch
        wheelPinchKey="meta"
        usePinch={true}
      >
        {children}
      </InfiniteViewer>
    </div>
  )
})

export function CanvaPortal({
  children,
}: {
  element: React.ReactNode
  children?: React.ReactNode
}) {
  return children
}

export function CanvaFrame({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-background flex aspect-[1.5/1] max-w-[1500px] items-center justify-center overflow-hidden rounded-xl p-8",
        className
      )}
      {...props}
    />
  )
}
