<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { Menubar as MenubarPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: MenubarPrimitive.SeparatorProps = $props()
</script>

<MenubarPrimitive.Separator
  bind:ref
  data-slot="menubar-separator"
  class={cn("cn-menubar-separator -mx-1 my-1 h-px", className)}
  {...restProps}
/>
