<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { Menubar as MenubarPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: MenubarPrimitive.RootProps = $props()
</script>

<MenubarPrimitive.Root
  bind:ref
  data-slot="menubar"
  class={cn("cn-menubar flex items-center", className)}
  {...restProps}
/>
