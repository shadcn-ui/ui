"use client"

import * as React from "react"

import {
  FileTree,
  type FileTreeNode,
  type FileTreeRenameDetails,
} from "@/styles/aria-nova/ui/file-tree"

const initialItems: FileTreeNode[] = [
  {
    id: "documents",
    name: "Documents",
    type: "folder",
    children: [
      { id: "proposal", name: "proposal.md", type: "file" },
      { id: "budget", name: "budget.csv", type: "file" },
    ],
  },
]

function renameNode(
  items: readonly FileTreeNode[],
  id: string,
  name: string
): FileTreeNode[] {
  return items.map((item) => ({
    ...item,
    name: item.id === id ? name : item.name,
    children: item.children ? renameNode(item.children, id, name) : undefined,
  }))
}

export function FileTreeRenameDemo() {
  const [items, setItems] = React.useState(initialItems)

  function handleRename({ id, name }: FileTreeRenameDetails<FileTreeNode>) {
    setItems((current) => renameNode(current, id, name))
  }

  return (
    <FileTree
      aria-label="Editable documents"
      className="max-w-sm border p-2"
      defaultExpandedIds={["documents"]}
      defaultSelectedIds={["proposal"]}
      items={items}
      onRename={handleRename}
      validateRename={(name) =>
        name.includes("/") ? "Names cannot contain a slash." : undefined
      }
    />
  )
}
