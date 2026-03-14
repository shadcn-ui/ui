import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[90px] w-full rounded-[var(--radius-md)] border border-[rgb(var(--border)/0.18)] bg-transparent px-3 py-2.5 text-sm text-[rgb(var(--foreground))] transition-colors duration-[100ms] hover:border-[rgb(var(--border)/0.32)] focus:border-[rgb(var(--primary)/0.5)] focus:ring-2 focus:ring-[rgb(var(--ring)/0.15)] focus:outline-none resize-vertical disabled:opacity-40 disabled:cursor-not-allowed placeholder:text-[rgb(var(--foreground-subtle))] aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
