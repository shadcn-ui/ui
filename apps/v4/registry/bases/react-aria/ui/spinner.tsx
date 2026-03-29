"use client";

import { cn } from "@/registry/bases/react-aria/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { ProgressBar as ProgressBarPrimitive } from "react-aria-components"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <ProgressBarPrimitive isIndeterminate aria-label="Loading" className={cn("size-4", className)}>
      <IconPlaceholder
        lucide="Loader2Icon"
        tabler="IconLoader"
        hugeicons="Loading03Icon"
        phosphor="SpinnerIcon"
        remixicon="RiLoaderLine"
        className="size-full animate-spin"
        {...props}
      />
    </ProgressBarPrimitive>
  )
}

export { Spinner }
