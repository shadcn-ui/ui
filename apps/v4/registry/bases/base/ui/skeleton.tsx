import { cn } from "cn"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden={true}
      className={cn("cn-skeleton animate-pulse", className)}
      {...props}
    />
  )
}

export { Skeleton }
