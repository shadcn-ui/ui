"use client"

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
import { Field, FieldGroup, FieldLabel } from "@/registry/bases/ark/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/registry/bases/ark/ui/input-group"
import { Item, ItemContent } from "@/registry/bases/ark/ui/item"
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
import { Separator } from "@/registry/bases/ark/ui/separator"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const fromAccounts = createListCollection({
  items: [
    { label: "Main Checking (··8402) — $12,450.00", value: "checking" },
    { label: "Business (··7731) — $8,920.00", value: "business" },
  ],
})

const toAccounts = createListCollection({
  items: [
    { label: "High Yield Savings (··1192) — $42,100.00", value: "savings" },
    { label: "Investment (··3349) — $18,200.00", value: "investment" },
  ],
})

export function TransferFunds() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Funds</CardTitle>
        <CardDescription>
          Move money between your connected accounts.
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
            <FieldLabel htmlFor="transfer-amount">
              Amount to Transfer
            </FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>$</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput id="transfer-amount" defaultValue="1,200.00" />
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel>From Account</FieldLabel>
            <Select
              collection={fromAccounts}
              defaultValue={["checking"]}
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
                  {fromAccounts.items.map((item) => (
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
            <FieldLabel>To Account</FieldLabel>
            <Select
              collection={toAccounts}
              defaultValue={["savings"]}
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
                  {toAccounts.items.map((item) => (
                    <SelectItem key={item.value} item={item}>
                      <SelectItemText>{item.label}</SelectItemText>
                      <SelectItemIndicator />
                    </SelectItem>
                  ))}
                </SelectItemGroup>
              </SelectContent>
            </Select>
          </Field>
          <Item variant="muted" className="flex-col items-stretch">
            <ItemContent className="gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Estimated arrival
                </span>
                <span className="text-sm font-medium">Today, Apr 14</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Transaction fee
                </span>
                <span className="text-sm font-medium tabular-nums">$0.00</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total amount</span>
                <span className="text-sm font-semibold tabular-nums">
                  $1,200.00
                </span>
              </div>
            </ItemContent>
          </Item>
        </FieldGroup>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Confirm Transfer</Button>
      </CardFooter>
    </Card>
  )
}