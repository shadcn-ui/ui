<script setup lang="ts">
import { ref } from 'vue'
import Bell from "@material-symbols/svg-400/rounded/notifications.svg?component"
import Calculator from "@material-symbols/svg-400/rounded/calculate.svg?component"
import Calendar from "@material-symbols/svg-400/rounded/calendar_month.svg?component"
import ClipboardPaste from "@material-symbols/svg-400/rounded/content_paste.svg?component"
import Code from "@material-symbols/svg-400/rounded/code.svg?component"
import Copy from "@material-symbols/svg-400/rounded/content_copy.svg?component"
import CreditCard from "@material-symbols/svg-400/rounded/credit_card.svg?component"
import FileText from "@material-symbols/svg-400/rounded/description.svg?component"
import Folder from "@material-symbols/svg-400/rounded/folder.svg?component"
import FolderPlus from "@material-symbols/svg-400/rounded/create_new_folder.svg?component"
import HelpCircle from "@material-symbols/svg-400/rounded/help.svg?component"
import Home from "@material-symbols/svg-400/rounded/home.svg?component"
import Image from "@material-symbols/svg-400/rounded/image.svg?component"
import Inbox from "@material-symbols/svg-400/rounded/inbox.svg?component"
import LayoutGrid from "@material-symbols/svg-400/rounded/grid_view.svg?component"
import List from "@material-symbols/svg-400/rounded/list.svg?component"
import Plus from "@material-symbols/svg-400/rounded/add.svg?component"
import Scissors from "@material-symbols/svg-400/rounded/content_cut.svg?component"
import Settings from "@material-symbols/svg-400/rounded/settings.svg?component"
import Trash from "@material-symbols/svg-400/rounded/delete.svg?component"
import User from "@material-symbols/svg-400/rounded/person.svg?component"
import ZoomIn from "@material-symbols/svg-400/rounded/zoom_in.svg?component"
import ZoomOut from "@material-symbols/svg-400/rounded/zoom_out.svg?component"
import { Button } from '@/ui/button'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/ui/command'

const open = ref(false)
</script>

<template>
  <div class="flex flex-col gap-4">
    <Button @click="open = true" variant="outline" class="w-fit">
      Open Menu
    </Button>
    <CommandDialog :open="open" @update:open="open = $event">
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem value="home">
              <Home />
              <span>Home</span>
              <CommandShortcut>⌘H</CommandShortcut>
            </CommandItem>
            <CommandItem value="inbox">
              <Inbox />
              <span>Inbox</span>
              <CommandShortcut>⌘I</CommandShortcut>
            </CommandItem>
            <CommandItem value="documents">
              <FileText />
              <span>Documents</span>
              <CommandShortcut>⌘D</CommandShortcut>
            </CommandItem>
            <CommandItem value="folders">
              <Folder />
              <span>Folders</span>
              <CommandShortcut>⌘F</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem value="new-file">
              <Plus />
              <span>New File</span>
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem value="new-folder">
              <FolderPlus />
              <span>New Folder</span>
              <CommandShortcut>⇧⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem value="copy">
              <Copy />
              <span>Copy</span>
              <CommandShortcut>⌘C</CommandShortcut>
            </CommandItem>
            <CommandItem value="cut">
              <Scissors />
              <span>Cut</span>
              <CommandShortcut>⌘X</CommandShortcut>
            </CommandItem>
            <CommandItem value="paste">
              <ClipboardPaste />
              <span>Paste</span>
              <CommandShortcut>⌘V</CommandShortcut>
            </CommandItem>
            <CommandItem value="delete">
              <Trash />
              <span>Delete</span>
              <CommandShortcut>⌫</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="View">
            <CommandItem value="grid-view">
              <LayoutGrid />
              <span>Grid View</span>
            </CommandItem>
            <CommandItem value="list-view">
              <List />
              <span>List View</span>
            </CommandItem>
            <CommandItem value="zoom-in">
              <ZoomIn />
              <span>Zoom In</span>
              <CommandShortcut>⌘+</CommandShortcut>
            </CommandItem>
            <CommandItem value="zoom-out">
              <ZoomOut />
              <span>Zoom Out</span>
              <CommandShortcut>⌘-</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Account">
            <CommandItem value="profile">
              <User />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem value="billing">
              <CreditCard />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem value="settings">
              <Settings />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
            <CommandItem value="notifications">
              <Bell />
              <span>Notifications</span>
            </CommandItem>
            <CommandItem value="help">
              <HelpCircle />
              <span>Help &amp; Support</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Tools">
            <CommandItem value="calculator">
              <Calculator />
              <span>Calculator</span>
            </CommandItem>
            <CommandItem value="calendar">
              <Calendar />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem value="image-editor">
              <Image />
              <span>Image Editor</span>
            </CommandItem>
            <CommandItem value="code-editor">
              <Code />
              <span>Code Editor</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  </div>
</template>
