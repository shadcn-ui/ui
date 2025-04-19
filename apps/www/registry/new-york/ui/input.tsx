import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const validateInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
      const isKeycodeInRange =
        event.keyCode >= 65 &&
        event.keyCode <= 90 &&
        !event.metaKey &&
        !event.shiftKey &&
        !event.altKey &&
        !event.ctrlKey
      const regex = /[a-zA-Z]/i
      isKeycodeInRange &&
        type === "tel" &&
        regex.test(event.key) &&
        event.preventDefault()
    }
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
        onKeyDown={(e) => {
          validateInput(e)
          props.onKeyDown?.(e)
        }}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
