"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="presentation"
      className={cn(
        "group/input-group border-input dark:bg-input/30 relative isolate flex h-9 w-full items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none",
        "has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:flex-col",
        "has-[>textarea]:h-auto",
        "has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3",

        // Error state.
        "has-[[aria-invalid=true]]:ring-destructive/20 has-[[aria-invalid=true]]:border-destructive dark:has-[[aria-invalid=true]]:ring-destructive/40",

        // Focus state.
        "has-[input:focus-visible,textarea:focus-visible]:border-ring has-[input:focus-visible,textarea:focus-visible]:ring-ring/50 has-[input:focus-visible,textarea:focus-visible]:ring-[3px]",
        "has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",

        // Child input overrides (direct children only).
        "[&>input]:flex-1 [&>input]:rounded-none [&>input]:border-0 [&>input]:bg-transparent [&>input]:shadow-none dark:[&>input]:bg-transparent [&>input:focus-visible]:ring-0",
        "[&>textarea]:flex-1 [&>textarea]:resize-none [&>textarea]:rounded-none [&>textarea]:border-0 [&>textarea]:bg-transparent [&>textarea]:shadow-none dark:[&>textarea]:bg-transparent [&>textarea:focus-visible]:ring-0",

        className
      )}
      {...props}
    />
  )
}

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & {
  align?: "inline-start" | "inline-end" | "block-start" | "block-end"
}) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(
        "text-muted-foreground flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium select-none",

        // Alignment and button adjustments.a
        "data-[align=inline-end]:order-last data-[align=inline-end]:pr-3",
        "data-[align=inline-start]:order-first data-[align=inline-start]:pl-3",
        "data-[align=inline-end]:has-[>button]:mr-[-0.4rem] data-[align=inline-end]:has-[>kbd]:mr-[-0.35rem]",
        "data-[align=inline-start]:has-[>button]:ml-[-0.45rem] data-[align=inline-start]:has-[>kbd]:ml-[-0.35rem]",

        "data-[align=block-start]:order-first data-[align=block-start]:w-full data-[align=block-start]:justify-start data-[align=block-start]:px-3 data-[align=block-start]:pt-3 data-[align=block-start]:[.border-b]:pb-3",
        "data-[align=block-end]:order-last data-[align=block-end]:w-full data-[align=block-end]:justify-start data-[align=block-end]:px-3 data-[align=block-end]:pb-3 data-[align=block-end]:[.border-t]:pt-3",

        // Children.
        "[&>svg:not([class*='size-'])]:size-4",
        "[&>kbd]:rounded-[calc(var(--radius)-5px)]",
        "group-data-[disabled=true]/input-group:opacity-50",

        className
      )}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      size={size}
      className={cn(
        "h-6 gap-1 px-1.5 text-sm shadow-none",
        "not-[.rounded-full]:rounded-[calc(var(--radius)-5px)]",
        "has-[>svg]:px-1.5",
        "data-[size=icon]:size-6",
        "data-[slot=button]:h-6",
        "data-[slot=button]:gap-1",
        "data-[slot=button]:px-1.5",
        className
      )}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-muted-foreground flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText }
