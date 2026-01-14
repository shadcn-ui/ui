import { Field, FieldLabel } from "@/examples/radix/ui/field"
import { RadioGroup, RadioGroupItem } from "@/examples/radix/ui/radio-group"

export function RadioGroupGrid() {
  return (
    <RadioGroup defaultValue="medium" className="grid grid-cols-2 gap-2">
      <FieldLabel htmlFor="size-small">
        <Field orientation="horizontal">
          <RadioGroupItem value="small" id="size-small" />
          <div className="font-medium">Small</div>
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="size-medium">
        <Field orientation="horizontal">
          <RadioGroupItem value="medium" id="size-medium" />
          <div className="font-medium">Medium</div>
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="size-large">
        <Field orientation="horizontal">
          <RadioGroupItem value="large" id="size-large" />
          <div className="font-medium">Large</div>
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="size-xlarge">
        <Field orientation="horizontal">
          <RadioGroupItem value="xlarge" id="size-xlarge" />
          <div className="font-medium">X-Large</div>
        </Field>
      </FieldLabel>
    </RadioGroup>
  )
}
