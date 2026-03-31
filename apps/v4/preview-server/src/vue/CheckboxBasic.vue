<script setup lang="ts">
import { Checkbox } from "@/ui/checkbox"
import { Field, FieldLabel } from "@/ui/field"
import { Example } from "@/components"
</script>

<template>
  <Example title="Basic">
    <Field orientation="horizontal">
      <Checkbox id="terms" />
      <FieldLabel html-for="terms">
        Accept terms and conditions
      </FieldLabel>
    </Field>
  </Example>
</template>
