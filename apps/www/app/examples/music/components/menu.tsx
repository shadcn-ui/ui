import { Globe, Mic } from "lucide-react"

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"

export function Menu() {
  return (
    <Menubar className="rounded-none border-b border-none px-2 lg:px-4">
      <MenubarMenu>
        <MenubarTrigger className="font-bold">Music</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>About Music</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Preferences... <MenubarShortcut>⌘,</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Hide Music... <MenubarShortcut>⌘H</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Hide Others... <MenubarShortcut>⇧⌘H</MenubarShortcut>
          </MenubarItem>
          <MenubarShortcut />
          <MenubarItem>
            Quit Music <MenubarShortcut>⌘Q</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="relative">File</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>New</MenubarSubTrigger>
            <MenubarSubContent className="w-[230px]">
              <MenubarItem>
                Playlist <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem disabled>
                Playlist from Selection <MenubarShortcut>⇧⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Smart Playlist... <MenubarShortcut>⌥⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>Playlist Folder</MenubarItem>
              <MenubarItem disabled>Genius Playlist</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarItem>
            Open Stream URL... <MenubarShortcut>⌘U</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Close Window <MenubarShortcut>⌘W</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Library</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Update Cloud Library</MenubarItem>
              <MenubarItem>Update Genius</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Organize Library...</MenubarItem>
              <MenubarItem>Export Library...</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Import Playlist...</MenubarItem>
              <MenubarItem disabled>Export Playlist...</MenubarItem>
              <MenubarItem>Show Duplicate Items</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Get Album Artwork</MenubarItem>
              <MenubarItem disabled>Get Track Names</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarItem>
            Import... <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>Burn Playlist to Disc...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Show in Finder <MenubarShortcut>⇧⌘R</MenubarShortcut>{" "}
          </MenubarItem>
          <MenubarItem>Convert</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Page Setup...</MenubarItem>
          <MenubarItem disabled>
            Print... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem disabled>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem disabled>
            Cut <MenubarShortcut>⌘X</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>
            Copy <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>
            Paste <MenubarShortcut>⌘V</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Select All <MenubarShortcut>⌘A</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>
            Deselect All <MenubarShortcut>⇧⌘A</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Smart Dictation...{" "}
            <MenubarShortcut>
              <Mic className="h-4 w-4" />
            </MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Emoji & Symbols{" "}
            <MenubarShortcut>
              <Globe className="h-4 w-4" />
            </MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem>Show Playing Next</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>Show Lyrics</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset disabled>
            Show Status Bar
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Hide Sidebar</MenubarItem>
          <MenubarItem disabled inset>
            Enter Full Screen
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="hidden md:block">Account</MenubarTrigger>
        <MenubarContent forceMount>
          <MenubarLabel inset>Switch Account</MenubarLabel>
          <MenubarSeparator />
          <MenubarRadioGroup value="benoit">
            <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
            <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem inset>Manage Famliy...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Add Account...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
