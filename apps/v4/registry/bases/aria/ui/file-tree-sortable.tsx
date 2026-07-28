"use client"

import * as React from "react"
import {
  KeyboardSensor,
  PointerActivationConstraints,
  PointerSensor,
} from "@dnd-kit/dom"
import {
  DragDropProvider,
  DragOverlay,
  type DragEndEvent,
  type DragMoveEvent,
  type DragOverEvent,
} from "@dnd-kit/react"
import { useSortable } from "@dnd-kit/react/sortable"

import {
  FileTree,
  FileTreeItem,
  FileTreeItemIcon,
  FileTreeItemLabel,
  FileTreeItemToggle,
  type FileTreeHandle,
  type FileTreeId,
  type FileTreeNode,
  type FileTreeProps,
  type FileTreeViewportComponent,
  type FileTreeViewportRenderProps,
  type FileTreeViewportRowOptions,
} from "./file-tree"
import {
  createFileTreeMoveIntent,
  getFileTreeMoveDestinations,
  normalizeFileTreeDraggedIds,
  validateFileTreeMoveIntent,
  type FileTreeMoveInput,
  type FileTreeMoveIntent,
  type FileTreeMovePosition,
  type FileTreeOrderMode,
} from "./file-tree-sortable-core"

const ROOT_GROUP = "__file-tree-root__"
const DND_TYPE = "file-tree-item"
const FILE_TREE_SORTABLE_PLUGINS: [] = []

export interface FileTreeMoveMessages {
  canceled: string
  dragInstructions: string
  dropped: (count: number) => string
  error: (message: string) => string
  expanded: (name: string) => string
  handleLabel: (name: string) => string
  invalid: string
  moving: (count: number) => string
  pickedUp: (name: string) => string
  rootName: string
  target: (name: string, position: FileTreeMovePosition) => string
}

const defaultFileTreeMoveMessages: FileTreeMoveMessages = {
  canceled: "Move canceled.",
  dragInstructions:
    "Press Enter or Space to pick up. Use arrow keys to choose a destination, then Enter or Space to drop. Press Escape to cancel.",
  dropped: (count) => `${count} ${count === 1 ? "item" : "items"} moved.`,
  error: (message) => `Move failed. ${message}`,
  expanded: (name) => `Expanded ${name}.`,
  handleLabel: (name) => `Move ${name}`,
  invalid: "That destination is not available.",
  moving: (count) => `Moving ${count} ${count === 1 ? "item" : "items"}.`,
  pickedUp: (name) => `Picked up ${name}.`,
  rootName: "project root",
  target: (name, position) => `Move ${position} ${name}.`,
}

export interface FileTreeMoveErrorDetails<T> {
  error: unknown
  intent: FileTreeMoveIntent<T>
}

export interface FileTreeDragPreviewProps<T> {
  count: number
  id: FileTreeId
  item: T
  name: string
}

export interface FileTreeSortableActivation {
  expandDelay?: number
  pointerDistance?: number
  touchDelay?: number
  touchTolerance?: number
}

export type SortableFileTreeProps<T = FileTreeNode> = FileTreeProps<T> & {
  activation?: FileTreeSortableActivation
  canMove?: (intent: FileTreeMoveIntent<T>) => boolean
  moveMessages?: Partial<FileTreeMoveMessages>
  onMove: (intent: FileTreeMoveIntent<T>) => void | Promise<void>
  onMoveError?: (details: FileTreeMoveErrorDetails<T>) => void
  orderMode?: FileTreeOrderMode
  renderDragPreview?: (props: FileTreeDragPreviewProps<T>) => React.ReactNode
}

interface FileTreeDndData {
  fileTreeId: FileTreeId
  item: unknown
  name: string
}

interface FileTreeSortableContextValue {
  activation: Required<FileTreeSortableActivation>
  canMove?: (intent: FileTreeMoveIntent<unknown>) => boolean
  messages: FileTreeMoveMessages
  onMove: (intent: FileTreeMoveIntent<unknown>) => void | Promise<void>
  onMoveError?: (details: FileTreeMoveErrorDetails<unknown>) => void
  orderMode: FileTreeOrderMode
  renderDragPreview?: (
    props: FileTreeDragPreviewProps<unknown>
  ) => React.ReactNode
}

