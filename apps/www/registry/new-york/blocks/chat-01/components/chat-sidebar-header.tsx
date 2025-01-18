import React from "react"
import { SearchIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york/ui/avatar"
import { Button } from "@/registry/new-york/ui/button"
import { ScrollArea, ScrollBar } from "@/registry/new-york/ui/scroll-area"

export function ChatSidebarHeader() {
  return (
    <div className="shrink-0 space-y-6">
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="flex w-full items-center justify-between"
        >
          <div className="flex items-center">
            <SearchIcon
              className="-ms-1 me-2 opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            <span className="text-muted-foreground">Search...</span>
          </div>
          <kbd className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
            ⌘P
          </kbd>
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="font-medium">Active</h2>
        <ScrollArea className="whitespace-nowrap">
          <div className="flex items-center justify-between">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="relative">
                <Avatar className="rounded-lg">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="rounded-lg">U</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}
