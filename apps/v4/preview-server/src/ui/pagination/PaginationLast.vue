<script setup lang="ts">
import type { PaginationLastProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import type { ButtonVariants } from "@/ui/button"
import { reactiveOmit } from "@vueuse/core"
import { PaginationLast, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { buttonVariants } from "@/ui/button"

const props = withDefaults(defineProps<PaginationLastProps & {
  size?: ButtonVariants["size"]
  class?: HTMLAttributes["class"]
}>(), {
  size: "default",
})

const delegatedProps = reactiveOmit(props, "class", "size")
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <PaginationLast
    data-slot="pagination-last"
    :class="cn(buttonVariants({ variant: 'ghost', size }), 'cn-pagination-last', props.class)"
    v-bind="forwarded"
  >
    <slot>
      <span class="cn-pagination-last-text hidden sm:block">Last</span>
      <IconPlaceholder
        lucide="ChevronsRightIcon"
        tabler="IconChevronsRight"
        hugeicons="ArrowRightDoubleIcon"
        phosphor="CaretDoubleRightIcon"
        remixicon="RiArrowRightDoubleLine"
        data-icon="inline-end"
      />
    </slot>
  </PaginationLast>
</template>
