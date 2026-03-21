import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
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
import { Textarea } from "@/registry/new-york-v4/ui/textarea"

export function ShippingForm() {
  return (
    <FieldSet>
      <FieldLegend>Shipping Details</FieldLegend>
      <FieldDescription>
        Please provide your shipping details so we can deliver your order.
      </FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="street-address">Street Address</FieldLabel>
          <Input id="street-address" autoComplete="off" />
        </Field>
        <Field>
          <FieldLabel htmlFor="city">City</FieldLabel>
          <Input id="city" />
        </Field>
        <FieldSet>
          <FieldLegend variant="label">Shipping Method</FieldLegend>
          <FieldDescription>
            Please select the shipping method for your order.
          </FieldDescription>
          <RadioGroup>
            <Field orientation="horizontal">
              <RadioGroupItem value="standard" id="shipping-method-1" />
              <FieldLabel htmlFor="shipping-method-1" className="font-normal">
                Standard{" "}
                <Badge className="rounded-full py-px" variant="outline">
                  Free
                </Badge>
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="express" id="shipping-method-2" />
              <FieldLabel htmlFor="shipping-method-2" className="font-normal">
                Express
              </FieldLabel>
            </Field>
          </RadioGroup>
        </FieldSet>
        <Field>
          <FieldLabel htmlFor="message">Message</FieldLabel>
          <Textarea id="message" />
          <FieldDescription>Anything else you want to add?</FieldDescription>
        </Field>
        <FieldSet>
          <FieldLegend>Additional Items</FieldLegend>
          <FieldDescription>
            Please select the additional items for your order.
          </FieldDescription>
          <FieldGroup data-slot="checkbox-group">
            <FieldLabel htmlFor="gift-wrapping">
              <Field orientation="horizontal">
                <Checkbox
                  value="gift-wrapping"
                  id="gift-wrapping"
                  aria-label="Gift Wrapping"
                />
                <FieldContent>
                  <FieldTitle>Gift Wrapping</FieldTitle>
                  <FieldDescription>
                    Add elegant gift wrapping with a personalized message.
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="insurance">
              <Field orientation="horizontal">
                <Checkbox
                  value="insurance"
                  id="insurance"
                  aria-label="Package Insurance"
                />
                <FieldContent>
                  <FieldTitle>Package Insurance</FieldTitle>
                  <FieldDescription>
                    Protect your shipment with comprehensive insurance coverage.
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="signature-confirmation">
              <Field orientation="horizontal">
                <Checkbox
                  value="signature-confirmation"
                  id="signature-confirmation"
                  aria-label="Signature Confirmation"
                />
                <FieldContent>
                  <FieldTitle>Signature Confirmation</FieldTitle>
                  <FieldDescription>
                    Require recipient signature upon delivery for added
                    security.
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldLabel>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
    </FieldSet>
  )
}
