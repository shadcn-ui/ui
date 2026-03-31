<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: DropdownMenuPrimitive.SubContentProps = $props()
</script>

<DropdownMenuPrimitive.SubContent
  bind:ref
  data-slot="dropdown-menu-sub-content"
  class={cn(
    "cn-dropdown-menu-sub-content cn-menu-target cn-menu-translucent w-auto",
    className
  )}
  {...restProps}
/>
