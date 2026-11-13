import { cn } from "cn"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "cn-skeleton animate-pulse motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
