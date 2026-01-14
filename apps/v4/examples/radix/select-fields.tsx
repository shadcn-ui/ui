import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/examples/radix/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/radix/ui/select"

export function SelectFields() {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="select-basic">Basic Select</FieldLabel>
        <Select>
          <SelectTrigger id="select-basic">
            <SelectValue placeholder="Choose an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor="select-country">Country</FieldLabel>
        <Select>
          <SelectTrigger id="select-country">
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
            <SelectItem value="ca">Canada</SelectItem>
          </SelectContent>
        </Select>
        <FieldDescription>
          Select the country where you currently reside.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="select-timezone">Timezone</FieldLabel>
        <FieldDescription>
          Choose your local timezone for accurate scheduling.
        </FieldDescription>
        <Select>
          <SelectTrigger id="select-timezone">
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="utc">UTC</SelectItem>
            <SelectItem value="est">Eastern Time</SelectItem>
            <SelectItem value="pst">Pacific Time</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor="select-invalid">Invalid Select</FieldLabel>
        <Select>
          <SelectTrigger id="select-invalid" aria-invalid>
            <SelectValue placeholder="This field has an error" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
        <FieldDescription>
          This field contains validation errors.
        </FieldDescription>
      </Field>
      <Field data-disabled>
        <FieldLabel htmlFor="select-disabled-field">Disabled Field</FieldLabel>
        <Select disabled>
          <SelectTrigger id="select-disabled-field">
            <SelectValue placeholder="Cannot select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
        <FieldDescription>This field is currently disabled.</FieldDescription>
      </Field>
    </FieldGroup>
  )
}
