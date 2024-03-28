import { Textarea } from "@/registry/new-york/ui/textarea"

export default function TextareaWithAutoResize() {
  return (
    <Textarea placeholder="Type your message here." autoResize={true} />
  )
}