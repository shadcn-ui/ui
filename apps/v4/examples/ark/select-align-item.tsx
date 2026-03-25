"use client"

import * as React from "react"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/examples/ark/ui/field"
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
import {
  Switch,
  SwitchControl,
  SwitchHiddenInput,
  SwitchThumb,
} from "@/examples/ark/ui/switch"

const fruits = createListCollection({
  items: [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Blueberry", value: "blueberry" },
    { label: "Grapes", value: "grapes" },
    { label: "Pineapple", value: "pineapple" },
  ],
})

export function SelectAlignItem() {
  const [top, setTop] = React.useState(false)

  return (
    <FieldGroup className="w-full max-w-xs">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="placement-top">Top Placement</FieldLabel>
          <FieldDescription>
            Toggle to open the dropdown above the trigger.
          </FieldDescription>
        </FieldContent>
        <Switch
          id="placement-top"
          checked={top}
          onCheckedChange={(details) => setTop(!!details.checked)}
        >
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchHiddenInput />
        </Switch>
      </Field>
      <Field>
        <Select
          collection={fruits}
          defaultValue={["banana"]}
          positioning={{ placement: top ? "top" : "bottom" }}
        >
          <SelectHiddenSelect />
          <SelectControl>
            <SelectTrigger>
              <SelectValue />
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
      </Field>
    </FieldGroup>
  )
}
