import { ChevronDownIcon, MoreHorizontal } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/new-york-v4/ui/input-group"

export default function InputGroupDropdown() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Enter file name" />
        <InputGroupAddon align="inline-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                variant="ghost"
                aria-label="More"
                size="icon-xs"
              >
                <MoreHorizontal />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Copy path</DropdownMenuItem>
              <DropdownMenuItem>Open location</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup className="[--radius:1rem]">
        <InputGroupInput placeholder="Enter search query" />
        <InputGroupAddon align="inline-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton variant="ghost" className="!pr-1.5 text-xs">
                Search In... <ChevronDownIcon className="size-3" />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="[--radius:0.95rem]">
              <DropdownMenuItem>Documentation</DropdownMenuItem>
              <DropdownMenuItem>Blog Posts</DropdownMenuItem>
              <DropdownMenuItem>Changelog</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
