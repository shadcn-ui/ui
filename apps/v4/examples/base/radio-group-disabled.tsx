import { Field, FieldLabel } from "@/examples/base/ui/field"
import { RadioGroup, RadioGroupItem } from "@/examples/base/ui/radio-group"

export function RadioGroupDisabled() {
  return (
    <RadioGroup defaultValue="option2" disabled>
      <Field orientation="horizontal">
        <RadioGroupItem value="option1" id="disabled-1" />
        <FieldLabel htmlFor="disabled-1" className="font-normal">
          Option 1
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="option2" id="disabled-2" />
        <FieldLabel htmlFor="disabled-2" className="font-normal">
          Option 2
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="option3" id="disabled-3" />
        <FieldLabel htmlFor="disabled-3" className="font-normal">
          Option 3
        </FieldLabel>
      </Field>
    </RadioGroup>
  )
}
