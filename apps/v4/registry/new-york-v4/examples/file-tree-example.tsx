import {
  FileTree,
  type FileTreeNode,
} from "@/registry/new-york-v4/ui/file-tree"

const items: FileTreeNode[] = [
  {
    id: "app",
    name: "app",
    type: "folder",
    children: [
      {
        id: "dashboard",
        name: "dashboard",
        type: "folder",
        children: [
          { id: "dashboard-page", name: "page.tsx", type: "file" },
          { id: "dashboard-loading", name: "loading.tsx", type: "file" },
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
      { id: "button", name: "button.tsx", type: "file" },
      { id: "file-tree", name: "file-tree.tsx", type: "file" },
    ],
  },
  { id: "package", name: "package.json", type: "file" },
]

export default function FileTreeExample() {
  return (
    <FileTree
      aria-label="Project files"
      className="max-w-sm border p-2"
      defaultExpandedIds={["app", "components"]}
      defaultSelectedIds={["dashboard-page"]}
      items={items}
    />
  )
}
