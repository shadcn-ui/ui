"use client"

import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/bases/base/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

import {
  createFileTreeControllerSnapshot,
  getFileTreeEnabledId,
  getFileTreeFocusRecoveryId,
  getFileTreePageTargetId,
  isFileTreeOperationAvailable,
  transitionFileTreeOperationMode,
  type FileTreeOperationEvent,
  type FileTreeOperationMode,
  type FileTreeViewportAdapter,
} from "./file-tree-controller"
import {
  createDefaultFileTreeAccessors,
  findFileTreeTypeaheadMatch,
  getFileTreeAncestors,
  getFileTreeRange,
  getFileTreeSiblingIds,
  isFileTreeDescendant,
  normalizeFileTree,
  type FileTreeAccessors,
  type FileTreeId,
  type FileTreeItemType,
  type FileTreeNode,
  type NormalizedFileTree,
  type NormalizedFileTreeNode,
} from "./file-tree-core"
import {
  FILE_TREE_BASE_COMMAND_ORDER,
  getFileTreeShortcutCommand,
  matchFileTreeShortcut,
  resolveFileTreeShortcuts,
  validateFileTreeShortcutCommands,
  warnFileTreeShortcutConflicts,
  type FileTreeResolvedPlatform,
  type FileTreeShortcutBinding,
  type FileTreeShortcutConfig,
} from "./file-tree-shortcuts"

export {
  createFileTreeMoveIntent,
  getFileTreeMoveDestinations,
  moveFileTreeNodes,
  normalizeFileTreeDraggedIds,
  validateFileTreeMoveIntent,
} from "./file-tree-sortable-core"
export type {
  FileTreeMoveDestination,
  FileTreeMoveDestinationPosition,
  FileTreeMoveInput,
  FileTreeMoveIntent,
  FileTreeMovePosition,
  FileTreeMoveTarget,
  FileTreeMoveValidationError,
  FileTreeMoveValidationErrorCode,
  FileTreeMoveValidationOptions,
  FileTreeMoveValidationResult,
  FileTreeOrderMode,
} from "./file-tree-sortable-core"

export type {
  FileTreeAccessors,
  FileTreeId,
  FileTreeItemType,
  FileTreeNode,
  NormalizedFileTree,
  NormalizedFileTreeNode,
} from "./file-tree-core"
export {
  createFileTreeControllerSnapshot,
  getFileTreeEnabledId,
  getFileTreeFocusRecoveryId,
  getFileTreePageTargetId,
  getNextFileTreeEnabledId,
  isFileTreeOperationAvailable,
  transitionFileTreeOperationMode,
} from "./file-tree-controller"
export type {
  FileTreeControllerSnapshot,
  FileTreeFocusRecoveryOptions,
  FileTreeOperationEvent,
  FileTreeOperationMode,
  FileTreeViewportAdapter,
} from "./file-tree-controller"
export {
  FILE_TREE_BUILTIN_COMMAND_IDS,
  FILE_TREE_DEFAULT_SHORTCUTS,
  getFileTreeAriaKeyShortcuts,
  getFileTreeShortcutCommand,
  getFileTreeShortcutLabel,
  matchFileTreeShortcut,
  resolveFileTreePlatform,
  resolveFileTreeShortcutMap,
  resolveFileTreeShortcuts,
  validateFileTreeShortcutCommands,
} from "./file-tree-shortcuts"
export type {
  FileTreeBuiltinCommandId,
  FileTreePlatform,
  FileTreeResolvedPlatform,
  FileTreeResolvedShortcutMap,
  FileTreeShortcut,
  FileTreeShortcutBinding,
  FileTreeShortcutConfig,
  FileTreeShortcutConflict,
  FileTreeShortcutConflictReason,
} from "./file-tree-shortcuts"

export type FileTreeSelectionMode = "none" | "single" | "multiple"
export type FileTreeActivationMode = "singleClick" | "doubleClick"
export type FileTreeDensity = "default" | "compact"
export type FileTreeChangeReason =
  | "pointer"
  | "keyboard"
  | "imperative"
  | "data-change"

export type FileTreeOriginalEvent = React.SyntheticEvent<HTMLElement>

export type FileTreeCapability<T> = boolean | ((item: T) => boolean)

export interface FileTreeChangeDetails<T> {
  item: T | null
  reason: FileTreeChangeReason
  originalEvent?: FileTreeOriginalEvent
}

export interface FileTreeActionDetails<T> extends FileTreeChangeDetails<T> {
  id: FileTreeId
  type: FileTreeItemType
}

export interface FileTreeLoadContext<T> {
  id: FileTreeId
  item: T
  signal: AbortSignal
}

export interface FileTreeLoadErrorDetails<T> {
  id: FileTreeId
  item: T
  error: unknown
}

export interface FileTreeRenameDetails<T> {
  id: FileTreeId
  item: T
  name: string
  previousName: string
  signal: AbortSignal
}

export interface FileTreeRenameErrorDetails<T> {
  id: FileTreeId
  item: T
  name: string
  error: unknown
}

export interface FileTreeCommandContext<T> {
  focusedId: FileTreeId | undefined
  focusedItem: T | null
  selectedIds: readonly FileTreeId[]
  selectedItems: readonly T[]
  platform: FileTreeResolvedPlatform | undefined
}

export interface FileTreeCommand<T> {
  id: string
  label: string
  shortcuts?: FileTreeShortcutBinding
  allowTypeaheadConflict?: boolean
  canRun?: (context: FileTreeCommandContext<T>) => boolean
  run: (
    context: FileTreeCommandContext<T>,
    event: React.KeyboardEvent<HTMLDivElement>
  ) => void | Promise<void>
}

export interface FileTreeCommandErrorDetails<T> {
  command: FileTreeCommand<T>
  context: FileTreeCommandContext<T>
  error: unknown
}

export interface FileTreeMessages {
  empty: string
  loadingLabel: string
  loadErrorLabel: string
  renameInstructions: string
  loading: (name: string) => string
  loaded: (name: string, count: number) => string
  loadError: (name: string, message: string) => string
  renameLabel: (name: string) => string
  renaming: (name: string) => string
  renameEmpty: string
  renamed: (previousName: string, name: string) => string
  renameError: (name: string, message: string) => string
  selectedCount: (count: number) => string
}

const defaultFileTreeMessages: FileTreeMessages = {
  empty: "No files",
  loadingLabel: "Loading",
  loadErrorLabel: "Could not load",
  renameInstructions: "Press Enter to save the new name or Escape to cancel.",
  loading: (name) => `Loading ${name}`,
  loaded: (name, count) =>
    `${name} loaded, ${count} ${count === 1 ? "item" : "items"}`,
  loadError: (name, message) => `Could not load ${name}. ${message}`,
  renameLabel: (name) => `Rename ${name}`,
  renaming: (name) =>
    `Renaming ${name}. Press Enter to save or Escape to cancel.`,
  renameEmpty: "Name cannot be empty.",
  renamed: (previousName, name) => `${previousName} renamed to ${name}`,
  renameError: (name, message) => `Could not rename ${name}. ${message}`,
  selectedCount: (count) =>
    `${count} ${count === 1 ? "item" : "items"} selected`,
}

export interface FileTreeItemState {
  isActionable: boolean
  isCurrent: boolean
  isDisabled: boolean
  isDroppable: boolean
  isEditable: boolean
  isEditing: boolean
  isExpanded: boolean
  isFocused: boolean
  isFolder: boolean
  isLoading: boolean
  isMovable: boolean
  isRenamePending: boolean
  isSelectable: boolean
  isSelected: boolean
  level: number
  loadError: unknown
  renameError: string | undefined
}

export interface FileTreeItemRenderProps<T> {
  id: FileTreeId
  item: T
  name: string
  state: FileTreeItemState
}

export interface FileTreeHandle {
  collapse: (id: FileTreeId) => void
  expand: (id: FileTreeId) => void
  focus: () => void
  focusItem: (id: FileTreeId) => void
  getVisibleIds: () => readonly FileTreeId[]
  refresh: (id: FileTreeId) => void
  revealItem: (id: FileTreeId) => void
  startRename: (id: FileTreeId) => void
  toggle: (id: FileTreeId) => void
}

export interface FileTreeViewportRowOptions {
  children?: React.ReactNode
  className?: string
  flat?: boolean
  measureElement?: (element: HTMLDivElement | null) => void
  moveState?: {
    dragging?: boolean
    invalid?: boolean
    pending?: boolean
    position?: "before" | "inside" | "after"
    source?: boolean
    target?: boolean
  }
  style?: React.CSSProperties
  virtualIndex?: number
}

export interface FileTreeViewportRenderProps<T> {
  announce: (message: string) => void
  canDropOnItem: (id: FileTreeId) => boolean
  canMoveItem: (id: FileTreeId) => boolean
  collapseItem: (id: FileTreeId) => void
  density: FileTreeDensity
  expandedIds: readonly FileTreeId[]
  expandItem: (id: FileTreeId) => void
  focusedId: FileTreeId | undefined
  getItemElement: (id: FileTreeId) => HTMLDivElement | undefined
  operationMode: FileTreeOperationMode
  pinnedIds: readonly FileTreeId[]
  registerViewportAdapter: (adapter: FileTreeViewportAdapter | null) => void
  renderRow: (
    id: FileTreeId,
    options?: FileTreeViewportRowOptions
  ) => React.ReactNode
  selectedIds: readonly FileTreeId[]
  sendOperationEvent: (event: FileTreeOperationEvent) => FileTreeOperationMode
  tree: NormalizedFileTree<T>
  treeElement: HTMLDivElement | null
  visibleNodes: readonly NormalizedFileTreeNode<T>[]
}

