<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog"
import type { DialogRootEmits, DialogRootProps } from "reka-ui"
import { useForwardPropsEmits } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import Command from "./Command.vue"

const props = withDefaults(
  defineProps<
    DialogRootProps & {
      title?: string
      description?: string
      class?: HTMLAttributes["class"]
      showCloseButton?: boolean
    }
  >(),
  {
    title: "Command Palette",
    description: "Search for a command to run...",
    showCloseButton: false,
  }
)
const emits = defineEmits<DialogRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <Dialog v-slot="slotProps" v-bind="forwarded">
    <DialogContent
      :class="cn('cn-command-dialog overflow-hidden p-0', props.class)"
      :show-close-button="showCloseButton"
    >
      <DialogHeader class="sr-only">
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>{{ description }}</DialogDescription>
      </DialogHeader>
      <Command>
        <slot v-bind="slotProps" />
      </Command>
    </DialogContent>
  </Dialog>
</template>
