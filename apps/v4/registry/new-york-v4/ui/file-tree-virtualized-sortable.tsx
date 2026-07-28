"use client"

import * as React from "react"
import {
  defaultRangeExtractor,
  useVirtualizer,
  type Range,
} from "@tanstack/react-virtual"

import {
  type FileTreeHandle,
  type FileTreeId,
  type FileTreeNode,
  type FileTreeViewportComponent,
  type FileTreeViewportRenderProps,
} from "./file-tree"
import {
  FileTreeSortableViewportRoot,
  SortableFileTree,
  type FileTreeSortableViewportState,
  type SortableFileTreeProps,
} from "./file-tree-sortable"
import type { FileTreeVirtualRange } from "./file-tree-virtualized"

export type VirtualizedSortableFileTreeProps<T = FileTreeNode> = Omit<
  SortableFileTreeProps<T>,
  "viewport"
> & {
  estimateSize?: number | ((item: T) => number)
  initialViewportSize?: { height: number; width: number }
  onVirtualRangeChange?: (range: FileTreeVirtualRange) => void
  overscan?: number
  scrollPadding?: number
  scrollToAlignment?: "start" | "center" | "end" | "auto"
  variableSize?: boolean
}

export interface VirtualizedSortableFileTreeHandle extends FileTreeHandle {
  scrollToItem: (
    id: FileTreeId,
    options?: { align?: "start" | "center" | "end" | "auto" }
  ) => void
}

type ScrollToItem = VirtualizedSortableFileTreeHandle["scrollToItem"]

interface VirtualizedSortableContextValue {
  estimateSize?: number | ((item: unknown) => number)
  initialViewportSize?: { height: number; width: number }
  onVirtualRangeChange?: (range: FileTreeVirtualRange) => void
  overscan: number
  registerScrollToItem: (scrollToItem: ScrollToItem | null) => void
  scrollPadding: number
  scrollToAlignment: "start" | "center" | "end" | "auto"
  variableSize: boolean
}

const VirtualizedSortableContext =
  React.createContext<VirtualizedSortableContextValue | null>(null)

function nextAnimationFrame() {
  return new Promise<void>((resolve) => {
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => resolve())
    } else {
      setTimeout(resolve, 0)
    }
  })
}

function VirtualizedSortableRows({
  props,
  sortable,
}: {
  props: FileTreeViewportRenderProps<unknown>
  sortable: FileTreeSortableViewportState
}) {
  const context = React.useContext(VirtualizedSortableContext)

  if (!context) {
    throw new Error(
      "VirtualizedSortableRows must be rendered by VirtualizedSortableFileTree."
    )
  }

  const configuredEstimateSize = context.estimateSize
  const getItemKey = React.useCallback(
    (index: number) => props.visibleNodes[index]?.id ?? index,
    [props.visibleNodes]
  )
  const estimateSize = React.useCallback(
    (index: number) => {
      const node = props.visibleNodes[index]
      if (typeof configuredEstimateSize === "function" && node) {
        return configuredEstimateSize(node.item)
      }
      if (typeof configuredEstimateSize === "number") {
        return configuredEstimateSize
      }
      return props.density === "compact" ? 28 : 32
    },
    [configuredEstimateSize, props.density, props.visibleNodes]
  )
  const pinnedIndexes = React.useMemo(
    () =>
      sortable.pinnedIds.flatMap((id) => {
        const index = props.visibleNodes.findIndex((node) => node.id === id)
        return index === -1 ? [] : [index]
      }),
    [props.visibleNodes, sortable.pinnedIds]
  )
  const rangeExtractor = React.useCallback(
    (range: Range) =>
      Array.from(
        new Set([...defaultRangeExtractor(range), ...pinnedIndexes])
      ).sort((a, b) => a - b),
    [pinnedIndexes]
  )
  const virtualizer = useVirtualizer({
    count: props.visibleNodes.length,
    estimateSize,
    getItemKey,
    getScrollElement: () => props.treeElement,
    initialRect: {
      height: context.initialViewportSize?.height ?? 320,
      width: context.initialViewportSize?.width ?? 0,
    },
    overscan: context.overscan,
    rangeExtractor,
    scrollPaddingEnd: context.scrollPadding,
    scrollPaddingStart: context.scrollPadding,
    useFlushSync: false,
  })
  const scrollToItem = React.useCallback<ScrollToItem>(
    (id, options) => {
      const index = props.visibleNodes.findIndex((node) => node.id === id)
      if (index === -1) return
      virtualizer.scrollToIndex(index, {
        align: options?.align ?? context.scrollToAlignment,
        behavior: "auto",
      })
    },
    [context, props.visibleNodes, virtualizer]
  )
  const adapter = React.useMemo(
    () => ({
      ensureRendered: async (id: FileTreeId) => {
        scrollToItem(id)
        for (let attempt = 0; attempt < 5; attempt += 1) {
          if (props.getItemElement(id)) return
          await nextAnimationFrame()
        }
      },
      focusElement: (id: FileTreeId) => props.getItemElement(id)?.focus(),
      scrollToItem,
    }),
    [props, scrollToItem]
  )

  React.useLayoutEffect(() => {
    props.registerViewportAdapter(adapter)
    context.registerScrollToItem(scrollToItem)

    return () => {
      props.registerViewportAdapter(null)
      context.registerScrollToItem(null)
    }
  }, [adapter, context, props, scrollToItem])

  React.useEffect(() => {
    if (sortable.targetId) scrollToItem(sortable.targetId)
  }, [scrollToItem, sortable.targetId])

  const measuredVirtualItems = virtualizer.getVirtualItems()
  const fallbackCount = Math.min(
    props.visibleNodes.length,
    Math.ceil(
      (context.initialViewportSize?.height ?? 320) /
        Math.max(1, estimateSize(0))
    ) + context.overscan
  )
  const virtualItems =
    measuredVirtualItems.length > 0
      ? measuredVirtualItems
      : Array.from(
          new Set([
            ...Array.from({ length: fallbackCount }, (_, index) => index),
            ...pinnedIndexes,
          ])
        )
          .sort((a, b) => a - b)
          .map((index) => {
            const size = estimateSize(index)
            return {
              end: index * size + size,
              index,
              key: getItemKey(index),
              lane: 0,
              size,
              start: index * size,
            }
          })
  const rangeKey = virtualItems
    .map((virtualItem) => `${virtualItem.index}:${virtualItem.key}`)
    .join("|")
  const previousRangeKey = React.useRef("")

  React.useEffect(() => {
    if (
      !context.onVirtualRangeChange ||
      previousRangeKey.current === rangeKey
    ) {
      return
    }
    previousRangeKey.current = rangeKey
    const indexes = virtualItems.map((virtualItem) => virtualItem.index)
    context.onVirtualRangeChange({
      startIndex: indexes.length === 0 ? -1 : Math.min(...indexes),
      endIndex: indexes.length === 0 ? -1 : Math.max(...indexes),
      visibleIds: virtualItems.flatMap((virtualItem) => {
        const id = props.visibleNodes[virtualItem.index]?.id
        return id ? [id] : []
      }),
    })
  }, [context, props.visibleNodes, rangeKey, virtualItems])

  return (
    <div
      role="none"
      data-slot="file-tree-virtualized-sortable-viewport"
      data-drop-target-id={sortable.targetId}
      style={{
        height: `${virtualizer.getTotalSize()}px`,
        position: "relative",
        width: "100%",
      }}
    >
      {virtualItems.map((virtualItem) => {
        const node = props.visibleNodes[virtualItem.index]
        if (!node) return null

        return sortable.renderSortableRow(node, virtualItem.index, {
          measureElement: context.variableSize
            ? virtualizer.measureElement
            : undefined,
          style: {
            height: `${virtualItem.size}px`,
            left: 0,
            position: "absolute",
            top: 0,
            transform: `translateY(${virtualItem.start}px)`,
            width: "100%",
          },
          virtualIndex: virtualItem.index,
        })
      })}
    </div>
  )
}

