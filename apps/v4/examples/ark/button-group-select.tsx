"use client"

import * as React from "react"
import { Button } from "@/examples/ark/ui/button"
import { ButtonGroup } from "@/examples/ark/ui/button-group"
import { Input } from "@/examples/ark/ui/input"
import {
  createListCollection,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectItemIndicator,
  SelectItemText,
  SelectTrigger,
} from "@/examples/ark/ui/select"
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
          <SelectTrigger className="font-mono">{currency}</SelectTrigger>
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
