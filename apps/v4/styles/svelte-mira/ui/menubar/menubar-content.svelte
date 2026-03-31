<script lang="ts">
  import { cn, type WithoutChildrenOrChild } from "$lib/utils.js"
  import { Menubar as MenubarPrimitive } from "bits-ui"
  import type { ComponentProps } from "svelte"

  import MenubarPortal from "./menubar-portal.svelte"

  let {
    ref = $bindable(null),
    class: className,
    sideOffset = 8,
    alignOffset = -4,
    align = "start",
    side = "bottom",
    portalProps,
    ...restProps
  }: MenubarPrimitive.ContentProps & {
    portalProps?: WithoutChildrenOrChild<ComponentProps<typeof MenubarPortal>>
  } = $props()
</script>

<MenubarPortal {...portalProps}>
  <MenubarPrimitive.Content
    bind:ref
    data-slot="menubar-content"
    {align}
    {alignOffset}
    {side}
    {sideOffset}
    class={cn(
      "cn-menu-target cn-menu-translucent bg-popover text-popover-foreground ring-foreground/10 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 z-50 min-w-36 origin-(--bits-menubar-content-transform-origin) overflow-hidden rounded-lg p-1 shadow-md ring-1 duration-100",
      className
    )}
    {...restProps}
  />
</MenubarPortal>
