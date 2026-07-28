import {
  createDefaultFileTreeAccessors,
  isFileTreeDescendant,
  normalizeFileTree,
  type FileTreeId,
  type FileTreeNode,
  type NormalizedFileTree,
} from "./file-tree-core"

export type FileTreeMovePosition = "before" | "inside" | "after"
export type FileTreeMoveInput = "pointer" | "touch" | "keyboard" | "command"
export type FileTreeOrderMode = "manual" | "grouped" | "sorted"

export interface FileTreeMoveTarget {
  index: number
  itemId: FileTreeId | null
  parentId: FileTreeId | null
  position: FileTreeMovePosition
}

export interface FileTreeMoveDestinationPosition<T> {
  index: number
  intent: FileTreeMoveIntent<T>
  itemId: FileTreeId | null
  position: FileTreeMovePosition
}

export interface FileTreeMoveDestination<T> {
  id: FileTreeId | null
  item: T | null
  level: number
  positions: readonly FileTreeMoveDestinationPosition<T>[]
}

export interface FileTreeMoveIntent<T> {
  draggedIds: readonly FileTreeId[]
  draggedItems: readonly T[]
  input: FileTreeMoveInput
  target: FileTreeMoveTarget
}

export type FileTreeMoveValidationErrorCode =
  | "empty"
  | "missing-source"
  | "disabled-source"
  | "read-only-source"
  | "missing-target"
  | "invalid-parent"
  | "disabled-target"
  | "read-only-target"
  | "self-target"
  | "descendant-target"
  | "invalid-index"
  | "sorted-order"

export interface FileTreeMoveValidationError {
  code: FileTreeMoveValidationErrorCode
  id?: FileTreeId
  message: string
}

export type FileTreeMoveValidationResult =
  | { valid: true }
  | { valid: false; error: FileTreeMoveValidationError }

export interface FileTreeMoveValidationOptions<T> {
  canDropOnItem?: (item: T) => boolean
  canMove?: (intent: FileTreeMoveIntent<T>) => boolean
  canMoveItem?: (item: T) => boolean
  orderMode?: FileTreeOrderMode
}

interface FileTreeMoveValidationContext<T> {
  draggedIdSet: ReadonlySet<FileTreeId>
  draggedItems: readonly T[]
  normalizedIds: readonly FileTreeId[]
  remainingDestinationIds?: readonly FileTreeId[]
  remainingIndexById?: ReadonlyMap<FileTreeId, number>
}

function getDocumentOrder<T>(tree: NormalizedFileTree<T>) {
  const ids: FileTreeId[] = []
  const stack = [...tree.rootIds].reverse()

  while (stack.length > 0) {
    const id = stack.pop()
    if (!id) continue
    const node = tree.nodes.get(id)
    if (!node) continue

    ids.push(id)
    if (node.childIds) {
      for (let index = node.childIds.length - 1; index >= 0; index -= 1) {
        const childId = node.childIds[index]
        if (childId) stack.push(childId)
      }
    }
  }

  return ids
}

export function normalizeFileTreeDraggedIds<T>(
  tree: NormalizedFileTree<T>,
  ids: readonly FileTreeId[]
) {
  const selectedIds = new Set(ids.filter((id) => tree.nodes.has(id)))

  return getDocumentOrder(tree).filter((id) => {
    if (!selectedIds.has(id)) return false

    let parentId = tree.nodes.get(id)?.parentId ?? null
    while (parentId !== null) {
      if (selectedIds.has(parentId)) return false
      parentId = tree.nodes.get(parentId)?.parentId ?? null
    }

    return true
  })
}

export function createFileTreeMoveIntent<T>(
  tree: NormalizedFileTree<T>,
  draggedIds: readonly FileTreeId[],
  target: FileTreeMoveTarget,
  input: FileTreeMoveInput
): FileTreeMoveIntent<T> {
  const normalizedIds = normalizeFileTreeDraggedIds(tree, draggedIds)

  return {
    draggedIds: normalizedIds,
    draggedItems: normalizedIds.flatMap((id) => {
      const item = tree.nodes.get(id)?.item
      return item === undefined ? [] : [item]
    }),
    input,
    target,
  }
}

function createNormalizedFileTreeMoveIntent<T>(
  normalizedIds: readonly FileTreeId[],
  draggedItems: readonly T[],
  target: FileTreeMoveTarget,
  input: FileTreeMoveInput
): FileTreeMoveIntent<T> {
  return {
    draggedIds: normalizedIds,
    draggedItems,
    input,
    target,
  }
}

function invalid(
  code: FileTreeMoveValidationErrorCode,
  message: string,
  id?: FileTreeId
): FileTreeMoveValidationResult {
  return { valid: false, error: { code, id, message } }
}

