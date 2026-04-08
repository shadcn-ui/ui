import { Button } from "@/styles/react-aria-nova/ui/button"
import { ButtonGroup } from "@/styles/react-aria-nova/ui/button-group"
import { Field, FieldLabel } from "@/styles/react-aria-nova/ui/field"
import { Input } from "@/styles/react-aria-nova/ui/input"

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
