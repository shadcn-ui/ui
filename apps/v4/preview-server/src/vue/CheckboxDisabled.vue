<script setup lang="ts">
import { Checkbox } from "@/ui/checkbox"
import { Field, FieldLabel } from "@/ui/field"
import { Example } from "@/components"
</script>

<template>
  <Example title="Disabled">
    <Field orientation="horizontal">
      <Checkbox id="toggle" disabled />
      <FieldLabel html-for="toggle">
        Enable notifications
      </FieldLabel>
    </Field>
  </Example>
</template>
