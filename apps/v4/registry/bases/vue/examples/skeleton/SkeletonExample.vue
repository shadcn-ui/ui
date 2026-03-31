<script setup lang="ts">
import { ExampleWrapper } from "@/components/example"
import SkeletonAvatar from "@/examples/skeleton/SkeletonAvatar.vue"
import SkeletonCard from "@/examples/skeleton/SkeletonCard.vue"
import SkeletonForm from "@/examples/skeleton/SkeletonForm.vue"
import SkeletonTable from "@/examples/skeleton/SkeletonTable.vue"
import SkeletonText from "@/examples/skeleton/SkeletonText.vue"
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
