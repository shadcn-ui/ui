import { Field, FieldGroup, FieldLabel } from "@/examples/radix/ui/field"
import { Input } from "@/examples/radix/ui/input"
import { InputGroup, InputGroupInput } from "@/examples/radix/ui/input-group"

export function InputGroupBasic() {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="input-default-01">
          Default (No Input Group)
        </FieldLabel>
        <Input placeholder="Placeholder" id="input-default-01" />
      </Field>
      <Field>
        <FieldLabel htmlFor="input-group-02">Input Group</FieldLabel>
        <InputGroup>
          <InputGroupInput id="input-group-02" placeholder="Placeholder" />
        </InputGroup>
      </Field>
      <Field data-disabled="true">
        <FieldLabel htmlFor="input-disabled-03">Disabled</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="input-disabled-03"
            placeholder="This field is disabled"
            disabled
          />
        </InputGroup>
      </Field>
      <Field data-invalid="true">
        <FieldLabel htmlFor="input-invalid-04">Invalid</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="input-invalid-04"
            placeholder="This field is invalid"
            aria-invalid="true"
          />
        </InputGroup>
      </Field>
    </FieldGroup>
  )
}
