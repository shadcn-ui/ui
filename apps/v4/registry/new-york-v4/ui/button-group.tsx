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
      role="toolbar"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(
        "flex w-fit items-stretch *:focus-visible:z-10 *:[[data-slot=select-trigger]]:!w-fit *:[input]:flex-1",
        "data-[orientation=horizontal]:[&:has(>*+*)>*:not(:first-child)]:-ml-px data-[orientation=horizontal]:[&:has(>*+*)>*:not(:first-child)]:rounded-l-none data-[orientation=horizontal]:[&:has(>*+*)>*:not(:last-child)]:rounded-r-none",
        "data-[orientation=vertical]:flex-col data-[orientation=vertical]:[&:has(>*+*)>*:not(:first-child)]:-my-px data-[orientation=vertical]:[&:has(>*+*)>*:not(:first-child)]:rounded-t-none data-[orientation=vertical]:[&:has(>*+*)>*:not(:last-child)]:rounded-b-none",
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
      className={cn("relative !m-0", className)}
      {...props}
    />
  )
}

export { ButtonGroup, ButtonGroupSeparator }
