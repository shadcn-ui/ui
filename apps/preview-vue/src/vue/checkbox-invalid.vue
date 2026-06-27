<script setup lang="ts">
import { Checkbox } from '@/ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '@/ui/field'
</script>

<template>
  <FieldGroup class="mx-auto w-56">
    <Field orientation="horizontal" data-invalid>
      <Checkbox
        id="terms-checkbox-invalid"
        name="terms-checkbox-invalid"
        aria-invalid="true"
      />
      <FieldLabel for="terms-checkbox-invalid">
        Accept terms and conditions
      </FieldLabel>
    </Field>
  </FieldGroup>
</template>
