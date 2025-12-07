import { mergeProps } from "@base-ui-components/react/merge-props"
import { useRender } from "@base-ui-components/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/bases/base/lib/utils"

const badgeVariants = cva(
  "rounded-full border border-transparent px-2 py-0.5 text-xs font-medium inset-shadow-2xs inset-shadow-white/25 inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-colors overflow-hidden group/badge",
  {
    variants: {
      variant: {
        default: "text-primary-foreground bg-linear-to-b from-[color-mix(in_oklch,var(--primary)_85%,var(--background))] to-(--primary) [a]:hover:bg-linear-to-t",
        secondary: "border-border text-foreground [a]:hover:text-accent-foreground bg-linear-to-b from-[color-mix(in_oklch,var(--accent)_25%,var(--background))] to-(--accent) shadow-none [a]:hover:bg-linear-to-t",
        destructive: "focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 bg-linear-to-b from-[color-mix(in_oklch,var(--destructive)_85%,var(--background))] to-(--destructive) text-white [a]:hover:bg-linear-to-t",
        outline: "border-border text-foreground [a]:hover:bg-accent [a]:hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
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
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ className, variant })),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
