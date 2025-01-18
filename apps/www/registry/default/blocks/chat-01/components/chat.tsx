import React from "react"

import { Message } from "@/registry/default/blocks/chat-01/components/message"
import { ScrollArea } from "@/registry/default/ui/scroll-area"

type Message = {
  sender: string
  message: string
  timestamp: Date
  image?: string
  file?: {
    name: string
    type: string
    size: number
    pages: number
    url: string
  }
  link?: string
}

interface ChatProps {
  messages: Message[]
}

export function Chat({ messages }: ChatProps) {
  return (
    <ScrollArea className="flex flex-1 flex-col gap-4 space-y-4 p-6">
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}
    </ScrollArea>
  )
}
