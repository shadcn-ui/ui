import { Button } from "@/examples/radix/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/examples/radix/ui/context-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/examples/radix/ui/dialog"
import {
  ClipboardPasteIcon,
  CopyIcon,
  ScissorsIcon,
  TrashIcon,
} from "lucide-react"

export function ContextMenuInDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Context Menu Example</DialogTitle>
          <DialogDescription>
            Right click on the area below to see the context menu.
          </DialogDescription>
        </DialogHeader>
        <ContextMenu>
          <ContextMenuTrigger className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
            Right click here
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuGroup>
              <ContextMenuItem>
                <CopyIcon />
                Copy
              </ContextMenuItem>
              <ContextMenuItem>
                <ScissorsIcon />
                Cut
              </ContextMenuItem>
              <ContextMenuItem>
                <ClipboardPasteIcon />
                Paste
              </ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger>More Options</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuGroup>
                  <ContextMenuItem>Save Page...</ContextMenuItem>
                  <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                  <ContextMenuItem>Name Window...</ContextMenuItem>
                </ContextMenuGroup>
                <ContextMenuSeparator />
                <ContextMenuGroup>
                  <ContextMenuItem>Developer Tools</ContextMenuItem>
                </ContextMenuGroup>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuItem variant="destructive">
                <TrashIcon />
                Delete
              </ContextMenuItem>
            </ContextMenuGroup>
          </ContextMenuContent>
        </ContextMenu>
      </DialogContent>
    </Dialog>
  )
}
