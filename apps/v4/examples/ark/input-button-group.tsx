import { Button } from "@/examples/ark/ui/button"
import { ButtonGroup } from "@/examples/ark/ui/button-group"
import { Field, FieldLabel } from "@/examples/ark/ui/field"
import { Input } from "@/examples/ark/ui/input"

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
