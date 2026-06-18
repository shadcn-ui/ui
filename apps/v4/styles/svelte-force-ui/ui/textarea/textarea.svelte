<script lang="ts">
  import { cn, type WithElementRef, type WithoutChildren } from "$lib/utils.js"
  import type { HTMLTextareaAttributes } from "svelte/elements"

  type Variant = "outline" | "filled" | "underline" | "ghost"

  const variantClass: Record<Variant, string> = {
    outline: "cn-textarea-variant-outline",
    filled: "cn-textarea-variant-filled",
    underline: "cn-textarea-variant-underline",
    ghost: "cn-textarea-variant-ghost",
  }

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    variant = "outline" as Variant,
    "data-slot": dataSlot = "textarea",
    ...restProps
  }: WithoutChildren<WithElementRef<HTMLTextareaAttributes>> & {
    variant?: Variant
  } = $props()
</script>

<textarea
  bind:this={ref}
  data-slot={dataSlot}
  class={cn(
    "cn-textarea placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full outline-none disabled:cursor-not-allowed disabled:opacity-50",
    variantClass[variant],
    className
  )}
  bind:value
  {...restProps}
></textarea>
