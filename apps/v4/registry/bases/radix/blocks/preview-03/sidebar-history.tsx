"use client"

import { cn } from "@/registry/bases/radix/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/bases/radix/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/registry/bases/radix/ui/sidebar"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

import type { SidebarSearchProjectChats } from "./sidebar-search"

export type SidebarHistoryMoveProject = {
  id: string
  name: string
}

function ProjectGroupOverflowMenu({ projectLabel }: { projectLabel: string }) {
  const { isMobile } = useSidebar()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarGroupAction
          type="button"
          title={`Actions for ${projectLabel}`}
          className={cn(
            "transition-opacity duration-150 aria-expanded:bg-muted",
            "opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100",
            "md:opacity-0",
            "group-hover/sidebar-history-project:opacity-100",
            "group-focus-within/sidebar-history-project:opacity-100"
          )}
        >
          <IconPlaceholder
            lucide="MoreHorizontalIcon"
            tabler="IconDots"
            hugeicons="MoreHorizontalCircle01Icon"
            phosphor="DotsThreeOutlineIcon"
            remixicon="RiMoreLine"
          />
          <span className="sr-only">Project actions</span>
        </SidebarGroupAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-fit min-w-48"
        side={isMobile ? "bottom" : "right"}
        align={isMobile ? "end" : "start"}
      >
        <DropdownMenuItem>
          <IconPlaceholder
            lucide="StarIcon"
            tabler="IconStar"
            hugeicons="StarIcon"
            phosphor="StarIcon"
            remixicon="RiStarLine"
          />
          <span>Favorite</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconPlaceholder
            lucide="FolderOpenIcon"
            tabler="IconFolderOpen"
            hugeicons="FolderOpenIcon"
            phosphor="FolderOpenIcon"
            remixicon="RiFolderOpenLine"
          />
          <span>Open in Finder</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconPlaceholder
            lucide="PencilIcon"
            tabler="IconPencil"
            hugeicons="PencilIcon"
            phosphor="PencilIcon"
            remixicon="RiPencilLine"
          />
          <span>Rename project</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconPlaceholder
            lucide="ArchiveIcon"
            tabler="IconArchive"
            hugeicons="ArchiveIcon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
          <span>Archive chats</span>
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          <IconPlaceholder
            lucide="XIcon"
            tabler="IconX"
            hugeicons="Cancel01Icon"
            phosphor="XIcon"
            remixicon="RiCloseLine"
          />
          <span>Remove from Sidebar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MoveToProjectSubmenu({
  moveToProjectTargets,
}: {
  moveToProjectTargets: SidebarHistoryMoveProject[]
}) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Move to Project</DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className="min-w-48">
          {moveToProjectTargets.map((project) => {
            return (
              <DropdownMenuItem key={project.id}>
                {project.name}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}

function ChatHistoryOverflowMenu({
  moveToProjectTargets,
}: {
  moveToProjectTargets: SidebarHistoryMoveProject[]
}) {
  const { isMobile } = useSidebar()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction
          showOnHover
          type="button"
          className="aria-expanded:bg-muted"
        >
          <IconPlaceholder
            lucide="MoreHorizontalIcon"
            tabler="IconDots"
            hugeicons="MoreHorizontalCircle01Icon"
            phosphor="DotsThreeOutlineIcon"
            remixicon="RiMoreLine"
          />
          <span className="sr-only">More</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-fit min-w-48"
        side={isMobile ? "bottom" : "right"}
        align={isMobile ? "end" : "start"}
      >
        <DropdownMenuItem>Pin chat</DropdownMenuItem>
        <DropdownMenuItem>Rename chat</DropdownMenuItem>
        <DropdownMenuItem>Archive chat</DropdownMenuItem>
        <DropdownMenuItem>Mark as unread</DropdownMenuItem>
        <MoveToProjectSubmenu moveToProjectTargets={moveToProjectTargets} />
        <DropdownMenuSeparator />
        <DropdownMenuItem>Open in Finder</DropdownMenuItem>
        <DropdownMenuItem>Copy working directory</DropdownMenuItem>
        <DropdownMenuItem>Copy session ID</DropdownMenuItem>
        <DropdownMenuItem>Copy deeplink</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Fork into local</DropdownMenuItem>
        <DropdownMenuItem>Fork into new worktree</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Open in mini window</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export type SidebarHistoryProps = {
  chatsByProject: SidebarSearchProjectChats[]
}

export function SidebarHistory({ chatsByProject }: SidebarHistoryProps) {
  const moveToProjectTargets: SidebarHistoryMoveProject[] = chatsByProject.map(
    (project) => {
      return {
        id: project.projectId,
        name: project.projectName,
      }
    }
  )

  return (
    <>
      {chatsByProject.map((project) => {
        return (
          <SidebarGroup
            key={project.projectId}
            className={cn("group/sidebar-history-project", "relative py-1")}
          >
            <SidebarGroupLabel className="truncate pr-12">
              {project.projectName}
            </SidebarGroupLabel>
            <ProjectGroupOverflowMenu projectLabel={project.projectName} />
            <SidebarGroupContent>
              <SidebarMenu>
                {project.chats.map((chat) => {
                  return (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton
                        type="button"
                        tooltip={chat.title}
                        className="group-has-aria-expanded/menu-item:bg-muted"
                      >
                        <span>{chat.title}</span>
                      </SidebarMenuButton>
                      <ChatHistoryOverflowMenu
                        moveToProjectTargets={moveToProjectTargets}
                      />
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )
      })}
    </>
  )
}
