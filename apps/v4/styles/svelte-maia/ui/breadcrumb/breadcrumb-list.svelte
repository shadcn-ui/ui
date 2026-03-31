<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils.js"
  import type { HTMLOlAttributes } from "svelte/elements"

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLOlAttributes> = $props()
</script>

<ol
  bind:this={ref}
  data-slot="breadcrumb-list"
  class={cn(
    "cn-breadcrumb-list flex flex-wrap items-center wrap-break-word",
    className
  )}
  {...restProps}
>
  {@render children?.()}
</ol>
