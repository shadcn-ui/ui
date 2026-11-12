<script setup lang="ts">
import { provide } from 'vue'
import {
  DropdownMenuRoot,
  type DropdownMenuRootEmits,
  type DropdownMenuRootProps,
  useForwardPropsEmits,
} from 'radix-vue'
import { saazeDirectionKey, useResolvedDirection } from '@/lib/rtl'

const props = defineProps<DropdownMenuRootProps>()
const emits = defineEmits<DropdownMenuRootEmits>()
const forwarded = useForwardPropsEmits(props, emits)

const dir = useResolvedDirection(() => props.dir)
// زیرمنوها و آیکون‌های جهت‌دار جهت همین منو را دنبال می‌کنند.
provide(saazeDirectionKey, dir)
</script>

<template>
  <DropdownMenuRoot v-slot="slotProps" v-bind="forwarded" :dir="dir">
    <slot v-bind="slotProps" />
  </DropdownMenuRoot>
</template>
