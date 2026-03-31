<script setup lang="ts">
import { Checkbox } from "@/ui/checkbox"
import { Field, FieldLabel } from "@/ui/field"
import { Example } from "@/components"
</script>

<template>
  <Example title="Invalid">
    <Field orientation="horizontal" data-invalid>
      <Checkbox id="terms-3" aria-invalid />
      <FieldLabel html-for="terms-3">
        Accept terms and conditions
      </FieldLabel>
    </Field>
  </Example>
</template>
