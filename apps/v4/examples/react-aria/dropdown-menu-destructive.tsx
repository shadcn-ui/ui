"use client"

import { Button } from "@/examples/react-aria/ui/button"
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/examples/react-aria/ui/dropdown-menu";
import { PencilIcon, ShareIcon, TrashIcon } from "lucide-react"

export function DropdownMenuDestructive() {
  return (
    <DropdownMenuTrigger>
      <Button variant="outline">
        Actions
      </Button>
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
  );
}