export type FileTreeViewportComponent<T> = React.ComponentType<
  FileTreeViewportRenderProps<T>
>

export interface FileTreeProps<T = FileTreeNode>
  extends Omit<React.ComponentProps<"div">, "children" | "onChange" | "ref"> {
  items: readonly T[]
  accessors?: FileTreeAccessors<T>
  activationMode?: FileTreeActivationMode
  children?:
    | React.ReactNode
    | ((props: FileTreeItemRenderProps<T>) => React.ReactNode)
  commands?: readonly FileTreeCommand<T>[]
  commitOnBlur?: boolean
  currentId?: FileTreeId
  defaultExpandedIds?: readonly FileTreeId[]
  defaultFocusedId?: FileTreeId
  defaultSelectedIds?: readonly FileTreeId[]
  density?: FileTreeDensity
  expandedIds?: readonly FileTreeId[]
  focusedId?: FileTreeId
  indent?: number | string
  isItemActionable?: FileTreeCapability<T>
  isItemDroppable?: FileTreeCapability<T>
  isItemEditable?: FileTreeCapability<T>
  isItemMovable?: FileTreeCapability<T>
  isItemSelectable?: FileTreeCapability<T>
  loadChildren?: (context: FileTreeLoadContext<T>) => Promise<readonly T[]>
  locale?: string
  messages?: Partial<FileTreeMessages>
  onCommandError?: (details: FileTreeCommandErrorDetails<T>) => void
  onExpandedIdsChange?: (
    ids: readonly FileTreeId[],
    details: FileTreeChangeDetails<T>
  ) => void
  onFocusedIdChange?: (
    id: FileTreeId | undefined,
    details: FileTreeChangeDetails<T>
  ) => void
  onItemAction?: (item: T, details: FileTreeActionDetails<T>) => void
  onItemContextMenu?: (item: T, details: FileTreeActionDetails<T>) => void
  onLoadError?: (details: FileTreeLoadErrorDetails<T>) => void
  onRename?: (details: FileTreeRenameDetails<T>) => void | Promise<void>
  onRenameError?: (details: FileTreeRenameErrorDetails<T>) => void
  onSelectedIdsChange?: (
    ids: readonly FileTreeId[],
    details: FileTreeChangeDetails<T>
  ) => void
  renderIcon?: (props: FileTreeItemRenderProps<T>) => React.ReactNode
  selectedIds?: readonly FileTreeId[]
  selectionMode?: FileTreeSelectionMode
  shortcuts?: FileTreeShortcutConfig
  validateRename?: (
    name: string,
    item: T
  ) => string | undefined | Promise<string | undefined>
  viewport?: FileTreeViewportComponent<T>
}

type ControllableIdsSetter<T> = (
  ids: readonly FileTreeId[],
  details: FileTreeChangeDetails<T>
) => void

type ControllableValueSetter<T> = (
  value: FileTreeId | undefined,
  details: FileTreeChangeDetails<T>
) => void

interface LoadState {
  status: "loading" | "error"
  error?: unknown
}

interface InFlightLoad {
  controller: AbortController
}

interface FileTreeItemContextValue<T> {
  cancelRename: () => void
  commitOnBlur: boolean
  commitRename: () => void
  density: FileTreeDensity
  draftName: string
  isRenamePending: boolean
  messages: FileTreeMessages
  node: NormalizedFileTreeNode<T>
  renderIcon?: (props: FileTreeItemRenderProps<T>) => React.ReactNode
  renameError: string | undefined
  renameErrorId: string
  renameInstructionsId: string
  retryLoad: () => void
  setDraftName: (value: string) => void
  startRename: () => void
  state: FileTreeItemState
  toggleExpanded: (event?: React.SyntheticEvent<HTMLElement>) => void
}

const FileTreeItemContext = React.createContext<
  FileTreeItemContextValue<unknown> | undefined
>(undefined)

function useFileTreeItemContext<T>() {
  const context = React.useContext(FileTreeItemContext)

  if (!context) {
    throw new Error("FileTree item components must be used inside FileTree.")
  }

  return context as FileTreeItemContextValue<T>
}

const fileTreeVariants = cva(
  "relative w-full overflow-auto rounded-md text-sm outline-none",
  {
    variants: {
      density: {
        default: "[--file-tree-row-height:2rem]",
        compact: "text-xs [--file-tree-row-height:1.75rem]",
      },
    },
    defaultVariants: {
      density: "default",
    },
  }
)

const fileTreeItemVariants = cva(
  "group/file-tree-item flex min-h-[var(--file-tree-row-height)] w-full min-w-0 items-center gap-1 rounded-sm pe-2 text-start transition-colors outline-none select-none group-focus-visible/file-tree-row:ring-2 group-focus-visible/file-tree-row:ring-ring/50 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
  {
    variants: {
      density: {
        default: "py-1",
        compact: "py-0.5",
      },
    },
    defaultVariants: {
      density: "default",
    },
  }
)

function arraysEqual<T>(a: readonly T[], b: readonly T[]) {
  return a.length === b.length && a.every((value, index) => value === b[index])
}

function uniqueIds(ids: readonly FileTreeId[]) {
  return Array.from(new Set(ids))
}

function resolveFileTreeCapability<T>(
  capability: FileTreeCapability<T> | undefined,
  item: T,
  defaultValue: boolean
) {
  if (typeof capability === "function") return capability(item)
  return capability ?? defaultValue
}

function useControllableIds<T>(
  componentName: string,
  value: readonly FileTreeId[] | undefined,
  defaultValue: readonly FileTreeId[],
  onChange: FileTreeProps<T>["onSelectedIdsChange"]
): [
  readonly FileTreeId[],
  ControllableIdsSetter<T>,
  React.RefObject<readonly FileTreeId[]>,
] {
  const isControlled = value !== undefined
  const wasControlled = React.useRef(isControlled)
  const [uncontrolledValue, setUncontrolledValue] = React.useState(() =>
    uniqueIds(defaultValue)
  )
  const currentValue = isControlled ? uniqueIds(value) : uncontrolledValue
  const valueRef = React.useRef<readonly FileTreeId[]>(currentValue)

  React.useLayoutEffect(() => {
    valueRef.current = currentValue
  }, [currentValue])

  React.useEffect(() => {
    if (wasControlled.current !== isControlled) {
      console.warn(
        `[FileTree] ${componentName} changed from ${
          wasControlled.current ? "controlled" : "uncontrolled"
        } to ${isControlled ? "controlled" : "uncontrolled"}.`
      )
      wasControlled.current = isControlled
    }
  }, [componentName, isControlled])

  const setValue = React.useCallback<ControllableIdsSetter<T>>(
    (nextValue, details) => {
      const nextIds = uniqueIds(nextValue)
      if (arraysEqual(valueRef.current, nextIds)) return

      valueRef.current = nextIds
      if (!isControlled) setUncontrolledValue(nextIds)
      onChange?.(nextIds, details)
    },
    [isControlled, onChange]
  )

  return [currentValue, setValue, valueRef]
}

function useControllableValue<T>(
  componentName: string,
  value: FileTreeId | undefined,
  defaultValue: FileTreeId | undefined,
  onChange: FileTreeProps<T>["onFocusedIdChange"]
): [
  FileTreeId | undefined,
  ControllableValueSetter<T>,
  React.RefObject<FileTreeId | undefined>,
] {
  const isControlled = value !== undefined
  const wasControlled = React.useRef(isControlled)
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const currentValue = isControlled ? value : uncontrolledValue
  const valueRef = React.useRef<FileTreeId | undefined>(currentValue)

  React.useLayoutEffect(() => {
    valueRef.current = currentValue
  }, [currentValue])

  React.useEffect(() => {
    if (wasControlled.current !== isControlled) {
      console.warn(
        `[FileTree] ${componentName} changed from ${
          wasControlled.current ? "controlled" : "uncontrolled"
        } to ${isControlled ? "controlled" : "uncontrolled"}.`
      )
      wasControlled.current = isControlled
    }
  }, [componentName, isControlled])

  const setValue = React.useCallback<ControllableValueSetter<T>>(
    (nextValue, details) => {
      if (valueRef.current === nextValue) return

      valueRef.current = nextValue
      if (!isControlled) setUncontrolledValue(nextValue)
      onChange?.(nextValue, details)
    },
    [isControlled, onChange]
  )

  return [currentValue, setValue, valueRef]
}

