"use client"

import * as React from "react"
import {
  defaultRangeExtractor,
  useVirtualizer,
  type Range,
} from "@tanstack/react-virtual"

import {
  FileTree,
  type FileTreeHandle,
  type FileTreeId,
  type FileTreeNode,
  type FileTreeProps,
  type FileTreeViewportComponent,
  type FileTreeViewportRenderProps,
} from "./file-tree"

export interface FileTreeVirtualRange {
  endIndex: number
  startIndex: number
  visibleIds: readonly FileTreeId[]
}

export type VirtualizedFileTreeProps<T = FileTreeNode> = Omit<
  FileTreeProps<T>,
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

export interface VirtualizedFileTreeHandle extends FileTreeHandle {
  scrollToItem: (
    id: FileTreeId,
    options?: { align?: "start" | "center" | "end" | "auto" }
  ) => void
}

type ScrollToItem = VirtualizedFileTreeHandle["scrollToItem"]

interface VirtualizedFileTreeContextValue {
  estimateSize?: number | ((item: unknown) => number)
  initialViewportSize?: { height: number; width: number }
  onVirtualRangeChange?: (range: FileTreeVirtualRange) => void
  overscan: number
  registerScrollToItem: (scrollToItem: ScrollToItem | null) => void
  scrollPadding: number
  scrollToAlignment: "start" | "center" | "end" | "auto"
  variableSize: boolean
}

const VirtualizedFileTreeContext =
  React.createContext<VirtualizedFileTreeContextValue | null>(null)

function nextAnimationFrame() {
  return new Promise<void>((resolve) => {
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => resolve())
    } else {
      setTimeout(resolve, 0)
    }
  })
}

function VirtualizedFileTreeViewport({
  density,
  focusedId,
  getItemElement,
  pinnedIds,
  registerViewportAdapter,
  renderRow,
  treeElement,
  visibleNodes,
}: FileTreeViewportRenderProps<unknown>) {
  const context = React.useContext(VirtualizedFileTreeContext)

  if (!context) {
    throw new Error(
      "VirtualizedFileTreeViewport must be rendered by VirtualizedFileTree."
    )
  }

  const configuredEstimateSize = context.estimateSize

  const getItemKey = React.useCallback(
    (index: number) => visibleNodes[index]?.id ?? index,
    [visibleNodes]
  )
  const estimateSize = React.useCallback(
    (index: number) => {
      const node = visibleNodes[index]
      if (typeof configuredEstimateSize === "function" && node) {
        return configuredEstimateSize(node.item)
      }
      if (typeof configuredEstimateSize === "number") {
        return configuredEstimateSize
      }
      return density === "compact" ? 28 : 32
    },
    [configuredEstimateSize, density, visibleNodes]
  )
  const pinnedIndexes = React.useMemo(
    () =>
      pinnedIds.flatMap((id) => {
        const index = visibleNodes.findIndex((node) => node.id === id)
        return index === -1 ? [] : [index]
      }),
    [pinnedIds, visibleNodes]
  )
  const rangeExtractor = React.useCallback(
    (range: Range) =>
      Array.from(
        new Set([...defaultRangeExtractor(range), ...pinnedIndexes])
      ).sort((a, b) => a - b),
    [pinnedIndexes]
  )

  const virtualizer = useVirtualizer({
    count: visibleNodes.length,
    estimateSize,
    getItemKey,
    getScrollElement: () => treeElement,
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
      const index = visibleNodes.findIndex((node) => node.id === id)
      if (index === -1) return
      virtualizer.scrollToIndex(index, {
        align: options?.align ?? context.scrollToAlignment,
        behavior: "auto",
      })
    },
    [context, virtualizer, visibleNodes]
  )

  const adapter = React.useMemo(
    () => ({
      ensureRendered: async (id: FileTreeId) => {
        scrollToItem(id)
        for (let attempt = 0; attempt < 5; attempt += 1) {
          if (getItemElement(id)) return
          await nextAnimationFrame()
        }
      },
      focusElement: (id: FileTreeId) => getItemElement(id)?.focus(),
      scrollToItem,
    }),
    [getItemElement, scrollToItem]
  )

  React.useLayoutEffect(() => {
    registerViewportAdapter(adapter)
    context.registerScrollToItem(scrollToItem)

    return () => {
      registerViewportAdapter(null)
      context.registerScrollToItem(null)
    }
  }, [
    adapter,
    context,
    context.registerScrollToItem,
    registerViewportAdapter,
    scrollToItem,
  ])

  const virtualItems = virtualizer.getVirtualItems()
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
        const id = visibleNodes[virtualItem.index]?.id
        return id ? [id] : []
      }),
    })
  }, [context, rangeKey, virtualItems, visibleNodes])

  return (
    <div
      role="none"
      data-slot="file-tree-virtual-viewport"
      data-focused-id={focusedId}
      style={{
        height: `${virtualizer.getTotalSize()}px`,
        position: "relative",
        width: "100%",
      }}
    >
      {virtualItems.map((virtualItem) => {
        const node = visibleNodes[virtualItem.index]
        if (!node) return null

        return renderRow(node.id, {
          flat: true,
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

function VirtualizedFileTreeInner<T = FileTreeNode>(
  {
    estimateSize,
    initialViewportSize,
    onVirtualRangeChange,
    overscan = 8,
    scrollPadding = 0,
    scrollToAlignment = "auto",
    variableSize = false,
    ...props
  }: VirtualizedFileTreeProps<T>,
  forwardedRef: React.ForwardedRef<VirtualizedFileTreeHandle>
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
  const context = React.useMemo<VirtualizedFileTreeContextValue>(
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

  const viewport = VirtualizedFileTreeViewport as FileTreeViewportComponent<T>

  return (
    <VirtualizedFileTreeContext.Provider value={context}>
      <FileTree ref={fileTreeRef} viewport={viewport} {...props} />
    </VirtualizedFileTreeContext.Provider>
  )
}

const VirtualizedFileTree = React.forwardRef(VirtualizedFileTreeInner) as <
  T = FileTreeNode,
>(
  props: VirtualizedFileTreeProps<T> &
    React.RefAttributes<VirtualizedFileTreeHandle>
) => React.ReactElement

export { VirtualizedFileTree }
