import { Button } from "@/styles/aria-nova/ui/button"
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/styles/aria-nova/ui/dialog"
import { Input } from "@/styles/aria-nova/ui/input"
import { Label } from "@/styles/aria-nova/ui/label"

export function DialogCloseButton() {
  return (
    <DialogTrigger>
      <Button variant="outline">Share</Button>
      <Dialog className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose type="button">Close</DialogClose>
        </DialogFooter>
      </Dialog>
    </DialogTrigger>
  )
}
