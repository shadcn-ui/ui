import { cn } from "@/registry/bases/base/lib/utils"

function ExampleWrapper({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className="bg-background w-full">
      <div
        data-slot="example-wrapper"
        className={cn(
          "mx-auto grid min-h-screen w-full max-w-5xl min-w-0 content-center items-start gap-12 p-6 lg:grid-cols-2 lg:gap-8 lg:p-12 2xl:max-w-6xl",

          className
        )}
        {...props}
      />
    </div>
  )
}

function Example({
  title,
  children,
  className,
  containerClassName,
  ...props
}: React.ComponentProps<"div"> & {
  title: string
  containerClassName?: string
}) {
  return (
    <div
      data-slot="example"
      className={cn(
        "mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none",
        containerClassName
      )}
      {...props}
    >
      <div className="text-muted-foreground px-1.5 py-2 text-xs font-medium">
        {title}
      </div>
      <div
        data-slot="example-content"
        className={cn(
          "bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-6 *:[div:not([class*='w-'])]:w-full",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

export { ExampleWrapper, Example }
