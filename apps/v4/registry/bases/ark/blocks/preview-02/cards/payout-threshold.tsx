"use client"

import * as React from "react"

import { Button } from "@/registry/bases/ark/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/ark/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/registry/bases/ark/ui/field"
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
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/ark/ui/select"
import {
  Slider,
  SliderControl,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@/registry/bases/ark/ui/slider"
import { Textarea } from "@/registry/bases/ark/ui/textarea"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const currencies = createListCollection({
  items: [
    { label: "USD — United States Dollar", value: "usd" },
    { label: "EUR — Euro", value: "eur" },
    { label: "GBP — British Pound", value: "gbp" },
    { label: "JPY — Japanese Yen", value: "jpy" },
  ],
})

export function PayoutThreshold() {
  const [amount, setAmount] = React.useState([2500])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payout Threshold</CardTitle>
        <CardDescription>
          Set the minimum balance required before a payout is triggered.
        </CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon-sm" className="bg-muted">
            <IconPlaceholder
              lucide="XIcon"
              tabler="IconX"
              hugeicons="Cancel01Icon"
              phosphor="XIcon"
              remixicon="RiCloseLine"
            />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel>
              Preferred Currency
            </FieldLabel>
            <Select
              collection={currencies}
              defaultValue={["usd"]}
              className="w-full"
            >
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
                  {currencies.items.map((item) => (
                    <SelectItem key={item.value} item={item}>
                      <SelectItemText>{item.label}</SelectItemText>
                      <SelectItemIndicator />
                    </SelectItem>
                  ))}
                </SelectItemGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <div className="flex items-baseline justify-between">
              <FieldLabel htmlFor="min-payout">
                Minimum Payout Amount
              </FieldLabel>
              <span className="text-2xl font-semibold tabular-nums">
                ${amount[0].toFixed(2)}
              </span>
            </div>
            <Slider
              id="min-payout"
              value={amount}
              onValueChange={(details) => setAmount(details.value)}
              min={50}
              max={10000}
              step={50}
            >
              <SliderControl>
                <SliderTrack>
                  <SliderRange />
                </SliderTrack>
                <SliderThumb index={0} />
              </SliderControl>
            </Slider>
            <div className="flex items-center justify-between">
              <FieldDescription>$50 (MIN)</FieldDescription>
              <FieldDescription>$10,000 (MAX)</FieldDescription>
            </div>
          </Field>
          <Field>
            <FieldLabel htmlFor="payout-notes">Notes</FieldLabel>
            <Textarea
              id="payout-notes"
              placeholder="Add any notes for this payout configuration..."
              className="min-h-[100px]"
            />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Save Threshold</Button>
      </CardFooter>
    </Card>
  )
}
