import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/examples/base/ui/menubar"
import {
  FileIcon,
  FolderIcon,
  LogOutIcon,
  SettingsIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react"

export function MenubarDestructive() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent className="w-40">
          <MenubarItem>
            <FileIcon />
            New File <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <FolderIcon />
            Open Folder
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">
            <TrashIcon />
            Delete File <MenubarShortcut>⌘⌫</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Account</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <UserIcon />
            Profile
          </MenubarItem>
          <MenubarItem>
            <SettingsIcon />
            Settings
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">
            <LogOutIcon />
            Sign out
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">
            <TrashIcon />
            Delete
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
