import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/base/components/example"
import { FileTree, type FileTreeNode } from "@/registry/bases/base/ui/file-tree"

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

export default function FileTreeExamples() {
  return (
    <ExampleWrapper>
      <Example title="Default">
        <FileTree
          aria-label="Project files"
          className="max-w-sm border p-2"
          defaultExpandedIds={["app", "components"]}
          defaultSelectedIds={["dashboard-page"]}
          items={items}
        />
      </Example>
      <Example title="Compact and multiple selection">
        <FileTree
          aria-label="Compact project files"
          className="max-w-sm border p-2"
          defaultExpandedIds={["app", "components"]}
          defaultSelectedIds={["app-layout", "app-page"]}
          density="compact"
          items={items}
          selectionMode="multiple"
        />
      </Example>
    </ExampleWrapper>
  )
}
