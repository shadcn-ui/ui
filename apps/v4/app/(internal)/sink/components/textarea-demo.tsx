import { Label } from "@/registry/new-york-v4/ui/label"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"

export function TextareaDemo() {
  return (
    <div className="flex w-full flex-col gap-10">
      <Textarea placeholder="Type your message here." />
      <Textarea placeholder="Type your message here." aria-invalid="true" />
      <div className="grid gap-3">
        <Label htmlFor="textarea-demo-message">Label</Label>
        <Textarea
          id="textarea-demo-message"
          placeholder="Type your message here."
          rows={6}
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="textarea-demo-message-2">
          With label and description
        </Label>
        <Textarea
          id="textarea-demo-message-2"
          placeholder="Type your message here."
          rows={6}
        />
        <div className="text-muted-foreground text-sm">
          Type your message and press enter to send.
        </div>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="textarea-demo-disabled">Disabled</Label>
        <Textarea
          id="textarea-demo-disabled"
          placeholder="Type your message here."
          disabled
        />
      </div>
    </div>
  )
}
