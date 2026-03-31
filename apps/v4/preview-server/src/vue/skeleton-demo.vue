<script setup lang="ts">
import { ExampleWrapper } from "@/components"
import SkeletonAvatar from "./SkeletonAvatar.vue"
import SkeletonCard from "./SkeletonCard.vue"
import SkeletonForm from "./SkeletonForm.vue"
import SkeletonTable from "./SkeletonTable.vue"
import SkeletonText from "./SkeletonText.vue"
</script>

<template>
  <ExampleWrapper>
    <SkeletonAvatar />
    <SkeletonCard />
    <SkeletonText />
    <SkeletonForm />
    <SkeletonTable />
  </ExampleWrapper>
</template>
