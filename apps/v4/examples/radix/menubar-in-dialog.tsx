import { Button } from "@/examples/radix/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/examples/radix/ui/dialog"
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/examples/radix/ui/menubar"
import {
  ClipboardPasteIcon,
  CopyIcon,
  ScissorsIcon,
  TrashIcon,
} from "lucide-react"

export function MenubarInDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Menubar Example</DialogTitle>
          <DialogDescription>
            Use the menubar below to see the menu options.
          </DialogDescription>
        </DialogHeader>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarItem>
                  <CopyIcon />
                  Copy
                </MenubarItem>
                <MenubarItem>
                  <ScissorsIcon />
                  Cut
                </MenubarItem>
                <MenubarItem>
                  <ClipboardPasteIcon />
                  Paste
                </MenubarItem>
              </MenubarGroup>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>More Options</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarGroup>
                    <MenubarItem>Save Page...</MenubarItem>
                    <MenubarItem>Create Shortcut...</MenubarItem>
                    <MenubarItem>Name Window...</MenubarItem>
                  </MenubarGroup>
                  <MenubarSeparator />
                  <MenubarGroup>
                    <MenubarItem>Developer Tools</MenubarItem>
                  </MenubarGroup>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarGroup>
                <MenubarItem variant="destructive">
                  <TrashIcon />
                  Delete
                </MenubarItem>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarItem>
                  Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                </MenubarItem>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </DialogContent>
    </Dialog>
  )
}
