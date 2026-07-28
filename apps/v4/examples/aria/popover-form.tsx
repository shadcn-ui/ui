import { Button } from "@/styles/aria-nova/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/styles/aria-nova/ui/field"
import { Input } from "@/styles/aria-nova/ui/input"
import {
  Popover,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/styles/aria-nova/ui/popover"

export function PopoverForm() {
  return (
    <>
      <PopoverTrigger>
        <Button variant="outline">Open Popover</Button>
        <Popover className="w-64" placement="bottom start">
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>
              Set the dimensions for the layer.
            </PopoverDescription>
          </PopoverHeader>
          <FieldGroup className="gap-4">
            <Field orientation="horizontal">
              <FieldLabel htmlFor="width" className="w-1/2">
                Width
              </FieldLabel>
              <Input id="width" defaultValue="100%" />
            </Field>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="height" className="w-1/2">
                Height
              </FieldLabel>
              <Input id="height" defaultValue="25px" />
            </Field>
          </FieldGroup>
        </Popover>
      </PopoverTrigger>
    </>
  )
}
