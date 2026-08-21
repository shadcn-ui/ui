import { cn } from "@/registry/aria-maia/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-xl bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
