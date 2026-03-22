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
  SelectPositioner,
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
  const [sameWidth, setSameWidth] = React.useState(true)

  return (
    <FieldGroup className="w-full max-w-xs">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="same-width">Same Width</FieldLabel>
          <FieldDescription>
            Toggle to match the dropdown width with the trigger.
          </FieldDescription>
        </FieldContent>
        <Switch
          id="same-width"
          checked={sameWidth}
          onCheckedChange={(details) => setSameWidth(!!details.checked)}
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
          positioning={{ sameWidth }}
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
          
            <SelectPositioner>
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
            </SelectPositioner>
          
        </Select>
      </Field>
    </FieldGroup>
  )
}
