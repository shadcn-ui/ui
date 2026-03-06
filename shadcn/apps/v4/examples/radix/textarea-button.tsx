import { Button } from "@/examples/radix/ui/button"
import { Textarea } from "@/examples/radix/ui/textarea"

export function TextareaButton() {
  return (
    <div className="grid w-full gap-2">
      <Textarea placeholder="Type your message here." />
      <Button>Send message</Button>
    </div>
  )
}
