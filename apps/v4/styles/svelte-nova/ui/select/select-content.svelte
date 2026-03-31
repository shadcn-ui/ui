<script lang="ts">
  import { cn, type WithoutChild } from "$lib/utils.js"
  import type { WithoutChildrenOrChild } from "$lib/utils.js"
  import { Select as SelectPrimitive } from "bits-ui"
  import type { ComponentProps } from "svelte"

  import SelectPortal from "./select-portal.svelte"
  import SelectScrollDownButton from "./select-scroll-down-button.svelte"
  import SelectScrollUpButton from "./select-scroll-up-button.svelte"

  let {
    ref = $bindable(null),
    class: className,
    sideOffset = 4,
    portalProps,
    children,
    preventScroll = true,
    ...restProps
  }: WithoutChild<SelectPrimitive.ContentProps> & {
    portalProps?: WithoutChildrenOrChild<ComponentProps<typeof SelectPortal>>
  } = $props()
</script>

<SelectPortal {...portalProps}>
  <SelectPrimitive.Content
    bind:ref
    {sideOffset}
    {preventScroll}
    data-slot="select-content"
    class={cn(
      "cn-select-content cn-select-content-logical cn-menu-target cn-menu-translucent relative isolate z-50 overflow-x-hidden overflow-y-auto",
      className
    )}
    {...restProps}
  >
    <SelectScrollUpButton />
    <SelectPrimitive.Viewport
      class={cn(
        "h-(--bits-select-anchor-height) w-full min-w-(--bits-select-anchor-width) scroll-my-1"
      )}
    >
      {@render children?.()}
    </SelectPrimitive.Viewport>
    <SelectScrollDownButton />
  </SelectPrimitive.Content>
</SelectPortal>
