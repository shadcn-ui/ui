import { Button } from "@/examples/radix/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/examples/radix/ui/dialog"

export function DialogWithStickyFooter() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Sticky Footer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scrollable Content</DialogTitle>
          <DialogDescription>
            This is a dialog with scrollable content.
          </DialogDescription>
        </DialogHeader>
        <div className="style-nova:-mx-4 style-nova:px-4 no-scrollbar style-vega:px-6 style-mira:px-4 style-maia:px-6 style-vega:-mx-6 style-maia:-mx-6 style-mira:-mx-4 style-lyra:-mx-4 style-lyra:px-4 max-h-[70vh] overflow-y-auto">
          {Array.from({ length: 10 }).map((_, index) => (
            <p
              key={index}
              className="style-lyra:mb-2 style-lyra:leading-relaxed mb-4 leading-normal"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
