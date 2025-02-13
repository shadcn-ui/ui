import React from "react"

import { ChatSidebarHeader } from "@/registry/default/blocks/chat-01/components/chat-sidebar-header"
import { ChatSidebarMessages } from "@/registry/default/blocks/chat-01/components/chat-sidebar-messages"
import { Separator } from "@/registry/default/ui/separator"

export function ChatSidebar() {
  return (
    <div className="hidden min-w-[350px] flex-col border-r bg-background p-4 lg:flex">
      <ChatSidebarHeader />
      <Separator className="my-6" />
      <ChatSidebarMessages />
    </div>
  )
}
