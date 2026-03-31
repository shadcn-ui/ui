<script lang="ts">
  import { cn } from "$lib/utils.js"
  import type { WithoutChildrenOrChild } from "$lib/utils.js"
  import { ContextMenu as ContextMenuPrimitive } from "bits-ui"
  import type { ComponentProps } from "svelte"

  import ContextMenuPortal from "./context-menu-portal.svelte"

  let {
    ref = $bindable(null),
    portalProps,
    class: className,
    ...restProps
  }: ContextMenuPrimitive.ContentProps & {
    portalProps?: WithoutChildrenOrChild<
      ComponentProps<typeof ContextMenuPortal>
    >
  } = $props()
</script>

<ContextMenuPortal {...portalProps}>
  <ContextMenuPrimitive.Content
    bind:ref
    data-slot="context-menu-content"
    class={cn(
      "cn-context-menu-content cn-menu-target cn-menu-translucent z-50 overflow-x-hidden overflow-y-auto outline-none",
      className
    )}
    {...restProps}
  />
</ContextMenuPortal>
