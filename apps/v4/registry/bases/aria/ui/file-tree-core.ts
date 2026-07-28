export type FileTreeId = string

export type FileTreeItemType = "file" | "folder"

export interface FileTreeNode<TData = unknown> {
  id: FileTreeId
  name: string
  type: FileTreeItemType
  children?: readonly FileTreeNode<TData>[]
  disabled?: boolean
  data?: TData
}

export interface FileTreeAccessors<T> {
  getItemId: (item: T) => FileTreeId
  getItemName: (item: T) => string
  getItemType: (item: T) => FileTreeItemType
  getItemChildren: (item: T) => readonly T[] | undefined
  getItemDisabled?: (item: T) => boolean
  getItemTextValue?: (item: T) => string
}

export interface NormalizedFileTreeNode<T> {
  id: FileTreeId
  item: T
  name: string
  textValue: string
  type: FileTreeItemType
  disabled: boolean
  parentId: FileTreeId | null
  childIds: readonly FileTreeId[] | undefined
  index: number
  level: number
  setSize: number
}

export interface NormalizedFileTree<T> {
  nodes: ReadonlyMap<FileTreeId, NormalizedFileTreeNode<T>>
  rootIds: readonly FileTreeId[]
}

export interface NormalizeFileTreeOptions {
  onWarning?: (message: string) => void
}

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`[FileTree] ${message}`)
  }
}

export function createDefaultFileTreeAccessors<
  TData = unknown,
>(): FileTreeAccessors<FileTreeNode<TData>> {
  return {
    getItemId: (item) => item.id,
    getItemName: (item) => item.name,
    getItemType: (item) => item.type,
    getItemChildren: (item) => item.children,
    getItemDisabled: (item) => item.disabled ?? false,
    getItemTextValue: (item) => item.name,
  }
}

export function normalizeFileTree<T>(
  items: readonly T[],
  accessors: FileTreeAccessors<T>,
  loadedChildren: ReadonlyMap<FileTreeId, readonly T[]> = new Map(),
  options: NormalizeFileTreeOptions = {}
): NormalizedFileTree<T> {
  const nodes = new Map<FileTreeId, NormalizedFileTreeNode<T>>()
  const activePath = new Set<FileTreeId>()

  interface VisitFrame {
    siblings: readonly T[]
    parentId: FileTreeId | null
    level: number
    nextIndex: number
    ids: FileTreeId[]
    ownerId?: FileTreeId
  }

  const rootIds: FileTreeId[] = []
  const stack: VisitFrame[] = [
    {
      siblings: items,
      parentId: null,
      level: 1,
      nextIndex: 0,
      ids: rootIds,
    },
  ]

  while (stack.length > 0) {
    const frame = stack[stack.length - 1]
    if (!frame) break

    if (frame.nextIndex >= frame.siblings.length) {
      stack.pop()
      if (frame.ownerId) {
        const owner = nodes.get(frame.ownerId)
        if (owner) nodes.set(frame.ownerId, { ...owner, childIds: frame.ids })
        activePath.delete(frame.ownerId)
      }
      continue
    }

    const index = frame.nextIndex
    const item = frame.siblings[index]
    frame.nextIndex += 1

    const id = accessors.getItemId(item)
    const name = accessors.getItemName(item)
    const type = accessors.getItemType(item)

    invariant(
      typeof id === "string" && id.length > 0,
      "Every item must have a non-empty string ID."
    )
    invariant(typeof name === "string", `Item "${id}" must have a string name.`)
    invariant(
      type === "file" || type === "folder",
      `Item "${id}" must have type "file" or "folder".`
    )
    invariant(
      !activePath.has(id),
      `Cycle detected while visiting item "${id}".`
    )
    invariant(!nodes.has(id), `Duplicate item ID "${id}".`)

    const sourceChildren = accessors.getItemChildren(item)
    let children = sourceChildren

    if (type === "file" && sourceChildren && sourceChildren.length > 0) {
      options.onWarning?.(
        `File item "${id}" has children. Children of file items are ignored.`
      )
      children = undefined
    }

    if (type === "folder" && sourceChildren === undefined) {
      children = loadedChildren.get(id)
    }

    const node: NormalizedFileTreeNode<T> = {
      id,
      item,
      name,
      textValue: accessors.getItemTextValue?.(item) ?? name,
      type,
      disabled: accessors.getItemDisabled?.(item) ?? false,
      parentId: frame.parentId,
      childIds: type === "folder" && children === undefined ? undefined : [],
      index,
      level: frame.level,
      setSize: frame.siblings.length,
    }

    nodes.set(id, node)
    frame.ids.push(id)

    if (type === "folder" && children !== undefined) {
      activePath.add(id)
      stack.push({
        siblings: children,
        parentId: id,
        level: frame.level + 1,
        nextIndex: 0,
        ids: [],
        ownerId: id,
      })
    }
  }

  return { nodes, rootIds }
}

