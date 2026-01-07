import { Label } from "@/registry/radix-nova/ui/label"
import { Textarea } from "@/registry/radix-nova/ui/textarea"

export default function TextareaWithLabel() {
  return (
    <div className="grid w-full gap-3">
      <Label htmlFor="message">Your message</Label>
      <Textarea placeholder="Type your message here." id="message" />
    </div>
  )
}
