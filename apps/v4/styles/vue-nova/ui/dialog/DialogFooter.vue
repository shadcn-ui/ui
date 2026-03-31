<script setup lang="ts">
import { Button } from "@/ui/button"
import { DialogClose } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    showCloseButton?: boolean
  }>(),
  {
    showCloseButton: false,
  }
)
</script>

<template>
  <div
    data-slot="dialog-footer"
    :class="
      cn(
        'cn-dialog-footer flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        props.class
      )
    "
  >
    <slot />
    <DialogClose v-if="showCloseButton" as-child>
      <Button variant="outline"> Close </Button>
    </DialogClose>
  </div>
</template>
