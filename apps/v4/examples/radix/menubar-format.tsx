import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/examples/radix/ui/menubar"
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

export function MenubarFormat() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Format</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              <BoldIcon />
              Bold <MenubarShortcut>⌘B</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <ItalicIcon />
              Italic <MenubarShortcut>⌘I</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <UnderlineIcon />
              Underline <MenubarShortcut>⌘U</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarCheckboxItem checked>Strikethrough</MenubarCheckboxItem>
            <MenubarCheckboxItem>Code</MenubarCheckboxItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem>Show Ruler</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>Show Grid</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem inset>Zoom In</MenubarItem>
            <MenubarItem inset>Zoom Out</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