function VirtualizedSortableFileTreeViewport(
  props: FileTreeViewportRenderProps<unknown>
) {
  return (
    <FileTreeSortableViewportRoot props={props}>
      {(sortable) => (
        <VirtualizedSortableRows props={props} sortable={sortable} />
      )}
    </FileTreeSortableViewportRoot>
  )
}

function VirtualizedSortableFileTreeInner<T = FileTreeNode>(
  {
    estimateSize,
    initialViewportSize,
    onVirtualRangeChange,
    overscan = 8,
    scrollPadding = 0,
    scrollToAlignment = "auto",
    variableSize = false,
    ...props
  }: VirtualizedSortableFileTreeProps<T>,
  forwardedRef: React.ForwardedRef<VirtualizedSortableFileTreeHandle>
) {
  const fileTreeRef = React.useRef<FileTreeHandle>(null)
  const scrollToItemRef = React.useRef<ScrollToItem | null>(null)
  const registerScrollToItem = React.useCallback(
    (scrollToItem: ScrollToItem | null) => {
      scrollToItemRef.current = scrollToItem
    },
    []
  )
  const resolvedEstimateSize = React.useMemo(
    () =>
      typeof estimateSize === "function"
        ? (item: unknown) => estimateSize(item as T)
        : estimateSize,
    [estimateSize]
  )
  const context = React.useMemo<VirtualizedSortableContextValue>(
    () => ({
      estimateSize: resolvedEstimateSize,
      initialViewportSize,
      onVirtualRangeChange,
      overscan: Math.max(0, Math.floor(overscan)),
      registerScrollToItem,
      scrollPadding: Math.max(0, scrollPadding),
      scrollToAlignment,
      variableSize,
    }),
    [
      initialViewportSize,
      onVirtualRangeChange,
      overscan,
      registerScrollToItem,
      resolvedEstimateSize,
      scrollPadding,
      scrollToAlignment,
      variableSize,
    ]
  )

  React.useImperativeHandle(
    forwardedRef,
    () => ({
      collapse: (id) => fileTreeRef.current?.collapse(id),
      expand: (id) => fileTreeRef.current?.expand(id),
      focus: () => fileTreeRef.current?.focus(),
      focusItem: (id) => fileTreeRef.current?.focusItem(id),
      getVisibleIds: () => fileTreeRef.current?.getVisibleIds() ?? [],
      refresh: (id) => fileTreeRef.current?.refresh(id),
      revealItem: (id) => fileTreeRef.current?.revealItem(id),
      scrollToItem: (id, options) => scrollToItemRef.current?.(id, options),
      startRename: (id) => fileTreeRef.current?.startRename(id),
      toggle: (id) => fileTreeRef.current?.toggle(id),
    }),
    []
  )

  const viewport =
    VirtualizedSortableFileTreeViewport as FileTreeViewportComponent<T>

  return (
    <VirtualizedSortableContext.Provider value={context}>
      <SortableFileTree ref={fileTreeRef} viewport={viewport} {...props} />
    </VirtualizedSortableContext.Provider>
  )
}

const VirtualizedSortableFileTree = React.forwardRef(
  VirtualizedSortableFileTreeInner
) as <T = FileTreeNode>(
  props: VirtualizedSortableFileTreeProps<T> &
    React.RefAttributes<VirtualizedSortableFileTreeHandle>
) => React.ReactElement

export { VirtualizedSortableFileTree }
