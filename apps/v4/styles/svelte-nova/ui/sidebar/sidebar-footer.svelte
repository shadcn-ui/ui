<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils.js"
  import type { HTMLAttributes } from "svelte/elements"

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLElement>> = $props()
</script>

<div
  bind:this={ref}
  data-slot="sidebar-footer"
  data-sidebar="footer"
  class={cn("cn-sidebar-footer flex flex-col", className)}
  {...restProps}
>
  {@render children?.()}
</div>
