import { CanvaFrame } from "@/components/canva"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/registry/bases/radix/ui/field"
import { Textarea } from "@/registry/bases/radix/ui/textarea"

export default function TextareaExample() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-lg flex-col gap-12">
        <TextareaBasic />
        <TextareaInvalid />
        <TextareaWithLabel />
        <TextareaWithDescription />
        <TextareaDisabled />
      </div>
    </div>
  )
}

function TextareaBasic() {
  return (
    <CanvaFrame title="Basic">
      <Textarea placeholder="Type your message here." />
    </CanvaFrame>
  )
}

function TextareaInvalid() {
  return (
    <CanvaFrame title="Invalid">
      <Textarea placeholder="Type your message here." aria-invalid="true" />
    </CanvaFrame>
  )
}

function TextareaWithLabel() {
  return (
    <CanvaFrame title="With Label">
      <Field>
        <FieldLabel htmlFor="textarea-demo-message">Message</FieldLabel>
        <Textarea
          id="textarea-demo-message"
          placeholder="Type your message here."
          rows={6}
        />
      </Field>
    </CanvaFrame>
  )
}

function TextareaWithDescription() {
  return (
    <CanvaFrame title="With Description">
      <Field>
        <FieldLabel htmlFor="textarea-demo-message-2">Message</FieldLabel>
        <Textarea
          id="textarea-demo-message-2"
          placeholder="Type your message here."
          rows={6}
        />
        <FieldDescription>
          Type your message and press enter to send.
        </FieldDescription>
      </Field>
    </CanvaFrame>
  )
}

function TextareaDisabled() {
  return (
    <CanvaFrame title="Disabled">
      <Field>
        <FieldLabel htmlFor="textarea-demo-disabled">Message</FieldLabel>
        <Textarea
          id="textarea-demo-disabled"
          placeholder="Type your message here."
          disabled
        />
      </Field>
    </CanvaFrame>
  )
}
