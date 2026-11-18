"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Button } from "@/registry/new-york-v4/ui/button"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group relative flex w-full items-center rounded-md border border-input shadow-xs transition-[color,box-shadow] outline-none dark:bg-input/30",
        "h-9 min-w-0 has-[>textarea]:h-auto",

        // Variants based on alignment.
        "has-[>[data-align=inline-start]]:[&>input]:pl-2",
        "has-[>[data-align=inline-end]]:[&>input]:pr-2",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",

        // Focus state.
        "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50",

        // Error state.
        "has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-destructive/20 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",

        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
        "inline-end":
          "order-last pr-3 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]",
        "block-start":
          "order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5 [.border-b]:pb-3",
        "block-end":
          "order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5 [.border-t]:pt-3",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

const inputGroupAddonInteractive = [
  "pointer-events-none",
  "[&_a]:pointer-events-auto",
  "[&_button]:pointer-events-auto",
  "[&_input]:pointer-events-auto",
  "[&_label]:pointer-events-auto",
  "[&_select]:pointer-events-auto",
  "[&_summary]:pointer-events-auto",
  "[&_textarea]:pointer-events-auto",
  "[&_[role=button]]:pointer-events-auto",
  "[&_[role=checkbox]]:pointer-events-auto",
  "[&_[role=combobox]]:pointer-events-auto",
  "[&_[role=link]]:pointer-events-auto",
  "[&_[role=menuitem]]:pointer-events-auto",
  "[&_[role=radio]]:pointer-events-auto",
  "[&_[role=switch]]:pointer-events-auto",
  "[&_[role=tab]]:pointer-events-auto",
  // Outrank the attribute selectors above so disabled fields stay inert.
  "[&_button:disabled]:pointer-events-none",
  "[&_input:disabled]:pointer-events-none",
  "[&_select:disabled]:pointer-events-none",
  "[&_textarea:disabled]:pointer-events-none",
].join(" ")

// Clicking addon chrome focuses the control, same as a <label>, without
// putting icons, text, or kbd hints in the tab order. Real controls inside
// the addon keep their own pointer events and keyboard behavior.
function findInputGroupControl(addon: HTMLElement) {
  const parent = addon.parentElement
  if (!parent) {
    return null
  }

  const candidates = Array.from(
    parent.querySelectorAll<HTMLElement>(
      "[data-slot='input-group-control'], input, textarea, select"
    )
  ).filter((element) => {
    if (addon.contains(element)) {
      return false
    }

    if (parent.getAttribute("data-slot") !== "input-group") {
      return true
    }

    return element.closest("[data-slot='input-group']") === parent
  })

  const slotted = candidates.find((element) =>
    element.matches("[data-slot='input-group-control']")
  )

  if (
    slotted &&
    (slotted.matches("input, textarea, select") ||
      slotted.isContentEditable ||
      slotted.tabIndex >= 0)
  ) {
    return slotted
  }

  const nested = slotted?.querySelector<HTMLElement>(
    "input, textarea, select, [contenteditable='true']"
  )
  if (nested) {
    return nested
  }

  return (
    candidates.find((element) => element.matches("input, textarea, select")) ??
    null
  )
}

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

function useInputGroupControlId(addonRef: React.RefObject<HTMLElement | null>) {
  const fallbackId = React.useId()
  const [controlId, setControlId] = React.useState<string>()

  useIsomorphicLayoutEffect(() => {
    const addon = addonRef.current
    if (!addon) {
      return
    }

    const control = findInputGroupControl(addon)
    if (!control) {
      setControlId((current) => (current === undefined ? current : undefined))
      return
    }

    if (!control.id) {
      control.id = fallbackId
    }

    const nextId = control.id
    setControlId((current) => (current === nextId ? current : nextId))
  })

  return controlId
}

function InputGroupAddon({
  className,
  align = "inline-start",
  children,
  ref,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const controlId = useInputGroupControlId(rootRef)
  const hasOwnClick = typeof props.onClick === "function"

  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(
        inputGroupAddonVariants({ align }),
        "isolate",
        !hasOwnClick && inputGroupAddonInteractive,
        className
      )}
      {...props}
      ref={(node) => {
        rootRef.current = node
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      }}
    >
      {!hasOwnClick && controlId ? (
        <label
          htmlFor={controlId}
          aria-hidden="true"
          data-slot="input-group-addon-focus"
          className="pointer-events-auto absolute inset-0 -z-10 cursor-text"
        />
      ) : null}
      {children}
    </div>
  )
}

const inputGroupButtonVariants = cva(
  "flex items-center gap-2 text-sm shadow-none",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 rounded-md px-2.5 has-[>svg]:px-2.5",
        "icon-xs":
          "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
)

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
