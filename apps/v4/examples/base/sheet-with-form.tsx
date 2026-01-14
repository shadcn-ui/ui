import { Button } from "@/examples/base/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/examples/base/ui/field"
import { Input } from "@/examples/base/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/examples/base/ui/sheet"

export function SheetWithForm() {
  return (
    <>
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
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
            <SheetClose render={<Button variant="outline" />}>Close</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
