<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { Calendar as CalendarPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: CalendarPrimitive.GridRowProps = $props()
</script>

<CalendarPrimitive.GridRow
  bind:ref
  class={cn("flex", className)}
  {...restProps}
/>
