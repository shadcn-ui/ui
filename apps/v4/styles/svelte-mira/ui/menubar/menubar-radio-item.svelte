<script lang="ts">
  import IconPlaceholder from "$lib/components/icon-placeholder/icon-placeholder.svelte"
  import { cn, type WithoutChild } from "$lib/utils.js"
  import { Menubar as MenubarPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    inset,
    children: childrenProp,
    ...restProps
  }: WithoutChild<MenubarPrimitive.RadioItemProps> & {
    inset?: boolean
  } = $props()
</script>

<MenubarPrimitive.RadioItem
  bind:ref
  data-slot="menubar-radio-item"
  data-inset={inset}
  class={cn(
    "cn-menubar-radio-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
    className
  )}
  {...restProps}
>
  {#snippet children({ checked })}
    <span
      class="cn-menubar-radio-item-indicator pointer-events-none absolute flex items-center justify-center"
    >
      {#if checked}
        <IconPlaceholder
          lucide="CheckIcon"
          tabler="IconCheck"
          hugeicons="Tick02Icon"
          phosphor="CheckIcon"
          remixicon="RiCheckLine"
        />
      {/if}
    </span>
    {@render childrenProp?.({ checked })}
  {/snippet}
</MenubarPrimitive.RadioItem>
