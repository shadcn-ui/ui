import { Button } from "@/styles/radix-force-ui/ui/button"
import { Textarea } from "@/styles/radix-force-ui/ui/textarea"

export function TextareaButton() {
  return (
    <div className="grid w-full gap-2">
      <Textarea placeholder="Type your message here." />
      <Button>Send message</Button>
    </div>
  )
}
