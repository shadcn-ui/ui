import { Textarea } from "@/registry/default/ui/textarea"

export default function TextareaWithAutoResize() {
  return (
    <Textarea placeholder="Type your message here." autoResize={true} />
  )
}