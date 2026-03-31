<script lang="ts">
  import { cn, type WithoutChildrenOrChild } from "$lib/utils.js"
  import { Popover as PopoverPrimitive } from "bits-ui"
  import type { ComponentProps } from "svelte"

  import PopoverPortal from "./popover-portal.svelte"

  let {
    ref = $bindable(null),
    class: className,
    sideOffset = 4,
    align = "center",
    portalProps,
    ...restProps
  }: PopoverPrimitive.ContentProps & {
    portalProps?: WithoutChildrenOrChild<ComponentProps<typeof PopoverPortal>>
  } = $props()
</script>

<PopoverPortal {...portalProps}>
  <PopoverPrimitive.Content
    bind:ref
    data-slot="popover-content"
    {sideOffset}
    {align}
    class={cn(
      "cn-popover-content cn-popover-content-logical z-50 w-72 origin-(--transform-origin) outline-hidden",
      className
    )}
    {...restProps}
  />
</PopoverPortal>