export function getVisibleFileTreeNodes<T>(
  tree: NormalizedFileTree<T>,
  expandedIds: ReadonlySet<FileTreeId>
): NormalizedFileTreeNode<T>[] {
  const visible: NormalizedFileTreeNode<T>[] = []
  const stack = [...tree.rootIds].reverse()

  while (stack.length > 0) {
    const id = stack.pop()
    if (!id) continue
    const node = tree.nodes.get(id)
    if (!node) continue

    visible.push(node)
    if (expandedIds.has(id) && node.childIds) {
      for (let index = node.childIds.length - 1; index >= 0; index -= 1) {
        const childId = node.childIds[index]
        if (childId) stack.push(childId)
      }
    }
  }

  return visible
}

export function getFileTreeAncestors<T>(
  tree: NormalizedFileTree<T>,
  id: FileTreeId
): FileTreeId[] {
  const ancestors: FileTreeId[] = []
  let parentId = tree.nodes.get(id)?.parentId ?? null

  while (parentId !== null) {
    ancestors.unshift(parentId)
    parentId = tree.nodes.get(parentId)?.parentId ?? null
  }

  return ancestors
}

export function isFileTreeDescendant<T>(
  tree: NormalizedFileTree<T>,
  id: FileTreeId,
  possibleAncestorId: FileTreeId
): boolean {
  let parentId = tree.nodes.get(id)?.parentId ?? null

  while (parentId !== null) {
    if (parentId === possibleAncestorId) return true
    parentId = tree.nodes.get(parentId)?.parentId ?? null
  }

  return false
}

export function getFileTreeSiblingIds<T>(
  tree: NormalizedFileTree<T>,
  id: FileTreeId
): readonly FileTreeId[] {
  const node = tree.nodes.get(id)
  if (!node) return []

  if (node.parentId === null) return tree.rootIds
  return tree.nodes.get(node.parentId)?.childIds ?? []
}

export function getFileTreeRange(
  visibleIds: readonly FileTreeId[],
  fromId: FileTreeId,
  toId: FileTreeId
): FileTreeId[] {
  const fromIndex = visibleIds.indexOf(fromId)
  const toIndex = visibleIds.indexOf(toId)

  if (fromIndex === -1 || toIndex === -1) return [toId]

  const start = Math.min(fromIndex, toIndex)
  const end = Math.max(fromIndex, toIndex)
  return visibleIds.slice(start, end + 1)
}

function normalizeSearchValue(value: string, locale?: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase(locale)
}

export function findFileTreeTypeaheadMatch<T>(
  visibleNodes: readonly NormalizedFileTreeNode<T>[],
  currentId: FileTreeId | undefined,
  query: string,
  locale?: string
): FileTreeId | undefined {
  if (visibleNodes.length === 0 || query.length === 0) return undefined

  const normalizedQuery = normalizeSearchValue(query, locale)
  const currentIndex = currentId
    ? visibleNodes.findIndex((node) => node.id === currentId)
    : -1

  for (let offset = 1; offset <= visibleNodes.length; offset += 1) {
    const index = (currentIndex + offset) % visibleNodes.length
    const node = visibleNodes[index]

    if (
      node &&
      !node.disabled &&
      normalizeSearchValue(node.textValue, locale).startsWith(normalizedQuery)
    ) {
      return node.id
    }
  }

  return undefined
}
