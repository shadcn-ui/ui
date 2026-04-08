import { Button } from "@/styles/react-aria-nova/ui/button"
import { Textarea } from "@/styles/react-aria-nova/ui/textarea"

export function TextareaButton() {
  return (
    <div className="grid w-full gap-2">
      <Textarea placeholder="Type your message here." />
      <Button>Send message</Button>
    </div>
  )
}
