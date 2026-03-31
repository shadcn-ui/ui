<script lang="ts">
  import IconPlaceholder from "$lib/components/icon-placeholder/icon-placeholder.svelte"
  import { cn } from "$lib/utils.js"
  import type { ComponentProps } from "svelte"

  import { PaginationLink } from "./index.js"

  type PaginationPreviousProps = ComponentProps<typeof PaginationLink>

  let { class: className, ...restProps }: PaginationPreviousProps = $props()
</script>

<PaginationLink
  aria-label="Go to previous page"
  size="default"
  class={cn("cn-pagination-previous", className)}
  {...restProps}
>
  <IconPlaceholder
    lucide="ChevronLeftIcon"
    tabler="IconChevronLeft"
    hugeicons="ArrowLeft01Icon"
    phosphor="CaretLeftIcon"
    remixicon="RiArrowLeftSLine"
    data-icon="inline-start"
  />
  <span class="cn-pagination-previous-text hidden sm:block">Previous</span>
</PaginationLink>
