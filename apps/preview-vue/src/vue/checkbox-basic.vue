<script setup lang="ts">
import { Checkbox } from '@/ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '@/ui/field'
</script>

<template>
  <FieldGroup class="mx-auto w-56">
    <Field orientation="horizontal">
      <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
      <FieldLabel for="terms-checkbox-basic">
        Accept terms and conditions
      </FieldLabel>
    </Field>
  </FieldGroup>
</template>
