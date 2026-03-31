<script lang="ts">
  import { cn } from "$lib/utils.js"
  import type { WithoutChildrenOrChild } from "$lib/utils.js"
  import type { ComponentProps } from "svelte"
  import { Drawer as DrawerPrimitive } from "vaul-svelte"

  import DrawerOverlay from "./drawer-overlay.svelte"
  import DrawerPortal from "./drawer-portal.svelte"

  let {
    ref = $bindable(null),
    class: className,
    portalProps,
    children,
    ...restProps
  }: DrawerPrimitive.ContentProps & {
    portalProps?: WithoutChildrenOrChild<ComponentProps<typeof DrawerPortal>>
  } = $props()
</script>

<DrawerPortal {...portalProps}>
  <DrawerOverlay />
  <DrawerPrimitive.Content
    bind:ref
    data-slot="drawer-content"
    class={cn("cn-drawer-content group/drawer-content fixed z-50", className)}
    {...restProps}
  >
    <div
      class="cn-drawer-handle bg-muted mx-auto hidden shrink-0 group-data-[vaul-drawer-direction=bottom]/drawer-content:block"
    ></div>
    {@render children?.()}
  </DrawerPrimitive.Content>
</DrawerPortal>
