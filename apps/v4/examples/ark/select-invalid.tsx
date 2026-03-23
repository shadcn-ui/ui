"use client"

import { Field, FieldError, FieldLabel } from "@/examples/ark/ui/field"
import {
  createListCollection,
  Select,
  SelectContent,
  SelectControl,
  SelectHiddenSelect,
  SelectIndicator,
  SelectIndicatorGroup,
  SelectItem,
  SelectItemGroup,
  SelectItemIndicator,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from "@/examples/ark/ui/select"

const fruits = createListCollection({
  items: [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Blueberry", value: "blueberry" },
  ],
})

export function SelectInvalid() {
  return (
    <Field data-invalid className="w-full max-w-48">
      <FieldLabel>Fruit</FieldLabel>
      <Select collection={fruits} invalid>
        <SelectHiddenSelect />
        <SelectControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectIndicatorGroup>
            <SelectIndicator />
          </SelectIndicatorGroup>
        </SelectControl>
        <SelectContent>
          <SelectItemGroup>
            {fruits.items.map((item) => (
              <SelectItem key={item.value} item={item}>
                <SelectItemText>{item.label}</SelectItemText>
                <SelectItemIndicator />
              </SelectItem>
            ))}
          </SelectItemGroup>
        </SelectContent>
      </Select>
      <FieldError>Please select a fruit.</FieldError>
    </Field>
  )
}
