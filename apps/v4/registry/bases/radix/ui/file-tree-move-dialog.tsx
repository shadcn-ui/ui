"use client"

import * as React from "react"

import { Button } from "@/registry/bases/radix/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/bases/radix/ui/dialog"

import {
  createDefaultFileTreeAccessors,
  getFileTreeAncestors,
  normalizeFileTree,
  type FileTreeAccessors,
  type FileTreeId,
  type FileTreeNode,
} from "./file-tree-core"
import {
  getFileTreeMoveDestinations,
  type FileTreeMoveIntent,
  type FileTreeMoveValidationOptions,
  type FileTreeOrderMode,
} from "./file-tree-sortable-core"

export interface FileTreeMoveDialogMessages {
  afterItem: (name: string) => string
  atBeginning: string
  cancel: string
  description: (count: number) => string
  destinationLabel: string
  error: (message: string) => string
  insideDestination: (name: string) => string
  move: string
  moving: string
  noDestinations: string
  positionLabel: string
  rootLabel: string
  title: string
}

const defaultFileTreeMoveDialogMessages: FileTreeMoveDialogMessages = {
  afterItem: (name) => `After ${name}`,
  atBeginning: "At beginning",
  cancel: "Cancel",
  description: (count) =>
    `Choose a destination and position for ${count} ${count === 1 ? "item" : "items"}.`,
  destinationLabel: "Destination folder",
  error: (message) => `Move failed. ${message}`,
  insideDestination: (name) => `Inside ${name}`,
  move: "Move",
  moving: "Moving…",
  noDestinations: "No legal destinations are available.",
  positionLabel: "Position",
  rootLabel: "Project root",
  title: "Move to…",
}

export interface FileTreeMoveDialogErrorDetails<T> {
  error: unknown
  intent: FileTreeMoveIntent<T>
}

export interface FileTreeMoveDialogProps<T = FileTreeNode> {
  accessors?: FileTreeAccessors<T>
  canMove?: (intent: FileTreeMoveIntent<T>) => boolean
  defaultOpen?: boolean
  draggedIds: readonly FileTreeId[]
  isItemDroppable?: boolean | ((item: T) => boolean)
  isItemMovable?: boolean | ((item: T) => boolean)
  items: readonly T[]
  messages?: Partial<FileTreeMoveDialogMessages>
  onMove: (intent: FileTreeMoveIntent<T>) => void | Promise<void>
  onMoveError?: (details: FileTreeMoveDialogErrorDetails<T>) => void
  onOpenChange?: (open: boolean) => void
  open?: boolean
  orderMode?: FileTreeOrderMode
}

function resolveCapability<T>(
  capability: boolean | ((item: T) => boolean) | undefined,
  item: T,
  fallback: boolean
) {
  return typeof capability === "function"
    ? capability(item)
    : (capability ?? fallback)
}

