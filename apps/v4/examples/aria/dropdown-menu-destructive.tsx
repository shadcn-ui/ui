"use client"

import { PencilIcon, ShareIcon, TrashIcon } from "lucide-react"

import { Button } from "@/styles/aria-nova/ui/button"
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/styles/aria-nova/ui/dropdown-menu"

export function DropdownMenuDestructive() {
  return (
    <DropdownMenuTrigger>
      <Button variant="outline">Actions</Button>
      <DropdownMenu>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PencilIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShareIcon />
            Share
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenu>
    </DropdownMenuTrigger>
  )
}
