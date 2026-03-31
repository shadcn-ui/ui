<script setup lang="ts">
import { Example } from "@/components"
import { Field } from "@/ui/field"
import { Label } from "@/ui/label"
import { Textarea } from "@/ui/textarea"
</script>

<template>
  <Example title="With Textarea">
    <Field>
      <Label html-for="label-demo-message">
        Message
      </Label>
      <Textarea id="label-demo-message" placeholder="Message" />
    </Field>
  </Example>
</template>
