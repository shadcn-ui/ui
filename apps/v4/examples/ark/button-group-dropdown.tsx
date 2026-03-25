"use client"

import { Button } from "@/examples/ark/ui/button"
import { ButtonGroup } from "@/examples/ark/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/examples/ark/ui/dropdown-menu"
import {
  AlertTriangleIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  ShareIcon,
  TrashIcon,
  UserRoundXIcon,
  VolumeOffIcon,
} from "lucide-react"

export default function ButtonGroupDropdown() {
  return (
    <ButtonGroup>
      <Button variant="outline">Follow</Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="pl-2!">
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuItem value="1">
              <VolumeOffIcon />
              Mute Conversation
            </DropdownMenuItem>
            <DropdownMenuItem value="2">
              <CheckIcon />
              Mark as Read
            </DropdownMenuItem>
            <DropdownMenuItem value="3">
              <AlertTriangleIcon />
              Report Conversation
            </DropdownMenuItem>
            <DropdownMenuItem value="4">
              <UserRoundXIcon />
              Block User
            </DropdownMenuItem>
            <DropdownMenuItem value="5">
              <ShareIcon />
              Share Conversation
            </DropdownMenuItem>
            <DropdownMenuItem value="6">
              <CopyIcon />
              Copy Conversation
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              <TrashIcon />
              Delete Conversation
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
