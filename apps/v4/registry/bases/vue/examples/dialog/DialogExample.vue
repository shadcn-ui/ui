<script setup lang="ts">
import { ExampleWrapper } from "@/components/example"
import DialogChatSettings from "@/examples/dialog/DialogChatSettings.vue"
import DialogNoCloseButton from "@/examples/dialog/DialogNoCloseButton.vue"
import DialogScrollableContent from "@/examples/dialog/DialogScrollableContent.vue"
import DialogWithForm from "@/examples/dialog/DialogWithForm.vue"
import DialogWithStickyFooter from "@/examples/dialog/DialogWithStickyFooter.vue"
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
