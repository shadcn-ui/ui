import { cn } from "cn"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse motion-reduce:animate-none rounded-md bg-accent",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
