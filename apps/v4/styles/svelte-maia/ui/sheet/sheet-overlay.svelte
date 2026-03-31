<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { Dialog as SheetPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: SheetPrimitive.OverlayProps = $props()
</script>

<SheetPrimitive.Overlay
  bind:ref
  data-slot="sheet-overlay"
  class={cn("cn-sheet-overlay fixed inset-0 z-50", className)}
  {...restProps}
/>
