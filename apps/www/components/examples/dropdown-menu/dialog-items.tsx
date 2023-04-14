import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuDialogItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuDialogItemsDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Dialog items</DropdownMenuLabel>
          <DropdownMenuDialogItem trigger="Open Dialog">
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Dialog 1</DialogTitle>
                <DialogDescription>Hello from Dialog 1</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </DropdownMenuDialogItem>
          <DropdownMenuDialogItem trigger="Open Dialog 2">
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Dialog 2</DialogTitle>
                <DialogDescription>Hello from Dialog 2</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </DropdownMenuDialogItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
