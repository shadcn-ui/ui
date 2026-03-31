<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: DropdownMenuPrimitive.SeparatorProps = $props()
</script>

<DropdownMenuPrimitive.Separator
  bind:ref
  data-slot="dropdown-menu-separator"
  class={cn("cn-dropdown-menu-separator", className)}
  {...restProps}
/>
