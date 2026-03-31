<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { Calendar as CalendarPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: CalendarPrimitive.GridProps = $props()
</script>

<CalendarPrimitive.Grid
  bind:ref
  class={cn("flex w-full border-collapse flex-col", className)}
  {...restProps}
/>
