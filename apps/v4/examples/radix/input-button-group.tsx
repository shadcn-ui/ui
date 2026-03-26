import { Button } from "@/examples/radix/ui/button"
import { ButtonGroup } from "@/examples/radix/ui/button-group"
import { Field, FieldLabel } from "@/examples/radix/ui/field"
import { Input } from "@/examples/radix/ui/input"

export function InputButtonGroup() {
  return (
    <Field>
      <FieldLabel htmlFor="input-button-group">Search</FieldLabel>
      <ButtonGroup>
        <Input id="input-button-group" placeholder="Type to search..." />
        <Button variant="outline">Search</Button>
      </ButtonGroup>
    </Field>
  )
}
