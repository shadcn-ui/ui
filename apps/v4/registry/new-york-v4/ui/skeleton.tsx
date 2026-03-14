import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-[var(--radius-md)] bg-[rgb(var(--foreground)/0.07)]", className)}
      {...props}
    />
  )
}

export { Skeleton }
