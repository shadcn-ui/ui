import { cn } from "@/registry/bases/radix/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

function Spinner({
  className,
  strokeWidth = 2,
  ...props
}: React.ComponentProps<"svg"> & { strokeWidth?: number }) {
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
      strokeWidth={strokeWidth}
      {...props}
    />
  )
}

export { Spinner }
