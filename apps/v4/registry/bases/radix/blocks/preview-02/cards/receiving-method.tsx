"use client"

import { Button } from "@/registry/bases/radix/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/registry/bases/radix/ui/field"
import { Input } from "@/registry/bases/radix/ui/input"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/bases/radix/ui/radio-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function ReceivingMethod() {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Payout Preferences</CardDescription>
        <CardTitle>Receiving Method</CardTitle>
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
            <FieldLabel htmlFor="account-holder">
              Account Holder Name
            </FieldLabel>
            <Input
              id="account-holder"
              defaultValue="Synthetic Horizons Music LLC"
            />
          </Field>
          <FieldSet>
            <FieldLegend variant="label">Receiving Method</FieldLegend>
            <RadioGroup
              defaultValue="bank"
              className="grid grid-cols-1 items-start gap-3 md:grid-cols-2"
            >
              <FieldLabel htmlFor="method-bank">
                <Field orientation="horizontal" className="pb-2.5">
                  <RadioGroupItem value="bank" id="method-bank" />
                  <FieldContent>
                    <FieldDescription className="font-medium text-foreground">
                      Bank Transfer
                    </FieldDescription>
                    <FieldDescription>SWIFT / IBAN</FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="method-paypal">
                <Field orientation="horizontal" className="pb-2.5">
                  <RadioGroupItem value="paypal" id="method-paypal" />
                  <FieldContent>
                    <FieldDescription className="font-medium text-foreground">
                      PayPal
                    </FieldDescription>
                    <FieldDescription className="line-clamp-1">
                      Instant Payout
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
            </RadioGroup>
          </FieldSet>
          <Field>
            <FieldLabel htmlFor="iban">IBAN / Account Number</FieldLabel>
            <Input id="iban" placeholder="DE89 3704 0044 ...." />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled>
          Save Payout Settings
        </Button>
      </CardFooter>
    </Card>
  )
}