const FileTreeSortableContext =
  React.createContext<FileTreeSortableContextValue | null>(null)

interface FileTreeSortableRowContextValue {
  handleRef: (element: Element | null) => void
  handleLabel: string
  instructionsId: string
  isDisabled: boolean
  isDragging: boolean
  isPending: boolean
  name: string
  onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void
}

const FileTreeSortableRowContext =
  React.createContext<FileTreeSortableRowContextValue | null>(null)

function FileTreeDropIndicator({
  children,
  position,
  ...props
}: React.ComponentProps<"span"> & { position: FileTreeMovePosition }) {
  return (
    <span
      {...props}
      data-position={position}
      data-slot="file-tree-drop-indicator"
      className="sr-only"
    >
      {children}
    </span>
  )
}

function FileTreeDragPreview({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="file-tree-drag-preview"
      className={[
        "rounded-md border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md motion-reduce:transition-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  )
}

function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
  if (typeof ref === "function") ref(value)
  else if (ref) ref.current = value
}

const FileTreeItemDragHandle = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(function FileTreeItemDragHandle(
  {
    children,
    disabled,
    onClick,
    onDoubleClick,
    onKeyDown,
    onPointerDown,
    ...props
  },
  forwardedRef
) {
  const context = React.useContext(FileTreeSortableRowContext)

  if (!context) {
    throw new Error(
      "FileTreeItemDragHandle must be used inside SortableFileTree."
    )
  }

  return (
    <button
      ref={(element) => {
        assignRef(forwardedRef, element)
        context.handleRef(element)
      }}
      type="button"
      aria-describedby={context.instructionsId}
      aria-keyshortcuts="Enter Space"
      aria-label={context.handleLabel}
      data-dragging={context.isDragging || undefined}
      data-move-pending={context.isPending || undefined}
      data-slot="file-tree-item-drag-handle"
      className="inline-flex size-6 shrink-0 touch-none items-center justify-center rounded-sm text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
      disabled={disabled || context.isDisabled || context.isPending}
      onClick={(event) => {
        event.stopPropagation()
        onClick?.(event)
      }}
      onDoubleClick={(event) => {
        event.stopPropagation()
        onDoubleClick?.(event)
      }}
      onKeyDown={(event) => {
        context.onKeyDown(event)
        onKeyDown?.(event)
      }}
      onPointerDown={(event) => {
        event.stopPropagation()
        onPointerDown?.(event)
      }}
      {...props}
    >
      {children ?? (
        <>
          <span aria-hidden="true">⠿</span>
          <span className="sr-only">{context.name}</span>
        </>
      )}
    </button>
  )
})

interface DropPreview {
  id: FileTreeId
  intent: FileTreeMoveIntent<unknown>
  position: FileTreeMovePosition
  valid: boolean
}

function getMoveInput(event: Event | null): FileTreeMoveInput {
  if (
    event &&
    "pointerType" in event &&
    typeof event.pointerType === "string"
  ) {
    return event.pointerType === "touch" ? "touch" : "pointer"
  }
  return "keyboard"
}

function createTargetIntent(
  props: FileTreeViewportRenderProps<unknown>,
  draggedIds: readonly FileTreeId[],
  targetId: FileTreeId,
  input: FileTreeMoveInput,
  position: { x: number; y: number }
) {
  const targetNode = props.tree.nodes.get(targetId)
  if (!targetNode) return undefined

  const targetElement = props.getItemElement(targetId)
  const rect = targetElement?.getBoundingClientRect()
  const relativeY =
    rect && rect.height > 0 ? (position.y - rect.top) / rect.height : 0.5
  const canMoveInside =
    targetNode.type === "folder" && props.canDropOnItem(targetNode.id)
  const targetPosition: FileTreeMovePosition =
    canMoveInside && relativeY >= 0.3 && relativeY <= 0.7
      ? "inside"
      : relativeY < 0.5
        ? "before"
        : "after"

  if (targetPosition === "inside") {
    const childIds = targetNode.childIds ?? []
    const draggedIdSet = new Set(draggedIds)
    const index = childIds.filter((id) => !draggedIdSet.has(id)).length
    return createFileTreeMoveIntent(
      props.tree,
      draggedIds,
      {
        index,
        itemId: targetNode.id,
        parentId: targetNode.id,
        position: "inside",
      },
      input
    )
  }

  const siblingIds =
    targetNode.parentId === null
      ? props.tree.rootIds
      : (props.tree.nodes.get(targetNode.parentId)?.childIds ?? [])
  const draggedIdSet = new Set(draggedIds)
  const remainingIds = siblingIds.filter((id) => !draggedIdSet.has(id))
  const targetIndex = remainingIds.indexOf(targetNode.id)
  if (targetIndex === -1) return undefined

  return createFileTreeMoveIntent(
    props.tree,
    draggedIds,
    {
      index: targetIndex + (targetPosition === "after" ? 1 : 0),
      itemId: targetNode.id,
      parentId: targetNode.parentId,
      position: targetPosition,
    },
    input
  )
}

function SortableFileTreeRow({
  index,
  isPending,
  keyboardSourceIds,
  messages,
  node,
  onKeyboardDragKeyDown,
  preview,
  props,
  rowOptions,
}: {
  index: number
  isPending: boolean
  keyboardSourceIds: readonly FileTreeId[]
  messages: FileTreeMoveMessages
  node: FileTreeViewportRenderProps<unknown>["visibleNodes"][number]
  onKeyboardDragKeyDown: (
    event: React.KeyboardEvent<HTMLButtonElement>,
    sourceId: FileTreeId
  ) => void
  preview: DropPreview | undefined
  props: FileTreeViewportRenderProps<unknown>
  rowOptions?: FileTreeViewportRowOptions
}) {
  const generatedId = React.useId()
  const canMoveItem = props.canMoveItem
  const isDisabled = !canMoveItem(node.id)
  const sortable = useSortable<FileTreeDndData>({
    accept: DND_TYPE,
    data: { fileTreeId: node.id, item: node.item, name: node.name },
    disabled: {
      draggable: isDisabled || isPending,
      droppable: false,
    },
    group: node.parentId ?? ROOT_GROUP,
    id: node.id,
    index: node.index,
    plugins: FILE_TREE_SORTABLE_PLUGINS,
    transition: null,
    type: DND_TYPE,
  })
  const isDragging = sortable.isDragging || keyboardSourceIds.includes(node.id)
  const isPreviewTarget = preview?.id === node.id
  const context = React.useMemo<FileTreeSortableRowContextValue>(
    () => ({
      handleRef: sortable.handleRef,
      handleLabel: messages.handleLabel(node.name),
      instructionsId: generatedId,
      isDisabled,
      isDragging,
      isPending,
      name: node.name,
      onKeyDown: (event) => onKeyboardDragKeyDown(event, node.id),
    }),
    [
      generatedId,
      isDisabled,
      isPending,
      messages,
      node.id,
      node.name,
      onKeyboardDragKeyDown,
      sortable.handleRef,
      isDragging,
    ]
  )

  return (
    <FileTreeSortableRowContext.Provider value={context}>
      {props.renderRow(node.id, {
        ...rowOptions,
        className: [
          "relative motion-reduce:transition-none data-[drop-position=before]:before:absolute data-[drop-position=before]:before:inset-x-0 data-[drop-position=before]:before:top-0 data-[drop-position=before]:before:h-0.5 data-[drop-position=before]:before:bg-primary data-[drop-position=after]:after:absolute data-[drop-position=after]:after:inset-x-0 data-[drop-position=after]:after:bottom-0 data-[drop-position=after]:after:h-0.5 data-[drop-position=after]:after:bg-primary data-[drop-position=inside]:ring-2 data-[drop-position=inside]:ring-primary/60",
          rowOptions?.className,
        ]
          .filter(Boolean)
          .join(" "),
        flat: true,
        measureElement: (element) => {
          sortable.ref(element)
          rowOptions?.measureElement?.(element)
        },
        moveState: {
          ...rowOptions?.moveState,
          dragging: isDragging,
          pending: isPending,
          position: isPreviewTarget ? preview.position : undefined,
          source: sortable.isDragSource || keyboardSourceIds.includes(node.id),
          target: isPreviewTarget,
          invalid: isPreviewTarget && !preview.valid,
        },
        virtualIndex: rowOptions?.virtualIndex ?? index,
      })}
      {isPreviewTarget && (
        <FileTreeDropIndicator position={preview.position}>
          {preview.valid
            ? messages.target(node.name, preview.position)
            : messages.invalid}
        </FileTreeDropIndicator>
      )}
      <span id={generatedId} className="sr-only">
        {messages.dragInstructions}
      </span>
    </FileTreeSortableRowContext.Provider>
  )
}

interface KeyboardDragState {
  draggedIds: readonly FileTreeId[]
  intents: readonly FileTreeMoveIntent<unknown>[]
  sourceId: FileTreeId
  targetIndex: number
}

export interface FileTreeSortableViewportState {
  pendingIds: readonly FileTreeId[]
  pinnedIds: readonly FileTreeId[]
  renderSortableRow: (
    node: FileTreeViewportRenderProps<unknown>["visibleNodes"][number],
    index: number,
    options?: FileTreeViewportRowOptions
  ) => React.ReactNode
  targetId: FileTreeId | undefined
}

export interface FileTreeSortableViewportRootProps {
  children: (state: FileTreeSortableViewportState) => React.ReactNode
  props: FileTreeViewportRenderProps<unknown>
}

function FileTreeSortableViewportRoot({
  children,
  props,
}: FileTreeSortableViewportRootProps) {
  const context = React.useContext(FileTreeSortableContext)
  const [preview, setPreview] = React.useState<DropPreview>()
  const [pointerSourceIds, setPointerSourceIds] = React.useState<
    readonly FileTreeId[]
  >([])
  const [keyboardDrag, setKeyboardDrag] = React.useState<KeyboardDragState>()
  const [pendingIds, setPendingIds] = React.useState<readonly FileTreeId[]>([])
  const expandTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const expandTargetId = React.useRef<FileTreeId | undefined>(undefined)
  const autoExpandedIds = React.useRef(new Set<FileTreeId>())

  if (!context) {
    throw new Error(
      "FileTreeSortableViewportRoot must be rendered by SortableFileTree."
    )
  }

  const sensors = React.useMemo(
    () => [
      PointerSensor.configure({
        activationConstraints(event) {
          if (event.pointerType === "touch") {
            return [
              new PointerActivationConstraints.Delay({
                tolerance: {
                  x: context.activation.touchTolerance,
                  y: context.activation.touchTolerance,
                },
                value: context.activation.touchDelay,
              }),
            ]
          }
          return [
            new PointerActivationConstraints.Distance({
              value: context.activation.pointerDistance,
            }),
          ]
        },
      }),
    ],
    [context.activation]
  )
  const getDraggedIds = React.useCallback(
    (sourceId: FileTreeId) =>
      normalizeFileTreeDraggedIds(
        props.tree,
        props.selectedIds.includes(sourceId) ? props.selectedIds : [sourceId]
      ),
    [props.selectedIds, props.tree]
  )
  const itemIds = React.useMemo(() => {
    const ids = new Map<unknown, FileTreeId>()
    props.tree.nodes.forEach((node) => {
      if (!ids.has(node.item)) ids.set(node.item, node.id)
    })
    return ids
  }, [props.tree.nodes])
  const getItemId = React.useCallback(
    (item: unknown) => itemIds.get(item),
    [itemIds]
  )
  const validationOptions = React.useMemo(
    () => ({
      canDropOnItem: (item: unknown) =>
        props.canDropOnItem(getItemId(item) ?? ""),
      canMove: context.canMove,
      canMoveItem: (item: unknown) => props.canMoveItem(getItemId(item) ?? ""),
      orderMode: context.orderMode,
    }),
    [context.canMove, context.orderMode, getItemId, props]
  )
  const clearExpandTimer = React.useCallback(() => {
    if (expandTimer.current) clearTimeout(expandTimer.current)
    expandTimer.current = null
    expandTargetId.current = undefined
  }, [])
  const restoreAutoExpanded = React.useCallback(() => {
    autoExpandedIds.current.forEach((id) => props.collapseItem(id))
    autoExpandedIds.current.clear()
  }, [props])

  React.useEffect(
    () => () => {
      clearExpandTimer()
    },
    [clearExpandTimer]
  )

  const resolvePreview = React.useCallback(
    (
      event: DragMoveEvent | DragOverEvent | DragEndEvent
    ): DropPreview | undefined => {
      const source = event.operation.source
      const target = event.operation.target
      if (!source || !target) return undefined

      const sourceId = String(source.id)
      const targetId = String(target.id)
      const position =
        event.operation.shape?.current?.center ??
        event.operation.position.current
      const intent = createTargetIntent(
        props,
        getDraggedIds(sourceId),
        targetId,
        getMoveInput(event.operation.activatorEvent),
        position
      )
      if (!intent) return undefined

      return {
        id: targetId,
        intent,
        position: intent.target.position,
        valid: validateFileTreeMoveIntent(props.tree, intent, validationOptions)
          .valid,
      }
    },
    [getDraggedIds, props, validationOptions]
  )
  const announceIntent = React.useCallback(
    (intent: FileTreeMoveIntent<unknown>) => {
      const targetId = intent.target.itemId ?? intent.target.parentId
      const targetName = targetId
        ? (props.tree.nodes.get(targetId)?.name ?? targetId)
        : context.messages.rootName
      props.announce(
        context.messages.target(targetName, intent.target.position)
      )
    },
    [context.messages, props]
  )
  const scheduleAutoExpand = React.useCallback(
    (nextPreview: DropPreview | undefined) => {
      const targetNode = nextPreview
        ? props.tree.nodes.get(nextPreview.id)
        : undefined
      const shouldExpand =
        nextPreview?.valid &&
        nextPreview.position === "inside" &&
        targetNode?.type === "folder" &&
        !props.expandedIds.includes(targetNode.id)

      if (!shouldExpand || !targetNode) {
        clearExpandTimer()
        return
      }
      if (expandTargetId.current === targetNode.id) return

      clearExpandTimer()
      expandTargetId.current = targetNode.id
      expandTimer.current = setTimeout(() => {
        autoExpandedIds.current.add(targetNode.id)
        props.expandItem(targetNode.id)
        props.announce(context.messages.expanded(targetNode.name))
        clearExpandTimer()
      }, context.activation.expandDelay)
    },
    [clearExpandTimer, context.activation.expandDelay, context.messages, props]
  )
  const commitMove = React.useCallback(
    async (
      intent: FileTreeMoveIntent<unknown>,
      suspension?: { abort: () => void; resume: () => void }
    ) => {
      setPendingIds(intent.draggedIds)
      setKeyboardDrag(undefined)
      props.sendOperationEvent({ type: "startPendingMove" })
      props.announce(context.messages.moving(intent.draggedIds.length))

      try {
        await context.onMove(intent)
        suspension?.resume()
        autoExpandedIds.current.clear()
        props.sendOperationEvent({ type: "finish" })
        props.announce(context.messages.dropped(intent.draggedIds.length))
      } catch (error) {
        suspension?.abort()
        restoreAutoExpanded()
        props.sendOperationEvent({ type: "cancel" })
        const message = error instanceof Error ? error.message : String(error)
        props.announce(context.messages.error(message))
        context.onMoveError?.({ error, intent })
      } finally {
        setPendingIds([])
      }
    },
    [context, props, restoreAutoExpanded]
  )
  const cancelMove = React.useCallback(() => {
    clearExpandTimer()
    restoreAutoExpanded()
    setKeyboardDrag(undefined)
    setPointerSourceIds([])
    setPreview(undefined)
    props.sendOperationEvent({ type: "cancel" })
    props.announce(context.messages.canceled)
  }, [clearExpandTimer, context.messages.canceled, props, restoreAutoExpanded])
  const handleDragUpdate = React.useCallback(
    (event: DragMoveEvent | DragOverEvent) => {
      const nextPreview = resolvePreview(event)
      scheduleAutoExpand(nextPreview)
      if (
        preview?.id !== nextPreview?.id ||
        preview?.position !== nextPreview?.position ||
        preview?.valid !== nextPreview?.valid
      ) {
        if (nextPreview?.valid) announceIntent(nextPreview.intent)
        setPreview(nextPreview)
      }
    },
    [announceIntent, preview, resolvePreview, scheduleAutoExpand]
  )
  const handleDragEnd = React.useCallback(
    async (event: DragEndEvent) => {
      clearExpandTimer()
      setPointerSourceIds([])
      if (event.canceled) {
        cancelMove()
        return
      }

      const resolved = resolvePreview(event) ?? preview
      setPreview(undefined)
      if (!resolved?.valid) {
        restoreAutoExpanded()
        props.sendOperationEvent({ type: "cancel" })
        props.announce(context.messages.invalid)
        return
      }
      await commitMove(resolved.intent, event.suspend())
    },
    [
      cancelMove,
      clearExpandTimer,
      commitMove,
      context.messages.invalid,
      preview,
      props,
      resolvePreview,
      restoreAutoExpanded,
    ]
  )
  const handleKeyboardDragKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, sourceId: FileTreeId) => {
      if (!keyboardDrag) {
        if (
          (event.key !== "Enter" && event.key !== " ") ||
          event.repeat ||
          props.operationMode !== "idle" ||
          !props.canMoveItem(sourceId)
        ) {
          return
        }
        const draggedIds = getDraggedIds(sourceId)
        const intents = getFileTreeMoveDestinations(
          props.tree,
          draggedIds,
          validationOptions
        ).flatMap((destination) =>
          destination.positions.map((position) => position.intent)
        )
        if (intents.length === 0) {
          props.announce(context.messages.invalid)
          return
        }

        const sourceNode = props.tree.nodes.get(sourceId)
        const sourceSiblings =
          sourceNode?.parentId === null
            ? props.tree.rootIds
            : (props.tree.nodes.get(sourceNode?.parentId ?? "")?.childIds ?? [])
        const draggedIdSet = new Set(draggedIds)
        const sourceIndex = sourceSiblings
          .slice(0, sourceNode?.index ?? 0)
          .filter((id) => !draggedIdSet.has(id)).length
        const initialIndex = Math.max(
          0,
          intents.findIndex(
            (intent) =>
              intent.target.parentId === sourceNode?.parentId &&
              intent.target.index === sourceIndex
          )
        )
        const next = {
          draggedIds,
          intents,
          sourceId,
          targetIndex: initialIndex,
        }
        event.preventDefault()
        props.sendOperationEvent({ type: "startKeyboardDrag" })
        props.announce(context.messages.pickedUp(sourceNode?.name ?? sourceId))
        announceIntent(intents[initialIndex] as FileTreeMoveIntent<unknown>)
        setKeyboardDrag(next)
        return
      }

      if (keyboardDrag.sourceId !== sourceId) return
      if (event.key === "Escape") {
        event.preventDefault()
        cancelMove()
        return
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        const intent = keyboardDrag.intents[keyboardDrag.targetIndex]
        if (intent) void commitMove(intent)
        return
      }

      const currentIntent = keyboardDrag.intents[keyboardDrag.targetIndex]
      const currentParentLevel = currentIntent?.target.parentId
        ? (props.tree.nodes.get(currentIntent.target.parentId)?.level ?? 0)
        : 0
      let targetIndex = keyboardDrag.targetIndex
      if (event.key === "ArrowDown") targetIndex += 1
      else if (event.key === "ArrowUp") targetIndex -= 1
      else if (event.key === "Home") targetIndex = 0
      else if (event.key === "End")
        targetIndex = keyboardDrag.intents.length - 1
      else if (event.key === "ArrowRight") {
        const found = keyboardDrag.intents.findIndex(
          (intent, index) =>
            index > keyboardDrag.targetIndex &&
            (intent.target.parentId
              ? (props.tree.nodes.get(intent.target.parentId)?.level ?? 0)
              : 0) > currentParentLevel
        )
        if (found !== -1) targetIndex = found
      } else if (event.key === "ArrowLeft") {
        for (let index = keyboardDrag.targetIndex - 1; index >= 0; index -= 1) {
          const intent = keyboardDrag.intents[index]
          const level = intent?.target.parentId
            ? (props.tree.nodes.get(intent.target.parentId)?.level ?? 0)
            : 0
          if (level < currentParentLevel) {
            targetIndex = index
            break
          }
        }
      } else {
        return
      }

      event.preventDefault()
      targetIndex = Math.max(
        0,
        Math.min(keyboardDrag.intents.length - 1, targetIndex)
      )
      if (targetIndex === keyboardDrag.targetIndex) {
        props.announce(context.messages.invalid)
        return
      }
      const intent = keyboardDrag.intents[targetIndex]
      if (!intent) return
      announceIntent(intent)
      setKeyboardDrag({ ...keyboardDrag, targetIndex })
    },
    [
      announceIntent,
      cancelMove,
      commitMove,
      context.messages,
      getDraggedIds,
      keyboardDrag,
      props,
      validationOptions,
    ]
  )
  const keyboardIntent = keyboardDrag?.intents[keyboardDrag.targetIndex]
  const keyboardTargetId =
    keyboardIntent?.target.itemId ?? keyboardIntent?.target.parentId
  const keyboardPreview =
    keyboardIntent && keyboardTargetId
      ? {
          id: keyboardTargetId,
          intent: keyboardIntent,
          position: keyboardIntent.target.position,
          valid: true,
        }
      : undefined
  const resolvedPreview = preview ?? keyboardPreview
  const pinnedIds = Array.from(
    new Set([
      ...props.pinnedIds,
      ...pointerSourceIds,
      ...(keyboardDrag?.draggedIds ?? []),
      ...pendingIds,
      ...(keyboardTargetId ? [keyboardTargetId] : []),
    ])
  )
  const renderSortableRow = React.useCallback(
    (
      node: FileTreeViewportRenderProps<unknown>["visibleNodes"][number],
      index: number,
      options?: FileTreeViewportRowOptions
    ) => (
      <SortableFileTreeRow
        key={node.id}
        index={index}
        isPending={pendingIds.includes(node.id)}
        keyboardSourceIds={keyboardDrag?.draggedIds ?? []}
        messages={context.messages}
        node={node}
        onKeyboardDragKeyDown={handleKeyboardDragKeyDown}
        preview={resolvedPreview}
        props={props}
        rowOptions={options}
      />
    ),
    [
      context.messages,
      handleKeyboardDragKeyDown,
      keyboardDrag?.draggedIds,
      pendingIds,
      props,
      resolvedPreview,
    ]
  )

  return (
    <DragDropProvider
      sensors={(defaults) => [
        ...defaults.filter(
          (sensor) => sensor !== PointerSensor && sensor !== KeyboardSensor
        ),
        ...sensors,
      ]}
      onBeforeDragStart={(event) => {
        const sourceId = event.operation.source?.id
        if (
          props.operationMode !== "idle" ||
          sourceId === null ||
          sourceId === undefined ||
          !props.canMoveItem(String(sourceId))
        ) {
          event.preventDefault()
        }
      }}
      onDragStart={(event) => {
        const source = event.operation.source
        if (!source) return
        const sourceId = String(source.id)
        setPointerSourceIds(getDraggedIds(sourceId))
        props.sendOperationEvent({ type: "startPointerDrag" })
        props.announce(
          context.messages.pickedUp(
            String((source.data as FileTreeDndData).name ?? source.id)
          )
        )
      }}
      onDragMove={handleDragUpdate}
      onDragOver={handleDragUpdate}
      onDragEnd={(event) => void handleDragEnd(event)}
    >
      {children({
        pendingIds,
        pinnedIds,
        renderSortableRow,
        targetId: resolvedPreview?.id,
      })}
      <DragOverlay>
        {(source) => {
          const data = source.data as FileTreeDndData
          return context.renderDragPreview ? (
            context.renderDragPreview({
              count: pointerSourceIds.length,
              id: String(source.id),
              item: data.item,
              name: String(data.name ?? source.id),
            })
          ) : (
            <FileTreeDragPreview>
              {String(data.name ?? source.id)}
            </FileTreeDragPreview>
          )
        }}
      </DragOverlay>
    </DragDropProvider>
  )
}