function FileTreeMoveDialog<T = FileTreeNode>({
  accessors,
  canMove,
  defaultOpen = false,
  draggedIds,
  isItemDroppable,
  isItemMovable,
  items,
  messages,
  onMove,
  onMoveError,
  onOpenChange,
  open,
  orderMode = "manual",
}: FileTreeMoveDialogProps<T>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const [destinationIndex, setDestinationIndex] = React.useState(0)
  const [positionIndex, setPositionIndex] = React.useState(0)
  const [isPending, setIsPending] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string>()
  const resolvedOpen = open ?? uncontrolledOpen
  const resolvedMessages = React.useMemo(
    () => ({ ...defaultFileTreeMoveDialogMessages, ...messages }),
    [messages]
  )
  const resolvedAccessors = React.useMemo(
    () =>
      (accessors ??
        createDefaultFileTreeAccessors()) as unknown as FileTreeAccessors<T>,
    [accessors]
  )
  const tree = React.useMemo(
    () => normalizeFileTree(items, resolvedAccessors),
    [items, resolvedAccessors]
  )
  const validationOptions = React.useMemo<FileTreeMoveValidationOptions<T>>(
    () => ({
      canDropOnItem: (item) => resolveCapability(isItemDroppable, item, true),
      canMove,
      canMoveItem: (item) => resolveCapability(isItemMovable, item, true),
      orderMode,
    }),
    [canMove, isItemDroppable, isItemMovable, orderMode]
  )
  const destinations = React.useMemo(
    () => getFileTreeMoveDestinations(tree, draggedIds, validationOptions),
    [draggedIds, tree, validationOptions]
  )
  const selectedDestination =
    destinations[Math.min(destinationIndex, destinations.length - 1)]
  const selectedPosition =
    selectedDestination?.positions[
      Math.min(positionIndex, selectedDestination.positions.length - 1)
    ]

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (open === undefined) setUncontrolledOpen(nextOpen)
      if (!nextOpen) setErrorMessage(undefined)
      onOpenChange?.(nextOpen)
    },
    [onOpenChange, open]
  )

  const getDestinationLabel = React.useCallback(
    (id: FileTreeId | null) => {
      if (id === null) return resolvedMessages.rootLabel
      return [...getFileTreeAncestors(tree, id), id]
        .map((pathId) => tree.nodes.get(pathId)?.name)
        .filter((name): name is string => Boolean(name))
        .join(" / ")
    },
    [resolvedMessages.rootLabel, tree]
  )

  const getPositionLabel = React.useCallback(
    (position: NonNullable<typeof selectedPosition>) => {
      if (position.position === "before") {
        return resolvedMessages.atBeginning
      }
      if (position.position === "after" && position.itemId) {
        return resolvedMessages.afterItem(
          tree.nodes.get(position.itemId)?.name ?? position.itemId
        )
      }
      return resolvedMessages.insideDestination(
        getDestinationLabel(position.intent.target.parentId)
      )
    },
    [getDestinationLabel, resolvedMessages, tree.nodes]
  )

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedPosition || isPending) return

    const intent = selectedPosition.intent
    setErrorMessage(undefined)
    setIsPending(true)
    try {
      await onMove(intent)
      setOpen(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setErrorMessage(resolvedMessages.error(message))
      onMoveError?.({ error, intent })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={resolvedOpen} onOpenChange={setOpen}>
      <DialogContent className="max-w-md" showCloseButton={false}>
        <form
          className="grid gap-4"
          onSubmit={(event) => void handleSubmit(event)}
        >
          <DialogHeader>
            <DialogTitle>{resolvedMessages.title}</DialogTitle>
            <DialogDescription>
              {resolvedMessages.description(draggedIds.length)}
            </DialogDescription>
          </DialogHeader>
          {destinations.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {resolvedMessages.noDestinations}
            </p>
          ) : (
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-medium">
                {resolvedMessages.destinationLabel}
                <select
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  disabled={isPending}
                  value={Math.min(destinationIndex, destinations.length - 1)}
                  onChange={(event) => {
                    setDestinationIndex(Number(event.target.value))
                    setPositionIndex(0)
                  }}
                >
                  {destinations.map((destination, index) => (
                    <option key={destination.id ?? "root"} value={index}>
                      {getDestinationLabel(destination.id)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                {resolvedMessages.positionLabel}
                <select
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  disabled={isPending}
                  value={Math.min(
                    positionIndex,
                    (selectedDestination?.positions.length ?? 1) - 1
                  )}
                  onChange={(event) =>
                    setPositionIndex(Number(event.target.value))
                  }
                >
                  {selectedDestination?.positions.map((position, index) => (
                    <option
                      key={`${position.position}:${position.itemId ?? "root"}:${position.index}`}
                      value={index}
                    >
                      {getPositionLabel(position)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
          {errorMessage && (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setOpen(false)}
            >
              {resolvedMessages.cancel}
            </Button>
            <Button type="submit" disabled={!selectedPosition || isPending}>
              {isPending ? resolvedMessages.moving : resolvedMessages.move}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { FileTreeMoveDialog, defaultFileTreeMoveDialogMessages }
