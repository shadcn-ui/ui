import { Button } from "@/registry/new-york-v4/ui/button"
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
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/new-york-v4/ui/input-group"
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
import { Textarea } from "@/registry/new-york-v4/ui/textarea"

export function ShipRegistrationForm() {
  return (
    <div className="flex max-w-md flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Join us in SF or online on October 23
        </h1>
        <FieldDescription>
          Already signed up? <a href="#">Log in</a>
        </FieldDescription>
      </div>
      <form>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>1. Select your ticket type</FieldLegend>
            <FieldDescription>
              Select your ticket type to join us in San Francisco or online on
              October 23.
            </FieldDescription>
            <Field>
              <RadioGroup>
                <FieldLabel htmlFor="in-person">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>In Person</FieldTitle>
                      <FieldDescription>
                        Join us in San Francisco on October 23.
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="in-person" id="in-person" />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="online">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Online</FieldTitle>
                      <FieldDescription>
                        Join us online on October 23.
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="online" id="online" />
                  </Field>
                </FieldLabel>
              </RadioGroup>
            </Field>
          </FieldSet>
          <Field orientation="horizontal">
            <Checkbox id="next-conf" />
            <FieldLabel htmlFor="next-conf">
              Also sign up for Next.js Conf 2025
            </FieldLabel>
          </Field>
          <FieldSet>
            <FieldLegend>2. Complete your attendee information</FieldLegend>
            <FieldDescription>
              By entering your information, you acknowledge that you have read
              and agree to the <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </FieldDescription>
            <FieldGroup className="grid grid-cols-2 gap-x-4">
              <Field>
                <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                <Input id="first-name" placeholder="Jane" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                <Input id="last-name" placeholder="Doe" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" placeholder="jane.doe@example.com" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="company">Company</FieldLabel>
                <Input id="company" placeholder="Example Inc." required />
              </Field>
              <Field>
                <FieldLabel htmlFor="job-title">Job Title</FieldLabel>
                <Input
                  id="job-title"
                  placeholder="Software Engineer"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="country">Country</FieldLabel>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field className="col-span-2">
                <FieldLabel htmlFor="topics">
                  What AI-related topics are you most curious about?
                </FieldLabel>
                <Textarea
                  id="topics"
                  placeholder="Agents, Security, Improving UX/Personalization, etc."
                  className="min-h-[100px]"
                />
              </Field>
              <Field className="col-span-2">
                <FieldLabel htmlFor="workloads">
                  What types of AI workloads are you tackling right now?
                </FieldLabel>
                <Textarea id="workloads" className="min-h-[100px]" />
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend>3. Buy your ticket</FieldLegend>
            <FieldDescription>
              Enter your card details to purchase your ticket.
            </FieldDescription>
            <FieldGroup className="grid grid-cols-2 gap-x-4">
              <Field className="col-span-2">
                <FieldLabel htmlFor="card-number">Card Number</FieldLabel>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="expiry-date">Expiry Date</FieldLabel>
                <Input id="expiry-date" placeholder="MM/YY" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="cvv">CVV</FieldLabel>
                <Input id="cvv" placeholder="123" required />
              </Field>
              <Field className="col-span-2">
                <FieldLabel htmlFor="promo-code">Promo Code</FieldLabel>
                <InputGroup>
                  <InputGroupInput id="promo-code" placeholder="PROMO10" />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton>Apply</InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field>
            <Button type="submit">Purchase Ticket</Button>
            <FieldDescription>
              By clicking Purchase Ticket, you agree to the{" "}
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
