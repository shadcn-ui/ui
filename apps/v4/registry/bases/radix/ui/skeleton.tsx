import { cn } from "@/registry/bases/radix/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true" // [FORCE-UI] purely decorative; the loading state belongs on the container via aria-busy
      className={cn("cn-skeleton animate-pulse", className)}
      {...props}
    />
  )
}

export { Skeleton }
