import { Button } from "@/examples/react-aria/ui/button"
import { Input } from "@/examples/react-aria/ui/input"
import { Label } from "@/examples/react-aria/ui/label"
import {
  Sheet,
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/examples/react-aria/ui/sheet";

export default function SheetDemo() {
  return (
    <SheetTrigger>
      <Button variant="outline">Open</Button>
      <Sheet>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Name</Label>
            <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-username">Username</Label>
            <Input id="sheet-demo-username" defaultValue="@peduarte" />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose variant="outline">Close</SheetClose>
        </SheetFooter>
      </Sheet>
    </SheetTrigger>
  );
}
