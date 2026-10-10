"use client"

import { Button } from "@/registry/bases/ark/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/ark/ui/card"
import { Checkbox } from "@/registry/bases/ark/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/registry/bases/ark/ui/field"
import { Input } from "@/registry/bases/ark/ui/input"
import {
  createListCollection,
  Select,
  SelectContent,
  SelectControl,
  SelectIndicator,
  SelectIndicatorGroup,
  SelectItem,
  SelectItemGroup,
  SelectItemIndicator,
  SelectItemText,
  SelectHiddenSelect,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/ark/ui/select"

const stateCollection = createListCollection({
  items: [
    { label: "California", value: "CA" },
    { label: "New York", value: "NY" },
    { label: "Texas", value: "TX" },
  ],
})

const countryCollection = createListCollection({
  items: [
    { label: "United States", value: "US" },
    { label: "Canada", value: "CA" },
    { label: "United Kingdom", value: "UK" },
  ],
})

export function ShippingAddress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Address</CardTitle>
        <CardDescription>Where should we deliver?</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="shipping-street">Street address</FieldLabel>
            <Input id="shipping-street" placeholder="123 Main Street" />
          </Field>
          <Field>
            <FieldLabel htmlFor="shipping-apt">Apt / Suite</FieldLabel>
            <Input id="shipping-apt" placeholder="Apt 4B" />
          </Field>
          <FieldGroup className="grid grid-cols-2">
            <Field>
              <FieldLabel htmlFor="shipping-city">City</FieldLabel>
              <Input id="shipping-city" placeholder="San Francisco" />
            </Field>
            <Field>
              <FieldLabel>State</FieldLabel>
              <Select collection={stateCollection} defaultValue={["CA"]}>
                <SelectHiddenSelect />
                <SelectControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectIndicatorGroup>
                    <SelectIndicator />
                  </SelectIndicatorGroup>
                </SelectControl>
                <SelectContent>
                  <SelectItemGroup>
                    {stateCollection.items.map((item) => (
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
          <FieldGroup className="grid grid-cols-2">
            <Field>
              <FieldLabel htmlFor="shipping-zip">ZIP Code</FieldLabel>
              <Input id="shipping-zip" placeholder="94102" />
            </Field>
            <Field>
              <FieldLabel>Country</FieldLabel>
              <Select collection={countryCollection} defaultValue={["US"]}>
                <SelectHiddenSelect />
                <SelectControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectIndicatorGroup>
                    <SelectIndicator />
                  </SelectIndicatorGroup>
                </SelectControl>
                <SelectContent>
                  <SelectItemGroup>
                    {countryCollection.items.map((item) => (
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
          <Field orientation="horizontal">
            <Checkbox id="shipping-save" defaultChecked />
            <FieldLabel htmlFor="shipping-save" className="font-normal">
              Save as default address
            </FieldLabel>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm" className="ml-auto">
          Save Address
        </Button>
      </CardFooter>
    </Card>
  )
}
