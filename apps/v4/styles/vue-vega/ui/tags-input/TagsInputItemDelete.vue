<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { TagsInputItemDeleteProps } from "reka-ui"
import { TagsInputItemDelete, useForwardProps } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"
import { IconPlaceholder } from "@/registry/bases/reka/components/icon-placeholder"

const props = defineProps<
  TagsInputItemDeleteProps & { class?: HTMLAttributes["class"] }
>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <TagsInputItemDelete
    v-bind="forwardedProps"
    :class="cn('mr-1 flex rounded bg-transparent', props.class)"
  >
    <slot>
      <IconPlaceholder
        lucide="XIcon"
        tabler="IconX"
        hugeicons="Cancel01Icon"
        phosphor="XIcon"
        remixicon="RiCloseLine"
        class="h-4 w-4"
      />
    </slot>
  </TagsInputItemDelete>
</template>
