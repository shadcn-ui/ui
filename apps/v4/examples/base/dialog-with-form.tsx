import { Button } from "@/examples/base/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/examples/base/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/examples/base/ui/field"
import { Input } from "@/examples/base/ui/input"

export function DialogWithForm() {
  return (
    <Dialog>
      <form>
        <DialogTrigger render={<Button variant="outline" />}>
          Edit Profile
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done. Your profile will be updated immediately.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name-1">Name</FieldLabel>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </Field>
            <Field>
              <FieldLabel htmlFor="username-1">Username</FieldLabel>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
