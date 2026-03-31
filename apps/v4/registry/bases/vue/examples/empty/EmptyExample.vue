<script setup lang="ts">
import { ExampleWrapper } from "@/components/example"
import EmptyBasic from "@/examples/empty/EmptyBasic.vue"
import EmptyInCard from "@/examples/empty/EmptyInCard.vue"
import EmptyWithBorder from "@/examples/empty/EmptyWithBorder.vue"
import EmptyWithIcon from "@/examples/empty/EmptyWithIcon.vue"
import EmptyWithMutedBackground from "@/examples/empty/EmptyWithMutedBackground.vue"
import EmptyWithMutedBackgroundAlt from "@/examples/empty/EmptyWithMutedBackgroundAlt.vue"
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
