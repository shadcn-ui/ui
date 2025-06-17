import { Label } from "@/registry/new-york-v4/ui/label"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"

export default function TextareaWithText() {
  return (
    <div className="grid w-full gap-3">
      <Label htmlFor="message-2">Your Message</Label>
      <Textarea placeholder="Type your message here." id="message-2" />
      <p className="text-muted-foreground text-sm">
        Your message will be copied to the support team.
      </p>
    </div>
  )
}
