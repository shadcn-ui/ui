<script setup lang="ts">
import { AvatarRoot } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import type { AvatarVariants } from "."
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
