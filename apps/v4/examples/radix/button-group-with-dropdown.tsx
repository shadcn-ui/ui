import { Button } from "@/examples/radix/ui/button"
import { ButtonGroup } from "@/examples/radix/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/examples/radix/ui/dropdown-menu"
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

export function ButtonGroupWithDropdown() {
  return (
    <div className="flex flex-col gap-4">
      <ButtonGroup>
        <Button variant="outline">Update</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Disable</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">Uninstall</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Follow</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-50">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <VolumeOffIcon />
                Mute Conversation
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CheckIcon />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem>
                <AlertTriangleIcon />
                Report Conversation
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserRoundXIcon />
                Block User
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ShareIcon />
                Share Conversation
              </DropdownMenuItem>
              <DropdownMenuItem>
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
    </div>
  )
}
