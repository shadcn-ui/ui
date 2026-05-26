import { Field, FieldGroup, FieldLabel } from "@/examples/ark/ui/field"
import { Input } from "@/examples/ark/ui/input"
import { InputGroup, InputGroupInput } from "@/examples/ark/ui/input-group"

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
      <Field disabled>
        <FieldLabel>Disabled</FieldLabel>
        <InputGroup>
          <InputGroupInput placeholder="This field is disabled" />
        </InputGroup>
      </Field>
      <Field invalid>
        <FieldLabel>Invalid</FieldLabel>
        <InputGroup>
          <InputGroupInput placeholder="This field is invalid" />
        </InputGroup>
      </Field>
    </FieldGroup>
  )
}
