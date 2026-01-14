import { Button } from "@/examples/radix/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/examples/radix/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/examples/radix/ui/popover"

export function PopoverInDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Popover Example</DialogTitle>
          <DialogDescription>
            Click the button below to see the popover.
          </DialogDescription>
        </DialogHeader>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-fit">
              Open Popover
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <PopoverHeader>
              <PopoverTitle>Popover in Dialog</PopoverTitle>
              <PopoverDescription>
                This popover appears inside a dialog. Click the button to open
                it.
              </PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      </DialogContent>
    </Dialog>
  )
}
