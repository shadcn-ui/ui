<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { Dialog as SheetPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: SheetPrimitive.TitleProps = $props()
</script>

<SheetPrimitive.Title
  bind:ref
  data-slot="sheet-title"
  class={cn("cn-sheet-title", className)}
  {...restProps}
/>
