<script lang="ts">
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down"
  import { cn, type WithoutChildrenOrChild } from "$lib/utils.js"
  import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    value,
    ...restProps
  }: WithoutChildrenOrChild<RangeCalendarPrimitive.YearSelectProps> = $props()
</script>

<span
  class={cn(
    "has-focus:border-ring border-input has-focus:ring-ring/50 relative flex rounded-md border shadow-xs has-focus:ring-[3px]",
    className
  )}
>
  <RangeCalendarPrimitive.YearSelect
    bind:ref
    class="absolute inset-0 opacity-0"
    {...restProps}
  >
    {#snippet child({ props, yearItems, selectedYearItem })}
      <select {...props} {value}>
        {#each yearItems as yearItem (yearItem.value)}
          <option
            value={yearItem.value}
            selected={value !== undefined
              ? yearItem.value === value
              : yearItem.value === selectedYearItem.value}
          >
            {yearItem.label}
          </option>
        {/each}
      </select>
      <span
        class="[&>svg]:text-muted-foreground flex h-(--cell-size) items-center gap-1 rounded-md ps-2 pe-1 text-sm font-medium select-none [&>svg]:size-3.5"
        aria-hidden="true"
      >
        {yearItems.find((item) => item.value === value)?.label ||
          selectedYearItem.label}
        <ChevronDownIcon class="size-4" />
      </span>
    {/snippet}
  </RangeCalendarPrimitive.YearSelect>
</span>
