import { Button } from "@/examples/radix/ui/button"
import { ButtonGroup } from "@/examples/radix/ui/button-group"
import { Field, FieldGroup } from "@/examples/radix/ui/field"
import { Input } from "@/examples/radix/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/examples/radix/ui/input-group"
import { Label } from "@/examples/radix/ui/label"
import { MinusIcon, PlusIcon } from "lucide-react"

export function ButtonGroupWithFields() {
  return (
    <FieldGroup className="grid grid-cols-3 gap-4">
      <Field className="col-span-2">
        <Label htmlFor="width">Width</Label>
        <ButtonGroup>
          <InputGroup>
            <InputGroupInput id="width" />
            <InputGroupAddon className="text-muted-foreground">
              W
            </InputGroupAddon>
            <InputGroupAddon
              align="inline-end"
              className="text-muted-foreground"
            >
              px
            </InputGroupAddon>
          </InputGroup>
          <Button variant="outline" size="icon">
            <MinusIcon />
          </Button>
          <Button variant="outline" size="icon">
            <PlusIcon />
          </Button>
        </ButtonGroup>
      </Field>
    </FieldGroup>
  )
}
