import { cn } from "@/registry/new-york/lib/utils"

export function ComponentWrapper({
  className,
  name,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { name: string }) {
  return (
    <div
      className={cn("flex w-full flex-col rounded-lg border", className)}
      {...props}
    >
      <div className="border-b px-4 py-3">
        <div className="text-sm font-medium">{name}</div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-4 [&>div]:max-w-full">
        {children}
      </div>
    </div>
  )
}
