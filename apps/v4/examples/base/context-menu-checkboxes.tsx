import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuTrigger,
} from "@/examples/base/ui/context-menu"

export function ContextMenuCheckboxes() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm">
        <span className="hidden pointer-fine:inline-block">
          Right click here
        </span>
        <span className="hidden pointer-coarse:inline-block">
          Long press here
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuCheckboxItem defaultChecked>
            Show Bookmarks Bar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem defaultChecked>
            Show Developer Tools
          </ContextMenuCheckboxItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}
