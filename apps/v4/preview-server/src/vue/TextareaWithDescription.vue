<script setup lang="ts">
import { Field, FieldDescription, FieldLabel } from "@/ui/field"
import { Textarea } from "@/ui/textarea"
</script>

<template>
  <Field>
    <FieldLabel html-for="textarea-demo-message-2">
      Message
    </FieldLabel>
    <Textarea
      id="textarea-demo-message-2"
      placeholder="Type your message here."
      :rows="6"
    />
    <FieldDescription>
      Type your message and press enter to send.
    </FieldDescription>
  </Field>
</template>
