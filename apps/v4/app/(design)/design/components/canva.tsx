"use client"

import * as React from "react"
import { atom, useAtom } from "jotai"
import InfiniteViewer from "react-infinite-viewer"

import { cn } from "@/lib/utils"

const ZOOM_MIN = 0.5
const ZOOM_MAX = 2
const ZOOM_STEP = 0.1
const ZOOM_INITIAL = 1
const FIT_PADDING = 200
const FRAME_WIDTH = 1500
const SCROLL_LEFT_OFFSET = 304
const SCROLL_TOP_OFFSET = 64
const FIT_ZOOM = false
const SETUP_DELAY = 200
const ZOOM_APPLY_DELAY = 50
const WHEEL_SCALE = 0.02

export const zoomAtom = atom(ZOOM_INITIAL)

type CanvaActions = {
  zoomToFit: () => void
  resetZoomAndPosition: () => void
}

export const canvaActionsAtom = atom<CanvaActions | null>(null)

export const ZOOM_CONSTANTS = {
  MIN: ZOOM_MIN,
  MAX: ZOOM_MAX,
  STEP: ZOOM_STEP,
  INITIAL: ZOOM_INITIAL,
} as const

function calculateZoomAndPosition() {
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const availableWidth = windowWidth - FIT_PADDING * 2
  const calculatedZoom = Math.min(availableWidth / FRAME_WIDTH, 1.0)
  const finalZoom = FIT_ZOOM ? Math.max(calculatedZoom, ZOOM_MIN) : 1.0

  const frame = document.querySelector(
    '[data-slot="canva-frame"]'
  ) as HTMLElement

  if (!frame) {
    return {
      zoom: finalZoom,
      scrollLeft: -SCROLL_LEFT_OFFSET / finalZoom,
      scrollTop: -SCROLL_TOP_OFFSET / finalZoom,
    }
  }

  const viewportHeight = windowHeight - SCROLL_TOP_OFFSET
  const viewportWidth = windowWidth - SCROLL_LEFT_OFFSET
  const frameWidthScaled = FRAME_WIDTH * finalZoom
  const frameHeightScaled = frame.offsetHeight * finalZoom
  const fitsInViewport =
    frameWidthScaled <= viewportWidth && frameHeightScaled <= viewportHeight

  const scrollLeft = fitsInViewport
    ? FRAME_WIDTH / 2 - (SCROLL_LEFT_OFFSET + viewportWidth / 2) / finalZoom
    : -SCROLL_LEFT_OFFSET / finalZoom
  const scrollTop = fitsInViewport
    ? frame.offsetHeight / 2 -
      (SCROLL_TOP_OFFSET + viewportHeight / 2) / finalZoom
    : -SCROLL_TOP_OFFSET / finalZoom

  return { zoom: finalZoom, scrollLeft, scrollTop }
}

