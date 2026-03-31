<script setup lang="ts">
import { ExampleWrapper } from "@/components"
import EmptyBasic from "./EmptyBasic.vue"
import EmptyInCard from "./EmptyInCard.vue"
import EmptyWithBorder from "./EmptyWithBorder.vue"
import EmptyWithIcon from "./EmptyWithIcon.vue"
import EmptyWithMutedBackground from "./EmptyWithMutedBackground.vue"
import EmptyWithMutedBackgroundAlt from "./EmptyWithMutedBackgroundAlt.vue"
</script>

<template>
  <ExampleWrapper>
    <EmptyBasic />
    <EmptyWithMutedBackground />
    <EmptyWithBorder />
    <EmptyWithIcon />
    <EmptyWithMutedBackgroundAlt />
    <EmptyInCard />
  </ExampleWrapper>
</template>
