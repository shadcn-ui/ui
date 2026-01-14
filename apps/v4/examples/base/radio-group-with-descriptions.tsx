import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/examples/base/ui/field"
import { RadioGroup, RadioGroupItem } from "@/examples/base/ui/radio-group"

export function RadioGroupWithDescriptions() {
  return (
    <RadioGroup defaultValue="plus">
      <FieldLabel htmlFor="plus-plan">
        <Field orientation="horizontal">
          <FieldContent>
            <div className="font-medium">Plus</div>
            <FieldDescription>For individuals and small teams</FieldDescription>
          </FieldContent>
          <RadioGroupItem value="plus" id="plus-plan" />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="pro-plan">
        <Field orientation="horizontal">
          <FieldContent>
            <div className="font-medium">Pro</div>
            <FieldDescription>For growing businesses</FieldDescription>
          </FieldContent>
          <RadioGroupItem value="pro" id="pro-plan" />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="enterprise-plan">
        <Field orientation="horizontal">
          <FieldContent>
            <div className="font-medium">Enterprise</div>
            <FieldDescription>For large teams and enterprises</FieldDescription>
          </FieldContent>
          <RadioGroupItem value="enterprise" id="enterprise-plan" />
        </Field>
      </FieldLabel>
    </RadioGroup>
  )
}
