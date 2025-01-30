import React from "react"
import { MoreHorizontalIcon, SmileIcon } from "lucide-react"

import { Button } from "@/registry/default/ui/button"
import { Textarea } from "@/registry/default/ui/textarea"

export function ChatInput() {
  return (
    <div className="sticky bottom-0 z-20 p-6">
      <div className="relative">
        <Textarea
          placeholder="Send a message..."
          className="min-h-[100px] resize-none bg-muted/50 pr-24"
        />
        <div className="absolute bottom-3 right-3 flex space-x-2">
          <Button variant="ghost" size="icon">
            <SmileIcon size={16} strokeWidth={2} aria-hidden="true" />
            <span className="sr-only">Choose emoji</span>
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon size={16} strokeWidth={2} aria-hidden="true" />
            <span className="sr-only">More options</span>
          </Button>
          <Button>Send</Button>
        </div>
      </div>
    </div>
  )
}
