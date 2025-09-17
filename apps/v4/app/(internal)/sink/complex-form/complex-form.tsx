"use client"

import { useActionState, useEffect } from "react"
import Form from "next/form"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/registry/new-york-v4/ui/field"
import { Input } from "@/registry/new-york-v4/ui/input"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/new-york-v4/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"

import { submitPhoneOrder } from "./actions"
import {
  accessories,
  countries,
  phoneModels,
  states,
  storageOptions,
  universalColors,
} from "./data"
import { FormState } from "./schema"

export function ComplexForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    submitPhoneOrder,
    {
      values: {
        model: "",
        color: "",
        storage: "",
        accessories: [],
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardName: "",
      },
      errors: null,
      success: false,
    }
  )

  useEffect(() => {
    if (state.success) {
      toast.success("Order placed successfully!")
    }
  }, [state.success])

  return (
    <Form action={formAction} className="w-full max-w-xl">
      <div className="flex flex-col gap-6 [--radius:0.95rem]">
          <Card>
            <CardContent>
              <FieldGroup>
                <FieldSet>
                  <FieldLegend>Phone Model</FieldLegend>
                  <FieldDescription>
                    Select your preferred iPhone model from our latest lineup.
                  </FieldDescription>
                  <Field data-invalid={!!state.errors?.model?.length}>
                    <RadioGroup
                      name="model"
                      defaultValue=""
                      aria-invalid={!!state.errors?.model?.length}
                    >
                      {phoneModels.map((phone) => (
                        <FieldLabel key={phone.value} htmlFor={phone.value}>
                          <Field>
                            <RadioGroupItem
                              value={phone.value}
                              id={phone.value}
                            />
                            <FieldContent>
                              <FieldTitle>{phone.label}</FieldTitle>
                              <FieldDescription>
                                {phone.description}
                              </FieldDescription>
                            </FieldContent>
                            <span className="font-mono font-medium tabular-nums">
                              ${phone.price}
                            </span>
                          </Field>
                        </FieldLabel>
                      ))}
                    </RadioGroup>
                    {state.errors?.model && (
                      <FieldError className="text-destructive">
                        {state.errors.model[0]}
                      </FieldError>
                    )}
                  </Field>
                </FieldSet>
                <FieldSet>
                  <FieldLegend>Color</FieldLegend>
                  <FieldDescription>
                    Choose your preferred color finish.
                  </FieldDescription>
                  <Field data-invalid={!!state.errors?.color?.length}>
                    <RadioGroup
                      name="color"
                      defaultValue=""
                      disabled={pending}
                      aria-invalid={!!state.errors?.color?.length}
                    >
                      {universalColors.map((color) => (
                        <FieldLabel key={color.value} htmlFor={color.value}>
                          <Field>
                            <RadioGroupItem
                              value={color.value}
                              id={color.value}
                            />
                            <FieldContent>
                              <FieldTitle>{color.label}</FieldTitle>
                              <FieldDescription>
                                {color.description}
                              </FieldDescription>
                            </FieldContent>
                            <div
                              className="size-6 rounded-full"
                              style={{ backgroundColor: color.color }}
                            />
                          </Field>
                        </FieldLabel>
                      ))}
                    </RadioGroup>
                    {state.errors?.color && (
                      <FieldError className="text-destructive">
                        {state.errors.color[0]}
                      </FieldError>
                    )}
                  </Field>
                </FieldSet>
                <FieldSet>
                  <FieldLegend>Storage Capacity</FieldLegend>
                  <FieldDescription>
                    Choose the storage size that best fits your needs.
                  </FieldDescription>

                  <Field data-invalid={!!state.errors?.storage?.length}>
                    <RadioGroup
                      name="storage"
                      defaultValue=""
                      aria-invalid={!!state.errors?.storage?.length}
                    >
                      {storageOptions.map((storage) => (
                        <FieldLabel key={storage.value} htmlFor={storage.value}>
                          <Field>
                            <RadioGroupItem
                              value={storage.value}
                              id={storage.value}
                            />
                            <FieldContent>
                              <FieldTitle>{storage.label}</FieldTitle>
                              <FieldDescription>
                                {storage.description}
                              </FieldDescription>
                            </FieldContent>
                            <span className="font-mono font-medium tabular-nums">
                              {storage.price > 0
                                ? `+$${storage.price}`
                                : "Included"}
                            </span>
                          </Field>
                        </FieldLabel>
                      ))}
                    </RadioGroup>
                    {state.errors?.storage && (
                      <FieldError className="text-destructive">
                        {state.errors.storage[0]}
                      </FieldError>
                    )}
                  </Field>
                </FieldSet>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accessories</CardTitle>
              <CardDescription>
                Select at least one accessory to enhance your phone experience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field data-invalid={!!state.errors?.accessories?.length}>
                  <FieldLabel className="sr-only">
                    Available Accessories
                  </FieldLabel>
                  <div className="grid grid-cols-2 gap-4">
                    {accessories.map((accessory) => (
                      <FieldLabel
                        key={accessory.value}
                        htmlFor={accessory.value}
                      >
                        <Field>
                          <Checkbox
                            id={accessory.value}
                            name="accessories"
                            value={accessory.value}
                            defaultChecked={false}
                            disabled={pending}
                          />
                          <FieldContent>
                            <FieldTitle className="flex justify-between">
                              <span>{accessory.label}</span>
                              <span className="font-semibold">
                                ${accessory.price}
                              </span>
                            </FieldTitle>
                            <FieldDescription>
                              {accessory.description}
                            </FieldDescription>
                          </FieldContent>
                        </Field>
                      </FieldLabel>
                    ))}
                  </div>
                  {state.errors?.accessories && (
                    <FieldError className="text-destructive">
                      {state.errors.accessories[0]}
                    </FieldError>
                  )}
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>
                Enter your shipping address details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field data-invalid={!!state.errors?.firstName?.length}>
                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      defaultValue=""
                      required
                      disabled={pending}
                      aria-invalid={!!state.errors?.firstName?.length}
                    />
                    {state.errors?.firstName && (
                      <FieldError className="text-destructive">
                        {state.errors.firstName[0]}
                      </FieldError>
                    )}
                  </Field>

                  <Field data-invalid={!!state.errors?.lastName?.length}>
                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      defaultValue=""
                      required
                      disabled={pending}
                      aria-invalid={!!state.errors?.lastName?.length}
                    />
                    {state.errors?.lastName && (
                      <FieldError className="text-destructive">
                        {state.errors.lastName[0]}
                      </FieldError>
                    )}
                  </Field>
                </div>

                <Field data-invalid={!!state.errors?.email?.length}>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    defaultValue=""
                    required
                    disabled={pending}
                    aria-invalid={!!state.errors?.email?.length}
                  />
                  <FieldDescription>
                    We&apos;ll send order updates to this email.
                  </FieldDescription>
                  {state.errors?.email && (
                    <FieldError className="text-destructive">
                      {state.errors.email[0]}
                    </FieldError>
                  )}
                </Field>

                <Field data-invalid={!!state.errors?.phone?.length}>
                  <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    defaultValue=""
                    required
                    disabled={pending}
                    aria-invalid={!!state.errors?.phone?.length}
                  />
                  {state.errors?.phone && (
                    <FieldError className="text-destructive">
                      {state.errors.phone[0]}
                    </FieldError>
                  )}
                </Field>

                <Field data-invalid={!!state.errors?.address?.length}>
                  <FieldLabel htmlFor="address">Street Address</FieldLabel>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main Street"
                    defaultValue=""
                    required
                    disabled={pending}
                    aria-invalid={!!state.errors?.address?.length}
                  />
                  {state.errors?.address && (
                    <FieldError className="text-destructive">
                      {state.errors.address[0]}
                    </FieldError>
                  )}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field data-invalid={!!state.errors?.city?.length}>
                    <FieldLabel htmlFor="city">City</FieldLabel>
                    <Input
                      id="city"
                      name="city"
                      placeholder="New York"
                      defaultValue=""
                      required
                      disabled={pending}
                      aria-invalid={!!state.errors?.city?.length}
                    />
                    {state.errors?.city && (
                      <FieldError className="text-destructive">
                        {state.errors.city[0]}
                      </FieldError>
                    )}
                  </Field>

                  <Field data-invalid={!!state.errors?.zipCode?.length}>
                    <FieldLabel htmlFor="zipCode">ZIP Code</FieldLabel>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      placeholder="10001"
                      defaultValue=""
                      required
                      disabled={pending}
                      aria-invalid={!!state.errors?.zipCode?.length}
                    />
                    {state.errors?.zipCode && (
                      <FieldError className="text-destructive">
                        {state.errors.zipCode[0]}
                      </FieldError>
                    )}
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field data-invalid={!!state.errors?.state?.length}>
                    <FieldLabel htmlFor="state">State</FieldLabel>
                    <Select
                      name="state"
                      defaultValue=""
                      disabled={pending}
                      aria-invalid={!!state.errors?.state?.length}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {state.errors?.state && (
                      <FieldError className="text-destructive">
                        {state.errors.state[0]}
                      </FieldError>
                    )}
                  </Field>

                  <Field data-invalid={!!state.errors?.country?.length}>
                    <FieldLabel htmlFor="country">Country</FieldLabel>
                    <Select
                      name="country"
                      defaultValue=""
                      disabled={pending}
                      aria-invalid={!!state.errors?.country?.length}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {state.errors?.country && (
                      <FieldError className="text-destructive">
                        {state.errors.country[0]}
                      </FieldError>
                    )}
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>
                Enter your payment details to complete the order.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field data-invalid={!!state.errors?.cardName?.length}>
                  <FieldLabel htmlFor="cardName">Name on Card</FieldLabel>
                  <Input
                    id="cardName"
                    name="cardName"
                    placeholder="John Doe"
                    defaultValue=""
                    required
                    disabled={pending}
                    aria-invalid={!!state.errors?.cardName?.length}
                  />
                  {state.errors?.cardName && (
                    <FieldError className="text-destructive">
                      {state.errors.cardName[0]}
                    </FieldError>
                  )}
                </Field>
                <Field data-invalid={!!state.errors?.cardNumber?.length}>
                  <FieldLabel htmlFor="cardNumber">Card Number</FieldLabel>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    defaultValue=""
                    required
                    disabled={pending}
                    aria-invalid={!!state.errors?.cardNumber?.length}
                  />
                  {state.errors?.cardNumber && (
                    <FieldError className="text-destructive">
                      {state.errors.cardNumber[0]}
                    </FieldError>
                  )}
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field data-invalid={!!state.errors?.expiryDate?.length}>
                    <FieldLabel htmlFor="expiryDate">Expiry Date</FieldLabel>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      defaultValue=""
                      required
                      disabled={pending}
                      aria-invalid={!!state.errors?.expiryDate?.length}
                    />
                    {state.errors?.expiryDate && (
                      <FieldError className="text-destructive">
                        {state.errors.expiryDate[0]}
                      </FieldError>
                    )}
                  </Field>
                  <Field data-invalid={!!state.errors?.cvv?.length}>
                    <FieldLabel htmlFor="cvv">CVV</FieldLabel>
                    <Input
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      defaultValue=""
                      required
                      disabled={pending}
                      aria-invalid={!!state.errors?.cvv?.length}
                    />
                    {state.errors?.cvv && (
                      <FieldError className="text-destructive">
                        {state.errors.cvv[0]}
                      </FieldError>
                    )}
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>
          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="animate-spin" />}
            {pending ? "Processing Order..." : "Place Order"}
          </Button>
      </div>
    </Form>
  )
}
