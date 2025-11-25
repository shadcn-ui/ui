import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("cn-skeleton bg-accent animate-pulse", className)}
      {...props}
    />
  )
}

export { Skeleton }
