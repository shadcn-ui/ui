<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils.js"
  import type { HTMLAttributes } from "svelte/elements"
  import { tv } from "tailwind-variants"

  // [FORCE-UI-START]
  const inputGroupVariants = tv({
    base: "group/input-group relative flex w-full min-w-0 items-center outline-none h-9 has-[>textarea]:h-auto",
    variants: {
      variant: {
        outline: "cn-input-group-variant-outline",
        filled: "cn-input-group-variant-filled",
        underline: "cn-input-group-variant-underline",
        ghost: "cn-input-group-variant-ghost",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  })
  // [FORCE-UI-END]

  let {
    ref = $bindable(null),
    class: className,
    variant = "outline",
    children,
    ...props
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    variant?: "outline" | "filled" | "underline" | "ghost" // [FORCE-UI]
  } = $props()
</script>

<div
  bind:this={ref}
  data-slot="input-group"
  role="group"
  class={cn(inputGroupVariants({ variant }), className)}
  {...props}
>
  {@render children?.()}
</div>
