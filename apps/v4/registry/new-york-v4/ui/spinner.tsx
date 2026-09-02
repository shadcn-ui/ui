import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({
  className,
  label = "Loading",
  ...props
}: React.ComponentProps<"svg"> & { label?: string }) {
  return (
    <span role="status" aria-label={label}>
      <Loader2Icon
        aria-hidden="true"
        data-slot="spinner"
        className={cn("size-4 animate-spin", className)}
        {...props}
      />
    </span>
  )
}

export { Spinner }
