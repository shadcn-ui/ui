import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/registry/bases/radix/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const buttonVariants = cva(
  "cn-button group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "cn-button-variant-default",
        outline: "cn-button-variant-outline",
        secondary: "cn-button-variant-secondary",
        ghost: "cn-button-variant-ghost",
        destructive: "cn-button-variant-destructive",
        link: "cn-button-variant-link",
      },
      size: {
        default: "cn-button-size-default",
        xs: "cn-button-size-xs",
        sm: "cn-button-size-sm",
        lg: "cn-button-size-lg",
        icon: "cn-button-size-icon",
        "icon-xs": "cn-button-size-icon-xs",
        "icon-sm": "cn-button-size-icon-sm",
        "icon-lg": "cn-button-size-icon-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  disabled,
  onClick,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /** [FORCE-UI] shows a spinner and blocks interaction, for async actions — mirrors the Figma `State=Loading` variant */
    loading?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"
  const isDisabled = disabled || loading

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading ? "" : undefined}
      aria-busy={loading || undefined}
      // [FORCE-UI] disabled has no effect when asChild renders an <a> — aria-disabled,
      // tabIndex, and a click-guard make it behave the same as a real disabled button
      aria-disabled={isDisabled || undefined}
      disabled={asChild ? undefined : isDisabled}
      tabIndex={asChild && isDisabled ? -1 : undefined}
      onClick={(event) => {
        if (isDisabled) {
          event.preventDefault()
          return
        }
        onClick?.(event)
      }}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading && (
            <span
              data-slot="button-spinner"
              aria-hidden="true"
              className="inline-flex animate-spin"
            >
              <IconPlaceholder
                lucide="Loader2Icon"
                materialSymbols="progress_activity"
                tabler="IconLoader"
                hugeicons="Loading03Icon"
                phosphor="SpinnerIcon"
                remixicon="RiLoaderLine"
              />
            </span>
          )}
          {children}
        </>
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
