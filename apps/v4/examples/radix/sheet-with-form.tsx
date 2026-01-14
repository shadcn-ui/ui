import { Button } from "@/examples/radix/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/examples/radix/ui/field"
import { Input } from "@/examples/radix/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/examples/radix/ui/sheet"

export function SheetWithForm() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="style-vega:px-4 style-maia:px-6 style-mira:px-6 style-lyra:px-4 style-nova:px-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="sheet-demo-name">Name</FieldLabel>
              <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
            </Field>
            <Field>
              <FieldLabel htmlFor="sheet-demo-username">Username</FieldLabel>
              <Input id="sheet-demo-username" defaultValue="@peduarte" />
            </Field>
          </FieldGroup>
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
