import { Button } from "@/examples/base/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/examples/base/ui/dialog"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/examples/base/ui/menubar"
import {
  ClipboardPasteIcon,
  CopyIcon,
  ScissorsIcon,
  TrashIcon,
} from "lucide-react"

export function MenubarInDialog() {
  return (
    <>
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Open Dialog
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
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger>More Options</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>Save Page...</MenubarItem>
                    <MenubarItem>Create Shortcut...</MenubarItem>
                    <MenubarItem>Name Window...</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>Developer Tools</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSeparator />
                <MenubarItem variant="destructive">
                  <TrashIcon />
                  Delete
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </DialogContent>
      </Dialog>
    </>
  )
}
