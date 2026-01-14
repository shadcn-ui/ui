import { Button } from "@/examples/radix/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/examples/radix/ui/sheet"

export function SheetNoCloseButton() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">No Close Button</Button>
      </SheetTrigger>
      <SheetContent showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>No Close Button</SheetTitle>
          <SheetDescription>
            This sheet doesn&apos;t have a close button in the top-right corner.
            You can only close it using the button below.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
