<script lang="ts">
  import { cn } from "$lib/utils.js"
  import * as ResizablePrimitive from "paneforge"

  let {
    ref = $bindable(null),
    this: paneGroup = $bindable(),
    class: className,
    ...restProps
  }: ResizablePrimitive.PaneGroupProps & {
    this?: ResizablePrimitive.PaneGroup
  } = $props()
</script>

<ResizablePrimitive.PaneGroup
  bind:ref
  bind:this={paneGroup}
  data-slot="resizable-pane-group"
  class={cn(
    "cn-resizable-panel-group flex h-full w-full data-[direction=vertical]:flex-col",
    className
  )}
  {...restProps}
/>
