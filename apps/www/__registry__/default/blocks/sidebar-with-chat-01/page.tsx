"use client"

import { AppSidebar } from "@/registry/default/blocks/sidebar-with-chat-01/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/registry/default/ui/sidebar"

import { ChatForm } from "./components/chat-form"

export const iframeHeight = "800px"

export const description = "A sidebar with a header and a search form."

export default function Page() {
  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex h-full flex-1 flex-col items-center justify-center gap-8 p-4">
              <h2 className="text-center text-4xl font-semibold">
                How can we help you?
              </h2>
              <ChatForm onSend={({ content }) => console.log(content)} />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
