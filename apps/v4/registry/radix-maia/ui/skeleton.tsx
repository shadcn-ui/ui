import { cn } from "@/registry/radix-maia/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted rounded-xl animate-pulse", className)}
      {...props}
    />
  )
}

export { Skeleton }
