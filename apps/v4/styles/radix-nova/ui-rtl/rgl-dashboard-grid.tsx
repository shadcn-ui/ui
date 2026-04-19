"use client"

import GridLayout, { WidthProvider } from "react-grid-layout"
import type { Layout } from "react-grid-layout"

import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

import { cn } from "@/lib/utils"

const GridWithWidth = WidthProvider(GridLayout)

type DashboardGridProps = {
  layout: Layout[]
  onLayoutChange: (layout: Layout[]) => void
  isDraggable: boolean
  isResizable: boolean
  className?: string
  children: React.ReactNode
}

export function DashboardGrid({
  layout,
  onLayoutChange,
  isDraggable,
  isResizable,
  className,
  children,
}: DashboardGridProps) {
  return (
    <GridWithWidth
      className={cn(
        "w-full min-w-0",
        "[&_.react-grid-placeholder]:rounded-lg [&_.react-grid-placeholder]:border-2 [&_.react-grid-placeholder]:border-dotted [&_.react-grid-placeholder]:border-primary/50 [&_.react-grid-placeholder]:bg-primary/5",
        "[&_.react-resizable-handle]:z-10 [&_.react-resizable-handle]:!m-0 [&_.react-resizable-handle]:box-border [&_.react-resizable-handle]:!transform-none [&_.react-resizable-handle]:p-0",
        "[&_.react-resizable-handle]:size-5 [&_.react-resizable-handle]:bg-transparent [&_.react-resizable-handle]:[background-image:none]",
        "[&_.react-resizable-handle]:opacity-80 [&_.react-resizable-handle]:transition-opacity hover:[&_.react-resizable-handle]:opacity-100",
        "[&_.react-resizable-handle-se]:cursor-nwse-resize [&_.react-resizable-handle-se]:rounded-ee-md [&_.react-resizable-handle-se]:border-e-2 [&_.react-resizable-handle-se]:border-b-2 [&_.react-resizable-handle-se]:border-foreground/90",
        "[&_.react-resizable-handle-sw]:cursor-nesw-resize [&_.react-resizable-handle-sw]:rounded-es-md [&_.react-resizable-handle-sw]:border-s-2 [&_.react-resizable-handle-sw]:border-b-2 [&_.react-resizable-handle-sw]:border-foreground/90",
        "[&_.react-resizable-handle-nw]:cursor-nwse-resize [&_.react-resizable-handle-nw]:rounded-ss-md [&_.react-resizable-handle-nw]:border-s-2 [&_.react-resizable-handle-nw]:border-t-2 [&_.react-resizable-handle-nw]:border-foreground/90",
        className
      )}
      layout={layout}
      cols={12}
      rowHeight={36}
      margin={[16, 16]}
      containerPadding={[16, 16]}
      compactType="vertical"
      draggableCancel=".rgl-no-drag"
      isDraggable={isDraggable}
      isResizable={isResizable}
      onLayoutChange={onLayoutChange}
    >
      {children}
    </GridWithWidth>
  )
}
