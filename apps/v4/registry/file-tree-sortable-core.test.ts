import { describe, expect, it } from "vitest"

import {
  createDefaultFileTreeAccessors,
  normalizeFileTree,
  type FileTreeNode,
} from "./bases/base/ui/file-tree-core"
import {
  createFileTreeMoveIntent,
  getFileTreeMoveDestinations,
  moveFileTreeNodes,
  normalizeFileTreeDraggedIds,
  validateFileTreeMoveIntent,
  type FileTreeMoveInput,
  type FileTreeMoveTarget,
} from "./bases/base/ui/file-tree-sortable-core"

const items: FileTreeNode[] = [
  {
    id: "src",
    name: "src",
    type: "folder",
    children: [
      { id: "alpha", name: "alpha.ts", type: "file" },
      { id: "beta", name: "beta.ts", type: "file" },
      { id: "gamma", name: "gamma.ts", type: "file" },
    ],
  },
  {
    id: "docs",
    name: "docs",
    type: "folder",
    children: [{ id: "guide", name: "guide.md", type: "file" }],
  },
  { id: "readme", name: "README.md", type: "file" },
]

function createTree(nextItems: readonly FileTreeNode[] = items) {
  return normalizeFileTree(nextItems, createDefaultFileTreeAccessors())
}

function createIntent(
  draggedIds: readonly string[],
  target: FileTreeMoveTarget,
  input: FileTreeMoveInput = "command",
  nextItems: readonly FileTreeNode[] = items
) {
  return createFileTreeMoveIntent(
    createTree(nextItems),
    draggedIds,
    target,
    input
  )
}

function childIds(treeItems: readonly FileTreeNode[], parentId: string) {
  return treeItems
    .find((item) => item.id === parentId)
    ?.children?.map((item) => item.id)
}

describe("file tree move intents", () => {
  it("normalizes ancestor and descendant selections in document order", () => {
    const tree = createTree()

    expect(
      normalizeFileTreeDraggedIds(tree, ["gamma", "alpha", "src", "docs"])
    ).toEqual(["src", "docs"])
    expect(
      createFileTreeMoveIntent(
        tree,
        ["gamma", "alpha"],
        { itemId: "docs", parentId: "docs", index: 1, position: "inside" },
        "keyboard"
      ).draggedItems.map((item) => item.id)
    ).toEqual(["alpha", "gamma"])
  })

  it("validates explicit before, after, and empty-root positions", () => {
    const tree = createTree()

    expect(
      validateFileTreeMoveIntent(
        tree,
        createIntent(["alpha"], {
          itemId: "gamma",
          parentId: "src",
          index: 1,
          position: "before",
        })
      )
    ).toEqual({ valid: true })
    expect(
      validateFileTreeMoveIntent(
        tree,
        createIntent(["alpha"], {
          itemId: "gamma",
          parentId: "src",
          index: 2,
          position: "after",
        })
      )
    ).toEqual({ valid: true })
    expect(
      validateFileTreeMoveIntent(
        tree,
        createIntent(["alpha"], {
          itemId: null,
          parentId: null,
          index: 3,
          position: "inside",
        })
      )
    ).toEqual({ valid: true })
  })

  it("rejects inconsistent indexes before callbacks can observe them", () => {
    const result = validateFileTreeMoveIntent(
      createTree(),
      createIntent(["alpha"], {
        itemId: "gamma",
        parentId: "src",
        index: 0,
        position: "after",
      })
    )

    expect(result).toMatchObject({
      valid: false,
      error: { code: "invalid-index" },
    })
  })

  it.each([
    [
      "self",
      ["src"],
      { itemId: "src", parentId: "src", index: 0, position: "inside" },
      "self-target",
    ],
    [
      "descendant",
      ["src"],
      { itemId: "docs", parentId: "alpha", index: 0, position: "before" },
      "invalid-parent",
    ],
  ] as const)("rejects a %s target", (_, draggedIds, target, code) => {
    expect(
      validateFileTreeMoveIntent(createTree(), createIntent(draggedIds, target))
    ).toMatchObject({ valid: false, error: { code } })
  })

  it("rejects moving a folder into its own descendant", () => {
    const nestedItems: FileTreeNode[] = [
      {
        id: "parent",
        name: "parent",
        type: "folder",
        children: [
          { id: "child", name: "child", type: "folder", children: [] },
        ],
      },
    ]
    const result = validateFileTreeMoveIntent(
      createTree(nestedItems),
      createIntent(
        ["parent"],
        {
          itemId: "child",
          parentId: "child",
          index: 0,
          position: "inside",
        },
        "command",
        nestedItems
      )
    )

    expect(result).toMatchObject({
      valid: false,
      error: { code: "descendant-target" },
    })
  })

  it("uses one capability policy for sources and destinations", () => {
    const sourceRejected = validateFileTreeMoveIntent(
      createTree(),
      createIntent(["alpha"], {
        itemId: "docs",
        parentId: "docs",
        index: 1,
        position: "inside",
      }),
      { canMoveItem: (item) => item.id !== "alpha" }
    )
    const targetRejected = validateFileTreeMoveIntent(
      createTree(),
      createIntent(["alpha"], {
        itemId: "docs",
        parentId: "docs",
        index: 1,
        position: "inside",
      }),
      { canDropOnItem: (item) => item.id !== "docs" }
    )

    expect(sourceRejected).toMatchObject({
      valid: false,
      error: { code: "read-only-source" },
    })
    expect(targetRejected).toMatchObject({
      valid: false,
      error: { code: "read-only-target" },
    })
  })

  it("suppresses manual ordering in sorted mode", () => {
    expect(
      validateFileTreeMoveIntent(
        createTree(),
        createIntent(["alpha"], {
          itemId: "beta",
          parentId: "src",
          index: 0,
          position: "before",
        }),
        { orderMode: "sorted" }
      )
    ).toMatchObject({ valid: false, error: { code: "sorted-order" } })
  })

  it("enumerates every legal command insertion index", () => {
    const destinations = getFileTreeMoveDestinations(createTree(), ["alpha"])
    const src = destinations.find((destination) => destination.id === "src")
    const docs = destinations.find((destination) => destination.id === "docs")

    expect(src?.positions.map((position) => position.index)).toEqual([0, 1, 2])
    expect(docs?.positions.map((position) => position.index)).toEqual([0, 1])
    expect(
      destinations
        .flatMap((destination) => destination.positions)
        .every((position) => position.intent.input === "command")
    ).toBe(true)
  })

  it("filters illegal descendants and capability-rejected destinations", () => {
    const destinations = getFileTreeMoveDestinations(createTree(), ["src"], {
      canDropOnItem: (item) => item.id !== "docs",
    })

    expect(destinations.map((destination) => destination.id)).toEqual([null])
  })

  it("offers one parent-only destination in sorted mode", () => {
    const docs = getFileTreeMoveDestinations(createTree(), ["alpha"], {
      orderMode: "sorted",
    }).find((destination) => destination.id === "docs")

    expect(docs?.positions).toHaveLength(1)
    expect(docs?.positions[0]?.intent.target).toMatchObject({
      index: 1,
      parentId: "docs",
      position: "inside",
    })
  })

  it("enumerates a large flat destination set within a linear-time budget", () => {
    const largeItems: FileTreeNode[] = Array.from(
      { length: 20_000 },
      (_, index) => ({
        id: `file-${index}`,
        name: `file-${index}.txt`,
        type: "file",
      })
    )
    const tree = createTree(largeItems)
    const startedAt = performance.now()
    const destinations = getFileTreeMoveDestinations(tree, ["file-0"])
    const duration = performance.now() - startedAt

    expect(destinations).toHaveLength(1)
    expect(destinations[0]?.positions).toHaveLength(20_000)
    expect(duration).toBeLessThan(1_000)
  })
})

