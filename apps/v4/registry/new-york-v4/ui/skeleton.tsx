import { cn } from "@/lib/utils"

function Skeleton({
  className,
  animation = "pulse",
  ...props
}: React.ComponentProps<"div"> & {
  animation?: "pulse" | "none"
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        animation === "pulse" && "animate-pulse",
        "rounded-md bg-accent",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
