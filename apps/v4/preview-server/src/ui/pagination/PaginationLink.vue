<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import type { ButtonVariants } from "@/ui/button"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/ui/button"

const props = withDefaults(defineProps<{
  href?: string
  size?: ButtonVariants["size"]
  isActive?: boolean
  class?: HTMLAttributes["class"]
}>(), {
  size: "icon",
  isActive: false,
})
</script>

<template>
  <a
    :href="href"
    data-slot="pagination-link"
    :data-active="isActive"
    :aria-current="isActive ? 'page' : undefined"
    :class="cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      'cn-pagination-link',
      props.class,
    )"
  >
    <slot />
  </a>
</template>