function scheduleAnimationFrame(callback: () => void) {
  if (typeof window !== "undefined" && window.requestAnimationFrame) {
    window.requestAnimationFrame(callback)
  } else {
    queueMicrotask(callback)
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message
  return "Something went wrong."
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError"
}

function isInteractiveTarget(target: EventTarget | null) {
  if (typeof HTMLElement === "undefined" || !(target instanceof HTMLElement)) {
    return false
  }
  return (
    target.isContentEditable ||
    target.matches(
      'a[href], button, input, select, textarea, [role="button"], [role="link"], [role="menuitem"], [role="option"], [role="slider"], [role="switch"], [role="textbox"]'
    )
  )
}

function FileTreeItem({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  const context = useFileTreeItemContext()
  const { node, state } = context

  return (
    <div
      data-actionable={state.isActionable}
      data-current={state.isCurrent}
      data-disabled={state.isDisabled}
      data-droppable={state.isDroppable}
      data-editable={state.isEditable}
      data-editing={state.isEditing}
      data-expanded={state.isFolder ? state.isExpanded : undefined}
      data-focused={state.isFocused}
      data-loading={state.isLoading}
      data-movable={state.isMovable}
      data-selectable={state.isSelectable}
      data-selected={state.isSelected}
      data-slot="file-tree-item"
      data-type={node.type}
      className={cn(
        fileTreeItemVariants({ density: context.density }),
        className
      )}
      style={{
        paddingInlineStart: `calc(${Math.max(0, node.level - 1)} * var(--file-tree-indent))`,
        ...style,
      }}
      {...props}
    />
  )
}

function FileTreeItemToggle({
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<"span">) {
  const context = useFileTreeItemContext()
  const { state } = context

  if (!state.isFolder) {
    return (
      <span
        aria-hidden="true"
        data-slot="file-tree-item-toggle-placeholder"
        className={cn("size-7 shrink-0", className)}
        {...props}
      />
    )
  }

  return (
    <span
      {...props}
      aria-hidden="true"
      data-slot="file-tree-item-toggle"
      className={cn(
        "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        className
      )}
      onClick={(event) => {
        event.stopPropagation()
        onClick?.(event)
        if (event.defaultPrevented) return
        context.toggleExpanded(event)
      }}
    >
      {children !== undefined ? (
        children
      ) : state.isLoading ? (
        <IconPlaceholder
          lucide="Loader2Icon"
          tabler="IconLoader"
          hugeicons="Loading03Icon"
          phosphor="SpinnerIcon"
          remixicon="RiLoaderLine"
          className="size-4 animate-spin motion-reduce:animate-none"
        />
      ) : state.loadError !== undefined ? (
        <IconPlaceholder
          lucide="RefreshCcwIcon"
          tabler="IconRefresh"
          hugeicons="ReloadIcon"
          phosphor="ArrowClockwiseIcon"
          remixicon="RiRefreshLine"
          className="size-3.5"
        />
      ) : (
        <IconPlaceholder
          lucide="ChevronRightIcon"
          tabler="IconChevronRight"
          hugeicons="ArrowRight01Icon"
          phosphor="CaretRightIcon"
          remixicon="RiArrowRightSLine"
          className={cn(
            "size-4 transition-transform motion-reduce:transition-none",
            state.isExpanded && "rotate-90 rtl:-rotate-90"
          )}
        />
      )}
    </span>
  )
}

function FileTreeItemIcon({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  const context = useFileTreeItemContext()
  const { node, state } = context
  const renderProps: FileTreeItemRenderProps<unknown> = {
    id: node.id,
    item: node.item,
    name: node.name,
    state,
  }

  let icon =
    children !== undefined ? children : context.renderIcon?.(renderProps)

  if (icon === undefined) {
    icon = state.isFolder ? (
      state.isExpanded ? (
        <IconPlaceholder
          lucide="FolderOpenIcon"
          tabler="IconFolderOpen"
          hugeicons="FolderOpenIcon"
          phosphor="FolderOpenIcon"
          remixicon="RiFolderOpenLine"
          className="size-4"
        />
      ) : (
        <IconPlaceholder
          lucide="FolderIcon"
          tabler="IconFolder"
          hugeicons="FolderIcon"
          phosphor="FolderIcon"
          remixicon="RiFolderLine"
          className="size-4"
        />
      )
    ) : (
      <IconPlaceholder
        lucide="FileIcon"
        tabler="IconFile"
        hugeicons="FileIcon"
        phosphor="FileIcon"
        remixicon="RiFileLine"
        className="size-4"
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      data-slot="file-tree-item-icon"
      className={cn("shrink-0 text-muted-foreground", className)}
      {...props}
    >
      {icon}
    </span>
  )
}

function FileTreeItemRenameInput({
  className,
  onBlur,
  onChange,
  onClick,
  onDoubleClick,
  onKeyDown,
  ...props
}: React.ComponentProps<"input">) {
  const context = useFileTreeItemContext()
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useLayoutEffect(() => {
    const input = inputRef.current
    if (!input) return

    input.focus()
    const dotIndex = context.node.name.lastIndexOf(".")
    const selectionEnd =
      context.node.type === "file" && dotIndex > 0
        ? dotIndex
        : context.node.name.length
    input.setSelectionRange(0, selectionEnd)
  }, [context.node.name, context.node.type])

  return (
    <input
      ref={inputRef}
      aria-describedby={
        context.renameError
          ? `${context.renameInstructionsId} ${context.renameErrorId}`
          : context.renameInstructionsId
      }
      aria-errormessage={
        context.renameError ? context.renameErrorId : undefined
      }
      aria-invalid={context.renameError ? true : undefined}
      aria-label={context.messages.renameLabel(context.node.name)}
      data-slot="file-tree-item-rename-input"
      disabled={context.isRenamePending}
      value={context.draftName}
      className={cn(
        "h-6 min-w-0 flex-1 rounded-sm border border-input bg-background px-1 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:opacity-60",
        className
      )}
      onBlur={(event) => {
        onBlur?.(event)
        if (!event.defaultPrevented && context.commitOnBlur) {
          context.commitRename()
        }
      }}
      onChange={(event) => {
        onChange?.(event)
        if (!event.defaultPrevented) context.setDraftName(event.target.value)
      }}
      onClick={(event) => {
        onClick?.(event)
        event.stopPropagation()
      }}
      onDoubleClick={(event) => {
        onDoubleClick?.(event)
        event.stopPropagation()
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented) return
        if (event.nativeEvent.isComposing) return

        if (event.key === "Enter") {
          event.preventDefault()
          context.commitRename()
        } else if (event.key === "Escape") {
          event.preventDefault()
          context.cancelRename()
        }
      }}
      {...props}
    />
  )
}

function FileTreeItemLabel({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  const context = useFileTreeItemContext()

  if (context.state.isEditing) {
    return <FileTreeItemRenameInput />
  }

  return (
    <span
      data-slot="file-tree-item-label"
      className={cn("min-w-0 flex-1 truncate", className)}
      title={context.node.name}
      {...props}
    >
      {children ?? context.node.name}
    </span>
  )
}

function FileTreeLoading({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  const context = React.useContext(FileTreeItemContext)

  return (
    <span
      data-slot="file-tree-loading"
      className={cn(
        "ms-auto truncate text-xs text-muted-foreground",
        className
      )}
      {...props}
    >
      {children ?? context?.messages.loadingLabel ?? "Loading"}
    </span>
  )
}

function FileTreeError({
  className,
  children,
  id,
  ...props
}: React.ComponentProps<"span">) {
  const context = React.useContext(FileTreeItemContext)
  const isRenameError = Boolean(context?.state.isEditing && context.renameError)
  const fallback = isRenameError
    ? context?.renameError
    : (context?.messages.loadErrorLabel ?? "Could not load")

  return (
    <span
      id={id ?? (isRenameError ? context?.renameErrorId : undefined)}
      data-slot="file-tree-error"
      className={cn("ms-auto truncate text-xs text-destructive", className)}
      {...props}
    >
      {children ?? fallback}
    </span>
  )
}

function FileTreeEmpty({
  className,
  children = "No files",
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="file-tree-empty"
      className={cn(
        "px-3 py-6 text-center text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface InternalFileTreeRowProps<T> {
  children: React.ReactNode
  className?: string
  commitOnBlur: boolean
  density: FileTreeDensity
  draftName: string
  flat?: boolean
  isActionable: boolean
  isCurrent: boolean
  isDroppable: boolean
  isEditable: boolean
  isEditing: boolean
  isExpanded: boolean
  isFocused: boolean
  isMovable: boolean
  isRenamePending: boolean
  isSelectable: boolean
  isSelected: boolean
  loadState: LoadState | undefined
  measureElement?: (element: HTMLDivElement | null) => void
  moveState?: FileTreeViewportRowOptions["moveState"]
  messages: FileTreeMessages
  node: NormalizedFileTreeNode<T>
  onCancelRename: () => void
  onCommitRename: () => void
  onContextMenu: (
    id: FileTreeId,
    event: React.MouseEvent<HTMLDivElement>
  ) => void
  onDoubleClick: (
    id: FileTreeId,
    event: React.MouseEvent<HTMLDivElement>
  ) => void
  onItemClick: (id: FileTreeId, event: React.MouseEvent<HTMLDivElement>) => void
  onRetryLoad: (id: FileTreeId) => void
  onStartRename: (id: FileTreeId) => void
  onToggleExpanded: (
    id: FileTreeId,
    event?: React.SyntheticEvent<HTMLElement>
  ) => void
  registerItem: (id: FileTreeId, element: HTMLDivElement | null) => void
  renameError: string | undefined
  renameErrorId: string
  renameInstructionsId: string
  renderIcon?: (props: FileTreeItemRenderProps<T>) => React.ReactNode
  renderItem?:
    | React.ReactNode
    | ((props: FileTreeItemRenderProps<T>) => React.ReactNode)
  selectionMode: FileTreeSelectionMode
  setDraftName: (value: string) => void
  style?: React.CSSProperties
  virtualIndex?: number
}

function InternalFileTreeRow<T>({
  children,
  className,
  commitOnBlur,
  density,
  draftName,
  flat,
  isActionable,
  isCurrent,
  isDroppable,
  isEditable,
  isEditing,
  isExpanded,
  isFocused,
  isMovable,
  isRenamePending,
  isSelectable,
  isSelected,
  loadState,
  measureElement,
  moveState,
  messages,
  node,
  onCancelRename,
  onCommitRename,
  onContextMenu,
  onDoubleClick,
  onItemClick,
  onRetryLoad,
  onStartRename,
  onToggleExpanded,
  registerItem,
  renameError,
  renameErrorId,
  renameInstructionsId,
  renderIcon,
  renderItem,
  selectionMode,
  setDraftName,
  style,
  virtualIndex,
}: InternalFileTreeRowProps<T>) {
  const state: FileTreeItemState = {
    isActionable,
    isCurrent,
    isDisabled: node.disabled,
    isDroppable,
    isEditable,
    isEditing,
    isExpanded,
    isFocused,
    isFolder: node.type === "folder",
    isLoading: loadState?.status === "loading",
    isMovable,
    isRenamePending,
    isSelectable,
    isSelected,
    level: node.level,
    loadError: loadState?.status === "error" ? loadState.error : undefined,
    renameError,
  }
  const renderProps: FileTreeItemRenderProps<T> = {
    id: node.id,
    item: node.item,
    name: node.name,
    state,
  }
  const context: FileTreeItemContextValue<T> = {
    cancelRename: onCancelRename,
    commitOnBlur,
    commitRename: onCommitRename,
    density,
    draftName,
    isRenamePending,
    messages,
    node,
    renderIcon,
    renameError,
    renameErrorId,
    renameInstructionsId,
    retryLoad: () => onRetryLoad(node.id),
    setDraftName,
    startRename: () => onStartRename(node.id),
    state,
    toggleExpanded: (event) => onToggleExpanded(node.id, event),
  }

  const content =
    typeof renderItem === "function" ? (
      renderItem(renderProps)
    ) : renderItem !== undefined ? (
      renderItem
    ) : (
      <FileTreeItem>
        <FileTreeItemToggle />
        <FileTreeItemIcon />
        <FileTreeItemLabel />
        {state.isEditing && renameError && <FileTreeError />}
        {state.isLoading && <FileTreeLoading />}
        {state.loadError !== undefined && (
          <FileTreeError title={getErrorMessage(state.loadError)} />
        )}
      </FileTreeItem>
    )

  return (
    <FileTreeItemContext.Provider
      value={context as FileTreeItemContextValue<unknown>}
    >
      <div
        ref={(element) => {
          registerItem(node.id, element)
          measureElement?.(element)
        }}
        role="treeitem"
        aria-busy={state.isLoading || undefined}
        aria-current={isCurrent ? "page" : undefined}
        aria-disabled={node.disabled || undefined}
        aria-expanded={node.type === "folder" ? isExpanded : undefined}
        aria-level={flat ? node.level : undefined}
        aria-posinset={flat ? node.index + 1 : undefined}
        aria-setsize={flat ? node.setSize : undefined}
        aria-selected={
          selectionMode === "none" || !isSelectable ? undefined : isSelected
        }
        data-actionable={isActionable}
        data-current={isCurrent}
        data-disabled={node.disabled}
        data-droppable={isDroppable}
        data-editable={isEditable}
        data-editing={isEditing}
        data-expanded={node.type === "folder" ? isExpanded : undefined}
        data-focused={isFocused}
        data-loading={state.isLoading}
        data-dragging={moveState?.dragging || undefined}
        data-drag-source={moveState?.source || undefined}
        data-drop-target={moveState?.target || undefined}
        data-drop-position={moveState?.position}
        data-move-invalid={moveState?.invalid || undefined}
        data-move-pending={moveState?.pending || undefined}
        data-movable={isMovable}
        data-selectable={isSelectable}
        data-selected={isSelected}
        data-slot="file-tree-row"
        data-type={node.type}
        data-index={virtualIndex}
        tabIndex={isFocused && !node.disabled ? 0 : -1}
        className={cn("group/file-tree-row outline-none", className)}
        style={style}
        onClick={(event) => onItemClick(node.id, event)}
        onContextMenu={(event) => onContextMenu(node.id, event)}
        onDoubleClick={(event) => onDoubleClick(node.id, event)}
      >
        {content}
        {!flat && node.type === "folder" && isExpanded && children ? (
          <div role="group" data-slot="file-tree-group">
            {children}
          </div>
        ) : null}
      </div>
    </FileTreeItemContext.Provider>
  )
}

function areInternalFileTreeRowPropsEqual<T>(
  previous: InternalFileTreeRowProps<T>,
  next: InternalFileTreeRowProps<T>
) {
  for (const key of Object.keys(previous) as Array<
    keyof InternalFileTreeRowProps<T>
  >) {
    if (previous[key] !== next[key]) return false
  }
  return true
}

const MemoizedInternalFileTreeRow = React.memo(
  InternalFileTreeRow,
  areInternalFileTreeRowPropsEqual
) as typeof InternalFileTreeRow

function FileTreeInner<T = FileTreeNode>(
  {
    accessors,
    activationMode = "doubleClick",
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    children: renderItem,
    className,
    commands,
    commitOnBlur = true,
    currentId,
    defaultExpandedIds = [],
    defaultFocusedId,
    defaultSelectedIds = [],
    density = "default",
    expandedIds: controlledExpandedIds,
    focusedId: controlledFocusedId,
    indent = "1rem",
    isItemActionable,
    isItemDroppable,
    isItemEditable,
    isItemMovable,
    isItemSelectable,
    items,
    loadChildren,
    locale,
    messages: messageOverrides,
    onCommandError,
    onExpandedIdsChange,
    onFocusedIdChange,
    onItemAction,
    onItemContextMenu,
    onKeyDown,
    onLoadError,
    onRename,
    onRenameError,
    onSelectedIdsChange,
    renderIcon,
    selectedIds: controlledSelectedIds,
    selectionMode = "single",
    shortcuts,
    style,
    validateRename,
    viewport: Viewport,
    ...props
  }: FileTreeProps<T>,
  forwardedRef: React.ForwardedRef<FileTreeHandle>
) {
  const generatedId = React.useId()
  const renameErrorId = `${generatedId}-rename-error`
  const renameInstructionsId = `${generatedId}-rename-instructions`
  const defaultAccessors = React.useMemo(
    () => createDefaultFileTreeAccessors() as unknown as FileTreeAccessors<T>,
    []
  )
  const resolvedAccessors = accessors ?? defaultAccessors
  const resolvedMessages = React.useMemo(
    () => ({ ...defaultFileTreeMessages, ...messageOverrides }),
    [messageOverrides]
  )
  const shortcutResolution = React.useMemo(
    () =>
      resolveFileTreeShortcuts({
        allowUnsafeNavigationOverrides:
          shortcuts?.allowUnsafeNavigationOverrides,
        allowUnsafeShortcuts: shortcuts?.allowUnsafeShortcuts,
        bindings: shortcuts?.bindings,
        platform: shortcuts?.platform,
      }),
    [
      shortcuts?.allowUnsafeNavigationOverrides,
      shortcuts?.allowUnsafeShortcuts,
      shortcuts?.bindings,
      shortcuts?.platform,
    ]
  )
  const customCommandResolution = React.useMemo(
    () =>
      validateFileTreeShortcutCommands(commands ?? [], {
        allowUnsafeShortcuts: shortcuts?.allowUnsafeShortcuts,
        bindings: shortcutResolution.bindings,
      }),
    [commands, shortcutResolution.bindings, shortcuts?.allowUnsafeShortcuts]
  )
  const enabledCustomCommands = React.useMemo(
    () =>
      (commands ?? []).filter((command) =>
        customCommandResolution.acceptedCommandIds.has(command.id)
      ),
    [commands, customCommandResolution.acceptedCommandIds]
  )
  const shortcutConflicts = React.useMemo(
    () => [
      ...shortcutResolution.conflicts,
      ...customCommandResolution.conflicts,
    ],
    [customCommandResolution.conflicts, shortcutResolution.conflicts]
  )
  const onShortcutConflict = shortcuts?.onConflict
  const warnedMessages = React.useRef(new Set<string>())
  const itemElements = React.useRef(new Map<FileTreeId, HTMLDivElement>())
  const inFlightLoads = React.useRef(new Map<FileTreeId, InFlightLoad>())
  const renameController = React.useRef<AbortController | null>(null)
  const renamePendingRef = React.useRef(false)
  const operationModeRef = React.useRef<FileTreeOperationMode>("idle")
  const selectionAnchor = React.useRef<FileTreeId | undefined>(undefined)
  const typeahead = React.useRef({ value: "", timestamp: 0 })
  const correctionKeys = React.useRef({
    expanded: "",
    focused: "",
    selected: "",
  })

  React.useEffect(() => {
    if (shortcutConflicts.length === 0) return

    if (onShortcutConflict) {
      shortcutConflicts.forEach((conflict) => onShortcutConflict(conflict))
    } else {
      warnFileTreeShortcutConflicts(shortcutConflicts)
    }
  }, [onShortcutConflict, shortcutConflicts])

  const [loadedChildren, setLoadedChildren] = React.useState(
    () => new Map<FileTreeId, readonly T[]>()
  )
  const [loadStates, setLoadStates] = React.useState(
    () => new Map<FileTreeId, LoadState>()
  )
  const [liveMessage, setLiveMessage] = React.useState("")
  const [editingId, setEditingId] = React.useState<FileTreeId>()
  const [draftName, setDraftName] = React.useState("")
  const [renameError, setRenameError] = React.useState<string>()
  const [isRenamePending, setIsRenamePending] = React.useState(false)
  const [treeElement, setTreeElement] = React.useState<HTMLDivElement | null>(
    null
  )
  const [operationMode, setOperationMode] =
    React.useState<FileTreeOperationMode>("idle")

  const sendOperationEvent = React.useCallback(
    (event: FileTreeOperationEvent) => {
      const nextMode = transitionFileTreeOperationMode(
        operationModeRef.current,
        event
      )
      operationModeRef.current = nextMode
      setOperationMode(nextMode)
      return nextMode
    },
    []
  )

  const [expandedIds, setExpandedIds, expandedIdsRef] = useControllableIds<T>(
    "expandedIds",
    controlledExpandedIds,
    defaultExpandedIds,
    onExpandedIdsChange
  )
  const [selectedIds, setSelectedIds, selectedIdsRef] = useControllableIds<T>(
    "selectedIds",
    controlledSelectedIds,
    defaultSelectedIds,
    onSelectedIdsChange
  )
  const [focusedId, setFocusedId, focusedIdRef] = useControllableValue<T>(
    "focusedId",
    controlledFocusedId,
    defaultFocusedId,
    onFocusedIdChange
  )

  const tree = React.useMemo(
    () =>
      normalizeFileTree(items, resolvedAccessors, loadedChildren, {
        onWarning: (message) => {
          if (warnedMessages.current.has(message)) return
          warnedMessages.current.add(message)
          console.warn(`[FileTree] ${message}`)
        },
      }),
    [items, loadedChildren, resolvedAccessors]
  )

  React.useEffect(() => {
    const isLoadableFolder = (id: FileTreeId) => {
      const node = tree.nodes.get(id)
      return (
        node?.type === "folder" &&
        resolvedAccessors.getItemChildren(node.item) === undefined
      )
    }

    inFlightLoads.current.forEach((task, id) => {
      if (isLoadableFolder(id)) return
      task.controller.abort()
      inFlightLoads.current.delete(id)
    })

    setLoadedChildren((current) => {
      if (Array.from(current.keys()).every(isLoadableFolder)) return current
      return new Map(Array.from(current).filter(([id]) => isLoadableFolder(id)))
    })
    setLoadStates((current) => {
      if (Array.from(current.keys()).every(isLoadableFolder)) return current
      return new Map(Array.from(current).filter(([id]) => isLoadableFolder(id)))
    })

    if (editingId && !tree.nodes.has(editingId)) {
      renameController.current?.abort()
      renameController.current = null
      renamePendingRef.current = false
      setIsRenamePending(false)
      setRenameError(undefined)
      setEditingId(undefined)
      sendOperationEvent({ type: "cancel" })
    }
  }, [editingId, resolvedAccessors, sendOperationEvent, tree.nodes])

  const expandedSet = React.useMemo(() => new Set(expandedIds), [expandedIds])
  const selectedSet = React.useMemo(() => new Set(selectedIds), [selectedIds])
  const controller = React.useMemo(
    () => createFileTreeControllerSnapshot(tree, expandedSet),
    [expandedSet, tree]
  )
  const { visibleIds, visibleIdSet, visibleNodes } = controller
  const previousTreeRef = React.useRef(tree)

  let effectiveFocusedId = focusedId
  if (
    !effectiveFocusedId ||
    !visibleIdSet.has(effectiveFocusedId) ||
    tree.nodes.get(effectiveFocusedId)?.disabled
  ) {
    if (effectiveFocusedId && tree.nodes.has(effectiveFocusedId)) {
      effectiveFocusedId = getFileTreeAncestors(tree, effectiveFocusedId)
        .reverse()
        .find((id) => visibleIdSet.has(id) && !tree.nodes.get(id)?.disabled)
    } else {
      effectiveFocusedId = undefined
    }

    effectiveFocusedId ??= selectedIds.find(
      (id) => visibleIdSet.has(id) && !tree.nodes.get(id)?.disabled
    )
    effectiveFocusedId ??= visibleNodes.find((node) => !node.disabled)?.id
  }
  const effectiveFocusedIdRef = React.useRef(effectiveFocusedId)
  React.useLayoutEffect(() => {
    effectiveFocusedIdRef.current = effectiveFocusedId
  }, [effectiveFocusedId])

  const announce = React.useCallback((message: string) => {
    setLiveMessage("")
    scheduleAnimationFrame(() => setLiveMessage(message))
  }, [])

  const registerItem = React.useCallback(
    (id: FileTreeId, element: HTMLDivElement | null) => {
      if (element) itemElements.current.set(id, element)
      else itemElements.current.delete(id)
    },
    []
  )

  const nestedViewportAdapter = React.useMemo<FileTreeViewportAdapter>(
    () => ({
      ensureRendered: () => {},
      focusElement: (id) => itemElements.current.get(id)?.focus(),
      scrollToItem: (id, options) => {
        const element = itemElements.current.get(id)
        const scrollableElement = element as
          | (HTMLDivElement & {
              scrollIntoView?: HTMLDivElement["scrollIntoView"]
            })
          | undefined
        scrollableElement?.scrollIntoView?.({
          block: options?.align === "auto" ? "nearest" : options?.align,
        })
      },
    }),
    []
  )
  const viewportAdapterRef = React.useRef(nestedViewportAdapter)
  const registerViewportAdapter = React.useCallback(
    (adapter: FileTreeViewportAdapter | null) => {
      viewportAdapterRef.current = adapter ?? nestedViewportAdapter
    },
    [nestedViewportAdapter]
  )
  const getItemElement = React.useCallback(
    (id: FileTreeId) => itemElements.current.get(id),
    []
  )

  const focusElement = React.useCallback((id: FileTreeId | undefined) => {
    if (!id) return
    scheduleAnimationFrame(() => {
      void Promise.resolve(viewportAdapterRef.current.ensureRendered(id)).then(
        () => {
          void viewportAdapterRef.current.scrollToItem(id, { align: "auto" })
          void viewportAdapterRef.current.focusElement(id)
        }
      )
    })
  }, [])

  const focusItem = React.useCallback(
    (
      id: FileTreeId,
      reason: FileTreeChangeReason,
      originalEvent?: FileTreeOriginalEvent
    ) => {
      const node = tree.nodes.get(id)
      if (!node || node.disabled || !visibleIdSet.has(id)) return

      setFocusedId(id, { item: node.item, reason, originalEvent })
      focusElement(id)
    },
    [focusElement, setFocusedId, tree.nodes, visibleIdSet]
  )

  const canSelectItem = React.useCallback(
    (node: NormalizedFileTreeNode<T>) =>
      !node.disabled &&
      resolveFileTreeCapability(isItemSelectable, node.item, true),
    [isItemSelectable]
  )

  const canActionItem = React.useCallback(
    (node: NormalizedFileTreeNode<T>) =>
      !node.disabled &&
      resolveFileTreeCapability(isItemActionable, node.item, true),
    [isItemActionable]
  )

  const canMoveItem = React.useCallback(
    (node: NormalizedFileTreeNode<T>) =>
      !node.disabled &&
      resolveFileTreeCapability(isItemMovable, node.item, false),
    [isItemMovable]
  )

  const canDropOnItem = React.useCallback(
    (node: NormalizedFileTreeNode<T>) =>
      node.type === "folder" &&
      !node.disabled &&
      resolveFileTreeCapability(isItemDroppable, node.item, false),
    [isItemDroppable]
  )
  const canMoveItemById = React.useCallback(
    (id: FileTreeId) => {
      const node = tree.nodes.get(id)
      return node ? canMoveItem(node) : false
    },
    [canMoveItem, tree.nodes]
  )
  const canDropOnItemById = React.useCallback(
    (id: FileTreeId) => {
      const node = tree.nodes.get(id)
      return node ? canDropOnItem(node) : false
    },
    [canDropOnItem, tree.nodes]
  )

  const requestChildren = React.useCallback(
    async (id: FileTreeId, force = false) => {
      const node = tree.nodes.get(id)
      if (!loadChildren || !node || node.type !== "folder" || node.disabled)
        return
      if (resolvedAccessors.getItemChildren(node.item) !== undefined) return
      if (!force && node.childIds !== undefined) return
      if (inFlightLoads.current.has(id)) return

      if (force) {
        setLoadedChildren((current) => {
          if (!current.has(id)) return current
          const next = new Map(current)
          next.delete(id)
          return next
        })
      }

      const controller = new AbortController()
      const task: InFlightLoad = { controller }
      inFlightLoads.current.set(id, task)
      setLoadStates((current) => {
        const next = new Map(current)
        next.set(id, { status: "loading" })
        return next
      })
      announce(resolvedMessages.loading(node.name))

      try {
        const children = await loadChildren({
          id,
          item: node.item,
          signal: controller.signal,
        })

        if (
          inFlightLoads.current.get(id) !== task ||
          controller.signal.aborted
        ) {
          return
        }

        setLoadedChildren((current) => {
          const next = new Map(current)
          next.set(id, children)
          return next
        })
        setLoadStates((current) => {
          const next = new Map(current)
          next.delete(id)
          return next
        })
        announce(resolvedMessages.loaded(node.name, children.length))
      } catch (error) {
        if (controller.signal.aborted || isAbortError(error)) return
        if (inFlightLoads.current.get(id) !== task) return

        setLoadStates((current) => {
          const next = new Map(current)
          next.set(id, { status: "error", error })
          return next
        })
        announce(resolvedMessages.loadError(node.name, getErrorMessage(error)))
        onLoadError?.({ id, item: node.item, error })
      } finally {
        if (inFlightLoads.current.get(id) === task) {
          inFlightLoads.current.delete(id)
        }
      }
    },
    [
      announce,
      loadChildren,
      onLoadError,
      resolvedAccessors,
      resolvedMessages,
      tree.nodes,
    ]
  )

  const setItemExpanded = React.useCallback(
    (
      id: FileTreeId,
      shouldExpand: boolean,
      reason: FileTreeChangeReason,
      originalEvent?: FileTreeOriginalEvent
    ) => {
      const node = tree.nodes.get(id)
      if (!node || node.type !== "folder" || node.disabled) return

      const next = new Set(expandedIdsRef.current)
      if (shouldExpand) next.add(id)
      else next.delete(id)

      setExpandedIds(Array.from(next), {
        item: node.item,
        reason,
        originalEvent,
      })

      if (!shouldExpand) {
        const currentFocus = focusedIdRef.current
        if (currentFocus && isFileTreeDescendant(tree, currentFocus, id)) {
          setFocusedId(id, { item: node.item, reason, originalEvent })
          focusElement(id)
        }
      } else if (node.childIds === undefined) {
        void requestChildren(id)
      }
    },
    [
      expandedIdsRef,
      focusElement,
      focusedIdRef,
      requestChildren,
      setExpandedIds,
      setFocusedId,
      tree,
    ]
  )

  const toggleItemExpanded = React.useCallback(
    (
      id: FileTreeId,
      reason: FileTreeChangeReason,
      originalEvent?: FileTreeOriginalEvent
    ) => {
      const node = tree.nodes.get(id)
      if (!node || node.type !== "folder") return

      if (
        expandedIdsRef.current.includes(id) &&
        loadStates.get(id)?.status === "error" &&
        node.childIds === undefined
      ) {
        void requestChildren(id, true)
        return
      }

      setItemExpanded(
        id,
        !expandedIdsRef.current.includes(id),
        reason,
        originalEvent
      )
    },
    [expandedIdsRef, loadStates, requestChildren, setItemExpanded, tree.nodes]
  )

  const setSelection = React.useCallback(
    (
      ids: readonly FileTreeId[],
      itemId: FileTreeId | undefined,
      reason: FileTreeChangeReason,
      originalEvent?: FileTreeOriginalEvent
    ) => {
      const nextIds = uniqueIds(ids).filter((id) => {
        const node = tree.nodes.get(id)
        return node ? canSelectItem(node) : false
      })
      const item = itemId ? (tree.nodes.get(itemId)?.item ?? null) : null
      setSelectedIds(nextIds, { item, reason, originalEvent })
    },
    [canSelectItem, setSelectedIds, tree.nodes]
  )

  const selectRange = React.useCallback(
    (
      toId: FileTreeId,
      reason: FileTreeChangeReason,
      originalEvent?: FileTreeOriginalEvent
    ) => {
      const anchor =
        selectionAnchor.current ?? effectiveFocusedIdRef.current ?? toId
      selectionAnchor.current = anchor
      const range = getFileTreeRange(visibleIds, anchor, toId).filter((id) => {
        const node = tree.nodes.get(id)
        return node ? canSelectItem(node) : false
      })
      setSelection(range, toId, reason, originalEvent)
      announce(resolvedMessages.selectedCount(range.length))
    },
    [
      announce,
      canSelectItem,
      effectiveFocusedIdRef,
      resolvedMessages,
      setSelection,
      tree.nodes,
      visibleIds,
    ]
  )

  const selectItemFromPointer = React.useCallback(
    (id: FileTreeId, event: React.MouseEvent<HTMLDivElement>) => {
      const node = tree.nodes.get(id)
      if (!node || !canSelectItem(node) || selectionMode === "none") return

      if (selectionMode === "multiple" && event.shiftKey) {
        selectRange(id, "pointer", event)
        return
      }

      if (selectionMode === "multiple" && (event.metaKey || event.ctrlKey)) {
        const next = new Set(selectedIdsRef.current)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        selectionAnchor.current = id
        setSelection(Array.from(next), id, "pointer", event)
        return
      }

      selectionAnchor.current = id
      setSelection([id], id, "pointer", event)
    },
    [
      canSelectItem,
      selectRange,
      selectedIdsRef,
      selectionMode,
      setSelection,
      tree.nodes,
    ]
  )

  const activateItem = React.useCallback(
    (
      id: FileTreeId,
      reason: FileTreeChangeReason,
      originalEvent?: FileTreeOriginalEvent
    ) => {
      const node = tree.nodes.get(id)
      if (!node || node.disabled) return

      if (node.type === "folder") {
        toggleItemExpanded(id, reason, originalEvent)
      }
      if (onItemAction && canActionItem(node)) {
        onItemAction(node.item, {
          id,
          item: node.item,
          originalEvent,
          reason,
          type: node.type,
        })
      }
    },
    [canActionItem, onItemAction, toggleItemExpanded, tree.nodes]
  )

  const canRenameItem = React.useCallback(
    (node: NormalizedFileTreeNode<T>) =>
      Boolean(onRename) &&
      !node.disabled &&
      resolveFileTreeCapability(isItemEditable, node.item, true),
    [isItemEditable, onRename]
  )

  const startRename = React.useCallback(
    (id: FileTreeId) => {
      const node = tree.nodes.get(id)
      if (!node || !canRenameItem(node)) return
      if (!isFileTreeOperationAvailable(operationModeRef.current, "renaming")) {
        return
      }

      renameController.current?.abort()
      renameController.current = null
      renamePendingRef.current = false
      setIsRenamePending(false)
      setRenameError(undefined)
      setDraftName(node.name)
      setEditingId(id)
      sendOperationEvent({ type: "startRename" })
      announce(resolvedMessages.renaming(node.name))
    },
    [announce, canRenameItem, resolvedMessages, sendOperationEvent, tree.nodes]
  )

  const cancelRename = React.useCallback(() => {
    const id = editingId
    renameController.current?.abort()
    renameController.current = null
    renamePendingRef.current = false
    setIsRenamePending(false)
    setRenameError(undefined)
    setEditingId(undefined)
    sendOperationEvent({ type: "cancel" })
    if (id) focusElement(id)
  }, [editingId, focusElement, sendOperationEvent])

  const commitRename = React.useCallback(async () => {
    if (!editingId || renamePendingRef.current || !onRename) return
    const node = tree.nodes.get(editingId)
    if (!node) return

    const nextName = draftName.trim()
    if (!nextName) {
      setRenameError(resolvedMessages.renameEmpty)
      announce(resolvedMessages.renameEmpty)
      return
    }

    renamePendingRef.current = true
    setIsRenamePending(true)
    setRenameError(undefined)

    try {
      const validationMessage = await validateRename?.(nextName, node.item)
      if (validationMessage) {
        setRenameError(validationMessage)
        announce(validationMessage)
        return
      }

      const controller = new AbortController()
      renameController.current = controller
      await onRename({
        id: node.id,
        item: node.item,
        name: nextName,
        previousName: node.name,
        signal: controller.signal,
      })

      if (controller.signal.aborted) return
      setEditingId(undefined)
      sendOperationEvent({ type: "finish" })
      announce(resolvedMessages.renamed(node.name, nextName))
      focusElement(node.id)
    } catch (error) {
      if (isAbortError(error)) return
      const message = getErrorMessage(error)
      setRenameError(message)
      announce(resolvedMessages.renameError(node.name, message))
      onRenameError?.({
        id: node.id,
        item: node.item,
        name: nextName,
        error,
      })
    } finally {
      renamePendingRef.current = false
      setIsRenamePending(false)
      renameController.current = null
    }
  }, [
    announce,
    draftName,
    editingId,
    focusElement,
    onRename,
    onRenameError,
    resolvedMessages,
    sendOperationEvent,
    tree.nodes,
    validateRename,
  ])

  const revealItem = React.useCallback(
    (id: FileTreeId) => {
      const node = tree.nodes.get(id)
      if (!node || node.disabled) return

      const next = new Set(expandedIdsRef.current)
      getFileTreeAncestors(tree, id).forEach((ancestorId) =>
        next.add(ancestorId)
      )
      setExpandedIds(Array.from(next), {
        item: node.item,
        reason: "imperative",
      })
      scheduleAnimationFrame(() => {
        setFocusedId(id, { item: node.item, reason: "imperative" })
        focusElement(id)
      })
    },
    [expandedIdsRef, focusElement, setExpandedIds, setFocusedId, tree]
  )

  React.useImperativeHandle(
    forwardedRef,
    () => ({
      collapse: (id) => setItemExpanded(id, false, "imperative"),
      expand: (id) => setItemExpanded(id, true, "imperative"),
      focus: () => focusElement(effectiveFocusedId),
      focusItem: (id) => revealItem(id),
      getVisibleIds: () => visibleIds,
      refresh: (id) => void requestChildren(id, true),
      revealItem,
      startRename,
      toggle: (id) => toggleItemExpanded(id, "imperative"),
    }),
    [
      effectiveFocusedId,
      focusElement,
      requestChildren,
      revealItem,
      setItemExpanded,
      startRename,
      toggleItemExpanded,
      visibleIds,
    ]
  )

  React.useEffect(() => {
    if (!ariaLabel && !ariaLabelledBy) {
      console.warn(
        "[FileTree] Provide aria-label or aria-labelledby so the tree has an accessible name."
      )
    }
  }, [ariaLabel, ariaLabelledBy])

  React.useEffect(() => {
    expandedIds.forEach((id) => {
      if (tree.nodes.get(id)?.childIds === undefined) {
        void requestChildren(id)
      }
    })
  }, [expandedIds, requestChildren, tree.nodes])

  React.useEffect(() => {
    const validExpanded = expandedIds.filter(
      (id) => tree.nodes.get(id)?.type === "folder"
    )
    const expandedKey = `${expandedIds.join("\u0001")}→${validExpanded.join(
      "\u0001"
    )}`
    if (!arraysEqual(expandedIds, validExpanded)) {
      if (correctionKeys.current.expanded !== expandedKey) {
        correctionKeys.current.expanded = expandedKey
        setExpandedIds(validExpanded, { item: null, reason: "data-change" })
      }
    } else {
      correctionKeys.current.expanded = ""
    }

    let validSelected = selectedIds.filter((id) => {
      const node = tree.nodes.get(id)
      return node ? canSelectItem(node) : false
    })
    if (selectionMode === "none") validSelected = []
    if (selectionMode === "single") validSelected = validSelected.slice(0, 1)
    const selectedKey = `${selectedIds.join("\u0001")}→${validSelected.join(
      "\u0001"
    )}`
    if (!arraysEqual(selectedIds, validSelected)) {
      if (correctionKeys.current.selected !== selectedKey) {
        correctionKeys.current.selected = selectedKey
        setSelectedIds(validSelected, { item: null, reason: "data-change" })
      }
    } else {
      correctionKeys.current.selected = ""
    }

    const recoveredFocusedId = getFileTreeFocusRecoveryId({
      focusedId,
      previousTree: previousTreeRef.current,
      next: controller,
    })
    if (focusedId && recoveredFocusedId !== focusedId) {
      const focusedKey = `${focusedId}→${recoveredFocusedId ?? ""}`
      if (correctionKeys.current.focused !== focusedKey) {
        correctionKeys.current.focused = focusedKey
        setFocusedId(recoveredFocusedId, {
          item: recoveredFocusedId
            ? (tree.nodes.get(recoveredFocusedId)?.item ?? null)
            : null,
          reason: "data-change",
        })
        focusElement(recoveredFocusedId)
      }
    } else {
      correctionKeys.current.focused = ""
    }
    previousTreeRef.current = tree
  }, [
    canSelectItem,
    controller,
    expandedIds,
    focusElement,
    focusedId,
    selectedIds,
    selectionMode,
    setExpandedIds,
    setFocusedId,
    setSelectedIds,
    tree,
    tree.nodes,
  ])

  React.useEffect(() => {
    const tasks = inFlightLoads.current

    return () => {
      tasks.forEach((task) => task.controller.abort())
      tasks.clear()
    }
  }, [items, loadChildren])

  React.useEffect(() => {
    return () => renameController.current?.abort()
  }, [])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented || isInteractiveTarget(event.target)) return
      if (event.nativeEvent.isComposing || event.getModifierState("AltGraph")) {
        return
      }

      const shortcutEvent = {
        key: event.key,
        code: event.code,
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
        repeat: event.repeat,
        isComposing: event.nativeEvent.isComposing,
        getModifierState: () => event.getModifierState("AltGraph"),
      }
      const commandId = getFileTreeShortcutCommand(
        shortcutEvent,
        shortcutResolution.bindings,
        Viewport
          ? [...FILE_TREE_BASE_COMMAND_ORDER, "pageUp", "pageDown"]
          : FILE_TREE_BASE_COMMAND_ORDER,
        { platform: shortcutResolution.platform }
      )
      const commandContext: FileTreeCommandContext<T> = {
        focusedId: effectiveFocusedId,
        focusedItem: effectiveFocusedId
          ? (tree.nodes.get(effectiveFocusedId)?.item ?? null)
          : null,
        selectedIds,
        selectedItems: selectedIds.flatMap((id) => {
          const item = tree.nodes.get(id)?.item
          return item === undefined ? [] : [item]
        }),
        platform: shortcutResolution.platform,
      }

      const currentId = effectiveFocusedId
      const currentNode = currentId ? tree.nodes.get(currentId) : undefined
      const currentIndex = currentId ? visibleIds.indexOf(currentId) : -1

      const moveFocus = (nextId: FileTreeId | undefined) => {
        if (!nextId) return
        focusItem(nextId, "keyboard", event)
        if (selectionMode === "multiple" && event.shiftKey) {
          selectRange(nextId, "keyboard", event)
        }
      }

      if (commandId === "focusNext" || commandId === "extendSelectionNext") {
        event.preventDefault()
        moveFocus(getFileTreeEnabledId(controller, currentIndex + 1, 1))
        return
      }

      if (
        commandId === "focusPrevious" ||
        commandId === "extendSelectionPrevious"
      ) {
        event.preventDefault()
        moveFocus(getFileTreeEnabledId(controller, currentIndex - 1, -1))
        return
      }

      if (commandId === "focusFirst") {
        event.preventDefault()
        moveFocus(getFileTreeEnabledId(controller, 0, 1))
        return
      }

      if (commandId === "focusLast") {
        event.preventDefault()
        moveFocus(getFileTreeEnabledId(controller, visibleNodes.length - 1, -1))
        return
      }

      if (commandId === "pageUp" || commandId === "pageDown") {
        event.preventDefault()
        const rowHeight = density === "compact" ? 28 : 32
        const pageSize = Math.max(
          1,
          Math.floor((treeElement?.clientHeight ?? rowHeight) / rowHeight)
        )
        moveFocus(
          getFileTreePageTargetId(
            controller,
            currentId,
            pageSize,
            commandId === "pageDown" ? 1 : -1
          )
        )
        return
      }

      if (commandId === "expandOrFirstChild" && currentNode) {
        event.preventDefault()
        if (currentNode.type !== "folder") return

        if (!expandedSet.has(currentNode.id)) {
          setItemExpanded(currentNode.id, true, "keyboard", event)
        } else if (currentNode.childIds === undefined) {
          void requestChildren(currentNode.id, loadStates.has(currentNode.id))
        } else {
          const childId = currentNode.childIds.find(
            (id) => !tree.nodes.get(id)?.disabled
          )
          moveFocus(childId)
        }
        return
      }

      if (commandId === "collapseOrParent" && currentNode) {
        event.preventDefault()
        if (currentNode.type === "folder" && expandedSet.has(currentNode.id)) {
          setItemExpanded(currentNode.id, false, "keyboard", event)
        } else if (currentNode.parentId) {
          moveFocus(currentNode.parentId)
        }
        return
      }

      if (
        commandId === "activate" &&
        currentId &&
        currentNode &&
        (currentNode.type === "folder" ||
          (Boolean(onItemAction) && canActionItem(currentNode)))
      ) {
        event.preventDefault()
        activateItem(currentId, "keyboard", event)
        return
      }

      if (
        (commandId === "toggleSelection" ||
          commandId === "selectRangeToFocus") &&
        currentId &&
        currentNode &&
        selectionMode !== "none" &&
        canSelectItem(currentNode)
      ) {
        event.preventDefault()

        if (
          commandId === "selectRangeToFocus" &&
          selectionMode === "multiple"
        ) {
          selectRange(currentId, "keyboard", event)
        } else if (selectionMode === "multiple") {
          const next = new Set(selectedIdsRef.current)
          if (next.has(currentId)) next.delete(currentId)
          else next.add(currentId)
          selectionAnchor.current = currentId
          setSelection(Array.from(next), currentId, "keyboard", event)
        } else {
          selectionAnchor.current = currentId
          setSelection([currentId], currentId, "keyboard", event)
        }
        return
      }

      if (commandId === "selectAll" && selectionMode === "multiple") {
        event.preventDefault()
        const allIds = visibleNodes.filter(canSelectItem).map((node) => node.id)
        setSelection(allIds, currentId, "keyboard", event)
        announce(resolvedMessages.selectedCount(allIds.length))
        return
      }

      if (commandId === "expandSiblings" && currentNode) {
        event.preventDefault()
        const next = new Set(expandedIdsRef.current)
        getFileTreeSiblingIds(tree, currentNode.id).forEach((id) => {
          const node = tree.nodes.get(id)
          if (node?.type === "folder" && !node.disabled) next.add(id)
        })
        setExpandedIds(Array.from(next), {
          item: currentNode.item,
          reason: "keyboard",
          originalEvent: event,
        })
        return
      }

      if (
        commandId === "rename" &&
        currentId &&
        currentNode &&
        canRenameItem(currentNode)
      ) {
        event.preventDefault()
        startRename(currentId)
        return
      }

      if (commandId === "openContextMenu" && currentNode && onItemContextMenu) {
        event.preventDefault()
        if (
          selectionMode !== "none" &&
          canSelectItem(currentNode) &&
          !selectedIdsRef.current.includes(currentNode.id)
        ) {
          selectionAnchor.current = currentNode.id
          setSelection([currentNode.id], currentNode.id, "keyboard", event)
        }
        onItemContextMenu?.(currentNode.item, {
          id: currentNode.id,
          item: currentNode.item,
          originalEvent: event,
          reason: "keyboard",
          type: currentNode.type,
        })
        return
      }

      for (const command of enabledCustomCommands) {
        const shortcutsForCommand =
          command.shortcuts ??
          shortcutResolution.bindings[
            command.id as keyof typeof shortcutResolution.bindings
          ]
        if (
          !matchFileTreeShortcut(shortcutEvent, shortcutsForCommand, {
            platform: shortcutResolution.platform,
          }) ||
          (command.canRun && !command.canRun(commandContext))
        ) {
          continue
        }

        event.preventDefault()
        try {
          Promise.resolve(command.run(commandContext, event)).catch((error) =>
            onCommandError?.({ command, context: commandContext, error })
          )
        } catch (error) {
          onCommandError?.({ command, context: commandContext, error })
        }
        return
      }

      if (
        event.key.length === 1 &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey
      ) {
        const now = Date.now()
        const previous = typeahead.current
        const value =
          now - previous.timestamp > 500
            ? event.key
            : `${previous.value}${event.key}`
        const isRepeatedCharacter = Array.from(value).every(
          (character) =>
            character.toLocaleLowerCase(locale) ===
            event.key.toLocaleLowerCase(locale)
        )
        const query = isRepeatedCharacter ? event.key : value
        typeahead.current = { value, timestamp: now }
        const match = findFileTreeTypeaheadMatch(
          visibleNodes,
          currentId,
          query,
          locale
        )
        if (match) {
          event.preventDefault()
          focusItem(match, "keyboard", event)
        }
      }
    },
    [
      activateItem,
      announce,
      canActionItem,
      canRenameItem,
      canSelectItem,
      controller,
      density,
      effectiveFocusedId,
      enabledCustomCommands,
      expandedIdsRef,
      expandedSet,
      focusItem,
      loadStates,
      locale,
      onCommandError,
      onItemContextMenu,
      onItemAction,
      onKeyDown,
      requestChildren,
      resolvedMessages,
      selectRange,
      selectedIds,
      selectedIdsRef,
      selectionMode,
      setExpandedIds,
      setItemExpanded,
      setSelection,
      startRename,
      shortcutResolution,
      tree,
      treeElement,
      Viewport,
      visibleIds,
      visibleNodes,
    ]
  )

  const handleRowContextMenu = React.useCallback(
    (id: FileTreeId, event: React.MouseEvent<HTMLDivElement>) => {
      const node = tree.nodes.get(id)
      if (!node || isInteractiveTarget(event.target) || node.disabled) return
      if (
        selectionMode !== "none" &&
        canSelectItem(node) &&
        !selectedIdsRef.current.includes(id)
      ) {
        setSelection([id], id, "pointer", event)
      }
      setFocusedId(id, {
        item: node.item,
        originalEvent: event,
        reason: "pointer",
      })
      onItemContextMenu?.(node.item, {
        id,
        item: node.item,
        originalEvent: event,
        reason: "pointer",
        type: node.type,
      })
    },
    [
      canSelectItem,
      onItemContextMenu,
      selectedIdsRef,
      selectionMode,
      setFocusedId,
      setSelection,
      tree.nodes,
    ]
  )
  const handleRowDoubleClick = React.useCallback(
    (id: FileTreeId, event: React.MouseEvent<HTMLDivElement>) => {
      if (isInteractiveTarget(event.target)) return
      if (activationMode === "doubleClick") {
        activateItem(id, "pointer", event)
      }
    },
    [activateItem, activationMode]
  )
  const handleRowClick = React.useCallback(
    (id: FileTreeId, event: React.MouseEvent<HTMLDivElement>) => {
      const node = tree.nodes.get(id)
      if (!node || isInteractiveTarget(event.target) || node.disabled) return
      focusItem(id, "pointer", event)
      selectItemFromPointer(id, event)
      if (activationMode === "singleClick") {
        activateItem(id, "pointer", event)
      }
    },
    [activateItem, activationMode, focusItem, selectItemFromPointer, tree.nodes]
  )
  const handleRowCommitRename = React.useCallback(
    () => void commitRename(),
    [commitRename]
  )
  const handleRowRetryLoad = React.useCallback(
    (id: FileTreeId) => void requestChildren(id, true),
    [requestChildren]
  )
  const handleRowToggleExpanded = React.useCallback(
    (id: FileTreeId, event?: React.SyntheticEvent<HTMLElement>) =>
      toggleItemExpanded(id, "pointer", event),
    [toggleItemExpanded]
  )

  const renderRow = (
    id: FileTreeId,
    options: FileTreeViewportRowOptions = {}
  ) => {
    const node = tree.nodes.get(id)
    if (!node) return null

    const isExpanded = expandedSet.has(id)

    return (
      <MemoizedInternalFileTreeRow
        key={id}
        className={options.className}
        commitOnBlur={commitOnBlur}
        density={density}
        draftName={editingId === id ? draftName : node.name}
        flat={options.flat}
        isActionable={Boolean(onItemAction) && canActionItem(node)}
        isCurrent={currentId === id}
        isDroppable={canDropOnItem(node)}
        isEditable={canRenameItem(node)}
        isEditing={editingId === id}
        isExpanded={isExpanded}
        isFocused={effectiveFocusedId === id}
        isMovable={canMoveItem(node)}
        isRenamePending={editingId === id && isRenamePending}
        isSelectable={canSelectItem(node)}
        isSelected={selectionMode !== "none" && selectedSet.has(id)}
        loadState={loadStates.get(id)}
        measureElement={options.measureElement}
        moveState={options.moveState}
        messages={resolvedMessages}
        node={node}
        onCancelRename={cancelRename}
        onCommitRename={handleRowCommitRename}
        onContextMenu={handleRowContextMenu}
        onDoubleClick={handleRowDoubleClick}
        onItemClick={handleRowClick}
        onRetryLoad={handleRowRetryLoad}
        onStartRename={startRename}
        onToggleExpanded={handleRowToggleExpanded}
        registerItem={registerItem}
        renameError={editingId === id ? renameError : undefined}
        renameErrorId={renameErrorId}
        renameInstructionsId={renameInstructionsId}
        renderIcon={renderIcon}
        renderItem={renderItem}
        selectionMode={selectionMode}
        setDraftName={setDraftName}
        style={options.style}
        virtualIndex={options.virtualIndex}
      >
        {options.children}
      </MemoizedInternalFileTreeRow>
    )
  }

  const renderNodes = (ids: readonly FileTreeId[]): React.ReactNode =>
    ids.map((id) => {
      const node = tree.nodes.get(id)
      if (!node) return null

      const isExpanded = expandedSet.has(id)
      const childContent =
        node.type === "folder" && isExpanded && node.childIds
          ? renderNodes(node.childIds)
          : null

      return renderRow(id, { children: childContent })
    })

  const indentValue = typeof indent === "number" ? `${indent}px` : indent
  const rootStyle = {
    "--file-tree-indent": indentValue,
    ...style,
  } as React.CSSProperties
  const pinnedIds = uniqueIds(
    [effectiveFocusedId, editingId].filter(
      (id): id is FileTreeId => id !== undefined
    )
  )

  return (
    <>
      <div
        {...props}
        ref={setTreeElement}
        role="tree"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-multiselectable={selectionMode === "multiple" || undefined}
        data-density={density}
        data-empty={visibleNodes.length === 0 || undefined}
        data-operation-mode={operationMode}
        data-slot="file-tree"
        tabIndex={visibleNodes.length === 0 ? 0 : undefined}
        className={cn(fileTreeVariants({ density }), className)}
        style={rootStyle}
        onKeyDown={handleKeyDown}
      >
        {visibleNodes.length === 0 ? (
          <FileTreeEmpty role="treeitem" aria-disabled="true">
            {resolvedMessages.empty}
          </FileTreeEmpty>
        ) : Viewport ? (
          <Viewport
            announce={announce}
            canDropOnItem={canDropOnItemById}
            canMoveItem={canMoveItemById}
            collapseItem={(id) => setItemExpanded(id, false, "imperative")}
            density={density}
            expandedIds={expandedIds}
            expandItem={(id) => setItemExpanded(id, true, "imperative")}
            focusedId={effectiveFocusedId}
            getItemElement={getItemElement}
            operationMode={operationMode}
            pinnedIds={pinnedIds}
            registerViewportAdapter={registerViewportAdapter}
            renderRow={renderRow}
            selectedIds={selectedIds}
            sendOperationEvent={sendOperationEvent}
            tree={tree}
            treeElement={treeElement}
            visibleNodes={visibleNodes}
          />
        ) : (
          renderNodes(tree.rootIds)
        )}
      </div>
      <span
        id={renameInstructionsId}
        className="sr-only"
        data-slot="file-tree-rename-instructions"
      >
        {resolvedMessages.renameInstructions}
      </span>
      <span
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        data-slot="file-tree-live-region"
      >
        {liveMessage}
      </span>
    </>
  )
}

const FileTree = React.forwardRef(FileTreeInner) as <T = FileTreeNode>(
  props: FileTreeProps<T> & React.RefAttributes<FileTreeHandle>
) => React.ReactElement

export {
  FileTree,
  FileTreeEmpty,
  FileTreeError,
  FileTreeItem,
  FileTreeItemIcon,
  FileTreeItemLabel,
  FileTreeItemRenameInput,
  FileTreeItemToggle,
  FileTreeLoading,
  defaultFileTreeMessages,
  fileTreeItemVariants,
  fileTreeVariants,
}
