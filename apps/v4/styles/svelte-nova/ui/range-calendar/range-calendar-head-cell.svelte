<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: RangeCalendarPrimitive.HeadCellProps = $props()
</script>

<RangeCalendarPrimitive.HeadCell
  bind:ref
  class={cn(
    "text-muted-foreground w-(--cell-size) rounded-md text-[0.8rem] font-normal",
    className
  )}
  {...restProps}
/>
