<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils.js"
  import type { HTMLAttributes } from "svelte/elements"

  let {
    ref = $bindable(null),
    class: className,
    children,
    size = "default",
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    size?: "default" | "sm"
  } = $props()
</script>

<div
  bind:this={ref}
  data-slot="card"
  data-size={size}
  class={cn("cn-card group/card flex flex-col", className)}
  {...restProps}
>
  {@render children?.()}
</div>
