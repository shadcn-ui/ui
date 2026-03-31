<script lang="ts">
  import { cn, type WithoutChildrenOrChild } from "$lib/utils.js"
  import { LinkPreview as HoverCardPrimitive } from "bits-ui"
  import type { ComponentProps } from "svelte"

  import HoverCardPortal from "./hover-card-portal.svelte"

  let {
    ref = $bindable(null),
    class: className,
    align = "center",
    sideOffset = 4,
    portalProps,
    ...restProps
  }: HoverCardPrimitive.ContentProps & {
    portalProps?: WithoutChildrenOrChild<ComponentProps<typeof HoverCardPortal>>
  } = $props()
</script>

<HoverCardPortal {...portalProps}>
  <HoverCardPrimitive.Content
    bind:ref
    data-slot="hover-card-content"
    {align}
    {sideOffset}
    class={cn(
      "cn-hover-card-content z-50 origin-(--transform-origin) outline-hidden",
      className
    )}
    {...restProps}
  />
</HoverCardPortal>
