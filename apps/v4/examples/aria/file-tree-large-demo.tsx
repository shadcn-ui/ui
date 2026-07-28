"use client"

import * as React from "react"

import { FileTree, type FileTreeNode } from "@/styles/aria-nova/ui/file-tree"

function createLargeTree(folderCount = 100, filesPerFolder = 100) {
  return Array.from(
    { length: folderCount },
    (_, folderIndex): FileTreeNode => ({
      id: `folder-${folderIndex}`,
      name: `folder-${folderIndex}`,
      type: "folder",
      children: Array.from(
        { length: filesPerFolder },
        (_, fileIndex): FileTreeNode => ({
          id: `folder-${folderIndex}-file-${fileIndex}`,
          name: `file-${fileIndex}.txt`,
          type: "file",
        })
      ),
    })
  )
}

export function FileTreeLargeDemo() {
  const items = React.useMemo(() => createLargeTree(), [])

  return (
    <FileTree
      aria-label="Large file set"
      className="h-96 max-w-sm border p-2"
      items={items}
    />
  )
}
