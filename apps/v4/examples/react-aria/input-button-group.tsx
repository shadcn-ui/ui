import { Button } from "@/examples/react-aria/ui/button"
import { ButtonGroup } from "@/examples/react-aria/ui/button-group"
import { Field, FieldLabel } from "@/examples/react-aria/ui/field"
import { Input } from "@/examples/react-aria/ui/input"

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
