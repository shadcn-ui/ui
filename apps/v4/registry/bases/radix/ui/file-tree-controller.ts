import {
  getFileTreeAncestors,
  getVisibleFileTreeNodes,
  type FileTreeId,
  type NormalizedFileTree,
  type NormalizedFileTreeNode,
} from "./file-tree-core"

export type FileTreeOperationMode =
  | "idle"
  | "renaming"
  | "keyboardDragging"
  | "pointerDragging"
  | "pendingMove"

export type FileTreeOperationEvent =
  | { type: "startRename" }
  | { type: "startKeyboardDrag" }
  | { type: "startPointerDrag" }
  | { type: "startPendingMove" }
  | { type: "finish" }
  | { type: "cancel" }

export interface FileTreeViewportAdapter {
  ensureRendered(id: FileTreeId): void | Promise<void>
  focusElement(id: FileTreeId): void | Promise<void>
  scrollToItem(
    id: FileTreeId,
    options?: { align?: "start" | "center" | "end" | "auto" }
  ): void | Promise<void>
}

export interface FileTreeControllerSnapshot<T> {
  tree: NormalizedFileTree<T>
  expandedIds: ReadonlySet<FileTreeId>
  visibleNodes: readonly NormalizedFileTreeNode<T>[]
  visibleIds: readonly FileTreeId[]
  visibleIdSet: ReadonlySet<FileTreeId>
  indexById: ReadonlyMap<FileTreeId, number>
}

export interface FileTreeFocusRecoveryOptions<T> {
  focusedId: FileTreeId | undefined
  previousTree: NormalizedFileTree<T>
  next: FileTreeControllerSnapshot<T>
}

export function createFileTreeControllerSnapshot<T>(
  tree: NormalizedFileTree<T>,
  expandedIds: ReadonlySet<FileTreeId>
): FileTreeControllerSnapshot<T> {
  const visibleNodes = getVisibleFileTreeNodes(tree, expandedIds)
  const visibleIds = visibleNodes.map((node) => node.id)

  return {
    tree,
    expandedIds,
    visibleNodes,
    visibleIds,
    visibleIdSet: new Set(visibleIds),
    indexById: new Map(visibleIds.map((id, index) => [id, index])),
  }
}

export function getFileTreeEnabledId<T>(
  snapshot: FileTreeControllerSnapshot<T>,
  startIndex: number,
  direction: 1 | -1
) {
  for (
    let index = startIndex;
    index >= 0 && index < snapshot.visibleNodes.length;
    index += direction
  ) {
    const node = snapshot.visibleNodes[index]
    if (node && !node.disabled) return node.id
  }

  return undefined
}

export function getNextFileTreeEnabledId<T>(
  snapshot: FileTreeControllerSnapshot<T>,
  currentId: FileTreeId | undefined,
  direction: 1 | -1
) {
  const currentIndex =
    currentId === undefined ? -1 : (snapshot.indexById.get(currentId) ?? -1)
  return getFileTreeEnabledId(snapshot, currentIndex + direction, direction)
}

export function getFileTreePageTargetId<T>(
  snapshot: FileTreeControllerSnapshot<T>,
  currentId: FileTreeId | undefined,
  pageSize: number,
  direction: 1 | -1
) {
  if (snapshot.visibleNodes.length === 0) return undefined

  const currentIndex =
    currentId === undefined ? 0 : (snapshot.indexById.get(currentId) ?? 0)
  const boundedPageSize = Math.max(1, Math.floor(pageSize))
  let targetIndex = Math.min(
    snapshot.visibleNodes.length - 1,
    Math.max(0, currentIndex + boundedPageSize * direction)
  )

  while (targetIndex >= 0 && targetIndex < snapshot.visibleNodes.length) {
    const node = snapshot.visibleNodes[targetIndex]
    if (node && !node.disabled) return node.id
    targetIndex += direction
  }

  return getFileTreeEnabledId(
    snapshot,
    direction === 1 ? snapshot.visibleNodes.length - 1 : 0,
    direction === 1 ? -1 : 1
  )
}

export function getFileTreeFocusRecoveryId<T>({
  focusedId,
  previousTree,
  next,
}: FileTreeFocusRecoveryOptions<T>) {
  if (!focusedId) {
    return getFileTreeEnabledId(next, 0, 1)
  }

  const current = next.tree.nodes.get(focusedId)
  if (current && next.visibleIdSet.has(focusedId) && !current.disabled) {
    return focusedId
  }

  const previousNode = previousTree.nodes.get(focusedId)
  if (previousNode) {
    const ancestors = getFileTreeAncestors(previousTree, focusedId)
    const recoveryPath = [focusedId, ...ancestors.reverse()]

    for (const pathId of recoveryPath) {
      const pathNode = previousTree.nodes.get(pathId)
      if (!pathNode) continue

      const siblingIds =
        pathNode.parentId === null
          ? previousTree.rootIds
          : (previousTree.nodes.get(pathNode.parentId)?.childIds ?? [])
      const siblingIndex = siblingIds.indexOf(pathId)

      for (
        let index = siblingIndex + 1;
        index < siblingIds.length;
        index += 1
      ) {
        const id = siblingIds[index]
        const node = id ? next.tree.nodes.get(id) : undefined
        if (id && node && next.visibleIdSet.has(id) && !node.disabled) return id
      }

      for (let index = siblingIndex - 1; index >= 0; index -= 1) {
        const id = siblingIds[index]
        const node = id ? next.tree.nodes.get(id) : undefined
        if (id && node && next.visibleIdSet.has(id) && !node.disabled) return id
      }

      const parentId = pathNode.parentId
      const parent = parentId ? next.tree.nodes.get(parentId) : undefined
      if (
        parentId &&
        parent &&
        next.visibleIdSet.has(parentId) &&
        !parent.disabled
      ) {
        return parentId
      }
    }
  }

  return getFileTreeEnabledId(next, 0, 1)
}

export function transitionFileTreeOperationMode(
  mode: FileTreeOperationMode,
  event: FileTreeOperationEvent
): FileTreeOperationMode {
  if (event.type === "finish" || event.type === "cancel") return "idle"

  if (event.type === "startPendingMove") {
    if (
      mode === "idle" ||
      mode === "keyboardDragging" ||
      mode === "pointerDragging"
    ) {
      return "pendingMove"
    }
    return mode
  }

  if (mode !== "idle") return mode

  if (event.type === "startRename") return "renaming"
  if (event.type === "startKeyboardDrag") return "keyboardDragging"
  if (event.type === "startPointerDrag") return "pointerDragging"

  return mode
}

export function isFileTreeOperationAvailable(
  mode: FileTreeOperationMode,
  operation: Exclude<FileTreeOperationMode, "idle">
) {
  if (mode === "idle") return true
  return mode === operation
}
