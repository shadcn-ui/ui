<script setup lang="ts">
import { ExampleWrapper } from "@/components"
import AlertDialogBasic from "./AlertDialogBasic.vue"
import AlertDialogDestructive from "./AlertDialogDestructive.vue"
import AlertDialogInDialog from "./AlertDialogInDialog.vue"
import AlertDialogSmall from "./AlertDialogSmall.vue"
import AlertDialogSmallWithMedia from "./AlertDialogSmallWithMedia.vue"
import AlertDialogWithMedia from "./AlertDialogWithMedia.vue"
</script>

<template>
  <ExampleWrapper>
    <AlertDialogBasic />
    <AlertDialogSmall />
    <AlertDialogWithMedia />
    <AlertDialogSmallWithMedia />
    <AlertDialogDestructive />
    <AlertDialogInDialog />
  </ExampleWrapper>
</template>
