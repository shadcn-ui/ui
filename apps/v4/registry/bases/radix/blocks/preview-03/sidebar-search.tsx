"use client"

import * as React from "react"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/bases/radix/ui/command"
import { Kbd } from "@/registry/bases/radix/ui/kbd"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/bases/radix/ui/sidebar"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export type SidebarSearchRecentChat = {
  id: string
  title: string
}

export type SidebarSearchProjectChats = {
  projectId: string
  projectName: string
  chats: SidebarSearchRecentChat[]
}

export type SidebarSearchCommandData = {
  recentChats: SidebarSearchRecentChat[]
  chatsByProject: SidebarSearchProjectChats[]
}

type SidebarSearchProps = {
  commandData: SidebarSearchCommandData
}

export function SidebarSearch({ commandData }: SidebarSearchProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            variant="outline"
            type="button"
            onClick={() => setOpen(true)}
          >
            <IconPlaceholder
              lucide="SearchIcon"
              tabler="IconSearch"
              hugeicons="SearchIcon"
              phosphor="MagnifyingGlassIcon"
              remixicon="RiSearchLine"
              data-icon="inline-start"
            />
            Search
            <Kbd className="ml-auto" data-icon="inline-end">
              ⌘K
            </Kbd>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Search chats, projects, and commands…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {commandData.recentChats.length > 0 ? (
              <CommandGroup heading="Recent">
                {commandData.recentChats.map((chat) => {
                  const value = `recent:${chat.id}:${chat.title}`
                  return (
                    <CommandItem
                      key={`recent-${chat.id}`}
                      value={value}
                      keywords={[chat.title, "recent"]}
                      onSelect={() => {
                        setOpen(false)
                      }}
                    >
                      <span>{chat.title}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ) : null}
            {commandData.chatsByProject.map((project) => {
              if (project.chats.length === 0) {
                return null
              }
              return (
                <CommandGroup
                  key={project.projectId}
                  heading={project.projectName}
                >
                  {project.chats.map((chat) => {
                    const value = `project:${project.projectId}:${chat.id}:${chat.title}`
                    return (
                      <CommandItem
                        key={`${project.projectId}-${chat.id}`}
                        value={value}
                        keywords={[
                          chat.title,
                          project.projectName,
                          project.projectId,
                        ]}
                        onSelect={() => {
                          setOpen(false)
                        }}
                      >
                        <span>{chat.title}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )
            })}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
