"use client"

import * as React from "react"

import {
  FileTree,
  type FileTreeId,
  type FileTreeNode,
} from "@/styles/base-nova/ui/file-tree"

const items: FileTreeNode[] = [
  {
    id: "src",
    name: "src",
    type: "folder",
    children: [
      { id: "index", name: "index.ts", type: "file" },
      { id: "styles", name: "styles.css", type: "file" },
      { id: "tests", name: "index.test.ts", type: "file" },
    ],
  },
  { id: "license", name: "LICENSE", type: "file" },
]

export function FileTreeControlledDemo() {
  const [expandedIds, setExpandedIds] = React.useState<readonly FileTreeId[]>([
    "src",
  ])
  const [selectedIds, setSelectedIds] = React.useState<readonly FileTreeId[]>([
    "index",
  ])

  return (
    <div className="grid max-w-sm gap-3">
      <FileTree
        aria-label="Source files"
        className="border p-2"
        expandedIds={expandedIds}
        items={items}
        onExpandedIdsChange={setExpandedIds}
        onSelectedIdsChange={setSelectedIds}
        selectedIds={selectedIds}
        selectionMode="multiple"
      />
      <p className="text-xs text-muted-foreground">
        Selected: {selectedIds.join(", ") || "none"}
      </p>
    </div>
  )
}
