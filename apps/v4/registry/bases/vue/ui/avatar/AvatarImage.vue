<script setup lang="ts">
import type { AvatarImageProps } from "reka-ui"
import { AvatarImage } from "reka-ui"

const props = defineProps<AvatarImageProps>()
</script>

<template>
  <AvatarImage
    data-slot="avatar-image"
    v-bind="props"
    class="cn-avatar-image aspect-square size-full object-cover"
  >
    <slot />
  </AvatarImage>
</template>
