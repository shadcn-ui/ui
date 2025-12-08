import { ArrowUp, Mic, Paperclip } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
} from "@/registry/new-york-v4/ui/toolbar"

export default function ToolbarPrompt() {
  return (
    <Toolbar
      className="mx-auto w-full max-w-lg flex-col items-center justify-center gap-2"
      aria-label="Prompt controls"
    >
      <Textarea
        placeholder="Typing something..."
        rows={2}
        className="max-h-28 resize-none border-none bg-transparent! shadow-none focus:ring-0!"
      />
      <ToolbarGroup className="w-full justify-between">
        <ToolbarGroup className="gap-2">
          <ToolbarButton size="icon-sm" variant="ghost" tooltip="Attach">
            <Paperclip />
          </ToolbarButton>
          <Select defaultValue="gemini-2.5-flash">
            <ToolbarButton asChild variant="ghost">
              <SelectTrigger className="hover:bg-accent! dark:hover:bg-accent/50! border-none! bg-transparent! shadow-none!">
                <SelectValue placeholder="Select agent" />
              </SelectTrigger>
            </ToolbarButton>
            <SelectContent align="start">
              <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
              <SelectItem value="gemini-2.5">Gemini 2.5</SelectItem>
              <SelectItem value="gemini-1.5">Gemini 1.5</SelectItem>
            </SelectContent>
          </Select>
        </ToolbarGroup>
        <ToolbarGroup className="gap-2">
          <ToolbarButton
            tooltip="Turn on microphone"
            size="icon-sm"
            variant="ghost"
          >
            <Mic />
          </ToolbarButton>
          <ToolbarButton tooltip="Send" size="icon-sm">
            <ArrowUp />
          </ToolbarButton>
        </ToolbarGroup>
      </ToolbarGroup>
    </Toolbar>
  )
}
