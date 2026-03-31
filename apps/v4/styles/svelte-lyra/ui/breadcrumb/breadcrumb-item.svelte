<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils.js"
  import type { HTMLLiAttributes } from "svelte/elements"

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLLiAttributes> = $props()
</script>

<li
  bind:this={ref}
  data-slot="breadcrumb-item"
  class={cn("cn-breadcrumb-item inline-flex items-center", className)}
  {...restProps}
>
  {@render children?.()}
</li>
