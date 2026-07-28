"use client"

import * as React from "react"

import { Button } from "@/styles/radix-nova/ui/button"
import {
  FileTree,
  type FileTreeHandle,
  type FileTreeLoadContext,
  type FileTreeNode,
} from "@/styles/radix-nova/ui/file-tree"

const items: FileTreeNode[] = [
  { id: "inbox", name: "Inbox", type: "folder" },
  { id: "archive", name: "Archive", type: "folder" },
]

const childrenByFolder: Record<string, readonly FileTreeNode[]> = {
  inbox: [
    { id: "welcome", name: "welcome.txt", type: "file" },
    { id: "roadmap", name: "roadmap.md", type: "file" },
  ],
  archive: [{ id: "notes-2025", name: "notes-2025.md", type: "file" }],
}

function wait(milliseconds: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(resolve, milliseconds)
    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeout)
        reject(new DOMException("The request was aborted.", "AbortError"))
      },
      { once: true }
    )
  })
}

export function FileTreeAsyncDemo() {
  const treeRef = React.useRef<FileTreeHandle>(null)

  async function loadChildren({
    id,
    signal,
  }: FileTreeLoadContext<FileTreeNode>) {
    await wait(500, signal)
    return childrenByFolder[id] ?? []
  }

  return (
    <div className="grid max-w-sm gap-3">
      <FileTree
        ref={treeRef}
        aria-label="Remote files"
        className="border p-2"
        items={items}
        loadChildren={loadChildren}
      />
      <Button
        className="w-fit"
        onClick={() => treeRef.current?.refresh("inbox")}
        size="sm"
        type="button"
        variant="outline"
      >
        Refresh Inbox
      </Button>
    </div>
  )
}
