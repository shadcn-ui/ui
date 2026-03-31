<script setup lang="ts">
import { ExampleWrapper } from "@/components"
import DialogChatSettings from "./DialogChatSettings.vue"
import DialogNoCloseButton from "./DialogNoCloseButton.vue"
import DialogScrollableContent from "./DialogScrollableContent.vue"
import DialogWithForm from "./DialogWithForm.vue"
import DialogWithStickyFooter from "./DialogWithStickyFooter.vue"
</script>

<template>
  <ExampleWrapper>
    <DialogWithForm />
    <DialogScrollableContent />
    <DialogWithStickyFooter />
    <DialogNoCloseButton />
    <DialogChatSettings />
  </ExampleWrapper>
</template>
