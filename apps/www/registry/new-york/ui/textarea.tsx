"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  focusValueEnd?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, focusValueEnd, ...props }, passedRef) => {
    const localRef = React.useRef<HTMLTextAreaElement | null>(null)

    React.useImperativeHandle(passedRef, () => localRef.current!)

    React.useEffect(() => {
      if (focusValueEnd && localRef.current) {
        const el = localRef.current
        el.focus()
        const len = el.value.length
        el.setSelectionRange(len, len)
      }
    }, [focusValueEnd])

    return (
      <textarea
        ref={localRef}
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        {...props}
      />
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea }
