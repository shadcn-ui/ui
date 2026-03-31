<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils.js"
  import type { HTMLAttributes } from "svelte/elements"

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLUListElement>> = $props()
</script>

<ul
  bind:this={ref}
  data-slot="pagination-content"
  class={cn("cn-pagination-content flex items-center", className)}
  {...restProps}
>
  {@render children?.()}
</ul>
