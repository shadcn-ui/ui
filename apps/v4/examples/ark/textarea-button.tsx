import { Button } from "@/styles/ark-nova/ui/button"
import { Textarea } from "@/styles/ark-nova/ui/textarea"

export function TextareaButton() {
  return (
    <div className="grid w-full gap-2">
      <Textarea placeholder="Type your message here." />
      <Button>Send message</Button>
    </div>
  )
}
