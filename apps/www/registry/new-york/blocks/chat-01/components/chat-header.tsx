import React from "react"
import { ArchiveIcon, MoreHorizontalIcon, UserIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york/ui/avatar"
import { Badge } from "@/registry/new-york/ui/badge"
import { Button } from "@/registry/new-york/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu"

export function ChatHeader() {
  return (
    <div className="sticky top-0 flex items-center justify-between border-b p-6">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Avatar className="rounded-lg">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold leading-none">Mia Johnson</h2>
            <Badge variant="secondary" className="rounded-full">
              Online
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">@miajohnson</p>
        </div>
      </div>
      <div className="hidden gap-2 xl:flex">
        <Button size="sm">
          <UserIcon size={16} strokeWidth={2} aria-hidden="true" />
          <span>View Profile</span>
        </Button>
        <Button variant="secondary" size="sm">
          <ArchiveIcon size={16} strokeWidth={2} aria-hidden="true" />
          <span>Archive</span>
        </Button>
        <Button variant="outline" size="sm">
          <MoreHorizontalIcon size={16} strokeWidth={2} aria-hidden="true" />
          <span>More</span>
        </Button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="flex size-8 xl:hidden"
          >
            <MoreHorizontalIcon size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Archive</DropdownMenuItem>
          <DropdownMenuItem>View Profile</DropdownMenuItem>
          <DropdownMenuItem>More</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
