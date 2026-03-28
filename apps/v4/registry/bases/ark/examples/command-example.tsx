"use client"

import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/ark/components/example"
import { Button } from "@/registry/bases/ark/ui/button"
import { Card, CardContent } from "@/registry/bases/ark/ui/card"
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
  CommandSeparator,
  CommandShortcut,
  createListCollection,
  useListCollection,
} from "@/registry/bases/ark/ui/command"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function CommandExample() {
  return (
    <ExampleWrapper>
      <CommandInline />
      <CommandBasic />
      <CommandWithShortcuts />
      <CommandWithGroups />
      <CommandManyItems />
    </ExampleWrapper>
  )
}

function CommandInline() {
  const { collection, filter } = useListCollection({
    initialItems: [
      { label: "Calendar", value: "calendar", group: "suggestions" },
      { label: "Search Emoji", value: "search-emoji", group: "suggestions" },
      { label: "Calculator", value: "calculator", group: "suggestions" },
      { label: "Profile", value: "profile", group: "settings", shortcut: "⌘P" },
      { label: "Billing", value: "billing", group: "settings", shortcut: "⌘B" },
      {
        label: "Settings",
        value: "settings",
        group: "settings",
        shortcut: "⌘S",
      },
    ],
    filter: (itemString, query) =>
      itemString.toLowerCase().includes(query.toLowerCase()),
    groupBy: (item) => item.group,
  })

  return (
    <Example title="Inline">
      <Card className="w-full p-0">
        <CardContent className="p-0">
          <Command collection={collection}>
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
        </CardContent>
      </Card>
    </Example>
  )
}

function CommandBasic() {
  const [open, setOpen] = React.useState(false)

  const { collection, filter } = useListCollection({
    initialItems: [
      { label: "Calendar", value: "calendar" },
      { label: "Search Emoji", value: "search-emoji" },
      { label: "Calculator", value: "calculator" },
    ],
    filter: (itemString, query) =>
      itemString.toLowerCase().includes(query.toLowerCase()),
  })

  return (
    <Example title="Basic">
      <div className="flex flex-col gap-4">
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="w-fit"
        >
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
              {collection.items.map((item) => (
                <CommandItem key={item.value} item={item}>
                  <CommandItemText>{item.label}</CommandItemText>
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </CommandDialog>
      </div>
    </Example>
  )
}

function CommandWithShortcuts() {
  const [open, setOpen] = React.useState(false)

  const { collection, filter } = useListCollection({
    initialItems: [
      { label: "Profile", value: "profile", shortcut: "⌘P" },
      { label: "Billing", value: "billing", shortcut: "⌘B" },
      { label: "Settings", value: "settings", shortcut: "⌘S" },
    ],
    filter: (itemString, query) =>
      itemString.toLowerCase().includes(query.toLowerCase()),
  })

  return (
    <Example title="With Shortcuts">
      <div className="flex flex-col gap-4">
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="w-fit"
        >
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
              <CommandGroup>
                <CommandGroupLabel>Settings</CommandGroupLabel>
                {collection.items.map((item) => (
                  <CommandItem key={item.value} item={item}>
                    <IconPlaceholder
                      lucide={
                        item.value === "profile"
                          ? "UserIcon"
                          : item.value === "billing"
                            ? "CreditCardIcon"
                            : "SettingsIcon"
                      }
                      tabler={
                        item.value === "profile"
                          ? "IconUser"
                          : item.value === "billing"
                            ? "IconCreditCard"
                            : "IconSettings"
                      }
                      hugeicons={
                        item.value === "profile"
                          ? "UserIcon"
                          : item.value === "billing"
                            ? "CreditCardIcon"
                            : "SettingsIcon"
                      }
                      phosphor={
                        item.value === "profile"
                          ? "UserIcon"
                          : item.value === "billing"
                            ? "CreditCardIcon"
                            : "GearIcon"
                      }
                      remixicon={
                        item.value === "profile"
                          ? "RiUserLine"
                          : item.value === "billing"
                            ? "RiBankCardLine"
                            : "RiSettingsLine"
                      }
                    />
                    <CommandItemText>{item.label}</CommandItemText>
                    <CommandShortcut>{item.shortcut}</CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandDialog>
      </div>
    </Example>
  )
}

function CommandWithGroups() {
  const [open, setOpen] = React.useState(false)

  const { collection, filter } = useListCollection({
    initialItems: [
      { label: "Calendar", value: "calendar", group: "suggestions" },
      { label: "Search Emoji", value: "search-emoji", group: "suggestions" },
      { label: "Calculator", value: "calculator", group: "suggestions" },
      {
        label: "Profile",
        value: "profile",
        group: "settings",
        shortcut: "⌘P",
      },
      {
        label: "Billing",
        value: "billing",
        group: "settings",
        shortcut: "⌘B",
      },
      {
        label: "Settings",
        value: "settings",
        group: "settings",
        shortcut: "⌘S",
      },
    ],
    filter: (itemString, query) =>
      itemString.toLowerCase().includes(query.toLowerCase()),
    groupBy: (item) => item.group,
  })

  return (
    <Example title="With Groups">
      <div className="flex flex-col gap-4">
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="w-fit"
        >
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
    </Example>
  )
}

function CommandManyItems() {
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
      {
        label: "Zoom In",
        value: "zoom-in",
        group: "view",
        shortcut: "⌘+",
      },
      {
        label: "Zoom Out",
        value: "zoom-out",
        group: "view",
        shortcut: "⌘-",
      },
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
      {
        label: "Help & Support",
        value: "help-support",
        group: "account",
      },
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

  return (
    <Example title="Many Groups & Items">
      <div className="flex flex-col gap-4">
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="w-fit"
        >
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
    </Example>
  )
}
