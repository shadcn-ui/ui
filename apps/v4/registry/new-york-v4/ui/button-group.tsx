import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"
import { Separator } from "@/registry/new-york-v4/ui/separator"

function ButtonGroup({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical"
}) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(
        "flex w-fit items-stretch",
        "[&>*]:focus-visible:z-10",
        "[&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit",
        "[&>input]:flex-1",
        "data-[orientation=horizontal]:[&>*:not(:first-child)]:rounded-l-none data-[orientation=horizontal]:[&>*:not(:first-child)]:border-l-0 data-[orientation=horizontal]:[&>*:not(:last-child)]:rounded-r-none",
        "data-[orientation=vertical]:flex-col data-[orientation=vertical]:[&>*:not(:first-child)]:rounded-t-none data-[orientation=vertical]:[&>*:not(:first-child)]:border-t-0 data-[orientation=vertical]:[&>*:not(:last-child)]:rounded-b-none",
        "has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md",

        className
      )}
      {...props}
    />
  )
}

function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      className={cn(
        "bg-muted flex items-center gap-2 rounded-md border px-4 text-sm font-medium shadow-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "relative !m-0 self-stretch data-[orientation=vertical]:h-auto",
        className
      )}
      {...props}
    />
  )
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText }
