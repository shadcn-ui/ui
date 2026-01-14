import { Button } from "@/examples/base/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/examples/base/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/examples/base/ui/popover"

export function PopoverInDialog() {
  return (
    <>
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Open Dialog
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Popover Example</DialogTitle>
            <DialogDescription>
              Click the button below to see the popover.
            </DialogDescription>
          </DialogHeader>
          <Popover>
            <PopoverTrigger
              render={<Button variant="outline" className="w-fit" />}
            >
              Open Popover
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
    </>
  )
}
