<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: RangeCalendarPrimitive.GridRowProps = $props()
</script>

<RangeCalendarPrimitive.GridRow
  bind:ref
  class={cn("flex", className)}
  {...restProps}
/>
