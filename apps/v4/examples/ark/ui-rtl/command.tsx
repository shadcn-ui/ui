"use client"

import * as React from "react"
import { cn } from "@/examples/ark/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/examples/ark/ui/dialog"
import { InputGroup, InputGroupAddon } from "@/examples/ark/ui/input-group"
import {
  createListCollection,
  useListCollection,
} from "@ark-ui/react/collection"
import { ark } from "@ark-ui/react/factory"
import {
  Listbox,
  type CollectionItem,
  type ListboxRootProps,
} from "@ark-ui/react/listbox"
import { CheckIcon, SearchIcon } from "lucide-react"

function Command<T extends CollectionItem>({
  className,
  ...props
}: ListboxRootProps<T>) {
  return (
    <Listbox.Root
      data-slot="command"
      className={cn(
        "cn-command flex size-full flex-col overflow-hidden",
        className
      )}
      selectionMode="single"
      {...props}
    />
  )
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  open,
  onOpenChange,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "onOpenChange"> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(details) => onOpenChange?.(details.open)}
      {...props}
    >
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn("overflow-hidden rounded-xl! p-0", className)}
        showCloseButton={showCloseButton}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  onFilter,
  ...props
}: React.ComponentProps<typeof Listbox.Input> & {
  onFilter?: (value: string) => void
}) {
  return (
    <ark.div data-slot="command-input-wrapper" className="p-1 pb-0">
      <InputGroup className="h-8! rounded-lg! border-input/30 bg-input/30 shadow-none! *:data-[slot=input-group-addon]:pl-2!">
        <Listbox.Input
          data-slot="command-input"
          className={cn(
            "w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          onChange={(e) => onFilter?.(e.currentTarget.value)}
          autoHighlight
          {...props}
        />
        <InputGroupAddon>
          <SearchIcon className="size-4 shrink-0 opacity-50" />
        </InputGroupAddon>
      </InputGroup>
    </ark.div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof Listbox.Content>) {
  return (
    <Listbox.Content
      data-slot="command-list"
      className={cn(
        "cn-command-list no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof Listbox.Empty>) {
  return (
    <Listbox.Empty
      data-slot="command-empty"
      className={cn("cn-command-empty", className)}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof Listbox.ItemGroup>) {
  return (
    <Listbox.ItemGroup
      data-slot="command-group"
      className={cn("cn-command-group", className)}
      {...props}
    />
  )
}

function CommandGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof Listbox.ItemGroupLabel>) {
  return (
    <Listbox.ItemGroupLabel
      data-slot="command-group-label"
      className={cn("cn-command-group-label", className)}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      data-slot="command-separator"
      className={cn("cn-command-separator", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Listbox.Item>) {
  return (
    <Listbox.Item
      data-slot="command-item"
      highlightOnHover
      className={cn(
        "cn-command-item group/command-item data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
      <Listbox.ItemIndicator className="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[state=checked]/command-item:opacity-100">
        <CheckIcon />
      </Listbox.ItemIndicator>
    </Listbox.Item>
  )
}

function CommandItemText({
  className,
  ...props
}: React.ComponentProps<typeof Listbox.ItemText>) {
  return (
    <Listbox.ItemText
      data-slot="command-item-text"
      className={className}
      {...props}
    />
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<typeof ark.span>) {
  return (
    <ark.span
      data-slot="command-shortcut"
      className={cn("cn-command-shortcut", className)}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandItem,
  CommandItemText,
  CommandShortcut,
  CommandSeparator,
  createListCollection,
  useListCollection,
}
