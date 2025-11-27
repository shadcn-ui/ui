import { cn } from "@/registry/bases/radix/lib/cn"

function ExampleWrapper({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="example-wrapper"
      className={cn(
        "flex min-h-screen w-full min-w-0 flex-col items-center justify-center gap-12 bg-neutral-50 p-6 lg:p-12 dark:bg-neutral-950",
        className
      )}
      {...props}
    />
  )
}

function Example({
  title,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & { title: string }) {
  return (
    <div
      data-slot="example"
      className={cn("flex w-full max-w-lg min-w-0 flex-col gap-1", className)}
      {...props}
    >
      <div className="text-muted-foreground px-1.5 py-2 text-xs font-medium">
        {title}
      </div>
      <div
        data-slot="example-content"
        className="bg-background text-foreground flex min-w-0 flex-col items-start gap-6 rounded-xl border border-dashed p-6 *:[div:not([class*='w-'])]:w-full"
      >
        {children}
      </div>
    </div>
  )
}

export { ExampleWrapper, Example }
