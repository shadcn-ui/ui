<script setup lang="ts">
import { Checkbox } from '@/ui/checkbox'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/ui/field'
</script>

<template>
  <FieldGroup class="mx-auto w-72">
    <Field orientation="horizontal">
      <Checkbox
        id="terms-checkbox-desc"
        name="terms-checkbox-desc"
        :default-value="true"
      />
      <FieldContent>
        <FieldLabel for="terms-checkbox-desc">
          Accept terms and conditions
        </FieldLabel>
        <FieldDescription>
          By clicking this checkbox, you agree to the terms and conditions.
        </FieldDescription>
      </FieldContent>
    </Field>
  </FieldGroup>
</template>
