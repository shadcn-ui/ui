import { cn } from "@/registry/bases/radix/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse", className)}
      {...props}
    />
  )
}

export { Skeleton }
