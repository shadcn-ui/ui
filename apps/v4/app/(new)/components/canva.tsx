"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"
import InfiniteViewer from "react-infinite-viewer"

import { cn } from "@/lib/utils"
import { canvaSearchParams } from "@/app/(new)/lib/search-params"

const ZOOM_MIN = 1
const ZOOM_MAX = 2

export function Canva({ children }: { children: React.ReactNode }) {
  const [params, setParams] = useQueryStates(canvaSearchParams)
  const canvaRef = React.useRef<InfiniteViewer>(null)
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    if (canvaRef.current) {
      if (params.scrollLeft !== 0 && params.scrollTop !== 0) {
        canvaRef.current.scrollTo(params.scrollLeft, params.scrollTop)
      } else {
        canvaRef.current.scrollCenter()
      }
      setIsMounted(true)
    }
  }, [params.scrollLeft, params.scrollTop])

  return (
    <div className={cn("relative flex-1", `theme-${params.theme}`)}>
      <div
        data-mounted={isMounted}
        className="bg-muted absolute inset-0 z-10 flex items-center justify-center data-[mounted=true]:hidden"
      />
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
        zoom={params.zoom}
        zoomX={params.zoom}
        zoomY={params.zoom}
        zoomRange={[ZOOM_MIN, ZOOM_MAX]}
        onScroll={(values) => {
          setParams({ scrollLeft: values.scrollLeft })
          setParams({ scrollTop: values.scrollTop })
        }}
        onPinch={(values) => {
          if (values.zoom >= ZOOM_MIN && values.zoom <= ZOOM_MAX) {
            setParams({ zoom: values.zoom })
          }
        }}
      >
        <div className="theme-container flex items-start gap-12">
          {children}
        </div>
      </InfiniteViewer>
    </div>
  )
}

export function CanvaPortal({
  children,
}: {
  element: React.ReactNode
  children?: React.ReactNode
}) {
  return children
}

export function CanvaFrame({
  children,
  name,
}: React.ComponentProps<"div"> & { name: string }) {
  return (
    <div data-slot="canva-frame" className="flex flex-col gap-2">
      <div
        data-slot="canva-frame-name"
        className="text-muted-foreground px-px text-sm"
      >
        {name}
      </div>
      <div
        data-slot="canva-frame-content"
        className="bg-background aspect-[4/2.5] w-[1200px] p-6"
      >
        {children}
      </div>
    </div>
  )
}
