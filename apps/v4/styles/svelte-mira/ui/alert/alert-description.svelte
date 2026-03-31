<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils.js"
  import type { HTMLAttributes } from "svelte/elements"

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()
</script>

<div
  bind:this={ref}
  data-slot="alert-description"
  class={cn(
    "cn-alert-description [&_a]:hover:text-foreground [&_a]:underline [&_a]:underline-offset-3",
    className
  )}
  {...restProps}
>
  {@render children?.()}
</div>
