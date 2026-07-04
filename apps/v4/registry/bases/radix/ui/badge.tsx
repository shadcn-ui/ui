import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/registry/bases/radix/lib/utils"

const badgeVariants = cva(
  "cn-badge group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "cn-badge-variant-default",
        secondary: "cn-badge-variant-secondary",
        destructive: "cn-badge-variant-destructive",
        warning: "cn-badge-variant-warning",
        success: "cn-badge-variant-success", // [FORCE-UI]
        info: "cn-badge-variant-info", // [FORCE-UI]
        "success-solid": "cn-badge-variant-success-solid", // [FORCE-UI]
        "warning-solid": "cn-badge-variant-warning-solid", // [FORCE-UI]
        "info-solid": "cn-badge-variant-info-solid", // [FORCE-UI]
        "error-solid": "cn-badge-variant-error-solid", // [FORCE-UI]
        outline: "cn-badge-variant-outline",
        ghost: "cn-badge-variant-ghost",
        link: "cn-badge-variant-link",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  srLabel,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
    /**
     * [FORCE-UI] Visually-hidden text prefix announced before the badge's
     * content. Status is otherwise conveyed only through color, which a
     * screen reader can't perceive — set this on count- or glyph-only
     * badges (e.g. `srLabel="Synced versions:"` on a bare "42").
     */
    srLabel?: string
  }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {srLabel && !asChild && <span className="sr-only">{srLabel} </span>}
      {children}
    </Comp>
  )
}

export { Badge, badgeVariants }
