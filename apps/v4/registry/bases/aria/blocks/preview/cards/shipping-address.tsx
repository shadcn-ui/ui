"use client"

import { Button } from "@/registry/bases/aria/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/aria/ui/card"
import { Checkbox } from "@/registry/bases/aria/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/registry/bases/aria/ui/field"
import { Input } from "@/registry/bases/aria/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/aria/ui/select"

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
              <FieldLabel htmlFor="shipping-state">State</FieldLabel>
              <Select defaultValue="CA">
                <SelectTrigger id="shipping-state" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem id="CA">California</SelectItem>
                    <SelectItem id="NY">New York</SelectItem>
                    <SelectItem id="TX">Texas</SelectItem>
                  </SelectGroup>
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
              <FieldLabel htmlFor="shipping-country">Country</FieldLabel>
              <Select defaultValue="US">
                <SelectTrigger id="shipping-country" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem id="US">United States</SelectItem>
                    <SelectItem id="CA">Canada</SelectItem>
                    <SelectItem id="UK">United Kingdom</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <Field orientation="horizontal">
            <Checkbox id="shipping-save" defaultSelected />
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
