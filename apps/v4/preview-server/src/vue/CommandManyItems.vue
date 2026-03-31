<script setup lang="ts">
import { ref } from "vue"
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Example } from "@/components"
import { Button } from "@/ui/button"
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
} from "@/ui/command"

const open = ref(false)
</script>

<template>
  <Example title="Many Groups & Items">
    <div class="flex flex-col gap-4">
      <Button
        variant="outline"
        class="w-fit"
        @click="open = true"
      >
        Open Menu
      </Button>
      <CommandDialog v-model:open="open">
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              <CommandItem value="home">
                <IconPlaceholder
                  lucide="HomeIcon"
                  tabler="IconHome"
                  hugeicons="HomeIcon"
                  phosphor="HouseIcon"
                  remixicon="RiHomeLine"
                />
                <span>Home</span>
                <CommandShortcut>⌘H</CommandShortcut>
              </CommandItem>
              <CommandItem value="inbox">
                <IconPlaceholder
                  lucide="InboxIcon"
                  tabler="IconInbox"
                  hugeicons="InboxIcon"
                  phosphor="TrayIcon"
                  remixicon="RiInboxLine"
                />
                <span>Inbox</span>
                <CommandShortcut>⌘I</CommandShortcut>
              </CommandItem>
              <CommandItem value="documents">
                <IconPlaceholder
                  lucide="FileTextIcon"
                  tabler="IconFileText"
                  hugeicons="File02Icon"
                  phosphor="FileTextIcon"
                  remixicon="RiFileTextLine"
                />
                <span>Documents</span>
                <CommandShortcut>⌘D</CommandShortcut>
              </CommandItem>
              <CommandItem value="folders">
                <IconPlaceholder
                  lucide="FolderIcon"
                  tabler="IconFolder"
                  hugeicons="FolderIcon"
                  phosphor="FolderIcon"
                  remixicon="RiFolderLine"
                />
                <span>Folders</span>
                <CommandShortcut>⌘F</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem value="new-file">
                <IconPlaceholder
                  lucide="PlusIcon"
                  tabler="IconPlus"
                  hugeicons="PlusSignIcon"
                  phosphor="PlusIcon"
                  remixicon="RiAddLine"
                />
                <span>New File</span>
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem value="new-folder">
                <IconPlaceholder
                  lucide="FolderPlusIcon"
                  tabler="IconFolderPlus"
                  hugeicons="FolderAddIcon"
                  phosphor="FolderPlusIcon"
                  remixicon="RiFolderAddLine"
                />
                <span>New Folder</span>
                <CommandShortcut>⇧⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem value="copy">
                <IconPlaceholder
                  lucide="CopyIcon"
                  tabler="IconCopy"
                  hugeicons="CopyIcon"
                  phosphor="CopyIcon"
                  remixicon="RiFileCopyLine"
                />
                <span>Copy</span>
                <CommandShortcut>⌘C</CommandShortcut>
              </CommandItem>
              <CommandItem value="cut">
                <IconPlaceholder
                  lucide="ScissorsIcon"
                  tabler="IconCut"
                  hugeicons="ScissorIcon"
                  phosphor="ScissorsIcon"
                  remixicon="RiScissorsCutLine"
                />
                <span>Cut</span>
                <CommandShortcut>⌘X</CommandShortcut>
              </CommandItem>
              <CommandItem value="paste">
                <IconPlaceholder
                  lucide="ClipboardPasteIcon"
                  tabler="IconClipboard"
                  hugeicons="ClipboardIcon"
                  phosphor="ClipboardIcon"
                  remixicon="RiClipboardLine"
                />
                <span>Paste</span>
                <CommandShortcut>⌘V</CommandShortcut>
              </CommandItem>
              <CommandItem value="delete">
                <IconPlaceholder
                  lucide="TrashIcon"
                  tabler="IconTrash"
                  hugeicons="DeleteIcon"
                  phosphor="TrashIcon"
                  remixicon="RiDeleteBinLine"
                />
                <span>Delete</span>
                <CommandShortcut>⌫</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="View">
              <CommandItem value="grid-view">
                <IconPlaceholder
                  lucide="LayoutGridIcon"
                  tabler="IconLayoutGrid"
                  hugeicons="GridIcon"
                  phosphor="GridFourIcon"
                  remixicon="RiGridLine"
                />
                <span>Grid View</span>
              </CommandItem>
              <CommandItem value="list-view">
                <IconPlaceholder
                  lucide="ListIcon"
                  tabler="IconList"
                  hugeicons="Menu05Icon"
                  phosphor="ListIcon"
                  remixicon="RiListUnordered"
                />
                <span>List View</span>
              </CommandItem>
              <CommandItem value="zoom-in">
                <IconPlaceholder
                  lucide="ZoomInIcon"
                  tabler="IconZoomIn"
                  hugeicons="ZoomInAreaIcon"
                  phosphor="MagnifyingGlassPlusIcon"
                  remixicon="RiZoomInLine"
                />
                <span>Zoom In</span>
                <CommandShortcut>⌘+</CommandShortcut>
              </CommandItem>
              <CommandItem value="zoom-out">
                <IconPlaceholder
                  lucide="ZoomOutIcon"
                  tabler="IconZoomOut"
                  hugeicons="ZoomOutAreaIcon"
                  phosphor="MagnifyingGlassMinusIcon"
                  remixicon="RiZoomOutLine"
                />
                <span>Zoom Out</span>
                <CommandShortcut>⌘-</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Account">
              <CommandItem value="profile">
                <IconPlaceholder
                  lucide="UserIcon"
                  tabler="IconUser"
                  hugeicons="UserIcon"
                  phosphor="UserIcon"
                  remixicon="RiUserLine"
                />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem value="billing">
                <IconPlaceholder
                  lucide="CreditCardIcon"
                  tabler="IconCreditCard"
                  hugeicons="CreditCardIcon"
                  phosphor="CreditCardIcon"
                  remixicon="RiBankCardLine"
                />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem value="settings">
                <IconPlaceholder
                  lucide="SettingsIcon"
                  tabler="IconSettings"
                  hugeicons="SettingsIcon"
                  phosphor="GearIcon"
                  remixicon="RiSettings3Line"
                />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
              <CommandItem value="notifications">
                <IconPlaceholder
                  lucide="BellIcon"
                  tabler="IconBell"
                  hugeicons="NotificationIcon"
                  phosphor="BellIcon"
                  remixicon="RiNotification3Line"
                />
                <span>Notifications</span>
              </CommandItem>
              <CommandItem value="help">
                <IconPlaceholder
                  lucide="HelpCircleIcon"
                  tabler="IconHelpCircle"
                  hugeicons="HelpCircleIcon"
                  phosphor="QuestionIcon"
                  remixicon="RiQuestionLine"
                />
                <span>Help & Support</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Tools">
              <CommandItem value="calculator">
                <IconPlaceholder
                  lucide="CalculatorIcon"
                  tabler="IconCalculator"
                  hugeicons="CalculatorIcon"
                  phosphor="CalculatorIcon"
                  remixicon="RiCalculatorLine"
                />
                <span>Calculator</span>
              </CommandItem>
              <CommandItem value="calendar">
                <IconPlaceholder
                  lucide="CalendarIcon"
                  tabler="IconCalendar"
                  hugeicons="CalendarIcon"
                  phosphor="CalendarIcon"
                  remixicon="RiCalendarLine"
                />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem value="image-editor">
                <IconPlaceholder
                  lucide="ImageIcon"
                  tabler="IconPhoto"
                  hugeicons="ImageIcon"
                  phosphor="ImageIcon"
                  remixicon="RiImageLine"
                />
                <span>Image Editor</span>
              </CommandItem>
              <CommandItem value="code-editor">
                <IconPlaceholder
                  lucide="CodeIcon"
                  tabler="IconCode"
                  hugeicons="CodeIcon"
                  phosphor="CodeIcon"
                  remixicon="RiCodeLine"
                />
                <span>Code Editor</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  </Example>
</template>
