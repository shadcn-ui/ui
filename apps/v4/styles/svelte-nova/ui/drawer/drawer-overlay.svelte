<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { Drawer as DrawerPrimitive } from "vaul-svelte"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: DrawerPrimitive.OverlayProps = $props()
</script>

<DrawerPrimitive.Overlay
  bind:ref
  data-slot="drawer-overlay"
  class={cn("cn-drawer-overlay fixed inset-0 z-50", className)}
  {...restProps}
/>