function SortableFileTreeViewport(props: FileTreeViewportRenderProps<unknown>) {
  return (
    <FileTreeSortableViewportRoot props={props}>
      {({ renderSortableRow }) => (
        <div
          role="none"
          data-slot="file-tree-sortable-viewport"
          className="relative"
        >
          {props.visibleNodes.map((node, index) =>
            renderSortableRow(node, index)
          )}
        </div>
      )}
    </FileTreeSortableViewportRoot>
  )
}

function SortableFileTreeInner<T = FileTreeNode>(
  {
    activation,
    canMove,
    children,
    moveMessages,
    onMove,
    onMoveError,
    orderMode = "manual",
    renderDragPreview,
    viewport: viewportProp,
    ...props
  }: SortableFileTreeProps<T>,
  forwardedRef: React.ForwardedRef<FileTreeHandle>
) {
  const messages = React.useMemo(
    () => ({ ...defaultFileTreeMoveMessages, ...moveMessages }),
    [moveMessages]
  )
  const context = React.useMemo<FileTreeSortableContextValue>(
    () => ({
      activation: {
        expandDelay: activation?.expandDelay ?? 700,
        pointerDistance: activation?.pointerDistance ?? 5,
        touchDelay: activation?.touchDelay ?? 250,
        touchTolerance: activation?.touchTolerance ?? 5,
      },
      canMove: canMove
        ? (intent) => canMove(intent as FileTreeMoveIntent<T>)
        : undefined,
      messages,
      onMove: (intent) => onMove(intent as FileTreeMoveIntent<T>),
      onMoveError: onMoveError
        ? (details) => onMoveError(details as FileTreeMoveErrorDetails<T>)
        : undefined,
      orderMode,
      renderDragPreview: renderDragPreview
        ? (previewProps) =>
            renderDragPreview(previewProps as FileTreeDragPreviewProps<T>)
        : undefined,
    }),
    [
      activation,
      canMove,
      messages,
      onMove,
      onMoveError,
      orderMode,
      renderDragPreview,
    ]
  )
  const viewport =
    viewportProp ?? (SortableFileTreeViewport as FileTreeViewportComponent<T>)
  const defaultChildren = React.useCallback(
    () => (
      <FileTreeItem>
        <FileTreeItemToggle />
        <FileTreeItemIcon />
        <FileTreeItemLabel />
        <FileTreeItemDragHandle />
      </FileTreeItem>
    ),
    []
  )

  return (
    <FileTreeSortableContext.Provider value={context}>
      <FileTree ref={forwardedRef} viewport={viewport} {...props}>
        {children ?? defaultChildren}
      </FileTree>
    </FileTreeSortableContext.Provider>
  )
}

const SortableFileTree = React.forwardRef(SortableFileTreeInner) as <
  T = FileTreeNode,
>(
  props: SortableFileTreeProps<T> & React.RefAttributes<FileTreeHandle>
) => React.ReactElement

export {
  FileTreeItemDragHandle,
  FileTreeDragPreview,
  FileTreeDropIndicator,
  FileTreeSortableViewportRoot,
  SortableFileTree,
  defaultFileTreeMoveMessages,
}
