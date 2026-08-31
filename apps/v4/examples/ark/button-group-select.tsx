"use client"

import * as React from "react"
import { Button } from "@/styles/ark-nova/ui/button"
import { ButtonGroup } from "@/styles/ark-nova/ui/button-group"
import { Input } from "@/styles/ark-nova/ui/input"
import {
  createListCollection,
  Select,
  SelectContent,
  SelectControl,
  SelectIndicator,
  SelectItem,
  SelectItemGroup,
  SelectItemIndicator,
  SelectItemText,
  SelectTrigger,
} from "@/styles/ark-nova/ui/select"
import { ArrowRightIcon } from "lucide-react"

const CURRENCIES = [
  {
    value: "$",
    label: "US Dollar",
  },
  {
    value: "€",
    label: "Euro",
  },
  {
    value: "£",
    label: "British Pound",
  },
]

const currencyItems = createListCollection({
  items: CURRENCIES,
})

export default function ButtonGroupSelect() {
  const [currency, setCurrency] = React.useState("$")

  return (
    <ButtonGroup>
      <ButtonGroup>
        <Select collection={currencyItems} value={[currency]} onValueChange={(details) => setCurrency(details.value[0])}>
          <SelectControl>
            <SelectTrigger className="font-mono">{currency}</SelectTrigger>
            <SelectIndicator />
          </SelectControl>
          <SelectContent className="min-w-24">
            <SelectItemGroup>
              {CURRENCIES.map((c) => (
                <SelectItem key={c.value} item={c}>
                  <SelectItemText>
                    {c.value}{" "}
                    <span className="text-muted-foreground">
                      {c.label}
                    </span>
                  </SelectItemText>
                  <SelectItemIndicator />
                </SelectItem>
              ))}
            </SelectItemGroup>
          </SelectContent>
        </Select>
        <Input placeholder="10.00" pattern="[0-9]*" />
      </ButtonGroup>
      <ButtonGroup>
        <Button aria-label="Send" size="icon" variant="outline">
          <ArrowRightIcon />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  )
}
