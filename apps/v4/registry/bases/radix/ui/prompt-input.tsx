"use client"

import * as React from "react"
import { PromptInput as PromptInputPrimitive } from "@shadcn/react/prompt-input"
import { cn } from "cn"

function PromptInputEditor({
  className,
  menuClassName,
  optionClassName,
  renderToken = (token) => (
    <PromptInputToken>
      {token.trigger}
      {token.label}
    </PromptInputToken>
  ),
  ...props
}: React.ComponentProps<typeof PromptInputPrimitive.Editor>) {
  return (
    <div className="relative w-full min-w-0 flex-1 [&_[data-slot=prompt-input-placeholder]]:pointer-events-none [&_[data-slot=prompt-input-placeholder]]:absolute [&_[data-slot=prompt-input-placeholder]]:start-3 [&_[data-slot=prompt-input-placeholder]]:top-3 [&_[data-slot=prompt-input-placeholder]]:text-muted-foreground">
      <PromptInputPrimitive.Editor
        data-slot="input-group-control"
        className={cn(
          "cn-input-group-textarea min-h-24 w-full p-3 text-base break-words whitespace-pre-wrap outline-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 md:text-sm",
          className
        )}
        menuClassName={cn(
          "relative z-50 max-h-64 min-w-48 overflow-y-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-md",
          menuClassName
        )}
        optionClassName={cn(
          "relative cursor-default rounded-sm px-2 py-1.5 text-sm outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground",
          optionClassName
        )}
        renderToken={renderToken}
        {...props}
      />
    </div>
  )
}

function PromptInputContent({
  className,
  renderToken = (token) => (
    <PromptInputToken>
      {token.trigger}
      {token.label}
    </PromptInputToken>
  ),
  ...props
}: React.ComponentProps<typeof PromptInputPrimitive.Content>) {
  return (
    <PromptInputPrimitive.Content
      className={cn("break-words whitespace-pre-wrap", className)}
      renderToken={renderToken}
      {...props}
    />
  )
}

function PromptInputToken({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="prompt-input-token"
      className={cn(
        "inline-flex items-center rounded-sm bg-muted px-1 py-0.5 text-sm font-medium text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { PromptInputEditor, PromptInputContent, PromptInputToken }
