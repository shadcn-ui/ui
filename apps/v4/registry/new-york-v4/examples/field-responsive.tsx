import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/registry/new-york-v4/ui/field"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"

export default function FieldResponsive() {
  return (
    <div className="w-full max-w-4xl">
      <form>
        <FieldSet>
          <FieldLegend>Profile</FieldLegend>
          <FieldDescription>Fill in your profile information.</FieldDescription>
          <FieldSeparator />
          <FieldGroup>
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <FieldDescription>
                  Provide your full name for identification
                </FieldDescription>
              </FieldContent>
              <Input id="name" placeholder="Evil Rabbit" required />
            </Field>
            <FieldSeparator />
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="lastName">Message</FieldLabel>
                <FieldDescription>
                  You can write your message here. Keep it short, preferably
                  under 100 characters.
                </FieldDescription>
              </FieldContent>
              <Textarea
                id="message"
                placeholder="Hello, world!"
                required
                className="min-h-[100px] resize-none sm:min-w-[300px]"
              />
            </Field>
            <FieldSeparator />
            <Field orientation="responsive">
              <Button type="submit">Submit</Button>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  )
}
