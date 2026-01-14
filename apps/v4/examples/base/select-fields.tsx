import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/examples/base/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/base/ui/select"

export function SelectFields() {
  const basicItems = [
    { label: "Choose an option", value: null },
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ]
  const countryItems = [
    { label: "Select your country", value: null },
    { label: "United States", value: "us" },
    { label: "United Kingdom", value: "uk" },
    { label: "Canada", value: "ca" },
  ]
  const timezoneItems = [
    { label: "Select timezone", value: null },
    { label: "UTC", value: "utc" },
    { label: "Eastern Time", value: "est" },
    { label: "Pacific Time", value: "pst" },
  ]
  const invalidItems = [
    { label: "This field has an error", value: null },
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ]
  const disabledItems = [
    { label: "Cannot select", value: null },
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ]

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="select-basic">Basic Select</FieldLabel>
        <Select items={basicItems}>
          <SelectTrigger id="select-basic">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {basicItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor="select-country">Country</FieldLabel>
        <Select items={countryItems}>
          <SelectTrigger id="select-country">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {countryItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
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
        <Select items={timezoneItems}>
          <SelectTrigger id="select-timezone">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {timezoneItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor="select-invalid">Invalid Select</FieldLabel>
        <Select items={invalidItems}>
          <SelectTrigger id="select-invalid" aria-invalid>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {invalidItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <FieldDescription>
          This field contains validation errors.
        </FieldDescription>
      </Field>
      <Field data-disabled>
        <FieldLabel htmlFor="select-disabled-field">Disabled Field</FieldLabel>
        <Select items={disabledItems} disabled>
          <SelectTrigger id="select-disabled-field">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {disabledItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <FieldDescription>This field is currently disabled.</FieldDescription>
      </Field>
    </FieldGroup>
  )
}
