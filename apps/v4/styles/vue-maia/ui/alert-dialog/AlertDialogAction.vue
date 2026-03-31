<script setup lang="ts">
import type { ButtonVariants } from "@/ui/button"
import { buttonVariants } from "@/ui/button"
import { reactiveOmit } from "@vueuse/core"
import type { AlertDialogActionProps } from "reka-ui"
import { AlertDialogAction } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<
    AlertDialogActionProps & {
      class?: HTMLAttributes["class"]
      variant?: ButtonVariants["variant"]
      size?: ButtonVariants["size"]
    }
  >(),
  {
    variant: "default",
    size: "default",
  }
)

const delegatedProps = reactiveOmit(props, "class", "variant", "size")
</script>

<template>
  <AlertDialogAction
    data-slot="alert-dialog-action"
    v-bind="delegatedProps"
    :class="
      cn(
        'cn-alert-dialog-action',
        buttonVariants({ variant, size }),
        props.class
      )
    "
  >
    <slot />
  </AlertDialogAction>
</template>
