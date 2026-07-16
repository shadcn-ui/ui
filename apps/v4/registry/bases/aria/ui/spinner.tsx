"use client"

import { ProgressBar as ProgressBarPrimitive } from "react-aria-components"

import { cn } from "@/registry/bases/aria/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <ProgressBarPrimitive
      isIndeterminate
      aria-label="Loading"
      className={cn("size-4", className)}
    >
      <IconPlaceholder
        lucide="Loader2Icon"
        tabler="IconLoader"
        hugeicons="Loading03Icon"
        phosphor="SpinnerIcon"
        remixicon="RiLoaderLine"
        data-slot="spinner"
        className="size-full animate-spin"
        {...props}
      />
    </ProgressBarPrimitive>
  )
}

export { Spinner }
