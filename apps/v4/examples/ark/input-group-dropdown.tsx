import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/examples/ark/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/examples/ark/ui/input-group"
import { ChevronDownIcon, MoreHorizontal } from "lucide-react"

export default function InputGroupDropdown() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Enter file name" />
        <InputGroupAddon align="inline-end">
          <DropdownMenu positioning={{ placement: "bottom-end" }}>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                variant="ghost"
                aria-label="More"
                size="icon-xs"
              >
                <MoreHorizontal />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem value="1">Settings</DropdownMenuItem>
                <DropdownMenuItem value="2">Copy path</DropdownMenuItem>
                <DropdownMenuItem value="3">Open location</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup className="[--radius:1rem]">
        <InputGroupInput placeholder="Enter search query" />
        <InputGroupAddon align="inline-end">
          <DropdownMenu positioning={{ placement: "bottom-end" }}>
            <DropdownMenuTrigger asChild>
              <InputGroupButton variant="ghost" className="pr-1.5! text-xs">
                Search In... <ChevronDownIcon className="size-3" />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="[--radius:0.95rem]">
              <DropdownMenuGroup>
                <DropdownMenuItem value="4">Documentation</DropdownMenuItem>
                <DropdownMenuItem value="5">Blog Posts</DropdownMenuItem>
                <DropdownMenuItem value="6">Changelog</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