const Canva = React.memo(function Canva({
  children,
}: {
  children: React.ReactNode
}) {
  const canvaRef = React.useRef<InfiniteViewer>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = React.useState(false)
  const [zoom, setZoom] = useAtom(zoomAtom)
  const [, setCanvaActions] = useAtom(canvaActionsAtom)
  const isApplyingZoomRef = React.useRef(false)
  const [isActive, setIsActive] = React.useState(false)
  const isDraggingRef = React.useRef(false)
  const mouseDownPosRef = React.useRef({ x: 0, y: 0 })

  const zoomToFit = React.useCallback(() => {
    const viewer = canvaRef.current
    if (!viewer) {
      return
    }

    const frame = document.querySelector(
      '[data-slot="canva-frame"]'
    ) as HTMLElement
    if (!frame) {
      return
    }

    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const viewportHeight = windowHeight - SCROLL_TOP_OFFSET
    const viewportWidth = windowWidth - SCROLL_LEFT_OFFSET

    const frameWidth = FRAME_WIDTH
    const frameHeight = frame.offsetHeight

    const zoomX = viewportWidth / frameWidth
    const zoomY = viewportHeight / frameHeight
    const fitZoom = Math.min(zoomX, zoomY, ZOOM_MAX) * 0.9

    const finalZoom = Math.max(fitZoom, ZOOM_MIN)

    const scrollLeft =
      frameWidth / 2 - (SCROLL_LEFT_OFFSET + viewportWidth / 2) / finalZoom
    const scrollTop =
      frameHeight / 2 - (SCROLL_TOP_OFFSET + viewportHeight / 2) / finalZoom

    isApplyingZoomRef.current = true
    viewer.setZoom(finalZoom)
    viewer.scrollTo(scrollLeft, scrollTop)
    setZoom(finalZoom)
    setTimeout(() => {
      isApplyingZoomRef.current = false
    }, ZOOM_APPLY_DELAY)
  }, [setZoom])

  const resetZoomAndPosition = React.useCallback(() => {
    const viewer = canvaRef.current
    if (!viewer) {
      return
    }

    const {
      zoom: finalZoom,
      scrollLeft,
      scrollTop,
    } = calculateZoomAndPosition()

    isApplyingZoomRef.current = true
    viewer.setZoom(finalZoom)
    viewer.scrollTo(scrollLeft, scrollTop)
    setZoom(finalZoom)
    setTimeout(() => {
      isApplyingZoomRef.current = false
    }, ZOOM_APPLY_DELAY)
  }, [setZoom])

  React.useEffect(() => {
    setCanvaActions({
      zoomToFit,
      resetZoomAndPosition,
    })

    return () => {
      setCanvaActions(null)
    }
  }, [zoomToFit, resetZoomAndPosition, setCanvaActions])

  React.useEffect(() => {
    if (!isReady) {
      return
    }
    const viewer = canvaRef.current
    if (!viewer || isApplyingZoomRef.current) {
      return
    }
    viewer.setZoom(zoom)
  }, [zoom, isReady])

  const handleZoomChange = React.useCallback(
    (newZoom: number) => {
      if (isApplyingZoomRef.current || Math.abs(newZoom - zoom) < 0.001) {
        return
      }
      setZoom(newZoom)
    },
    [zoom, setZoom]
  )

  React.useEffect(() => {
    const viewer = canvaRef.current
    if (!viewer) {
      return
    }

    const setup = () => {
      const {
        zoom: finalZoom,
        scrollLeft,
        scrollTop,
      } = calculateZoomAndPosition()
      viewer.setZoom(finalZoom)
      viewer.scrollTo(scrollLeft, scrollTop)
      setZoom(finalZoom)
      setIsReady(true)
    }

    const timeoutId = setTimeout(setup, SETUP_DELAY)
    return () => clearTimeout(timeoutId)
  }, [setZoom])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsActive(false)
        // Blur any focused elements in the iframe.
        const iframe = document.querySelector(
          '[data-slot="canva-frame"] iframe'
        ) as HTMLIFrameElement
        if (iframe?.contentWindow?.document.activeElement) {
          ;(iframe.contentWindow.document.activeElement as HTMLElement)?.blur()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      data-slot="canva-container"
      className="relative size-full opacity-0 data-[ready=true]:opacity-100"
      style={
        {
          "--canva-frame-width": `${FRAME_WIDTH}px`,
        } as React.CSSProperties
      }
      data-ready={isReady}
      onClick={(e) => {
        const target = e.target as HTMLElement
        const frame = target.closest('[data-slot="canva-frame"]')
        if (!frame) {
          setIsActive(false)
          const iframe = document.querySelector(
            '[data-slot="canva-frame"] iframe'
          ) as HTMLIFrameElement
          if (iframe?.contentWindow?.document.activeElement) {
            ;(
              iframe.contentWindow.document.activeElement as HTMLElement
            )?.blur()
          }
        }
      }}
    >
      <InfiniteViewer
        ref={canvaRef}
        className="section-soft h-screen w-full"
        data-slot="canva-viewer"
        margin={0}
        displayVerticalScroll={false}
        displayHorizontalScroll={false}
        useMouseDrag
        pinchThreshold={0.5}
        threshold={10}
        useAutoZoom
        zoomRange={[ZOOM_MIN, ZOOM_MAX]}
        useWheelScroll
        useWheelPinch
        wheelPinchKey="meta"
        wheelScale={WHEEL_SCALE}
        usePinch
        onPinch={({ zoom }) => {
          handleZoomChange(zoom)
        }}
      >
        <div
          data-slot="canva-frame"
          data-active={isActive}
          className="ring-border relative flex aspect-[1.5/1] max-w-(--canva-frame-width) flex-1 flex-col overflow-hidden rounded-xl ring-1 data-[active=true]:ring-2 data-[active=true]:ring-blue-600"
        >
          <div
            data-slot="canva-overlay"
            data-active={isActive}
            className="absolute inset-0 z-10 cursor-grab data-[active=true]:pointer-events-none data-[active=true]:cursor-auto"
            onMouseDown={(e) => {
              isDraggingRef.current = false
              mouseDownPosRef.current = { x: e.clientX, y: e.clientY }
            }}
            onMouseMove={(e) => {
              if (mouseDownPosRef.current) {
                const deltaX = Math.abs(e.clientX - mouseDownPosRef.current.x)
                const deltaY = Math.abs(e.clientY - mouseDownPosRef.current.y)
                if (deltaX > 5 || deltaY > 5) {
                  isDraggingRef.current = true
                }
              }
            }}
            onClick={(e) => {
              if (!isDraggingRef.current) {
                setIsActive(true)
                e.stopPropagation()
              }
            }}
          />
          {children}
        </div>
      </InfiniteViewer>
    </div>
  )
})

function CanvaPortal({
  children,
}: {
  element?: React.ReactElement
  children?: React.ReactNode
}) {
  return <>{children}</>
}

function CanvaFrame({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-background no-scrollbar ring-border flex aspect-[1.5/1] max-w-(--canva-frame-width) scroll-pb-8 overflow-hidden rounded-xl p-8 ring-1",
        className
      )}
      {...props}
    />
  )
}

export { Canva, CanvaPortal, CanvaFrame }
