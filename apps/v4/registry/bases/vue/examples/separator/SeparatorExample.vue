<script setup lang="ts">
import { ExampleWrapper } from "@/components/example"
import SeparatorHorizontal from "@/examples/separator/SeparatorHorizontal.vue"
import SeparatorInList from "@/examples/separator/SeparatorInList.vue"
import SeparatorVertical from "@/examples/separator/SeparatorVertical.vue"
import SeparatorVerticalMenu from "@/examples/separator/SeparatorVerticalMenu.vue"
</script>

<template>
  <ExampleWrapper>
    <SeparatorHorizontal />
    <SeparatorVertical />
    <SeparatorVerticalMenu />
    <SeparatorInList />
  </ExampleWrapper>
</template>
