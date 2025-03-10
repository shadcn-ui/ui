import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-primary/10 dark:bg-primary/20 animate-pulse rounded-md",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
