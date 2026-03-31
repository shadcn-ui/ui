<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import type { AvatarVariants } from "."
import { AvatarRoot } from "reka-ui"
import { cn } from "@/lib/utils"
import { avatarVariants } from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
  size?: AvatarVariants["size"]
}>()
</script>

<template>
  <AvatarRoot
    data-slot="avatar"
    :data-size="size ?? 'default'"
    :class="cn(avatarVariants({ size }), props.class)"
  >
    <slot />
  </AvatarRoot>
</template>
