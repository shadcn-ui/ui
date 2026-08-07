"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

type InputProps = React.ComponentProps<"input"> & {
  showPasswordToggle?: boolean
}

function Input({
  className,
  type,
  showPasswordToggle = true,
  ...props
}: InputProps) {
  const [show, setShow] = React.useState(false)

  const isPassword = type === "password" && showPasswordToggle

  // Build the main input
  const inputElement = (
  <input
    type={isPassword ? (show ? "text" : "password") : type}
    data-slot="input"
    className={cn(
      "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
      "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
      "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
      isPassword ? "pr-10" : "",
      className
    )}
    {...props}
  />
)

  // If not password-type → return plain input
  if (!isPassword) return inputElement

  // Otherwise render wrapper with toggle
  return (
    <div className="relative">
      {inputElement}

      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

export { Input }
