"use client"

import * as React from "react"
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react"

import { Button } from "@/styles/base-rhea/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/styles/base-rhea/ui/collapsible"

type FileNode =
  | { type: "file"; name: string; path: string }
  | { type: "folder"; name: string; path: string; children: FileNode[] }

const files: FileNode[] = [
  {
    type: "folder",
    name: "app",
    path: "app",
    children: [
      { type: "file", name: "layout.tsx", path: "app/layout.tsx" },
      { type: "file", name: "page.tsx", path: "app/page.tsx" },
    ],
  },
  {
    type: "folder",
    name: "components",
    path: "components",
    children: [
      {
        type: "folder",
        name: "ui",
        path: "components/ui",
        children: [
          {
            type: "file",
            name: "button.tsx",
            path: "components/ui/button.tsx",
          },
        ],
      },
      {
        type: "file",
        name: "login-form.tsx",
        path: "components/login-form.tsx",
      },
    ],
  },
]

function FileTreeNode({
  node,
  selected,
  onSelect,
}: {
  node: FileNode
  selected: string
  onSelect: (path: string) => void
}) {
  switch (node.type) {
    case "folder":
      return (
        <Collapsible defaultOpen>
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start font-normal aria-expanded:bg-transparent aria-expanded:hover:bg-muted dark:aria-expanded:hover:bg-muted/50"
              />
            }
          >
            <ChevronRightIcon className="transition-transform group-data-panel-open/button:rotate-90" />
            <FolderIcon />
            {node.name}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="ml-4 flex flex-col">
              {node.children.map((child) => (
                <FileTreeNode
                  key={child.path}
                  node={child}
                  selected={selected}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )
    case "file":
      return (
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start font-normal ${
            selected === node.path ? "bg-accent text-accent-foreground" : ""
          }`}
          aria-current={selected === node.path ? "true" : undefined}
          onClick={() => onSelect(node.path)}
        >
          <FileIcon />
          {node.name}
        </Button>
      )
    default: {
      const unreachable: never = node
      return unreachable
    }
  }
}

export function FileTreeDemo() {
  const [selected, setSelected] = React.useState("components/ui/button.tsx")

  return (
    <div className="flex w-full max-w-xs flex-col py-6 text-sm">
      {files.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          selected={selected}
          onSelect={setSelected}
        />
      ))}
    </div>
  )
}
