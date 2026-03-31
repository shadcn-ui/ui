<script lang="ts">
  import type { WithElementRef } from "$lib/utils.js"
  import type { HTMLOptgroupAttributes } from "svelte/elements"

  let {
    ref = $bindable(null),
    children,
    ...restProps
  }: WithElementRef<HTMLOptgroupAttributes> = $props()
</script>

<optgroup bind:this={ref} data-slot="native-select-opt-group" {...restProps}>
  {@render children?.()}
</optgroup>
