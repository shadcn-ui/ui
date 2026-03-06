import { Button } from "@/examples/base/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/examples/base/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/examples/base/ui/field"
import { Input } from "@/examples/base/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/examples/base/ui/input-group"
import { ExternalLinkIcon, MailIcon } from "lucide-react"

export function InputGroupInCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Card with Input Group</CardTitle>
        <CardDescription>This is a card with an input group.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email-input">Email Address</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="email-input"
                type="email"
                placeholder="you@example.com"
              />
              <InputGroupAddon align="inline-end">
                <MailIcon />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="website-input">Website URL</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>https://</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput id="website-input" placeholder="example.com" />
              <InputGroupAddon align="inline-end">
                <ExternalLinkIcon />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="feedback-textarea">
              Feedback & Comments
            </FieldLabel>
            <InputGroup>
              <InputGroupTextarea
                id="feedback-textarea"
                placeholder="Share your thoughts..."
                className="min-h-[100px]"
              />
              <InputGroupAddon align="block-end">
                <InputGroupText>0/500 characters</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Submit</Button>
      </CardFooter>
    </Card>
  )
}
