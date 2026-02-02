import { cn } from "@/examples/radix/lib/utils"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <IconPlaceholder
      lucide="Loader2Icon"
      tabler="IconLoader"
      hugeicons="Loading03Icon"
      phosphor="SpinnerIcon"
      remixicon="RiLoaderLine"
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
