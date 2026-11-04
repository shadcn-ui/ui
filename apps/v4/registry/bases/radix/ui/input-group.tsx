"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Button } from "@/registry/bases/radix/ui/button"
import { Input } from "@/registry/bases/radix/ui/input"
import { Textarea } from "@/registry/bases/radix/ui/textarea"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group cn-input-group relative flex w-full min-w-0 items-center outline-none has-[>textarea]:h-auto",
        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "cn-input-group-addon flex cursor-text items-center justify-center select-none",
  {
    variants: {
      align: {
        "inline-start": "cn-input-group-addon-align-inline-start order-first",
        "inline-end": "cn-input-group-addon-align-inline-end order-last",
        "block-start":
          "cn-input-group-addon-align-block-start order-first w-full justify-start",
        "block-end":
          "cn-input-group-addon-align-block-end order-last w-full justify-start",
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
  "cn-input-group-button flex items-center shadow-none",
  {
    variants: {
      size: {
        xs: "cn-input-group-button-size-xs",
        sm: "cn-input-group-button-size-sm",
        "icon-xs": "cn-input-group-button-size-icon-xs",
        "icon-sm": "cn-input-group-button-size-icon-sm",
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
        "cn-input-group-text flex items-center [&_svg]:pointer-events-none",
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
      className={cn("cn-input-group-input flex-1", className)}
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
      className={cn("cn-input-group-textarea flex-1 resize-none", className)}
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
