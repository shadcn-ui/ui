"use client"

import * as React from "react"
import { SendHorizonalIcon } from "lucide-react"

import { cn } from "@/registry/new-york/lib/utils"
import { Button } from "@/registry/new-york/ui/button"
import { Textarea } from "@/registry/new-york/ui/textarea"

export type ChatFormProps = {
  className?: string
  onSend?: ({ content }: { content: string }) => void
} & React.HTMLAttributes<HTMLFormElement>

export function ChatForm({ className, onSend, ...props }: ChatFormProps) {
  /**
   * Handles the form submission and sends the content of the chat form
   * to the `onSend` prop if it is provided.
   *
   * @param {React.FormEvent<HTMLFormElement>} event
   * The form submission event
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const content = formData.get("content") as string
    if (onSend) {
      onSend({ content })
    }
  }

  return (
    <form
      className={cn(
        "w-full max-w-2xl space-y-4 rounded-xl border border-input bg-muted px-2 py-4 dark:border-muted",
        className
      )}
      onSubmit={handleSubmit}
      {...props}
    >
      <Textarea
        name="content"
        className="w-full resize-none border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Type a message..."
        required
      />
      <div className="mt-2 flex items-center justify-between px-2">
        <Button className="ml-auto">
          <SendHorizonalIcon className="size-4" />
        </Button>
      </div>
    </form>
  )
}
