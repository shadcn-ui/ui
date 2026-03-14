import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-[var(--radius-md)] border border-[rgb(var(--border)/0.18)] bg-transparent px-3 py-2 text-sm text-[rgb(var(--foreground))] transition-colors duration-[100ms] hover:border-[rgb(var(--border)/0.32)] focus:border-[rgb(var(--primary)/0.5)] focus:ring-2 focus:ring-[rgb(var(--ring)/0.15)] focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[rgb(var(--foreground-subtle))]",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
