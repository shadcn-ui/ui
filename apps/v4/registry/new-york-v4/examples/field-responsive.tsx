import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/registry/new-york-v4/ui/field"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"

export default function FieldResponsive() {
  return (
    <div className="w-full max-w-4xl">
      <form>
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
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="lastName">Message</FieldLabel>
              <FieldDescription>
                You can write your message here. Keep it short, preferably under
                100 characters.
              </FieldDescription>
            </FieldContent>
            <Textarea
              id="message"
              placeholder="Hello, world!"
              required
              className="min-h-[100px] resize-none sm:min-w-[300px]"
            />
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