function validateNormalizedFileTreeMoveIntent<T>(
  tree: NormalizedFileTree<T>,
  intent: FileTreeMoveIntent<T>,
  options: FileTreeMoveValidationOptions<T>,
  context: FileTreeMoveValidationContext<T>
): FileTreeMoveValidationResult {
  const { draggedIdSet, draggedItems, normalizedIds } = context
  if (normalizedIds.length === 0) {
    return invalid("empty", "At least one existing item must be moved.")
  }

  for (const id of intent.draggedIds) {
    if (!tree.nodes.has(id)) {
      return invalid(
        "missing-source",
        `The source item "${id}" no longer exists.`,
        id
      )
    }
  }

  for (const id of normalizedIds) {
    const node = tree.nodes.get(id)
    if (!node) continue
    if (node.disabled) {
      return invalid(
        "disabled-source",
        `The source item "${id}" is disabled.`,
        id
      )
    }
    if (options.canMoveItem && !options.canMoveItem(node.item)) {
      return invalid(
        "read-only-source",
        `The source item "${id}" cannot be moved.`,
        id
      )
    }
  }

  const { target } = intent
  const targetNode = target.itemId ? tree.nodes.get(target.itemId) : undefined
  if (target.itemId && !targetNode) {
    return invalid(
      "missing-target",
      `The target item "${target.itemId}" no longer exists.`,
      target.itemId
    )
  }

  if (options.orderMode === "sorted" && target.position !== "inside") {
    return invalid(
      "sorted-order",
      "Before and after moves are unavailable in sorted mode."
    )
  }

  if (target.position === "inside") {
    if (
      !(target.itemId === null && target.parentId === null) &&
      (!targetNode ||
        targetNode.type !== "folder" ||
        target.parentId !== targetNode.id)
    ) {
      return invalid(
        "invalid-parent",
        "An inside move requires a folder target and matching parent ID.",
        target.itemId ?? undefined
      )
    }
  } else if (targetNode && targetNode.parentId !== target.parentId) {
    return invalid(
      "invalid-parent",
      "Before and after targets must use the target item's parent.",
      targetNode.id
    )
  }
  if (targetNode?.disabled) {
    return invalid(
      "disabled-target",
      `The target item "${targetNode.id}" is disabled.`,
      targetNode.id
    )
  }

  const parentNode = target.parentId
    ? tree.nodes.get(target.parentId)
    : undefined
  if (target.parentId && (!parentNode || parentNode.type !== "folder")) {
    return invalid(
      "invalid-parent",
      `The destination parent "${target.parentId}" is not a folder.`,
      target.parentId
    )
  }
  if (parentNode?.disabled) {
    return invalid(
      "disabled-target",
      `The destination folder "${parentNode.id}" is disabled.`,
      parentNode.id
    )
  }
  if (
    parentNode &&
    options.canDropOnItem &&
    !options.canDropOnItem(parentNode.item)
  ) {
    return invalid(
      "read-only-target",
      `The destination folder "${parentNode.id}" does not accept moves.`,
      parentNode.id
    )
  }

  for (const id of normalizedIds) {
    if (target.itemId === id || target.parentId === id) {
      return invalid("self-target", "An item cannot be moved onto itself.", id)
    }
    if (
      (target.itemId && isFileTreeDescendant(tree, target.itemId, id)) ||
      (target.parentId && isFileTreeDescendant(tree, target.parentId, id))
    ) {
      return invalid(
        "descendant-target",
        "An item cannot be moved into its own descendant.",
        id
      )
    }
  }

  const destinationIds =
    target.parentId === null ? tree.rootIds : (parentNode?.childIds ?? [])
  const remainingDestinationIds =
    context.remainingDestinationIds ??
    destinationIds.filter((id) => !draggedIdSet.has(id))
  const destinationSize = remainingDestinationIds.length
  if (
    !Number.isInteger(target.index) ||
    target.index < 0 ||
    target.index > destinationSize
  ) {
    return invalid(
      "invalid-index",
      `Destination index ${target.index} is outside 0..${destinationSize}.`
    )
  }
  if (target.position !== "inside" && target.itemId) {
    const targetIndex =
      context.remainingIndexById?.get(target.itemId) ??
      remainingDestinationIds.indexOf(target.itemId)
    const expectedIndex = targetIndex + (target.position === "after" ? 1 : 0)
    if (targetIndex === -1 || target.index !== expectedIndex) {
      return invalid(
        "invalid-index",
        `The ${target.position} target requires destination index ${expectedIndex}.`,
        target.itemId
      )
    }
  }

  const normalizedIntent =
    normalizedIds.length === intent.draggedIds.length &&
    normalizedIds.every((id, index) => intent.draggedIds[index] === id)
      ? intent
      : {
          ...intent,
          draggedIds: normalizedIds,
          draggedItems,
        }
  if (options.canMove && !options.canMove(normalizedIntent)) {
    return invalid("read-only-target", "The application rejected this move.")
  }

  return { valid: true }
}

export function validateFileTreeMoveIntent<T>(
  tree: NormalizedFileTree<T>,
  intent: FileTreeMoveIntent<T>,
  options: FileTreeMoveValidationOptions<T> = {}
): FileTreeMoveValidationResult {
  const normalizedIds = normalizeFileTreeDraggedIds(tree, intent.draggedIds)
  const draggedItems = normalizedIds.flatMap((id) => {
    const item = tree.nodes.get(id)?.item
    return item === undefined ? [] : [item]
  })

  return validateNormalizedFileTreeMoveIntent(tree, intent, options, {
    draggedIdSet: new Set(normalizedIds),
    draggedItems,
    normalizedIds,
  })
}

