<script setup lang="ts">
import { ExampleWrapper } from "@/components"
import AvatarGroupExample from "./AvatarGroupExample.vue"
import AvatarGroupWithCount from "./AvatarGroupWithCount.vue"
import AvatarGroupWithIconCount from "./AvatarGroupWithIconCount.vue"
import AvatarInEmpty from "./AvatarInEmpty.vue"
import AvatarSizes from "./AvatarSizes.vue"
import AvatarWithBadge from "./AvatarWithBadge.vue"
import AvatarWithBadgeIcon from "./AvatarWithBadgeIcon.vue"
</script>

<template>
  <ExampleWrapper>
    <AvatarSizes />
    <AvatarWithBadge />
    <AvatarWithBadgeIcon />
    <AvatarGroupExample />
    <AvatarGroupWithCount />
    <AvatarGroupWithIconCount />
    <AvatarInEmpty />
  </ExampleWrapper>
</template>
