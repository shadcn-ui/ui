"use client"

import GridLayout, { WidthProvider } from "react-grid-layout"
import type { Layout } from "react-grid-layout"

import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

import { cn } from "@/registry/base-lyra/lib/utils"

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
        "[&_.react-resizable-handle]:opacity-70",
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
