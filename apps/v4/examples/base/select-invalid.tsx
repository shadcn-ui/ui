import { Field, FieldError, FieldLabel } from "@/examples/base/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/base/ui/select"

const items = [
  { label: "Select a fruit", value: null },
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
]

export function SelectInvalid() {
  return (
    <Field data-invalid className="w-full max-w-48">
      <FieldLabel>Fruit</FieldLabel>
      <Select items={items}>
        <SelectTrigger aria-invalid>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <FieldError>Please select a fruit.</FieldError>
    </Field>
  )
}
