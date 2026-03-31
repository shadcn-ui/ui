<script lang="ts">
  import {
    buttonVariants,
    type ButtonSize,
  } from "$lib/registry/ui/button/index.js"
  import { cn } from "$lib/utils.js"
  import { Pagination as PaginationPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    size = "icon",
    isActive,
    page,
    children,
    ...restProps
  }: PaginationPrimitive.PageProps & {
    size?: ButtonSize
    isActive: boolean
  } = $props()
</script>

{#snippet Fallback()}
  {page.value}
{/snippet}

<PaginationPrimitive.Page
  bind:ref
  {page}
  aria-current={isActive ? "page" : undefined}
  data-slot="pagination-link"
  data-active={isActive}
  data-size={size}
  class={cn(
    buttonVariants({ size, variant: isActive ? "outline" : "ghost" }),
    "cn-pagination-link",
    className
  )}
  {...restProps}
>
  {#if children}
    {@render children?.()}
  {:else}
    {@render Fallback()}
  {/if}
</PaginationPrimitive.Page>
