<script setup lang="ts">
import type { DialogRootEmits, DialogRootProps } from 'radix-vue'
import { useForwardPropsEmits, VisuallyHidden } from 'radix-vue'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import Command from './Command.vue'

const props = defineProps<DialogRootProps>()
const emits = defineEmits<DialogRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <Dialog v-bind="forwarded">
    <DialogContent class="overflow-hidden p-0 shadow-lg">
      <VisuallyHidden>
        <DialogTitle>پالت فرمان‌ها</DialogTitle>
      </VisuallyHidden>
      <Command
        class="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5"
      >
        <slot />
      </Command>
    </DialogContent>
  </Dialog>
</template>
