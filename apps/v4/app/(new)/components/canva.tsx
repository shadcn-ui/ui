"use client"

import * as React from "react"
import { parseAsFloat, parseAsInteger, useQueryState } from "nuqs"
import InfiniteViewer from "react-infinite-viewer"

import { useMounted } from "@/hooks/use-mounted"

const ZOOM_MIN = 1
const ZOOM_MAX = 2

export function Canva({ children }: { children: React.ReactNode }) {
  const [scrollLeft, setScrollLeft] = useQueryState(
    "scrollLeft",
    parseAsInteger.withDefault(0)
  )
  const [scrollTop, setScrollTop] = useQueryState(
    "scrollTop",
    parseAsInteger.withDefault(0)
  )
  const [zoom, setZoom] = useQueryState("zoom", parseAsFloat.withDefault(1))
  const canvaRef = React.useRef<InfiniteViewer>(null)
  const isMounted = useMounted()

  React.useEffect(() => {
    if (canvaRef.current) {
      if (scrollLeft !== 0 && scrollTop !== 0) {
        canvaRef.current.scrollTo(scrollLeft, scrollTop)
      } else {
        canvaRef.current.scrollCenter()
      }
    }
  }, [scrollLeft, scrollTop])

  return (
    <InfiniteViewer
      data-mounted={isMounted}
      ref={canvaRef}
      width="100%"
      height="100%"
      className="bg-muted h-full w-full data-[mounted=false]:hidden"
      displayVerticalScroll={false}
      displayHorizontalScroll={false}
      useMouseDrag
      useWheelScroll
      useWheelPinch={true}
      wheelPinchKey="meta"
      usePinch={true}
      pinchThreshold={50}
      zoomOffsetX={200}
      zoomOffsetY={20}
      zoom={zoom}
      zoomX={zoom}
      zoomY={zoom}
      zoomRange={[ZOOM_MIN, ZOOM_MAX]}
      onScroll={(values) => {
        setScrollLeft(values.scrollLeft)
        setScrollTop(values.scrollTop)
      }}
      onPinch={(values) => {
        if (values.zoom >= ZOOM_MIN && values.zoom <= ZOOM_MAX) {
          setZoom(values.zoom)
        }
      }}
    >
      <div className="viewport h-[800px] w-[1200px] bg-red-200">{children}</div>
    </InfiniteViewer>
  )
}

export function CanvaPortal({
  children,
}: {
  element: React.ReactNode
  children: React.ReactNode
}) {
  return children
}
