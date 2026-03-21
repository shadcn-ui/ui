import { Button } from "@/examples/react-aria/ui/button"
import { Textarea } from "@/examples/react-aria/ui/textarea"

export function TextareaButton() {
  return (
    <div className="grid w-full gap-2">
      <Textarea placeholder="Type your message here." />
      <Button>Send message</Button>
    </div>
  )
}
