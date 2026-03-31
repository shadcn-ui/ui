<script setup lang="ts">
import type { ButtonVariants } from "@/ui/button"
import { buttonVariants } from "@/ui/button"
import { reactiveOmit } from "@vueuse/core"
import type { AlertDialogCancelProps } from "reka-ui"
import { AlertDialogCancel } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<
    AlertDialogCancelProps & {
      class?: HTMLAttributes["class"]
      variant?: ButtonVariants["variant"]
      size?: ButtonVariants["size"]
    }
  >(),
  {
    variant: "outline",
    size: "default",
  }
)

const delegatedProps = reactiveOmit(props, "class", "variant", "size")
</script>

<template>
  <AlertDialogCancel
    data-slot="alert-dialog-cancel"
    v-bind="delegatedProps"
    :class="
      cn(
        'cn-alert-dialog-cancel',
        buttonVariants({ variant, size }),
        props.class
      )
    "
  >
    <slot />
  </AlertDialogCancel>
</template>
