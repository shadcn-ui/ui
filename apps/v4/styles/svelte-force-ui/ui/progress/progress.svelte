<script lang="ts">
  import { cn, type WithoutChildrenOrChild } from "$lib/utils.js"
  import { Progress as ProgressPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    max = 100,
    value,
    ...restProps
  }: WithoutChildrenOrChild<ProgressPrimitive.RootProps> = $props()
</script>

<ProgressPrimitive.Root
  bind:ref
  data-slot="progress"
  class={cn(
    "cn-progress relative flex w-full items-center overflow-x-hidden",
    className
  )}
  {value}
  {max}
  {...restProps}
>
  <div
    data-slot="progress-indicator"
    data-state={value === null || value === undefined
      ? "indeterminate"
      : undefined}
    class="cn-progress-indicator size-full flex-1 transition-all motion-reduce:transition-none data-[state=indeterminate]:animate-pulse motion-reduce:data-[state=indeterminate]:animate-none"
    style="transform: translateX(-{100 - (100 * (value ?? 0)) / (max ?? 1)}%)"
  ></div>
</ProgressPrimitive.Root>