export function getFileTreeMoveDestinations<T>(
  tree: NormalizedFileTree<T>,
  draggedIds: readonly FileTreeId[],
  options: FileTreeMoveValidationOptions<T> = {}
): FileTreeMoveDestination<T>[] {
  const normalizedIds = normalizeFileTreeDraggedIds(tree, draggedIds)
  if (normalizedIds.length === 0) return []

  const parentIds: Array<FileTreeId | null> = [
    null,
    ...getDocumentOrder(tree).filter(
      (id) => tree.nodes.get(id)?.type === "folder"
    ),
  ]
  const draggedIdSet = new Set(normalizedIds)
  const draggedItems = normalizedIds.flatMap((id) => {
    const item = tree.nodes.get(id)?.item
    return item === undefined ? [] : [item]
  })

  return parentIds.flatMap((parentId) => {
    const parentNode = parentId === null ? undefined : tree.nodes.get(parentId)
    const siblingIds = (
      parentId === null ? tree.rootIds : (parentNode?.childIds ?? [])
    ).filter((id) => !draggedIdSet.has(id))
    const indexes =
      options.orderMode === "sorted"
        ? [siblingIds.length]
        : Array.from({ length: siblingIds.length + 1 }, (_, index) => index)
    const remainingIndexById = new Map(
      siblingIds.map((id, index) => [id, index] as const)
    )
    const positions = indexes.flatMap((index) => {
      const previousId = siblingIds[index - 1]
      const nextId = siblingIds[index]
      const target: FileTreeMoveTarget =
        options.orderMode === "sorted" || siblingIds.length === 0
          ? {
              index,
              itemId: parentId,
              parentId,
              position: "inside",
            }
          : previousId
            ? {
                index,
                itemId: previousId,
                parentId,
                position: "after",
              }
            : {
                index,
                itemId: nextId ?? null,
                parentId,
                position: nextId ? "before" : "inside",
              }
      const intent = createNormalizedFileTreeMoveIntent(
        normalizedIds,
        draggedItems,
        target,
        "command"
      )
      const validation = validateNormalizedFileTreeMoveIntent(
        tree,
        intent,
        options,
        {
          draggedIdSet,
          draggedItems,
          normalizedIds,
          remainingDestinationIds: siblingIds,
          remainingIndexById,
        }
      )

      return validation.valid
        ? [
            {
              index,
              intent,
              itemId: target.itemId,
              position: target.position,
            },
          ]
        : []
    })

    return positions.length > 0
      ? [
          {
            id: parentId,
            item: parentNode?.item ?? null,
            level: parentNode?.level ?? 0,
            positions,
          },
        ]
      : []
  })
}

export function moveFileTreeNodes<TData>(
  items: readonly FileTreeNode<TData>[],
  intent: FileTreeMoveIntent<FileTreeNode<TData>>
): FileTreeNode<TData>[] {
  const tree = normalizeFileTree(items, createDefaultFileTreeAccessors<TData>())
  const normalizedIds = normalizeFileTreeDraggedIds(tree, intent.draggedIds)
  const normalizedIntent = createFileTreeMoveIntent(
    tree,
    normalizedIds,
    intent.target,
    intent.input
  )
  const validation = validateFileTreeMoveIntent(tree, normalizedIntent)
  if (!validation.valid) {
    throw new Error(`[FileTree] Invalid move: ${validation.error.message}`)
  }

  const draggedIdSet = new Set(normalizedIds)
  const movedById = new Map<FileTreeId, FileTreeNode<TData>>()

  const removeDragged = (
    siblings: readonly FileTreeNode<TData>[]
  ): FileTreeNode<TData>[] =>
    siblings.flatMap((item) => {
      if (draggedIdSet.has(item.id)) {
        movedById.set(item.id, item)
        return []
      }
      if (item.children === undefined) return [item]

      const children = removeDragged(item.children)
      return children === item.children ? [item] : [{ ...item, children }]
    })

  const withoutDragged = removeDragged(items)
  const movedItems = normalizedIds.flatMap((id) => {
    const item = movedById.get(id)
    return item ? [item] : []
  })

  if (intent.target.parentId === null) {
    const next = [...withoutDragged]
    next.splice(intent.target.index, 0, ...movedItems)
    return next
  }

  let inserted = false
  const insertIntoParent = (
    siblings: readonly FileTreeNode<TData>[]
  ): FileTreeNode<TData>[] =>
    siblings.map((item) => {
      if (item.id === intent.target.parentId) {
        const children = [...(item.children ?? [])]
        children.splice(intent.target.index, 0, ...movedItems)
        inserted = true
        return { ...item, children }
      }
      if (item.children === undefined) return item

      const children = insertIntoParent(item.children)
      return children === item.children ? item : { ...item, children }
    })

  const next = insertIntoParent(withoutDragged)
  if (!inserted) {
    throw new Error(
      `[FileTree] Invalid move: The destination parent "${intent.target.parentId}" no longer exists.`
    )
  }
  return next
}
