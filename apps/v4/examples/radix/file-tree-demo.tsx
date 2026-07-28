"use client"

import { FileTree, type FileTreeNode } from "@/styles/radix-nova/ui/file-tree"

const items: FileTreeNode[] = [
  {
    id: "app",
    name: "app",
    type: "folder",
    children: [
      {
        id: "app-dashboard",
        name: "dashboard",
        type: "folder",
        children: [
          { id: "app-dashboard-page", name: "page.tsx", type: "file" },
          { id: "app-dashboard-loading", name: "loading.tsx", type: "file" },
        ],
      },
      { id: "app-layout", name: "layout.tsx", type: "file" },
      { id: "app-page", name: "page.tsx", type: "file" },
    ],
  },
  {
    id: "components",
    name: "components",
    type: "folder",
    children: [
      { id: "components-button", name: "button.tsx", type: "file" },
      { id: "components-file-tree", name: "file-tree.tsx", type: "file" },
    ],
  },
  { id: "package-json", name: "package.json", type: "file" },
  { id: "readme", name: "README.md", type: "file" },
]

export function FileTreeDemo() {
  return (
    <FileTree
      aria-label="Project files"
      className="max-w-sm border p-2"
      defaultExpandedIds={["app", "components"]}
      items={items}
      onItemAction={(item) => {
        if (item.type === "file") console.log("Open", item.name)
      }}
    />
  )
}
