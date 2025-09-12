import * as React from "react"

import { cn } from "@/lib/utils"

function ButtonGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="button-group"
      className={cn(
        "flex w-fit *:focus-visible:z-10 *:[[data-slot=select-trigger]]:!w-fit *:[input]:flex-1 [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none",
        className
      )}
      {...props}
    />
  )
}

export { ButtonGroup }