describe("moveFileTreeNodes", () => {
  it("moves down and up within one parent using post-removal indexes", () => {
    const down = moveFileTreeNodes(
      items,
      createIntent(["alpha"], {
        itemId: "gamma",
        parentId: "src",
        index: 2,
        position: "after",
      })
    )
    const up = moveFileTreeNodes(
      down,
      createIntent(
        ["gamma"],
        {
          itemId: "beta",
          parentId: "src",
          index: 0,
          position: "before",
        },
        "command",
        down
      )
    )

    expect(childIds(down, "src")).toEqual(["beta", "gamma", "alpha"])
    expect(childIds(up, "src")).toEqual(["gamma", "beta", "alpha"])
  })

  it("moves multiple items across parents and preserves document order", () => {
    const next = moveFileTreeNodes(
      items,
      createIntent(["gamma", "alpha"], {
        itemId: "docs",
        parentId: "docs",
        index: 1,
        position: "inside",
      })
    )

    expect(childIds(next, "src")).toEqual(["beta"])
    expect(childIds(next, "docs")).toEqual(["guide", "alpha", "gamma"])
  })

  it("moves into an empty folder without mutating consumer data", () => {
    const emptyItems: FileTreeNode[] = [
      { id: "empty", name: "empty", type: "folder", children: [] },
      { id: "file", name: "file.txt", type: "file" },
    ]
    const next = moveFileTreeNodes(
      emptyItems,
      createIntent(
        ["file"],
        {
          itemId: "empty",
          parentId: "empty",
          index: 0,
          position: "inside",
        },
        "command",
        emptyItems
      )
    )

    expect(childIds(next, "empty")).toEqual(["file"])
    expect(emptyItems).toEqual([
      { id: "empty", name: "empty", type: "folder", children: [] },
      { id: "file", name: "file.txt", type: "file" },
    ])
  })
})
