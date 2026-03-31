<script setup lang="ts">
import { ExampleWrapper } from "@/components"
import BadgeAsLink from "./BadgeAsLink.vue"
import BadgeCustomColors from "./BadgeCustomColors.vue"
import BadgeLongText from "./BadgeLongText.vue"
import BadgeVariants from "./BadgeVariants.vue"
import BadgeWithIconLeft from "./BadgeWithIconLeft.vue"
import BadgeWithIconRight from "./BadgeWithIconRight.vue"
import BadgeWithSpinner from "./BadgeWithSpinner.vue"
</script>

<template>
  <ExampleWrapper class="lg:grid-cols-1">
    <BadgeVariants />
    <BadgeWithIconLeft />
    <BadgeWithIconRight />
    <BadgeWithSpinner />
    <BadgeAsLink />
    <BadgeLongText />
    <BadgeCustomColors />
  </ExampleWrapper>
</template>
