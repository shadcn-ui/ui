<script lang="ts" module>
  import { tv, type VariantProps } from "tailwind-variants"

  export const alertVariants = tv({
    base: "cn-alert group/alert relative w-full",
    variants: {
      variant: {
        default: "cn-alert-variant-default",
        destructive: "cn-alert-variant-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  })

  export type AlertVariant = VariantProps<typeof alertVariants>["variant"]
</script>

<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils.js"
  import type { HTMLAttributes } from "svelte/elements"

  let {
    ref = $bindable(null),
    class: className,
    variant = "default",
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    variant?: AlertVariant
  } = $props()
</script>

<div
  bind:this={ref}
  data-slot="alert"
  role="alert"
  class={cn(alertVariants({ variant }), className)}
  {...restProps}
>
  {@render children?.()}
</div>
