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
  CheckIcon,
  ImageIcon,
  LinkIcon,
  SearchIcon,
  TableIcon,
} from "lucide-react"

export function MenubarInsert() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Insert</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>
              <ImageIcon />
              Media
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Image</MenubarItem>
              <MenubarItem>Video</MenubarItem>
              <MenubarItem>Audio</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            <LinkIcon />
            Link <MenubarShortcut>⌘K</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <TableIcon />
            Table
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Tools</MenubarTrigger>
        <MenubarContent className="w-44">
          <MenubarItem>
            <SearchIcon />
            Find & Replace <MenubarShortcut>⌘F</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <CheckIcon />
            Spell Check
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
