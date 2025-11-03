import { cn } from "@/lib/utils"
import { IconPlaceholder } from "@/registry/icon-placeholder"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <IconPlaceholder
      name="SpinnerLoader"
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
