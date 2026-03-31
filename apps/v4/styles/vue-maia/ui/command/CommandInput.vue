<script setup lang="ts">
import { InputGroup, InputGroupAddon } from "@/ui/input-group"
import { reactiveOmit } from "@vueuse/core"
import type { ListboxFilterProps } from "reka-ui"
import { ListboxFilter, useForwardProps } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"
import IconPlaceholder from "@/components/icon-placeholder/IconPlaceholder.vue"

import { useCommand } from "."

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<
  ListboxFilterProps & {
    class?: HTMLAttributes["class"]
  }
>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)

const { filterState } = useCommand()
</script>

<template>
  <div data-slot="command-input-wrapper" class="cn-command-input-wrapper">
    <InputGroup class="cn-command-input-group">
      <ListboxFilter
        v-bind="{ ...forwardedProps, ...$attrs }"
        v-model="filterState.search"
        data-slot="command-input"
        auto-focus
        :class="
          cn(
            'cn-command-input outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
            props.class
          )
        "
      />
      <InputGroupAddon>
        <IconPlaceholder
          lucide="SearchIcon"
          tabler="IconSearch"
          hugeicons="SearchIcon"
          phosphor="MagnifyingGlassIcon"
          remixicon="RiSearchLine"
          class="cn-command-input-icon"
        />
      </InputGroupAddon>
    </InputGroup>
  </div>
</template>
