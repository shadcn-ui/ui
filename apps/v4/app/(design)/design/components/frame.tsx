import { cn } from "@/lib/utils"

export default function Frame({
  title,
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="frame"
      className={cn("flex min-w-0 flex-col gap-1", className)}
      {...props}
    >
      <div className="text-muted-foreground px-1.5 py-2 text-xs font-medium">
        {title}
      </div>
      <div className="bg-background text-foreground flex flex-col gap-4 rounded-xl border border-dashed p-4">
        {children}
      </div>
    </div>
  )
}
