import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/examples/base/ui/field"
import { RadioGroup, RadioGroupItem } from "@/examples/base/ui/radio-group"

export function RadioGroupWithFieldSet() {
  return (
    <FieldSet>
      <FieldLegend>Battery Level</FieldLegend>
      <FieldDescription>Choose your preferred battery level.</FieldDescription>
      <RadioGroup defaultValue="medium">
        <Field orientation="horizontal">
          <RadioGroupItem value="high" id="battery-high" />
          <FieldLabel htmlFor="battery-high" className="font-normal">
            High
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="medium" id="battery-medium" />
          <FieldLabel htmlFor="battery-medium" className="font-normal">
            Medium
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="low" id="battery-low" />
          <FieldLabel htmlFor="battery-low" className="font-normal">
            Low
          </FieldLabel>
        </Field>
      </RadioGroup>
    </FieldSet>
  )
}
