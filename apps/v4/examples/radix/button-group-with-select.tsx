"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/examples/radix/ui/button"
import { ButtonGroup } from "@/examples/radix/ui/button-group"
import { Field } from "@/examples/radix/ui/field"
import { Input } from "@/examples/radix/ui/input"
import { Label } from "@/examples/radix/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/radix/ui/select"
import { ArrowRightIcon } from "lucide-react"

export function ButtonGroupWithSelect() {
  const [currency, setCurrency] = useState("$")

  return (
    <Field>
      <Label htmlFor="amount">Amount</Label>
      <ButtonGroup>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value="$">$</SelectItem>
            <SelectItem value="€">€</SelectItem>
            <SelectItem value="£">£</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Enter amount to send" />
        <Button variant="outline">
          <ArrowRightIcon />
        </Button>
      </ButtonGroup>
    </Field>
  )
}
