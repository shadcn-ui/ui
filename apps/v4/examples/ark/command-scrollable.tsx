"use client"

import * as React from "react"
import { Button } from "@/examples/ark/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemText,
  CommandList,
  CommandShortcut,
  useListCollection,
} from "@/examples/ark/ui/command"
import {
  BellIcon,
  CalculatorIcon,
  CalendarIcon,
  ClipboardPasteIcon,
  CodeIcon,
  CopyIcon,
  CreditCardIcon,
  FileTextIcon,
  FolderIcon,
  FolderPlusIcon,
  HelpCircleIcon,
  HomeIcon,
  ImageIcon,
  InboxIcon,
  LayoutGridIcon,
  ListIcon,
  PlusIcon,
  ScissorsIcon,
  SettingsIcon,
  TrashIcon,
  UserIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react"

export function CommandManyItems() {
  const [open, setOpen] = React.useState(false)

  const { collection, filter } = useListCollection({
    initialItems: [
      { label: "Home", value: "home", group: "navigation", shortcut: "⌘H" },
      { label: "Inbox", value: "inbox", group: "navigation", shortcut: "⌘I" },
      {
        label: "Documents",
        value: "documents",
        group: "navigation",
        shortcut: "⌘D",
      },
      {
        label: "Folders",
        value: "folders",
        group: "navigation",
        shortcut: "⌘F",
      },
      {
        label: "New File",
        value: "new-file",
        group: "actions",
        shortcut: "⌘N",
      },
      {
        label: "New Folder",
        value: "new-folder",
        group: "actions",
        shortcut: "⇧⌘N",
      },
      { label: "Copy", value: "copy", group: "actions", shortcut: "⌘C" },
      { label: "Cut", value: "cut", group: "actions", shortcut: "⌘X" },
      { label: "Paste", value: "paste", group: "actions", shortcut: "⌘V" },
      { label: "Delete", value: "delete", group: "actions", shortcut: "⌫" },
      { label: "Grid View", value: "grid-view", group: "view" },
      { label: "List View", value: "list-view", group: "view" },
      { label: "Zoom In", value: "zoom-in", group: "view", shortcut: "⌘+" },
      { label: "Zoom Out", value: "zoom-out", group: "view", shortcut: "⌘-" },
      {
        label: "Profile",
        value: "profile",
        group: "account",
        shortcut: "⌘P",
      },
      {
        label: "Billing",
        value: "billing",
        group: "account",
        shortcut: "⌘B",
      },
      {
        label: "Settings",
        value: "settings",
        group: "account",
        shortcut: "⌘S",
      },
      { label: "Notifications", value: "notifications", group: "account" },
      { label: "Help & Support", value: "help-support", group: "account" },
      { label: "Calculator", value: "calculator", group: "tools" },
      { label: "Calendar", value: "calendar", group: "tools" },
      { label: "Image Editor", value: "image-editor", group: "tools" },
      { label: "Code Editor", value: "code-editor", group: "tools" },
    ],
    filter: (itemString, query) =>
      itemString.toLowerCase().includes(query.toLowerCase()),
    groupBy: (item) => item.group,
    groupSort: ["navigation", "actions", "view", "account", "tools"],
  })

  const icons: Record<string, React.ReactNode> = {
    home: <HomeIcon />,
    inbox: <InboxIcon />,
    documents: <FileTextIcon />,
    folders: <FolderIcon />,
    "new-file": <PlusIcon />,
    "new-folder": <FolderPlusIcon />,
    copy: <CopyIcon />,
    cut: <ScissorsIcon />,
    paste: <ClipboardPasteIcon />,
    delete: <TrashIcon />,
    "grid-view": <LayoutGridIcon />,
    "list-view": <ListIcon />,
    "zoom-in": <ZoomInIcon />,
    "zoom-out": <ZoomOutIcon />,
    profile: <UserIcon />,
    billing: <CreditCardIcon />,
    settings: <SettingsIcon />,
    notifications: <BellIcon />,
    "help-support": <HelpCircleIcon />,
    calculator: <CalculatorIcon />,
    calendar: <CalendarIcon />,
    "image-editor": <ImageIcon />,
    "code-editor": <CodeIcon />,
  }

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => setOpen(true)} variant="outline" className="w-fit">
        Open Menu
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command
          collection={collection}
          onValueChange={() => {
            setOpen(false)
            filter("")
          }}
        >
          <CommandInput
            placeholder="Type a command or search..."
            onFilter={filter}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {collection.group().map(([group, items]) => (
              <CommandGroup key={group}>
                <CommandGroupLabel className="capitalize">
                  {group}
                </CommandGroupLabel>
                {items.map((item) => (
                  <CommandItem key={item.value} item={item}>
                    {icons[item.value]}
                    <CommandItemText>{item.label}</CommandItemText>
                    {item.shortcut && (
                      <CommandShortcut>{item.shortcut}</CommandShortcut>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
