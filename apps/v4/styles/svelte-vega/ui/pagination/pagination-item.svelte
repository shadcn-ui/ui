<script lang="ts">
  import type { WithElementRef } from "$lib/utils.js"
  import type { HTMLLiAttributes } from "svelte/elements"

  let {
    ref = $bindable(null),
    children,
    ...restProps
  }: WithElementRef<HTMLLiAttributes> = $props()
</script>

<li bind:this={ref} data-slot="pagination-item" {...restProps}>
  {@render children?.()}
</li>
