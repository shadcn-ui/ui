<script setup lang="ts">
import type { WithClassAsProps } from "./interface"
import type { ButtonVariants } from "@/ui/button"
import { cn } from "@/lib/utils"
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Button } from "@/ui/button"
import { useCarousel } from "./useCarousel"

const props = withDefaults(defineProps<{
  variant?: ButtonVariants["variant"]
  size?: ButtonVariants["size"]
}
& WithClassAsProps>(), {
  variant: "outline",
  size: "icon",
})

const { orientation, canScrollPrev, scrollPrev } = useCarousel()
</script>

<template>
  <Button
    data-slot="carousel-previous"
    :disabled="!canScrollPrev"
    :class="cn(
      'absolute size-8 rounded-full',
      orientation === 'horizontal'
        ? 'top-1/2 -left-12 -translate-y-1/2'
        : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
      props.class,
    )"
    :variant="variant"
    :size="size"
    @click="scrollPrev"
  >
    <slot>
      <IconPlaceholder lucide="ArrowLeftIcon" tabler="IconArrowLeft" hugeicons="ArrowLeft01Icon" phosphor="ArrowLeftIcon" remixicon="RiArrowLeftLine" />
      <span class="sr-only">Previous Slide</span>
    </slot>
  </Button>
</template>
