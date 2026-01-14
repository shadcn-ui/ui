import { Button } from "@/examples/base/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/examples/base/ui/dropdown-menu"
import { ArchiveIcon, PencilIcon, ShareIcon, TrashIcon } from "lucide-react"

export function DropdownMenuWithDestructive() {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline" className="w-fit" />}
        >
          Actions
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <PencilIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShareIcon />
            Share
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <ArchiveIcon />
            Archive
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
